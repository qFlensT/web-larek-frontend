import { cloneTemplate } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Basket } from '../common/Basket/Basket';

export class BasketView extends Basket {
	constructor(events: IEvents) {
		super(cloneTemplate<HTMLDivElement>('#card-basket'));
	}
}
