import { BasketActions, BasketProps } from '../../../types/types';
import { ensureElement } from '../../../utils/utils';
import { Component } from '../../base/Component';

export class Basket extends Component<BasketProps> {
	protected _basketListElement: HTMLUListElement;
	protected _basketButtonElement: HTMLButtonElement;
	protected _totalPriceElement: HTMLSpanElement;

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

		this._totalPriceElement = ensureElement<HTMLSpanElement>(
			'.basket__price',
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

	set disableBuyButton(value: boolean) {
		this.setDisabled(this._basketButtonElement, value);
	}

	set totalPrice(value: string | number | null) {
		if (value === null || value === undefined) {
			this.setText(this._totalPriceElement, 'Бесценно');
		} else this.setText(this._totalPriceElement, `${value} синапсов`);
	}

	set items(value: HTMLElement[]) {
		this._basketListElement.replaceChildren(...value);
	}
}
export { BasketProps };
