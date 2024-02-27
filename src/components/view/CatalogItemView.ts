import { cloneTemplate } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Card, CardProps } from '../common/Card';

export type CatalogItemViewProps = {
	id: string;
} & CardProps;

export type CatalogItemViewActions = {
	onCardClick: (id: string) => void;
};

export class CatalogItemView extends Card<CatalogItemViewProps> {
	constructor(events: IEvents, actions: CatalogItemViewActions) {
		super(cloneTemplate<HTMLButtonElement>('#card-catalog'), events, {
			onClick: () => actions.onCardClick(this.id),
		});
	}

	set id(id: string) {
		this._container.dataset.id = id || '';
	}

	get id() {
		return this._container.dataset.id || '';
	}
}
