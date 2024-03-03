import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export const CardCategory = {
	'софт-скил': { title: 'софт-скил', modifier: 'soft' },
	'хард-скил': { title: 'хард-скил', modifier: 'hard' },
	другое: { title: 'другое', modifier: 'other' },
	дополнительно: { title: 'дополнительно', modifier: 'additional' },
	кнопка: { title: 'кнопка', modifier: 'button' },
} as const;

export type CardActions = {
	onClick: () => void;
};

export type CardProps = {
	type: keyof typeof CardCategory;
	titleText: string;
	imageUrl: string;
	price: string;
};

export class Card<T> extends Component<CardProps & T> {
	private __chipElement: HTMLSpanElement;
	private __titleElement: HTMLHeadingElement;
	private __imageElement: HTMLImageElement;
	private __priceElement: HTMLSpanElement;
	private __buttonElement: HTMLButtonElement | null;

	constructor(container: HTMLElement, actions?: CardActions) {
		super(container);
		this.__chipElement = ensureElement<HTMLSpanElement>(
			'.card__category',
			this._container
		);
		this.__titleElement = ensureElement<HTMLHeadingElement>(
			'.card__title',
			this._container
		);
		this.__imageElement = ensureElement<HTMLImageElement>(
			'.card__image',
			this._container
		);
		this.__priceElement = ensureElement<HTMLSpanElement>(
			'.card__price',
			this._container
		);

		this.__buttonElement =
			this._container.querySelector<HTMLButtonElement>('.card__button');

		if (actions) {
			if (this.__buttonElement) {
				this.__buttonElement.addEventListener('click', actions.onClick);
			} else this._container.addEventListener('click', actions.onClick);
		}
	}

	set titleText(value: string) {
		this.setText(this.__titleElement, value);
	}

	set price(value: string) {
		this.setText(this.__priceElement, value);
	}

	set imageUrl(value: string) {
		this.setImage(this.__imageElement, value);
	}

	set type(value: keyof typeof CardCategory) {
		const category = CardCategory[value];
		this.setText(this.__chipElement, category.title);
		this.setClass(
			this.__chipElement,
			`card__category card__category_${category.modifier}`
		);
	}
}
