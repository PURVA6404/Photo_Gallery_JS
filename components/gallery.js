import Lightbox from './lightbox.js';

/**
 * Gallery Component
 * Handles the photo grid, lazy loading, and filtering
 */
class Gallery {
    constructor() {
        this.lightbox = new Lightbox();
        this.photos = [];
        this.albums = [];
        this.currentAlbum = null;
        this.searchTerm = '';
        
        this.init();
    }

    async init() {
        try {
            // Load photo data
            const response = await fetch('/data/photos.json');
            const data = await response.json();
            this.photos = data.photos;
            this.albums = data.albums;

            // Set up DOM elements
            this.setupDOM();
            
            // Initialize lazy loading
            this.setupLazyLoading();
            
            // Render initial view
            this.renderAlbums();
            this.renderPhotos();
            
            // Set up event listeners
            this.setupEventListeners();
        } catch (error) {
            console.error('Failed to initialize gallery:', error);
        }
    }

    setupDOM() {
        // Create search bar
        this.searchBar = document.createElement('input');
        this.searchBar.type = 'text';
        this.searchBar.className = 'search-bar';
        this.searchBar.placeholder = 'Search photos by title or tags...';

        // Create albums container
        this.albumsContainer = document.createElement('div');
        this.albumsContainer.className = 'albums-container';

        // Create photos grid
        this.photosGrid = document.createElement('div');
        this.photosGrid.className = 'photos-grid';

        // Add elements to gallery container
        const galleryContainer = document.querySelector('.gallery-container');
        galleryContainer.appendChild(this.searchBar);
        galleryContainer.appendChild(this.albumsContainer);
        galleryContainer.appendChild(this.photosGrid);
    }

    setupLazyLoading() {
        this.imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        });
    }

    setupEventListeners() {
        // Search functionality
        this.searchBar.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.renderPhotos();
        });

        // Handle photo clicks
        this.photosGrid.addEventListener('click', (e) => {
            const photoEl = e.target.closest('.photo-item');
            if (!photoEl) return;

            const photoId = photoEl.dataset.photoId;
            const photoIndex = this.getFilteredPhotos().findIndex(p => p.id === photoId);
            if (photoIndex !== -1) {
                this.lightbox.show(this.getFilteredPhotos(), photoIndex);
            }
        });
    }

    renderAlbums() {
        this.albumsContainer.innerHTML = `
            <div class="album ${!this.currentAlbum ? 'active' : ''}" data-album-id="">
                All Photos
            </div>
            ${this.albums.map(album => `
                <div class="album ${this.currentAlbum === album.id ? 'active' : ''}" 
                     data-album-id="${album.id}">
                    ${album.name}
                </div>
            `).join('')}
        `;

        // Add click handlers to albums
        this.albumsContainer.querySelectorAll('.album').forEach(albumEl => {
            albumEl.addEventListener('click', () => {
                this.currentAlbum = albumEl.dataset.albumId || null;
                this.albumsContainer.querySelectorAll('.album').forEach(el => 
                    el.classList.toggle('active', el.dataset.albumId === this.currentAlbum)
                );
                this.renderPhotos();
            });
        });
    }

    getFilteredPhotos() {
        return this.photos.filter(photo => {
            const matchesAlbum = !this.currentAlbum || photo.albumId === this.currentAlbum;
            const matchesSearch = !this.searchTerm || 
                photo.title.toLowerCase().includes(this.searchTerm) ||
                photo.tags.some(tag => tag.toLowerCase().includes(this.searchTerm));
            return matchesAlbum && matchesSearch;
        });
    }

    renderPhotos() {
        const filteredPhotos = this.getFilteredPhotos();
        
        this.photosGrid.innerHTML = filteredPhotos.map(photo => `
            <div class="photo-item" data-photo-id="${photo.id}">
                <img class="photo-img" 
                     data-src="${photo.thumbnail}" 
                     alt="${photo.title}"
                     loading="lazy">
                <div class="photo-info">
                    <h3>${photo.title}</h3>
                    <div class="photo-tags">
                        ${photo.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        // Set up lazy loading for new images
        this.photosGrid.querySelectorAll('img[data-src]').forEach(img => {
            this.imageObserver.observe(img);
        });
    }
}

export default Gallery; 