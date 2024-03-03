import { IEvents } from './base/events';
import { OrderView } from './view/OrderView';

export class OrderForm {
	private __view = new OrderView(this.events);
	private __errors: Record<string, string> = {};
	private paymentType: 'cash' | 'online' = 'online';
	private address = '';

	constructor(protected events: IEvents) {
		this.__applyListener();
	}

	private __applyListener() {
		this.events.on<{ field: string; value: string; validationMessage: string }>(
			'order:change',
			(d) => {
				console.log(d);
				let error = '';
				if (!d.value.length) error = 'Поле не должно быть пустым';
				else d.validationMessage.length && (error = d.validationMessage);
				console.log('error ', error);
				console.log(
					'error state ',
					error.length ? { field: d.field, error } : null
				);
				const data = {
					...d,
					error: error.length ? { field: d.field, error } : null,
				};
				Object.assign(this, data);
			}
		);
	}

	protected set error(value: { field: string; error: string }) {
		if (!value) {
			delete this.__errors[value?.field];
			return;
		}
		if (value.field in this.__errors) return;
		this.__errors = value;
	}

	get valid() {
		return !!Object.keys(this.__errors).length;
	}

	get errors() {
		return Object.values(this.__errors);
	}

	get data() {
		return {
			paymentType: this.paymentType,
			address: this.address,
		};
	}

	public render() {
		return this.__view.render({ errors: this.errors, valid: this.valid });
	}
}
