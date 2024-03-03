import { cloneTemplate } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Form } from '../common/Form';

export type ContactsForm = {
	email: string;
	phone: string;
};

export class ContactsView extends Form<ContactsForm> {
	constructor(events: IEvents) {
		super(cloneTemplate<HTMLFormElement>('#contacts'), {
			onInput: (field, value) =>
				events.emit(
					'contacts:change',
					field === 'email' ? { email: value } : { phone: value }
				),
			onSubmit: () => events.emit('contacts:submit'),
		});
	}
}
