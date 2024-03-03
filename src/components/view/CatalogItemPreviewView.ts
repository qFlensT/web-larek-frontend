import { cloneTemplate, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Card, CardProps } from '../common/Card';

export type CatalogItemPreviewViewProps = {
	id: string;
	description: string;
} & CardProps;

export class CatalogItemPreviewView extends Card<CatalogItemPreviewViewProps> {
	private __descriptionElement: HTMLParagraphElement;

	constructor(events: IEvents) {
		super(cloneTemplate<HTMLDivElement>('#card-preview'), {
			onClick: () => events.emit('catalogItem:addToCartClick', { id: this.id }),
		});

		this.__descriptionElement = ensureElement<HTMLParagraphElement>(
			'.card__text',
			this._container
		);
	}

	set id(id: string) {
		this._container.dataset.id = id || '';
	}

	get id() {
		return this._container.dataset.id || '';
	}

	set description(value: string) {
		this.setText(this.__descriptionElement, value);
	}
}
