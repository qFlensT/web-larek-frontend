import { IEvents, OrderForm } from '../../types/types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Form } from '../common/Form';

export class OrderView extends Form<OrderForm> {
	constructor(events: IEvents) {
		super(cloneTemplate<HTMLFormElement>('#order'), {
			onInput: (field, value) =>
				events.emit('order:change', { address: value }),
			onSubmit: () => events.emit('order:submit'),
		});

		const onlineButton = ensureElement<HTMLButtonElement>(
			'button[name="card"]',
			this._container
		);
		const cashButton = ensureElement<HTMLButtonElement>(
			'button[name="cash"]',
			this._container
		);

		onlineButton.classList.toggle('button_alt-active');

		onlineButton.addEventListener('click', () => {
			cashButton.classList.remove('button_alt-active');
			onlineButton.classList.add('button_alt-active');
			events.emit('order:change', { paymentType: 'online' });
		});

		cashButton.addEventListener('click', () => {
			onlineButton.classList.remove('button_alt-active');
			cashButton.classList.add('button_alt-active');
			events.emit('order:change', { paymentType: 'cash' });
		});
	}
}
