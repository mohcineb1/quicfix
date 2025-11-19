import { Controller } from '@hotwired/stimulus';
import TomSelect from 'tom-select';
import trad from '../../utils/trad';

export default class extends Controller {
  #tomInstance;
  connect() {
    super.connect();
    console.log('TomSelect controller connected for:', this.element.id || this.element.name);
    
      // Check if remove button should be disabled
    const noRemoveButton = this.element.dataset.noRemoveButton === 'true';
    
    const config = {
      render: {
        no_results: function () {
          return '<div class="no-results">' + `${trad.multipleSelect.notFoundMsg}` + '</div>';
        },
        option: function (data, escape) {
            return '<div><i class="bi bi-caret-up-fill"></i> <span>' + escape(data.text) + '</span> </div>';
        },
      },
    };
    
    // Only add remove_button plugin if not disabled
    if (!noRemoveButton) {
      config.plugins = {
        remove_button: {
          title: `${trad.multipleSelect.removeTitle}`,
        },
      };
    }
    
    this.#tomInstance = new TomSelect(this.element, config);
    this.#tomInstance.ignoreFocus = true;
    this.#tomInstance.control_input.addEventListener('click', this.#onClick.bind(this));
    
    // If noRemoveButton is true, disable text input
    if (noRemoveButton) {
      this.#tomInstance.control_input.disabled = true;
      this.#tomInstance.control_input.style.cursor = 'pointer';
    }
  }

  disconnect() {
    this.#tomInstance.control_input.removeEventListener('click', this.#onClick);
    super.disconnect();
  }

  invalid() {
    this.#tomInstance.wrapper.classList.add('border-danger');
  }

  #onClick() {
    if (this.#tomInstance.wrapper.classList.contains('border-danger')) {
      this.#tomInstance.wrapper.classList.remove('border-danger');
    }
  }
}
