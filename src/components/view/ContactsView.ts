import { cloneTemplate } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Form } from '../common/Form';

export type ContactsForm = {
	email: string;
	phone: string;
};

export class ContactsView extends Form<ContactsForm> {
	constructor(events: IEvents) {
		super(cloneTemplate<HTMLFormElement>('#contacts'), {
			onInput: (field, value) =>
				events.emit('contacts:input', { field, value }),
			onSubmit: () => events.emit('contacts:submit'),
		});
	}
}
