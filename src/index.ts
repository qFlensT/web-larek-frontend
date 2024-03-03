import { EventEmitter } from './components/base/events';
import { BasketView } from './components/view/Basket/BasketView';
import { CatalogItemPreviewView } from './components/view/CatalogItemPreviewView';
import {
	CatalogItemView,
	CatalogItemViewProps,
} from './components/view/CatalogItemView';
import { ModalView } from './components/view/ModalView';
import { OrderView } from './components/view/OrderView';
import './scss/styles.scss';
import { ensureElement } from './utils/utils';

const cardsMock: Partial<CatalogItemViewProps>[] = [
	{
		price: '100',
		titleText: 'Карточкаasd',
		type: 'софт-скил',
		id: '1',
	},
	{
		price: '1001',
		titleText: 'Карточкаasdd',
		type: 'софт-скил',
		id: '2',
	},
	{
		price: '100123',
		titleText: 'Карточкаddd',
		type: 'софт-скил',
		id: '3',
	},
	{
		price: '10033',
		titleText: 'Картasdasdочка',
		type: 'софт-скил',
		id: '4',
	},
];

const cardCatalog = ensureElement<HTMLElement>('.gallery');
const basketButton = ensureElement<HTMLButtonElement>('.header__basket');
const basketCounter = ensureElement<HTMLSpanElement>(
	'.header__basket-counter',
	basketButton
);

const events = new EventEmitter();
const basket = new BasketView(events);
const modal = new ModalView(events);

events.on<{ amount: number }>('basket:change', (data) => {
	basketCounter.textContent = data.amount.toString();
});

events.on<{ id: string }>('catalogItem:click', (data) => {
	const catalogItemPreview = new CatalogItemPreviewView(events);
	const card = cardsMock.find((card) => card.id === data.id);

	if (card) {
		modal.render({
			content: catalogItemPreview.render({
				id: card.id,
				price: card.price,
				titleText: card.titleText,
				type: card.type,
			}),
		});
	}
});

events.on<{ id: string }>('catalogItem:addedToCart', (data) => {
	const card = cardsMock.find((card) => card.id === data.id);
	if (card) {
		basket.addItem({
			id: card.id,
			price: card.price,
			title: card.titleText,
			index: basket.itemsAmount.toString(),
		});
	}

	modal.close();
});

events.on<{ id: string }>('basketItem:delete', (data) => {
	basket.removeItemById(data.id);
});

events.on('basket:buy', () => {
	modal.render({
		content: new OrderView(events).render(),
	});
});

basketButton.addEventListener('click', () => {
	modal.render({
		content: basket.render(),
	});
});

cardsMock.forEach((card) =>
	cardCatalog.appendChild(new CatalogItemView(events).render(card))
);
