import { ensureElement } from './utils/utils';
import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { CatalogApi } from './components/model/CatalogApi';
import { OrderApi } from './components/model/OrderApi';
import { AppState } from './components/AppState';
import { CatalogItemView } from './components/view/CatalogItemView';
import { ModalView } from './components/view/ModalView';
import { CatalogItemPreviewView } from './components/view/CatalogItemPreviewView';
import { BasketView } from './components/view/Basket/BasketView';
import { BasketItemView } from './components/view/Basket/BasketItemView';
import { OrderView } from './components/view/OrderView';
import { ContactsForm, OrderForm } from './types/types';
import { ContactsView } from './components/view/ContactsView';
import { SuccessView } from './components/view/SuccessView';

const itemsCatalog = ensureElement<HTMLElement>('.gallery');
const basketButton = ensureElement<HTMLButtonElement>('.header__basket');
const basketCounter = ensureElement<HTMLSpanElement>(
	'.header__basket-counter',
	basketButton
);
const page = ensureElement<HTMLBodyElement>('.page__wrapper');

const events = new EventEmitter();
const appState = new AppState(events);

const catalogApi = new CatalogApi();
const orderApi = new OrderApi();

const modal = new ModalView(events);
const basket = new BasketView(events);
const order = new OrderView(events);
const contacts = new ContactsView(events);

events.on('modal:open', () => {
	page.classList.add('page__wrapper_locked');
});

events.on('modal:close', () => {
	page.classList.remove('page__wrapper_locked');
});

events.on('catalogItems:set', () => {
	appState.catalogItems.forEach((item) =>
		itemsCatalog.appendChild(new CatalogItemView(events).render(item))
	);
});

events.on('basketItems:change', () => {
	basketCounter.textContent = `${appState.basketItems.length}`;
	basket.render({
		disableBuyButton: !appState.basketTotal,
		totalPrice: appState.basketTotal,
		items: appState.basketItems.map((item) =>
			new BasketItemView(events).render(item)
		),
	});
});

events.on<{ id: string }>('catalogItem:click', ({ id }) =>
	modal.render({
		content: new CatalogItemPreviewView(events).render(
			appState.getCatalogItemById(id)
		),
	})
);

events.on<{ id: string }>('catalogItem:addToCartClick', ({ id }) => {
	appState.addBasketItem(appState.getCatalogItemById(id));
	modal.close();
});

events.on<{ id: string }>('basketItem:delete', ({ id }) =>
	appState.removeBasketItem(id)
);

events.on('basket:buy', () =>
	modal.render({
		content: order.render(appState.validateOrderForm()),
	})
);

events.on<Partial<OrderForm>>('order:change', (data) => {
	appState.orderForm = { ...appState.orderForm, ...data };
	order.render(appState.validateOrderForm());
});

events.on<Partial<ContactsForm>>('contacts:change', (data) => {
	appState.contactsForm = { ...appState.contactsForm, ...data };
	contacts.render(appState.validateContactsForm());
});

events.on('order:submit', () =>
	modal.render({ content: contacts.render(appState.validateContactsForm()) })
);

events.on('contacts:submit', () => {
	orderApi
		.postOrder({
			payment: appState.orderForm.paymentType,
			email: appState.contactsForm.email,
			phone: appState.contactsForm.phone,
			address: appState.orderForm.address,
			total: appState.basketTotal,
			items: appState.basketItems.map((item) => item.id),
		})
		.then(() => {
			modal.render({
				content: new SuccessView(events).render({
					total: appState.basketTotal,
				}),
			});
			appState.clearBasket();
			appState.resetForms();
			order.reset();
			contacts.reset();
		})
		.catch(console.error);
});

events.on('success:click', () => {
	modal.close();
});

basketButton.addEventListener('click', () => {
	modal.render({
		content: basket.render(),
	});
});

catalogApi
	.getCatalogItems()
	.then((data) => (appState.catalogItems = data.items));
