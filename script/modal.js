 // Gallery configurations - each gallery has its own image set
        const galleries = {
            'woodwise': [
                { src: './assets/WoodWise-Home.png', alt: 'WoodWise Home' },
                { src: './assets/Woodwise-service.png', alt: 'WoodWise Service' },
                { src: './assets/Woodwise-gallery.png', alt: 'WoodWise Gallery' }
            ]
            // Add more galleries here like:
            // 'project2': [
            //     { src: './assets/project2-1.png', alt: 'Project 2 Image 1' },
            //     { src: './assets/project2-2.png', alt: 'Project 2 Image 2' }
            // ]
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