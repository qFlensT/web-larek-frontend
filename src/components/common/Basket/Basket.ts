import { ensureElement } from '../../../utils/utils';
import { Component } from '../../base/Component';

export type BasketActions = {
	onBuy: () => void;
};

export class Basket extends Component<{}> {
	protected _basketListElement: HTMLUListElement;
	protected _basketButtonElement: HTMLButtonElement;

	constructor(
		protected readonly _container: HTMLElement,
		actions?: Partial<BasketActions>
	) {
		super(_container);

		this._basketListElement = ensureElement<HTMLUListElement>(
			'.basket__list',
			this._container
		);

		this._basketButtonElement = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this._container
		);

		if (actions) {
			actions.onBuy &&
				this._basketButtonElement.addEventListener('click', actions.onBuy);
		}
	}

	public clear() {
		this._basketListElement.innerHTML = null;
	}
}
