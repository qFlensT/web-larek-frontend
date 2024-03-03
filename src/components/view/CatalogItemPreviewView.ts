import { cloneTemplate } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Card, CardProps } from '../common/Card';

export type CatalogItemPreviewViewProps = {
	id: string;
} & CardProps;

export class CatalogItemPreviewView extends Card<CatalogItemPreviewViewProps> {
	constructor(events: IEvents) {
		super(cloneTemplate<HTMLDivElement>('#card-preview'), {
			onClick: () => events.emit('catalogItem:addedToCart', { id: this.id }),
		});
	}

	set id(id: string) {
		this._container.dataset.id = id || '';
	}
	get id() {
		return this._container.dataset.id || '';
	}
}
