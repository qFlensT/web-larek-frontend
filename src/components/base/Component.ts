/**
 * Базовый компонент
 */
export abstract class Component<T> {
	protected constructor(protected readonly _container: HTMLElement) {
		// Учитывайте что код в конструкторе исполняется ДО всех объявлений в дочернем классе
	}

	// Инструментарий для работы с DOM в дочерних компонентах

	// Переключить класс
	public toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}

	// Добавить класс
	public addClass(element: HTMLElement, className: string) {
		element.classList.add(className);
	}

	public setClass(element: HTMLElement, className: string) {
		element.className = className;
	}

	// Установить текстовое содержимое
	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	// Сменить статус блокировки
	setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}

	// Скрыть
	protected setHidden(element: HTMLElement) {
		element.style.display = 'none';
	}

	// Показать
	protected setVisible(element: HTMLElement) {
		element.style.removeProperty('display');
	}

	// Установить изображение с алтернативным текстом
	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	// Вернуть корневой DOM-элемент
	public render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this._container;
	}
}
