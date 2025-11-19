import { Controller } from '@hotwired/stimulus';
import { Modal } from 'bootstrap';
import { Events } from '../../utils/events';

export default class extends Controller {
  #modal;
  #callback;

  connect() {
    this.#modal = Modal.getOrCreateInstance(document.querySelector('#confirm-modal'));
    document.addEventListener(Events.CONFIRM_MODAL_SHOW, this.show.bind(this));
  }

  confirm = async () => {
    if (this.#callback !== null) {
      await this.#callback();
    }
    this.close();
  };

  show(event) {
    this.#callback = event.detail.callback;
    this.#modal.show();
  }

  close() {
    this.#callback = null;
    this.#modal.hide();
  }
}
