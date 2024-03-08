import { IEvents } from '../../../types/types';
import { cloneTemplate } from '../../../utils/utils';
import { Basket } from '../../common/Basket/Basket';

export class BasketView extends Basket {
	constructor(protected events: IEvents) {
		super(cloneTemplate<HTMLDivElement>('#basket'), {
			onBuy: () => events.emit('basket:buy'),
		});
	}
}
