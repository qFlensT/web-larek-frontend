import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { BasketView } from './components/view/Basket/BasketView';
import { ModalView } from './components/view/ModalView';
import { ensureElement, validateForm } from './utils/utils';
import { CatalogApi, CatalogItemDto } from './components/model/CatalogApi';
import { OrderApi } from './components/model/OrderApi';
import { CatalogItemView } from './components/view/CatalogItemView';
import { CatalogItemPreviewView } from './components/view/CatalogItemPreviewView';
import { OrderForm, OrderView } from './components/view/OrderView';
import { ContactsForm, ContactsView } from './components/view/ContactsView';
import { SuccessView } from './components/view/SuccessView';

const itemsCatalog = ensureElement<HTMLElement>('.gallery');
const basketButton = ensureElement<HTMLButtonElement>('.header__basket');
const basketCounter = ensureElement<HTMLSpanElement>(
	'.header__basket-counter',
	basketButton
);
const page = ensureElement<HTMLBodyElement>('.page__wrapper');

const catalogApi = new CatalogApi();
const orderApi = new OrderApi();

const events = new EventEmitter();
const basket = new BasketView(events);
const modal = new ModalView(events);
const order = new OrderView(events);
const contacts = new ContactsView(events);

const orderForm: OrderForm = { address: '', paymentType: 'online' };
const orderValidationRules = {
	address: (value: string) =>
		!value.length ? 'Заполните адрес доставки' : null,
	paymentType: (value: string) =>
		!value.length ? 'Выберите тип оплаты' : null,
};
const contactsForm: ContactsForm = { email: '', phone: '' };
const contactsValidationRules = {
	email: (value: string) => (!value.length ? 'Введите email' : null),
	phone: (value: string) => (!value.length ? 'Введите телефон' : null),
};

let catalogItems: CatalogItemDto[] = [];

const calculateBasketTotal = () =>
	basket.items.reduce((acc, item) => acc + +item.price, 0);

const updateBasketCounter = (value: number = basket.itemsAmount) =>
	(basketCounter.textContent = `${value}`);

const getCatalogItemById = (id: string) =>
	catalogItems.find((item) => item.id === id);

catalogApi.getCatalogItems().then((data) => {
	catalogItems = data.items;
	data.items.forEach((item) =>
		itemsCatalog.appendChild(new CatalogItemView(events).render(item))
	);
});

events.on<{ id: string }>('catalogItem:click', ({ id }) =>
	modal.render({
		content: new CatalogItemPreviewView(events).render(getCatalogItemById(id)),
	})
);

events.on<{ id: string }>('catalogItem:addToCartClick', ({ id }) => {
	if (basket.items.some((item) => item.id === id)) return;
	basket.addItem({ ...getCatalogItemById(id), index: basket.itemsAmount });
	updateBasketCounter();
	modal.close();
});

events.on<{ id: string }>('basketItem:delete', ({ id }) => {
	basket.removeItemById(id);
	updateBasketCounter();
	basket.render({
		totalPrice: calculateBasketTotal(),
		disableBuyButton: !basket.items.length,
	});
});

events.on('basket:buy', () => {
	modal.render({
		content: order.render({ errors: [], valid: false }),
	});
});

events.on<Partial<OrderForm>>('order:change', (data) => {
	validateForm(orderForm, data, orderValidationRules, order);
});

events.on<Partial<ContactsForm>>('contacts:change', (data) => {
	validateForm(contactsForm, data, contactsValidationRules, contacts);
});

events.on('order:submit', () => {
	modal.render({ content: contacts.render() });
});

events.on('contacts:submit', () => {
	orderApi
		.postOrder({
			payment: orderForm.paymentType,
			email: contactsForm.email,
			phone: contactsForm.phone,
			address: orderForm.address,
			total: calculateBasketTotal(),
			items: basket.items.map((item) => item.id),
		})
		.then((data) => {
			modal.render({
				content: new SuccessView(events).render({
					total: calculateBasketTotal(),
				}),
			});
			basket.clear();
			updateBasketCounter(0);
		});
});

events.on('success:click', () => {
	modal.close();
});

events.on('modal:open', () => {
	page.classList.add('page__wrapper_locked');
});
events.on('modal:close', () => {
	page.classList.remove('page__wrapper_locked');
});

basketButton.addEventListener('click', () => {
	modal.render({
		content: basket.render({
			totalPrice: calculateBasketTotal(),
			disableBuyButton: !basket.items.length,
		}),
	});
});
