// Attend que le DOM soit entièrement chargé avant d'exécuter le script
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== SÉLECTION DES ÉLÉMENTS DU DOM ====================
    // On regroupe toutes les sélections d'éléments ici pour une meilleure lisibilité
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#header nav a');
    const mobileMenuToggle = document.getElementById('mobile-toggle');
    const nav = document.getElementById('main-nav');
    const darkModeToggle = document.getElementById("darkModeToggle");
    const darkModeIcon = document.getElementById("darkModeIcon");
    const flipCard = document.querySelector('.project-card-flip');
    const modalContainer = document.getElementById('modal-container');
    
    // Fonction utilitaire pour vérifier si on est sur un appareil mobile
    const isMobile = () => window.innerWidth <= 768;

    // ==================== GESTION DU SCROLL (Optimisée avec requestAnimationFrame) ====================
    let isTicking = false;

    const handleScroll = () => {
        const scrollY = window.scrollY;

        // Effet sur le Header et le bouton "Retour en haut"
        if (header) {
            header.classList.toggle('scrolled', scrollY > 50);
        }
        if (backToTop) {
            backToTop.classList.toggle('show', scrollY > 50);
        }

        // Mise à jour de la classe 'active' sur les liens de navigation
        let currentSectionId = '';
        sections.forEach(section => {
            if (scrollY >= section.offsetTop - 100) {
                currentSectionId = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + currentSectionId);
        });

        isTicking = false;
    };

    window.addEventListener('scroll', () => {
        if (!isTicking) {
            window.requestAnimationFrame(handleScroll);
            isTicking = true;
        }
    }, { passive: true });


    // ==================== NAVIGATION FLUIDE (Smooth Scroll) ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            // Ferme le menu mobile si un lien est cliqué
            if (isMobile() && nav && nav.classList.contains('mobile-active')) {
                closeMobileMenu();
            }
        });
    });

    // ==================== ANIMATIONS AU DÉFILEMENT (Intersection Observer) ====================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // On ajoute une classe au lieu de styles directs
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // On ajoute la classe "revealable" à tous les éléments qu'on veut animer
    document.querySelectorAll('.timeline-item, .skill-card, .formation-item, .project-card-flip').forEach(el => {
        el.classList.add('revealable');
        observer.observe(el);
    });

    // ==================== MENU MOBILE AMÉLIORÉ ====================
    const openMobileMenu = () => {
        if (!nav || !mobileMenuToggle) return;
        nav.classList.add('mobile-active');
        header.classList.add('mobile-menu-active-header'); 
        mobileMenuToggle.querySelector('i').classList.replace('fa-bars', 'fa-times');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        mobileMenuToggle.setAttribute('aria-label', 'Fermer le menu de navigation');
    };

    const closeMobileMenu = () => {
        if (!nav || !mobileMenuToggle) return;
        nav.classList.remove('mobile-active');
        header.classList.remove('mobile-menu-active-header');
        mobileMenuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.setAttribute('aria-label', 'Ouvrir le menu de navigation');
    };

    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (nav.classList.contains('mobile-active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
        
        // Ferme le menu en cliquant sur l'overlay (l'élément nav lui-même)
        nav.addEventListener('click', (e) => {
             if (e.target === nav) closeMobileMenu();
        });
    }

    // ==================== MODE SOMBRE ====================
    if (darkModeToggle && darkModeIcon) {
        const updateDarkModeIcon = (isDark) => {
            darkModeIcon.classList.toggle('fa-sun', isDark);
            darkModeIcon.classList.toggle('fa-moon', !isDark);
        };

        const enableDarkMode = () => {
            document.body.classList.add("dark-mode");
            localStorage.setItem("dark-mode", "enabled");
            updateDarkModeIcon(true);
        };

        const disableDarkMode = () => {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("dark-mode", "disabled");
            updateDarkModeIcon(false);
        };

        // Appliquer le thème au chargement de la page
        if (localStorage.getItem("dark-mode") === "enabled") {
            enableDarkMode();
        } else {
            updateDarkModeIcon(false);
        }

        darkModeToggle.addEventListener("click", () => {
            if (document.body.classList.contains("dark-mode")) {
                disableDarkMode();
            } else {
                enableDarkMode();
            }
        });
    }

    // ==================== ANIMATION "MACHINE À ÉCRIRE" ====================
    const homeTitle = document.querySelector('#home h1');

    if (homeTitle) {
        const originalText = homeTitle.textContent;
        // On vide le contenu pour le reconstruire
        homeTitle.innerHTML = ''; 
        
        // On ajoute un conteneur pour le texte et un autre pour le curseur
        const textSpan = document.createElement('span');
        const cursorSpan = document.createElement('span');
        cursorSpan.className = 'cursor';
        
        homeTitle.appendChild(textSpan);
        homeTitle.appendChild(cursorSpan);

        let index = 0;
        const typeSpeed = 100; // Vitesse de frappe en millisecondes

        function typeWriter() {
            if (index < originalText.length) {
                textSpan.textContent += originalText.charAt(index);
                index++;
                setTimeout(typeWriter, typeSpeed);
            } else {
                // Une fois la frappe terminée, on attend un court instant...
                setTimeout(() => {
                    // ...puis on fait disparaître le curseur en fondu.
                    cursorSpan.style.opacity = '0';
                }, 750); // Attend 750ms avant de le faire disparaître
            }
        }
        
        // On démarre l'animation après un petit délai
        setTimeout(typeWriter, 500);
    }
    
    // ==================== CARTE PROJET INTERACTIVE (Flip + Swipe) ====================
    if (flipCard) {
        const flip = () => flipCard.classList.toggle('is-flipped');
        
        flipCard.querySelectorAll('.btn-flip, .btn-flip-back').forEach(btn => {
            btn.addEventListener('click', flip);
        });

        // Gestion du swipe pour mobile
        let touchStartX = 0;
        flipCard.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX, { passive: true });
        flipCard.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].clientX;
            if (Math.abs(touchStartX - touchEndX) > 50) { // Si le swipe est significatif
                flip();
            }
        });
    }

    // ==================== GESTION DE LA FENÊTRE MODALE AMÉLIORÉE (avec Iframe) ====================
    if (modalContainer) {
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modalCloseBtn = document.getElementById('modal-close');
        let scrollPosition = 0;

        const openModal = (title, contentPath) => {
            scrollPosition = window.pageYOffset;
            document.body.style.top = `-${scrollPosition}px`;
            document.body.classList.add('modal-open');

            modalTitle.textContent = title;
            // Affiche le spinner de chargement et prépare l'iframe
            modalBody.innerHTML = `
                <div class="modal-loading">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    <p>Chargement du document...</p>
                </div>
                <iframe src="${contentPath}" width="100%" height="100%" loading="lazy" style="visibility: hidden; border: none;"></iframe>
            `;

            const iframe = modalBody.querySelector('iframe');
            const loadingSpinner = modalBody.querySelector('.modal-loading');

            // Cache le spinner une fois que l'iframe est chargée
            iframe.onload = () => {
                loadingSpinner.style.display = 'none';
                iframe.style.visibility = 'visible';
            };
            
            // Gère le cas où le PDF ne se charge pas
            iframe.onerror = () => {
                loadingSpinner.innerHTML = '<p>Désolé, une erreur est survenue lors du chargement du document.</p>';
            };

            modalContainer.classList.add('active');
        };

        const closeModal = () => {
            modalContainer.classList.remove('active');
            document.body.classList.remove('modal-open');
            document.body.style.removeProperty('top');
            window.scrollTo(0, scrollPosition);
            // Vide le contenu pour stopper le chargement de l'iframe
            modalBody.innerHTML = ''; 
        };

        document.querySelectorAll('.modal-trigger').forEach(trigger => {
            trigger.addEventListener('click', () => {
                const title = trigger.dataset.modalTitle;
                const content = trigger.dataset.modalContent;
                if (content && content !== 'undefined') {
                    openModal(title, content);
                }
            });
        });

        modalCloseBtn.addEventListener('click', closeModal);
        modalContainer.addEventListener('click', e => {
            if (e.target === modalContainer) closeModal();
        });
        window.addEventListener('keydown', e => {
            if (e.key === 'Escape' && modalContainer.classList.contains('active')) closeModal();
        });
    }

});