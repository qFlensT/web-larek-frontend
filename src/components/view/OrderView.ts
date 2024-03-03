import { cloneTemplate } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Form } from '../common/Form';

export type OrderForm = {
	paymentType: string;
	address: string;
};

export class OrderView extends Form<OrderForm> {
	constructor(events: IEvents) {
		super(cloneTemplate<HTMLFormElement>('#order'), {
			onInput: (field, value) => events.emit('order:input', { field, value }),
			onSubmit: () => events.emit('order:submit'),
		});
	}
}
