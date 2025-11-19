/**
 * Upcoming Events Carousel
 * Initializes Swiper carousel for upcoming events on the homepage
 */

/* global Swiper */

(function() {
    'use strict';
   
    // Make function globally accessible for AJAX re-initialization
    window.initUpcomingEventsCarousel = function() {
        const swiperElement = document.querySelector('.upcoming-events-swiper');
        
        if (!swiperElement) {
            console.log('Upcoming events carousel element not found');
            return;
        }

        // Destroy existing instance if any (prevent duplicates)
        if (swiperElement.swiper) {
            swiperElement.swiper.destroy(true, true);
            console.log('Destroyed existing Swiper instance');
        }

        try {
            // Initialize Swiper carousel
            new Swiper('.upcoming-events-swiper', {
                effect: 'coverflow',
                grabCursor: false,
                centeredSlides: true,
                slidesPerView: '3',
                coverflowEffect: {
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 2,
                    slideShadows: false,
                },
                navigation: {
                    nextEl: '.upcoming-events-swiper .swiper-button-next',
                    prevEl: '.upcoming-events-swiper .swiper-button-prev',
                },
                loop: true,
                breakpoints: {
                    320: {
                    slidesPerView: 1,
                    },
                    768: {
                        slidesPerView: 3,
                        coverflowEffect: {
                            depth: 150,
                            modifier: 2.5,
                        }
                    }
                }
            });

            console.log('✅ Upcoming Events Carousel initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing Upcoming Events Carousel:', error);
        }
    }    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.initUpcomingEventsCarousel);
    } else {
        window.initUpcomingEventsCarousel();
    }

    // Also try on window load as fallback
    window.addEventListener('load', function() {
        if (!document.querySelector('.swiper-initialized')) {
            window.initUpcomingEventsCarousel();
        }
    });

})();
