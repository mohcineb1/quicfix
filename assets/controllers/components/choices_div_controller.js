import { Controller } from '@hotwired/stimulus';
import { dispatchAppEvent, Events } from '../../utils/events';

export default class extends Controller {
  static values = {
    bgColorClass: { type: String, required: true },
  };

  static targets = ['div', 'title', 'icon'];

  toggleSelection(event) {
    const removeTarget = this.element.querySelector('div[data-selected="true"]');
    const addTarget = this.element.querySelector('div[data-selected="false"]');

    if (event.currentTarget !== removeTarget) {
      this.#toggleElementState(removeTarget, false);
      this.#toggleElementState(addTarget, true);
      this.titleTarget.innerHTML = addTarget.dataset.title;
      this.#toggleIconClass(addTarget.querySelector('i'), 'bi-arrow-down-right', 'bi-arrow-down');
      this.#toggleIconClass(removeTarget.querySelector('i'), 'bi-arrow-down', 'bi-arrow-down-right');
      const value = this.#swapValues();
      dispatchAppEvent(Events.DIV_TOGGLE_CHOICE, { blockName: `${value}` });
    }
  }

  #swapValues() {
    const checkedRadio = this.element.querySelector('input[type="radio"]:checked');
    const unChekedRadio = this.element.querySelector('input[type="radio"]:not(:checked)');
    unChekedRadio.checked = true;
    checkedRadio.checked = false;
    return unChekedRadio.value;
  }

  #toggleElementState(element, isSelected) {
    element.classList.toggle(this.bgColorClassValue, isSelected);
    element.setAttribute('data-selected', isSelected.toString());
  }

  #toggleIconClass(element, oldClass, newClass) {
    if (element) {
      element.classList.remove(oldClass);
      element.classList.add(newClass);
    }
  }
}
