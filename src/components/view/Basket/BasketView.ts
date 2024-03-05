import {
	BasketItemViewProps,
	BasketProps,
	IEvents,
} from '../../../types/types';
import { cloneTemplate } from '../../../utils/utils';
import { Basket } from '../../common/Basket/Basket';
import { BasketItemView } from './BasketItemView';

export class BasketView extends Basket {
	private __items: BasketItemViewProps[] = [];

	constructor(protected events: IEvents) {
		super(cloneTemplate<HTMLDivElement>('#basket'), {
			onBuy: () => events.emit('basket:buy'),
		});
	}

	get items(): BasketItemViewProps[] {
		return this.__items;
	}

	public addItem(props: BasketItemViewProps): this {
		this.__items.push(props);
		return this;
	}

	public removeItemById(id: string): this {
		const itemIndex = this.__items.findIndex((item) => item.id === id);
		if (itemIndex !== -1) {
			this.__items.splice(itemIndex, 1);
		}

		return this;
	}

	public clear(): this {
		super.clear();
		this.__items = [];

		return this;
	}

	get itemsAmount(): number {
		return this.__items.length;
	}

	public render(data?: Partial<BasketProps>): HTMLElement {
		super.render(data);
		this._basketListElement.replaceChildren(
			...this.__items.map((item) =>
				new BasketItemView(this.events).render(item)
			)
		);
		return this._container;
	}
}
