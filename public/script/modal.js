 // Gallery configurations - each gallery has its own image set
        const galleries = {
            'woodwise': [
                { src: './assets/WoodWise-Home.png', alt: 'WoodWise Home' },
                { src: './assets/Woodwise-service.png', alt: 'WoodWise Service' },
                { src: './assets/Woodwise-gallery.png', alt: 'WoodWise Gallery' }
            ],
            'laravel': [
                { src: './assets/Laravel-Blog.png', alt: 'Laravel Home' },
                { src: './assets/Laravel-Login.png', alt: 'Laravel Login' },
                { src: './assets/Laravel-user-setting.png', alt: 'Laravel User Setting' }
            ],
            'react': [
                { src: './assets/FitJourney-1.png', alt: 'FitJourney App' },
                { src: './assets/FitJourney-add.png', alt: 'FitJourney Add Goal' },
                { src: './assets/FitJourney-added-goal.png', alt: 'FitJourney Goal Added' }
            ],
            'app': [
                { src: './assets/app-design2.png', alt:'App Screen 1' },
                { src: './assets/app-design2.png', alt: 'App Screen 2' },
                { src: './assets/App-Design-phone.png', alt: 'App Screen 3' }
            ],
            'logo': [
                { src: './assets/Logos.png', alt: 'Logos' }
            ],
            'youtube': [
                { src: './assets/YouTube.png', alt: 'YouTube Home' },
                { src: './assets/thumbnail2.png', alt: 'Thumbnail 1' },
                { src: './assets/thumbnail4.png', alt: 'Thumbnail 2' }
            ]
        };

        let currentGallery = null;
        let currentImageIndex = 0;

        // Modal functionality - now accepts gallery name and image index
        function openModal(galleryName, imageIndex) {
            currentGallery = galleryName;
            currentImageIndex = imageIndex;
            
            const modal = document.getElementById('imageModal');
            const modalImage = document.getElementById('modalImage');
            const currentIndexSpan = document.getElementById('currentImageIndex');
            const totalImagesSpan = document.getElementById('totalImages');
            
            const images = galleries[currentGallery];
            modalImage.src = images[currentImageIndex].src;
            modalImage.alt = images[currentImageIndex].alt;
            currentIndexSpan.textContent = currentImageIndex + 1;
            totalImagesSpan.textContent = images.length;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            const modal = document.getElementById('imageModal');
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            currentGallery = null;
        }

        function nextImage() {
            if (!currentGallery) return;
            const images = galleries[currentGallery];
            currentImageIndex = (currentImageIndex + 1) % images.length;
            updateModalImage();
        }

        function previousImage() {
            if (!currentGallery) return;
            const images = galleries[currentGallery];
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            updateModalImage();
        }

        function updateModalImage() {
            if (!currentGallery) return;
            
            const modalImage = document.getElementById('modalImage');
            const currentIndexSpan = document.getElementById('currentImageIndex');
            const images = galleries[currentGallery];
            
            modalImage.src = images[currentImageIndex].src;
            modalImage.alt = images[currentImageIndex].alt;
            currentIndexSpan.textContent = currentImageIndex + 1;
        }

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            const modal = document.getElementById('imageModal');
            if (modal.classList.contains('active')) {
                switch(e.key) {
                    case 'Escape':
                        closeModal();
                        break;
                    case 'ArrowRight':
                        nextImage();
                        break;
                    case 'ArrowLeft':
                        previousImage();
                        break;
                }
            }
        });