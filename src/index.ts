import { EventEmitter } from './components/base/events';
import { Card, CardProps } from './components/common/Card';
import { CatalogItemPreviewView } from './components/view/CatalogItemPreviewView';
import {
	CatalogItemView,
	CatalogItemViewProps,
} from './components/view/CatalogItemView';
import { ModalView } from './components/view/ModalView';
import './scss/styles.scss';
import { cloneTemplate, ensureElement } from './utils/utils';

const cardsMock: CatalogItemViewProps[] = [
	{
		imageUrl: './images/Subtract.png',
		price: '100',
		titleText: 'Карточкаasd',
		type: 'софт-скил',
		id: '1',
	},
	{
		imageUrl: './images/Subtract.png',
		price: '1001',
		titleText: 'Карточкаasdd',
		type: 'софт-скил',
		id: '2',
	},
	{
		imageUrl: './images/Subtract.png',
		price: '100123',
		titleText: 'Карточкаddd',
		type: 'софт-скил',
		id: '3',
	},
	{
		imageUrl: './images/Subtract.png',
		price: '10033',
		titleText: 'Картasdasdочка',
		type: 'софт-скил',
		id: '4',
	},
];

const events = new EventEmitter();

const cardCatalog = ensureElement<HTMLElement>('.gallery');

cardsMock.forEach((card) => {
	const modal = new ModalView(events);

	const catalogItem = new CatalogItemView(events, {
		onCardClick: (id) => {
			console.log('Card click! ID = ', id);

			modal.render({
				content: new CatalogItemPreviewView(events, {
					onAddToCartClick: () => console.log('Add to cart! ID = ', id),
				}).render(cardsMock.find((card) => card.id === id) as CardProps),
			});
		},
	});
	cardCatalog.appendChild(catalogItem.render(card));
});
