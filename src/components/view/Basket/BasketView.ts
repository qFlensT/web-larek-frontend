import { cloneTemplate } from '../../../utils/utils';
import { IEvents } from '../../base/events';
import { Basket } from '../../common/Basket/Basket';
import { BasketItemView, BasketItemViewProps } from './BasketItemView';

export class BasketView extends Basket {
	private __items: HTMLElement[] = [];

	constructor(protected events: IEvents) {
		super(cloneTemplate<HTMLDivElement>('#basket'), {
			onBuy: () => events.emit('basket:buy'),
		});
	}

	public addItem(props: BasketItemViewProps): this {
		this.__items.push(new BasketItemView(this.events).render(props));
		this.events.emit('basket:change', { amount: this.__items.length });
		return this;
	}

	public removeItemById(id: string): this {
		const index = this.__items.findIndex((item) => item.dataset.id === id);
		if (index !== -1) {
			delete this.__items[index];
		}

		this.events.emit('basket:change', { amount: this.__items.length });

		return this;
	}

	public clear(): this {
		super.clear();
		this.__items = [];
		this.events.emit('basket:change', { amount: this.__items.length });

		return this;
	}

	get itemsAmount(): number {
		return this.__items.length;
	}

	public render(): HTMLElement {
		this._basketListElement.replaceChildren(...this.__items);
		return this._container;
	}
}
