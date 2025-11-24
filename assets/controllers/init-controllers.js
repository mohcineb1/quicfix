// Plain JavaScript initialization for controllers
import flatpickr from 'flatpickr';
import TomSelect from 'tom-select';

// Initialize all controllers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initFlatpickr();
  initMultipleSelect();
  initTagFilters();
  initEventTabs();
  initEventSearch();
});

// Initialize Flatpickr date pickers
function initFlatpickr() {
  const flatpickrElements = document.querySelectorAll('[data-controller*="flatpickr"]');
  
  flatpickrElements.forEach(element => {
    // Skip if already initialized
    if (element._flatpickr) {
      console.log('Flatpickr already initialized on element, skipping');
      return;
    }
    
    // If it's a hidden input, look for a sibling input or create a visible one
    let targetElement = element;
    if (element.type === 'hidden') {
      // Look for the flatpickr input that was created by Symfony/wrapper
      const wrapper = element.closest('.flatpickr-wrapper');
      if (wrapper) {
        const visibleInput = wrapper.querySelector('input[type="text"]');
        if (visibleInput) {
          targetElement = visibleInput;
        } else {
          // Create a visible input if none exists
          const newInput = document.createElement('input');
          newInput.type = 'text';
          newInput.className = element.className;
          newInput.placeholder = element.placeholder || '';
          element.parentNode.insertBefore(newInput, element.nextSibling);
          targetElement = newInput;
          
          // Sync values between hidden and visible input
          newInput.addEventListener('change', () => {
            element.value = newInput.value;
          });
        }
      }
    }
    
    const enableTime = element.dataset.componentsFlatpickrEnableTimeValue === 'true';
    const dateFormat = element.dataset.componentsFlatpickrDateFormatValue || 'd/m/Y';
    
    const config = {
      enableTime: enableTime,
      dateFormat: dateFormat,
      time_24hr: true,
      locale: {
        firstDayOfWeek: 1
      },
      altInput: element.type === 'hidden',
      altFormat: dateFormat
    };
    
    flatpickr(targetElement, config);
  });
  
  console.log(`Initialized ${flatpickrElements.length} flatpickr instance(s)`);
}

// Initialize TomSelect (Multiple Select)
function initMultipleSelect() {
  const selectElements = document.querySelectorAll('[data-controller*="multiple-select"]');
  
  let initializedCount = 0;
  
  selectElements.forEach(element => {
    // Skip if already initialized (check for tomselect property or ts-hidden-accessible class)
    if (element.tomselect || element.classList.contains('tomselected')) {
      console.log('TomSelect already initialized on element, skipping');
      return;
    }
    
    const noRemoveButton = element.dataset.noRemoveButton === 'true';
    
    const config = {
      render: {
        no_results: function () {
          return '<div class="no-results">Aucun résultat trouvé</div>';
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
          title: 'Supprimer',
        },
      };
    }
    
    try {
      const tomInstance = new TomSelect(element, config);
      tomInstance.ignoreFocus = true;
      
      // If noRemoveButton is true, disable text input
      if (noRemoveButton) {
        tomInstance.control_input.disabled = true;
        tomInstance.control_input.style.cursor = 'pointer';
      }
      
      // Handle click to remove border-danger class
      tomInstance.control_input.addEventListener('click', () => {
        if (tomInstance.wrapper.classList.contains('border-danger')) {
          tomInstance.wrapper.classList.remove('border-danger');
        }
      });
      
      initializedCount++;
    } catch (error) {
      console.error('Failed to initialize TomSelect:', error);
    }
  });
  
  console.log(`Initialized ${initializedCount} TomSelect instance(s) (found ${selectElements.length} elements)`);
}

// Initialize Tag Filters
function initTagFilters() {
  const tagFilterElements = document.querySelectorAll('[data-controller*="tag-filter"]');
  
  tagFilterElements.forEach(element => {
    const visibleCount = parseInt(element.dataset.tagFilterVisibleCountValue) || 6;
    const showMoreText = element.dataset.tagFilterShowMoreTextValue || '+';
    const showLessText = element.dataset.tagFilterShowLessTextValue || '-';
    
    let showingAll = false;
    
    // Get all tag items and toggle button
    const tagItems = element.querySelectorAll('[data-tag-filter-target="tagItem"]');
    const toggleButton = element.querySelector('[data-tag-filter-target="toggleButton"]');
    const checkboxes = element.querySelectorAll('[data-tag-filter-target="checkbox"]');
    const buttons = element.querySelectorAll('[data-tag-filter-target="button"]');
    
    // Initialize button states based on checkbox values (only for form filters)
    if (checkboxes.length > 0 && buttons.length > 0) {
      checkboxes.forEach((checkbox, index) => {
        updateButtonState(checkbox, buttons[index]);
        
        // Add click event listeners to buttons
        buttons[index].addEventListener('click', (e) => {
          e.preventDefault();
          checkbox.checked = !checkbox.checked;
          updateButtonState(checkbox, buttons[index]);
        });
      });
    }
    
    // Add toggle show all functionality
    if (toggleButton) {
      toggleButton.addEventListener('click', (e) => {
        e.preventDefault();
        showingAll = !showingAll;
        
        tagItems.forEach((item) => {
          const index = parseInt(item.dataset.index);
          if (index > visibleCount) {
            if (showingAll) {
              item.classList.remove('d-none');
            } else {
              item.classList.add('d-none');
            }
          }
        });
        
        // Update button icon or text
        const icon = toggleButton.querySelector('i');
        if (icon) {
          // Form filter style with icon
          if (showingAll) {
            icon.classList.remove('bi-plus');
            icon.classList.add('bi-dash');
          } else {
            icon.classList.remove('bi-dash');
            icon.classList.add('bi-plus');
          }
        } else {
          // Event card style with text
          if (showingAll) {
            toggleButton.textContent = showLessText;
          } else {
            // Count hidden items to show "+X"
            const hiddenCount = Array.from(tagItems).filter(item => 
              item.classList.contains('d-none')
            ).length;
            toggleButton.textContent = showMoreText || `+${hiddenCount}`;
          }
        }
      });
    }
    
    function updateButtonState(checkbox, button) {
      if (checkbox.checked) {
        button.classList.remove('btn-outline-secondary');
        button.classList.add('btn-primary');
      } else {
        button.classList.remove('btn-primary');
        button.classList.add('btn-outline-secondary');
      }
    }
  });
  
  console.log(`Initialized ${tagFilterElements.length} tag filter(s)`);
}

// Initialize Event Tabs
function initEventTabs() {
  const eventTabsElements = document.querySelectorAll('[data-controller*="event-tabs"]');
  
  eventTabsElements.forEach(element => {
    const listUrl = element.dataset.eventTabsListUrlValue;
    const meUrl = element.dataset.eventTabsMeUrlValue;
    const newUrl = element.dataset.eventTabsNewUrlValue;
    
    const tabLinks = element.querySelectorAll('[data-event-tabs-target="tabLink"]');
    
    tabLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const tab = link.dataset.tab;
        
        // Remove active class from all tabs
        tabLinks.forEach(l => {
          l.classList.remove('active');
          l.setAttribute('aria-selected', 'false');
        });
        
        // Add active class to clicked tab
        link.classList.add('active');
        link.setAttribute('aria-selected', 'true');
        
        // Navigate to the appropriate URL
        let targetUrl;
        switch(tab) {
          case 'list':
            targetUrl = listUrl;
            break;
          case 'me':
            targetUrl = meUrl;
            break;
          case 'new':
            targetUrl = newUrl;
            break;
        }
        
        if (targetUrl) {
          window.location.href = targetUrl;
        }
      });
    });
  });
  
  console.log(`Initialized ${eventTabsElements.length} event tabs instance(s)`);
}

// Initialize Event Search
function initEventSearch() {
  const eventSearchElements = document.querySelectorAll('[data-controller*="event-search"]');
  
  eventSearchElements.forEach(element => {
    const searchInput = element.querySelector('input[type="search"]');
    
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        // Find all event cards (adjust selector based on your actual structure)
        const eventCards = document.querySelectorAll('.event-card, [data-event-card]');
        
        eventCards.forEach(card => {
          const cardText = card.textContent.toLowerCase();
          
          if (cardText.includes(searchTerm)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    }
  });
  
  console.log(`Initialized ${eventSearchElements.length} event search instance(s)`);
}
