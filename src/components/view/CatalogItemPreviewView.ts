import { cloneTemplate } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Card, CardProps } from '../common/Card';

export type CatalogItemPreviewViewProps = {
	id: string;
} & CardProps;

export type CatalogItemPreviewViewActions = {
	onAddToCartClick: (id: string) => void;
};

export class CatalogItemPreviewView extends Card<CatalogItemPreviewViewProps> {
	constructor(events: IEvents, actions: CatalogItemPreviewViewActions) {
		super(cloneTemplate<HTMLDivElement>('#card-preview'), events, {
			onClick: () => actions.onAddToCartClick(this.id),
		});
	}

	set id(id: string) {
		this._container.dataset.id = id || '';
	}
	get id() {
		return this._container.dataset.id || '';
	}
}
