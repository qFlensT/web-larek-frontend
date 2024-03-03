import { cloneTemplate } from '../../../utils/utils';
import { IEvents } from '../../base/Events';
import { BasketItem, BasketItemProps } from '../../common/Basket/BasketItem';

export type BasketItemViewProps = {
	id: string;
} & BasketItemProps;

export class BasketItemView extends BasketItem<BasketItemViewProps> {
	constructor(events: IEvents) {
		super(cloneTemplate<HTMLLIElement>('#card-basket'), {
			onDelete: () => events.emit('basketItem:delete', { id: this.id }),
		});
	}

	set id(id: string) {
		this._container.dataset.id = id || '';
	}

	get id() {
		return this._container.dataset.id || '';
	}
}
