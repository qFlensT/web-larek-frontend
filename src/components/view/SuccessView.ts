import { cloneTemplate } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { Success } from '../common/Success';

export type SuccessProps = {};

export class SuccessView extends Success {
	constructor(events: IEvents) {
		super(cloneTemplate<HTMLDivElement>('#success'), {
			onClick: () => events.emit('success:click'),
		});
	}
}
