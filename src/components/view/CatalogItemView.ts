import { cloneTemplate } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Card, CardProps } from '../common/Card';

export type CatalogItemViewProps = {
	id: string;
} & CardProps;

export class CatalogItemView extends Card<CatalogItemViewProps> {
	constructor(events: IEvents) {
		super(cloneTemplate<HTMLButtonElement>('#card-catalog'), {
			onClick: () => events.emit('catalogItem:click', { id: this.id }),
		});
	}

	set id(id: string) {
		this._container.dataset.id = id || '';
	}

	get id() {
		return this._container.dataset.id || '';
	}
}
