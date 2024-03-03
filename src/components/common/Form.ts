import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export type FormProps = {
	valid: boolean;
	errors: string[];
};

export type FormActions<T> = {
	onSubmit: () => void;
	onInput: (field: keyof T, value: string) => void;
};

export class Form<T> extends Component<FormProps> {
	private __submitButtonElement: HTMLButtonElement;
	private __errorElement: HTMLSpanElement;

	constructor(
		protected _container: HTMLFormElement,
		protected actions?: Partial<FormActions<T>>
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

		if (actions?.onInput) {
			this._container.addEventListener('input', this.inputHandler);
		}

		if (actions?.onSubmit) {
			this._container.addEventListener('submit', this.submitHandler);
		}
	}

	private inputHandler = (e: KeyboardEvent) => {
		const target = e.target as HTMLInputElement;
		const field = target.name as keyof T;
		const value = target.value;
		this.actions.onInput(field, value);
	};

	private submitHandler = (e: SubmitEvent) => {
		e.preventDefault();
		this.actions.onSubmit();
	};

	set valid(value: boolean) {
		this.setDisabled(this.__submitButtonElement, !value);
	}

	set errors(value: string[]) {
		this.setText(this.__errorElement, value.join(', '));
	}
}
