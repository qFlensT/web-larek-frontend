import { ensureElement } from '../../../utils/utils';
import { Component } from '../../base/Component';

export type BasketItemActions = {
	onDelete: () => void;
};

export type BasketItemProps = {
	title: string;
	price: string | number | null;
	index: number | string;
};

export class BasketItem<T> extends Component<BasketItemProps & T> {
	private __indexElement: HTMLSpanElement;
	private __titleElement: HTMLSpanElement;
	private __priceElement: HTMLSpanElement;
	private __removeButtonElement: HTMLButtonElement;

	constructor(_container: HTMLLIElement, actions?: Partial<BasketItemActions>) {
		super(_container);
		this.__indexElement = ensureElement<HTMLSpanElement>(
			'.basket__item-index',
			this._container
		);
		this.__titleElement = ensureElement<HTMLSpanElement>(
			'.card__title',
			this._container
		);
		this.__priceElement = ensureElement<HTMLSpanElement>(
			'.card__price',
			this._container
		);

		this.__removeButtonElement = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			this._container
		);

		if (actions) {
			this.__removeButtonElement.addEventListener('click', actions.onDelete);
		}
	}

	public set title(value: string) {
		this.setText(this.__titleElement, value);
	}

	public set price(value: string) {
		if (value) this.setText(this.__priceElement, value);
		else this.setText(this.__priceElement, 'Бесценно');
	}

	public set index(value: string) {
		this.setText(this.__indexElement, value);
	}
}