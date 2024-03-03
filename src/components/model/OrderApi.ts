import { API_URL } from '../../utils/constants';
import { Api } from '../base/api';

export type Order = {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
};

export type OrderDto = {
	id: string;
	total: number;
};

export class OrderApi extends Api {
	constructor() {
		super(API_URL);
	}

	postOrder(order: Order) {
		return this.post('/order', order) as Promise<OrderDto>;
	}
}
