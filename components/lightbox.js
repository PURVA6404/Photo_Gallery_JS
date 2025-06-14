/**
 * Lightbox Component
 * Handles the fullscreen image view with navigation
 */
class Lightbox {
    constructor() {
        this.createLightboxElement();
        this.currentPhotoIndex = 0;
        this.photos = [];
    }

    createLightboxElement() {
        this.element = document.createElement('div');
        this.element.className = 'lightbox';
        this.element.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
                <button class="lightbox-nav prev" aria-label="Previous image">&lt;</button>
                <button class="lightbox-nav next" aria-label="Next image">&gt;</button>
                <img class="lightbox-image" src="" alt="">
                <div class="lightbox-info">
                    <h3 class="lightbox-title"></h3>
                    <p class="lightbox-description"></p>
                    <div class="lightbox-tags"></div>
                </div>
            </div>
        `;

        // Add event listeners
        this.element.querySelector('.lightbox-close').addEventListener('click', () => this.close());
        this.element.querySelector('.lightbox-nav.prev').addEventListener('click', () => this.showPrevious());
        this.element.querySelector('.lightbox-nav.next').addEventListener('click', () => this.showNext());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.element.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape': this.close(); break;
                case 'ArrowLeft': this.showPrevious(); break;
                case 'ArrowRight': this.showNext(); break;
            }
        });

        document.body.appendChild(this.element);
    }

    show(photos, index) {
        this.photos = photos;
        this.currentPhotoIndex = index;
        this.element.classList.add('active');
        this.updatePhoto();
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    close() {
        this.element.classList.remove('active');
        document.body.style.overflow = '';
    }

    showNext() {
        this.currentPhotoIndex = (this.currentPhotoIndex + 1) % this.photos.length;
        this.updatePhoto();
    }

    showPrevious() {
        this.currentPhotoIndex = (this.currentPhotoIndex - 1 + this.photos.length) % this.photos.length;
        this.updatePhoto();
    }

    updatePhoto() {
        const photo = this.photos[this.currentPhotoIndex];
        const img = this.element.querySelector('.lightbox-image');
        const title = this.element.querySelector('.lightbox-title');
        const description = this.element.querySelector('.lightbox-description');
        const tags = this.element.querySelector('.lightbox-tags');

        // Update image and info
        img.src = photo.url;
        img.alt = photo.title;
        title.textContent = photo.title;
        description.textContent = photo.description;
        
        // Update tags
        tags.innerHTML = photo.tags
            .map(tag => `<span class="tag">#${tag}</span>`)
            .join('');
    }
}

export default Lightbox; 