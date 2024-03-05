import { IEvents } from '../../types/types';
import { ensureElement } from '../../utils/utils';
import { Modal } from '../common/Modal';

export class ModalView extends Modal {
	constructor(events: IEvents) {
		super(ensureElement<HTMLDivElement>('#modal-container'), {
			onClose: () => events.emit('modal:close'),
			onOpen: () => events.emit('modal:open'),
		});
	}
}
