import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { BasketView } from './components/view/Basket/BasketView';
import { ModalView } from './components/view/ModalView';
import { ensureElement } from './utils/utils';
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

const catalogApi = new CatalogApi();
const orderApi = new OrderApi();

const events = new EventEmitter();
const basket = new BasketView(events);
const modal = new ModalView(events);
const order = new OrderView(events);
const contacts = new ContactsView(events);

const orderForm: OrderForm = { address: '', paymentType: 'online' };
const contactsForm: ContactsForm = { email: '', phone: '' };
let catalogItems: CatalogItemDto[] = [];

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

events.on<{ id: string }>('catalogItem:addedToCart', ({ id }) => {
	basket.addItem({ ...getCatalogItemById(id), index: basket.itemsAmount });
	basketCounter.textContent = `${basket.itemsAmount}`;
});

events.on<{ id: string }>('basketItem:delete', ({ id }) => {
	basket.removeItemById(id);
	basketCounter.textContent = `${basket.itemsAmount}`;
	basket.render();
});

events.on('basket:buy', () => {
	modal.render({
		content: order.render({ errors: [], valid: false }),
	});
});

// Order form assign and validation
events.on<Partial<OrderForm>>('order:change', (data) => {
	Object.assign(orderForm, data);
	const errors = [];
	let valid = true;
	if (!orderForm.address.length) {
		errors.push('Заполните адрес доставки');
		valid = false;
	}
	if (!orderForm.paymentType.length) {
		errors.push('Выберите тип оплаты');
		valid = false;
	}

	order.errors = errors;
	order.valid = valid;
});

events.on('order:submit', () => {
	modal.render({ content: contacts.render() });
});

events.on<Partial<ContactsForm>>('contacts:change', (data) => {
	Object.assign(contactsForm, data);
	const errors = [];
	let valid = true;
	if (!contactsForm.email.length) {
		errors.push('Введите email');
		valid = false;
	}
	if (!contactsForm.phone.length) {
		errors.push('Введите телефон');
		valid = false;
	}

	contacts.errors = errors;
	contacts.valid = valid;
});

events.on('contacts:submit', () => {
	const total = basket.items.reduce((acc, item) => acc + +item.price, 0);

	orderApi
		.postOrder({
			payment: orderForm.paymentType,
			email: contactsForm.email,
			phone: contactsForm.phone,
			address: orderForm.address,
			total,
			items: basket.items.map((item) => item.id),
		})
		.then((data) => {
			basket.clear();
			basketCounter.textContent = '0';
			modal.render({
				content: new SuccessView(events).render({ total }),
			});
		});
});

events.on('success:click', () => {
	modal.close();
});

basketButton.addEventListener('click', () => {
	modal.render({
		content: basket.render({
			totalPrice: basket.items.reduce((acc, item) => acc + +item.price, 0),
		}),
	});
});
