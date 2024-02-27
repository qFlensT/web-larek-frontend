import { cloneTemplate, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Modal } from '../common/Modal';

export class ModalView extends Modal {
	constructor(events: IEvents) {
		super(ensureElement<HTMLDivElement>('#modal-container'), events);
	}
}
