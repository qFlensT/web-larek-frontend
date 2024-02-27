import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export type FormProps = {
	valid: boolean;
	errors: string[];
};

export class Form<T> extends Component<FormProps> {
	private __submitButtonElement: HTMLButtonElement;
	private __errorElement: HTMLSpanElement;

	constructor(
		protected _container: HTMLFormElement,
		protected _events: IEvents
	) {
		super(_container);

		this.__submitButtonElement = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			this._container
		);

		this.__errorElement = ensureElement<HTMLSpanElement>(
			'.form__errors',
			this._container
		);

		this._container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInput(field, value);
		});

		this._container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this._events.emit(`${this._container.name}:submit`);
		});
	}

	protected onInput(field: keyof T, value: string) {
		this._events.emit(`${this._container.name}:input`, { field, value });
	}

	set valid(value: boolean) {
		this.setDisabled(this.__submitButtonElement, !value);
	}

	set errors(value: string[]) {
		this.setText(this.__errorElement, value.join(', '));
	}
}
