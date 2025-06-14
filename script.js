/**
 * Carousel Class - Implements a responsive image carousel with autoplay and navigation
 * Features:
 * - Next/Previous navigation buttons
 * - Dot indicators for direct slide access
 * - Autoplay with hover pause
 * - Touch swipe support
 * - Keyboard navigation
 * - Responsive design handling
 * - Image preloading
 */
class Carousel {
    constructor() {
        // Select all necessary DOM elements
        this.carousel = document.querySelector('.carousel');
        this.track = document.querySelector('.carousel-track');
        this.slides = Array.from(document.querySelectorAll('.carousel-slide'));
        this.dotsContainer = document.querySelector('.carousel-dots');
        this.prevButton = document.querySelector('.carousel-button.prev');
        this.nextButton = document.querySelector('.carousel-button.next');

        // Initialize state variables
        this.currentIndex = 0;
        this.slideCount = this.slides.length;
        this.autoplayInterval = null;
        this.autoplayDelay = 3000; // 3 seconds

        // Set up the carousel
        this.createDots();
        this.updateDots();
        this.addEventListeners();
        this.startAutoplay();
        this.preloadImages();
    }

    /**
     * Creates dot indicators for each slide
     */
    createDots() {
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
    }

    /**
     * Updates the active state of dot indicators
     */
    updateDots() {
        const dots = this.dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    /**
     * Updates the carousel position to show the current slide
     */
    updateSlidePosition() {
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        this.updateDots();
    }

    /**
     * Navigates to a specific slide
     * @param {number} index - The index of the target slide
     */
    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlidePosition();
    }

    /**
     * Moves to the next slide with wraparound
     */
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slideCount;
        this.updateSlidePosition();
    }

    /**
     * Moves to the previous slide with wraparound
     */
    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
        this.updateSlidePosition();
    }

    /**
     * Starts the autoplay functionality
     */
    startAutoplay() {
        if (this.autoplayInterval) clearInterval(this.autoplayInterval);
        this.autoplayInterval = setInterval(() => this.nextSlide(), this.autoplayDelay);
    }

    /**
     * Stops the autoplay functionality
     */
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    /**
     * Preloads all carousel images to prevent flickering
     */
    preloadImages() {
        const imageUrls = this.slides.map(slide => 
            slide.querySelector('img').src
        );

        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }

    /**
     * Sets up all event listeners for carousel interaction
     */
    addEventListeners() {
        // Navigation button clicks
        this.prevButton.addEventListener('click', () => this.prevSlide());
        this.nextButton.addEventListener('click', () => this.nextSlide());

        // Autoplay pause/resume on hover
        this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoplay());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Window resize handling with debounce
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.updateSlidePosition();
            }, 100);
        });

        // Touch swipe support for mobile devices
        let touchStartX = 0;
        let touchEndX = 0;

        this.carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        this.carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const difference = touchStartX - touchEndX;
            
            if (Math.abs(difference) > 50) { // Minimum swipe distance threshold
                if (difference > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
    }
}

// Initialize the carousel when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
});

import Gallery from './components/gallery.js';

document.addEventListener('DOMContentLoaded', () => {
    new Gallery();
}); 