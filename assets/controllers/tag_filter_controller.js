import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['wrapper', 'tagItem', 'checkbox', 'button', 'toggleButton', 'toggleText'];
    static values = {
        showMoreText: String,
        showLessText: String,
        visibleCount: { type: Number, default: 6 }
    };
    
    showingAll = false;connect() {
        try {
            // Initialize button states based on checkbox values (only for form filters)
            // Only run checkbox/button logic if these targets exist (for filter forms)
            if (this.hasCheckboxTarget && this.hasButtonTarget) {
                this.checkboxTargets.forEach((checkbox, index) => {
                    this.updateButtonState(checkbox, this.buttonTargets[index]);
                });

                // Add click event listeners to buttons
                this.buttonTargets.forEach((button, index) => {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        const checkbox = this.checkboxTargets[index];
                        checkbox.checked = !checkbox.checked;
                        this.updateButtonState(checkbox, button);
                    });
                });
            }
        } catch (error) {
            console.error('Error in tag_filter connect():', error);
        }
    }

    updateButtonState(checkbox, button) {
        if (checkbox.checked) {
            button.classList.remove('btn-outline-secondary');
            button.classList.add('btn-primary');
        } else {
            button.classList.remove('btn-primary');
            button.classList.add('btn-outline-secondary');
        }
    }    toggleShowAll(event) {
        try {
            event.preventDefault();
            
            // Safety check: if no tagItem targets, do nothing
            if (!this.hasTagItemTarget) {
                console.warn('toggleShowAll called but no tagItem targets found');
                return;
            }
            
            this.showingAll = !this.showingAll;

            // Use the visibleCount value from the component
            const threshold = this.visibleCountValue;

            this.tagItemTargets.forEach((item) => {
                const index = parseInt(item.dataset.index);
                if (index > threshold) {
                    if (this.showingAll) {
                        item.classList.remove('d-none');
                    } else {
                        item.classList.add('d-none');
                    }
                }
            });

            // Update button icon or text
            if (!this.hasToggleButtonTarget) {
                console.warn('No toggleButton target found');
                return;
            }
            
            const icon = this.toggleButtonTarget.querySelector('i');
            if (icon) {
                // Form filter style with icon
                if (this.showingAll) {
                    icon.classList.remove('bi-plus');
                    icon.classList.add('bi-dash');
                } else {
                    icon.classList.remove('bi-dash');
                    icon.classList.add('bi-plus');
                }
            } else {
                // Event card style with text
                if (this.showingAll) {
                    this.toggleButtonTarget.textContent = this.showLessTextValue || '-';
                } else {
                    // Count hidden items to show "+X"
                    const hiddenCount = this.tagItemTargets.filter(item => 
                        item.classList.contains('d-none')
                    ).length;
                    this.toggleButtonTarget.textContent = this.showMoreTextValue || `+${hiddenCount}`;
                }
            }
        } catch (error) {
            console.error('Error in toggleShowAll():', error);
        }
    }
}
