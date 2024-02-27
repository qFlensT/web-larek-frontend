import { ensureElement } from '../../../utils/utils';
import { Component } from '../../base/Component';
import { BasketItemProps } from './BasketItem';

export type BasketProps = {
	items: BasketItemProps[];
};

export class Basket extends Component<BasketProps> {
	private __basketListElement: HTMLUListElement;

	constructor(protected readonly _container: HTMLElement) {
		super(_container);

		this.__basketListElement = ensureElement<HTMLUListElement>(
			'.basket__list',
			this._container
		);
	}

	public set items(value: HTMLLIElement[]) {
		value.forEach((item) => this.__basketListElement.appendChild(item));
	}
}
