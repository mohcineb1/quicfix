import { Controller } from '@hotwired/stimulus';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

/**
 * Flatpickr date/time picker controller
 * 
 * Usage examples:
 * 
 * Single date with time:
 * data-controller="components--flatpickr"
 * data-components--flatpickr-enable-time-value="true"
 * data-components--flatpickr-time24hr-value="false"
 * 
 * Multi-date selection:
 * data-controller="components--flatpickr"
 * data-components--flatpickr-mode-value="multiple"
 * 
 * Date range:
 * data-controller="components--flatpickr"
 * data-components--flatpickr-mode-value="range"
 * 
 * Multi-date with time:
 * data-controller="components--flatpickr"
 * data-components--flatpickr-mode-value="multiple"
 * data-components--flatpickr-enable-time-value="true"
 */
export default class extends Controller {
    static values = {
        mode: { type: String, default: 'single' }, // 'single', 'multiple', 'range'
        enableTime: { type: Boolean, default: false },
        time24hr: { type: Boolean, default: true },
        dateFormat: { type: String, default: 'd-m-Y H:i' },
        altFormat: { type: String, default: 'd-m-Y H:i' },
        minDate: String,
        maxDate: String,
        defaultDate: String,
        inline: { type: Boolean, default: false },
        locale: { type: String, default: 'default' },
        autoSetTime: { type: String, default: '' }, // 'start' (00:00), 'end' (23:59), or '' (none)
        timeMode: { type: String, default: 'auto' }, // 'auto' or 'manual'
        timeLabel: { type: String, default: "Sélectionner un horaire" },
        wrap: { type: Boolean, default: false } // Enable calendar icon trigger
    };

    static targets = ['input'];

    connect() {
        console.log('[FLATPICKR] ========== CONNECT START ==========');
        console.log('[FLATPICKR] Element:', this.element.id || this.element.name);
        
        // CRITICAL FIX: Check if flatpickr is already initialized on this element
        if (this.element._flatpickr) {
            console.log('[FLATPICKR] ALREADY INITIALIZED - Skipping');
            // Store reference to existing instance
            this.flatpickrInstance = this.element._flatpickr;
            console.log('[FLATPICKR] ========== CONNECT END (SKIP) ==========');
            return;
        }
        
        // Store initial time BEFORE flatpickr initialization
        this.extractedInitialTime = null;
        const existingValue = this.element.value;
        console.log('[FLATPICKR] Existing value:', existingValue);
        
        if (existingValue && existingValue.trim() !== '') {
            // Try to extract time from format: dd/MM/yyyy HH:mm:ss
            const timeMatch = existingValue.match(/(\d{2}):(\d{2}):\d{2}$/);
            if (timeMatch) {
                this.extractedInitialTime = `${timeMatch[1]}:${timeMatch[2]}`;
                console.log('[FLATPICKR] Extracted initial time:', this.extractedInitialTime);
            }
        }        this.initializeFlatpickr();
        
        // Note: setupToggleBehavior() is now called in onReady callback
        // to ensure altInput is created before we attach click handlers
        
        // Initialize manual time picker if mode is 'manual'
        if (this.timeModeValue === 'manual') {
            console.log('[FLATPICKR] Time mode is manual, scheduling createManualTimePicker()...');
            // Wait a bit for flatpickr to fully initialize before creating time picker
            setTimeout(() => {
                this.createManualTimePicker();
            }, 100);
        }
        
        console.log('[FLATPICKR] ========== CONNECT END ==========');
    }

    disconnect() {
        console.log('[FLATPICKR] ========== DISCONNECT START ==========');
        console.log('[FLATPICKR] Element:', this.element.id || this.element.name);
        
        // DON'T destroy flatpickr on disconnect - let it persist
        // Only clean up event listeners we added
        if (this.inputElement && this.handleInputClick) {
            console.log('[FLATPICKR] Removing event listener...');
            this.inputElement.removeEventListener('click', this.handleInputClick);
            if (this.flatpickrInstance?.altInput) {
                this.flatpickrInstance.altInput.removeEventListener('click', this.handleInputClick);
            }
        }
        
        // DON'T remove the time picker container - let it persist
        // The flatpickr instance and its DOM remain intact
        
        console.log('[FLATPICKR] ========== DISCONNECT END ==========');
    }    initializeFlatpickr() {
        console.log('[FLATPICKR] initializeFlatpickr() called');
        
        const config = {
            mode: this.modeValue,
            enableTime: this.enableTimeValue,
            time_24hr: this.time24hrValue,
            dateFormat: this.dateFormatValue,
            altFormat: this.altFormatValue,
            altInput: true,
            inline: this.inlineValue,
            allowInput: true,
            clickOpens: false, // Disable default click, we'll handle toggle manually
            wrap: this.wrapValue,
            static: true, // Prevent calendar from closing on scroll
            // CRITICAL: Prevent mobile-specific DOM mutations
            disableMobile: true,
            // Setup toggle behavior once flatpickr is ready
            onReady: (selectedDates, dateStr, instance) => {
                console.log('[FLATPICKR] onReady callback - flatpickr is now ready');
                console.log('[FLATPICKR] altInput created:', !!instance.altInput);
                // Re-setup toggle behavior now that everything is ready
                setTimeout(() => {
                    this.setupToggleBehavior();
                }, 0);
            }
        };

        // Add minDate if provided
        if (this.hasMinDateValue) {
            config.minDate = this.minDateValue;
        }

        // Add maxDate if provided
        if (this.hasMaxDateValue) {
            config.maxDate = this.maxDateValue;
        }

        // Add defaultDate if provided
        if (this.hasDefaultDateValue) {
            config.defaultDate = this.defaultDateValue;
        }

        // Handle locale (you can add more locales as needed)
        if (this.localeValue !== 'default') {
            // Import locale dynamically if needed
            // For now, we'll use the default English locale
        }

        // Add onChange handler to auto-set time if specified
        if (this.autoSetTimeValue && this.timeModeValue === 'auto') {
            config.onChange = (selectedDates) => {
                if (selectedDates.length > 0) {
                    const date = selectedDates[0];
                    let modifiedDate;
                    
                    if (this.autoSetTimeValue === 'start') {
                        // Set to 00:00:00
                        modifiedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
                    } else if (this.autoSetTimeValue === 'end') {
                        // Set to 23:59:59
                        modifiedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
                    }
                    
                    if (modifiedDate) {
                        // Update the input value with the modified date
                        // Format: dd/MM/yyyy HH:mm:ss for Symfony
                        const day = String(modifiedDate.getDate()).padStart(2, '0');
                        const month = String(modifiedDate.getMonth() + 1).padStart(2, '0');
                        const year = modifiedDate.getFullYear();
                        const hours = String(modifiedDate.getHours()).padStart(2, '0');
                        const minutes = String(modifiedDate.getMinutes()).padStart(2, '0');
                        const seconds = String(modifiedDate.getSeconds()).padStart(2, '0');
                        
                        this.element.value = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
                    }
                }
            };
        } else if (this.timeModeValue === 'manual') {
            config.onChange = (selectedDates) => {
                if (selectedDates.length > 0) {
                    // Only update if we have a selected time, otherwise keep existing
                    if (this.selectedTime) {
                        this.updateInputWithManualTime();
                    } else {
                        // Extract time from the selected date if available
                        const date = selectedDates[0];
                        const hours = String(date.getHours()).padStart(2, '0');
                        const minutes = String(date.getMinutes()).padStart(2, '0');
                        // Round to nearest 15 minutes
                        const roundedMinutes = Math.floor(parseInt(minutes) / 15) * 15;
                        const timeStr = `${hours}:${String(roundedMinutes).padStart(2, '0')}`;
                        this.setManualTime(timeStr);
                        this.updateInputWithManualTime();
                    }
                }
            };
        }

        // Parse existing value BEFORE initializing Flatpickr
        const existingValue = this.element.value;
        if (existingValue && existingValue.trim() !== '') {
            // Try to parse format: dd/MM/yyyy HH:mm:ss
            const dateMatch = existingValue.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/);
            if (dateMatch) {
                const [, day, month, year, hours, minutes, seconds] = dateMatch;
                const parsedDate = new Date(
                    parseInt(year, 10),
                    parseInt(month, 10) - 1, // Month is 0-indexed
                    parseInt(day, 10),
                    parseInt(hours, 10),
                    parseInt(minutes, 10),
                    parseInt(seconds, 10)
                );
                config.defaultDate = parsedDate;
            }
        }
        
        // Initialize Flatpickr with the parsed date
        console.log('[FLATPICKR] Initializing flatpickr...');
        this.flatpickrInstance = flatpickr(this.element, config);
        console.log('[FLATPICKR] Flatpickr instance created');
    }

    // Method to programmatically set date
    setDate(date) {
        if (this.flatpickrInstance) {
            this.flatpickrInstance.setDate(date);
        }
    }

    // Method to clear the date
    clear() {
        if (this.flatpickrInstance) {
            this.flatpickrInstance.clear();
        }
    }

    // Method to get selected dates
    getSelectedDates() {
        if (this.flatpickrInstance) {
            return this.flatpickrInstance.selectedDates;
        }
        return [];
    }    // Setup toggle behavior: click on input to toggle calendar open/close
    setupToggleBehavior() {
        console.log('[FLATPICKR] setupToggleBehavior() called');
        console.log('[FLATPICKR] flatpickrInstance exists:', !!this.flatpickrInstance);
        console.log('[FLATPICKR] altInput exists:', !!this.flatpickrInstance?.altInput);
        
        // Remove old event listener if it exists
        if (this.inputElement && this.handleInputClick) {
            console.log('[FLATPICKR] Removing old click handler');
            this.inputElement.removeEventListener('click', this.handleInputClick);
        }
        
        // Store bound handler so we can remove it later
        this.handleInputClick = (e) => {
            console.log('[FLATPICKR] Input clicked!');
            if (!this.flatpickrInstance) {
                console.log('[FLATPICKR] ERROR: No flatpickr instance');
                return;
            }

            console.log('[FLATPICKR] Calendar isOpen:', this.flatpickrInstance.isOpen);
            
            // Check if calendar is currently open
            if (this.flatpickrInstance.isOpen) {
                // If open, close it
                console.log('[FLATPICKR] Closing calendar');
                this.flatpickrInstance.close();
                e.preventDefault();
                e.stopPropagation();
            } else {
                // If closed, open it
                console.log('[FLATPICKR] Opening calendar');
                this.flatpickrInstance.open();
            }
        };

        // Get the actual visible input element
        // Priority: altInput (visible formatted input) > wrapped input > original element
        if (this.flatpickrInstance && this.flatpickrInstance.altInput) {
            // When altInput is used (most common case), attach to altInput
            this.inputElement = this.flatpickrInstance.altInput;
            this.inputElement.addEventListener('click', this.handleInputClick);
            console.log('[FLATPICKR] Click handler attached to altInput:', this.inputElement);
        } else if (this.wrapValue) {
            // When using wrap mode without altInput
            this.inputElement = this.element.querySelector('[data-input]');
            if (this.inputElement) {
                this.inputElement.addEventListener('click', this.handleInputClick);
                console.log('[FLATPICKR] Click handler attached to wrapped input');
            }
        } else {
            // Fallback to original element
            this.inputElement = this.element;
            this.inputElement.addEventListener('click', this.handleInputClick);
            console.log('[FLATPICKR] Click handler attached to original element');
        }
    }    // Create manual time picker UI
    createManualTimePicker() {
        console.log('[FLATPICKR] ========== createManualTimePicker() START ==========');
        
        // GUARD: Prevent multiple creations
        if (this.timePickerContainer) {
            console.log('[FLATPICKR] GUARD: Time picker already exists');
            console.log('[FLATPICKR] ========== createManualTimePicker() END (GUARD) ==========');
            return;
        }
        
        // Get references to input and wrapper elements
        const visibleInput = this.flatpickrInstance.altInput || this.element;
        const wrapperDiv = visibleInput.parentNode;
        
        // ALSO check if time picker already exists in DOM (from previous initialization)
        // Look for time picker AFTER the wrapper, not inside it
        const existingTimePicker = wrapperDiv.parentNode.querySelector('.flatpickr-time-picker-container');
        if (existingTimePicker) {
            console.log('[FLATPICKR] GUARD: Time picker container already exists in DOM');
            this.timePickerContainer = existingTimePicker;
            this.timeInput = existingTimePicker.querySelector('.flatpickr-time-picker-input');
            this.timeDropdown = existingTimePicker.querySelector('.flatpickr-time-picker-dropdown');
            this.timeList = existingTimePicker.querySelector('.flatpickr-time-list');
            console.log('[FLATPICKR] ========== createManualTimePicker() END (REUSED) ==========');
            return;
        }
        
        console.log('[FLATPICKR] Creating time picker container...');
        // Create container for time picker
        this.timePickerContainer = document.createElement('div');
        this.timePickerContainer.className = 'flatpickr-time-picker-container';
        
        // Create label
        const label = document.createElement('label');
        label.className = 'flatpickr-time-picker-label form-label';
        label.textContent = this.timeLabelValue;
        
        // Create input wrapper
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'flatpickr-time-picker-wrapper';
        
        // Create time input
        const timeInput = document.createElement('input');
        timeInput.type = 'text';
        timeInput.className = 'flatpickr flatpickr-time-picker-input form-control';
        timeInput.placeholder = this.timeLabelValue;
        timeInput.readOnly = true;
        
        // Create dropdown container
        const dropdown = document.createElement('div');
        dropdown.className = 'flatpickr-time-picker-dropdown';
        dropdown.style.display = 'none';
        
        // Create scroll button (up)
        const scrollUpBtn = document.createElement('button');
        scrollUpBtn.type = 'button';
        scrollUpBtn.className = 'flatpickr-time-scroll-btn flatpickr-time-scroll-up';
        
        // Create time list
        const timeList = document.createElement('div');
        timeList.className = 'flatpickr-time-list';
        
        // Generate 15-minute intervals (00:00, 00:15, 00:30, ..., 23:45)
        this.generateTimeOptions(timeList);
        
        // Create scroll button (down)
        const scrollDownBtn = document.createElement('button');
        scrollDownBtn.type = 'button';
        scrollDownBtn.className = 'flatpickr-time-scroll-btn flatpickr-time-scroll-down';
          // Assemble dropdown
        dropdown.appendChild(scrollUpBtn);
        dropdown.appendChild(timeList);
        dropdown.appendChild(scrollDownBtn);
        
        // Assemble time picker
        inputWrapper.appendChild(timeInput);
        inputWrapper.appendChild(dropdown);
        this.timePickerContainer.appendChild(label);
        this.timePickerContainer.appendChild(inputWrapper);
        
        // Insert time picker container AFTER the flatpickr wrapper (not inside it)
        // wrapperDiv was already declared at the beginning of this method
        wrapperDiv.parentNode.insertBefore(this.timePickerContainer, wrapperDiv.nextSibling);
        
        // Store references
        this.timeInput = timeInput;
        this.timeDropdown = dropdown;
        this.timeList = timeList;
        
        // Add event listeners
        this.setupTimePickerEvents(timeInput, dropdown, timeList, scrollUpBtn, scrollDownBtn);
        
        // Use the stored initial time that was extracted BEFORE flatpickr initialization
        if (this.extractedInitialTime) {
            console.log('[FLATPICKR] Setting initial time:', this.extractedInitialTime);
            this.setManualTime(this.extractedInitialTime);
        }
        
        console.log('[FLATPICKR] ========== createManualTimePicker() END (SUCCESS) ==========');
    }
    
    generateTimeOptions(timeList) {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const h = String(hour).padStart(2, '0');
                const m = String(minute).padStart(2, '0');
                times.push(`${h}:${m}`);
            }
        }
        
        times.forEach(time => {
            const option = document.createElement('div');
            option.className = 'flatpickr-time-option';
            option.textContent = time;
            option.dataset.time = time;
            timeList.appendChild(option);
        });
    }
    
    setupTimePickerEvents(input, dropdown, timeList, scrollUpBtn, scrollDownBtn) {
        // Toggle dropdown on input click
        input.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = dropdown.style.display === 'flex';
            dropdown.style.display = isVisible ? 'none' : 'flex';
            
            if (!isVisible) {
                // Scroll to selected time
                const selectedOption = timeList.querySelector('.flatpickr-time-option.selected');
                if (selectedOption) {
                    timeList.scrollTop = selectedOption.offsetTop - timeList.offsetHeight / 2 + selectedOption.offsetHeight / 2;
                }
            }
        });
        
        // Select time option
        timeList.addEventListener('click', (e) => {
            if (e.target.classList.contains('flatpickr-time-option')) {
                this.setManualTime(e.target.dataset.time);
                dropdown.style.display = 'none';
                this.updateInputWithManualTime();
            }
        });
        
        // Scroll buttons
        scrollUpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            timeList.scrollBy({ top: -100, behavior: 'smooth' });
        });
        
        scrollDownBtn.addEventListener('click', (e) => {
            e.preventDefault();
            timeList.scrollBy({ top: 100, behavior: 'smooth' });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.timePickerContainer.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }
    
    setManualTime(time) {
        this.selectedTime = time;
        if (this.timeInput) {
            this.timeInput.value = time;
        }
        
        // Update selected state
        if (this.timeList) {
            const options = this.timeList.querySelectorAll('.flatpickr-time-option');
            options.forEach(opt => {
                opt.classList.toggle('selected', opt.dataset.time === time);
            });
        }
    }
    
    updateInputWithManualTime() {
        const selectedDates = this.flatpickrInstance.selectedDates;
        if (selectedDates.length > 0) {
            const date = selectedDates[0];
            let hours = '00';
            let minutes = '00';
            
            // Only use selected time if one has been chosen
            if (this.selectedTime) {
                [hours, minutes] = this.selectedTime.split(':');
            }
            
            const modifiedDate = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                parseInt(hours, 10),
                parseInt(minutes, 10),
                0
            );
            
            const day = String(modifiedDate.getDate()).padStart(2, '0');
            const month = String(modifiedDate.getMonth() + 1).padStart(2, '0');
            const year = modifiedDate.getFullYear();
            const h = String(modifiedDate.getHours()).padStart(2, '0');
            const m = String(modifiedDate.getMinutes()).padStart(2, '0');
            const s = '00';
            
            this.element.value = `${day}/${month}/${year} ${h}:${m}:${s}`;
        }
    }
}