/**
 * LCTUR Landing Page - Arquivo Principal de JavaScript
 * JavaScript Puro (Vanilla JS), focado em performance e acessibilidade.
 */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // ==========================================
        // 1. COMPORTAMENTO DE SCROLL DO CABEÇALHO
        // ==========================================
        const header = document.querySelector('.header');
        let isScrolled = false;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            if (scrollY > 80 && !isScrolled) {
                header?.classList.add('header--scrolled');
                isScrolled = true;
            } else if (scrollY <= 80 && isScrolled) {
                header?.classList.remove('header--scrolled');
                isScrolled = false;
            }
        };

        // Usa passive listener para melhor performance
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Executa no carregamento inicial

        // ==========================================
        // 2. MENU MOBILE
        // ==========================================
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileNav = document.querySelector('.mobile-nav');
        const body = document.body;
        const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

        const toggleMenu = (forceState = null) => {
            if (!menuToggle || !mobileNav) return;
            
            const isOpening = forceState !== null ? forceState : !mobileNav.classList.contains('active');
            
            if (isOpening) {
                mobileNav.classList.add('active');
                menuToggle.classList.add('active');
                menuToggle.setAttribute('aria-expanded', 'true');
                body.classList.add('no-scroll');
            } else {
                mobileNav.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                body.classList.remove('no-scroll');
            }
        };

        menuToggle?.addEventListener('click', () => toggleMenu());

        // Fechar menu ao clicar num link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });

        // Fechar menu com a tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav?.classList.contains('active')) {
                toggleMenu(false);
            }
        });

        // ==========================================
        // 3. SCROLL SUAVE (SMOOTH SCROLL)
        // ==========================================
        const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
        const headerOffset = 80;

        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    e.preventDefault();
                    
                    // Fecha menu mobile se estiver aberto
                    toggleMenu(false);

                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: prefersReducedMotion ? 'auto' : 'smooth'
                    });

                    // Atualiza a URL sem causar salto na página
                    if (window.history.pushState) {
                        window.history.pushState(null, null, targetId);
                    } else {
                        window.location.hash = targetId;
                    }
                }
            });
        });

        // ==========================================
        // 4. ANIMAÇÕES AO ROLAR (INTERSECTION OBSERVER)
        // ==========================================
        const animatedElements = document.querySelectorAll('.animate-on-scroll, [data-animate]');
        
        if (prefersReducedMotion) {
            animatedElements.forEach(el => el.classList.add('animated'));
        } else {
            const animationObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
            });

            animatedElements.forEach(el => animationObserver.observe(el));
        }

        // ==========================================
        // 5. ACORDEÃO DE FAQ
        // ==========================================
        const faqQuestions = document.querySelectorAll('.faq-question');

        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const parentItem = this.closest('.faq-item');
                const isOpen = parentItem.classList.contains('active');

                // Fecha todos os itens abertos
                document.querySelectorAll('.faq-item.active').forEach(item => {
                    item.classList.remove('active');
                    item.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
                    item.querySelector('.faq-answer')?.setAttribute('aria-hidden', 'true');
                });

                // Abre o clicado se não estava aberto
                if (!isOpen) {
                    parentItem.classList.add('active');
                    this.setAttribute('aria-expanded', 'true');
                    parentItem.querySelector('.faq-answer')?.setAttribute('aria-hidden', 'false');
                }
            });
        });

       

       // 8. FILTROS DA GALERIA
// ==========================================
const filterBtns = document.querySelectorAll('.gallery-filter, .btn--filter');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = (btn.getAttribute('data-category') || 'todos').toLowerCase();

        galleryItems.forEach(item => {
            const itemCategory = (item.getAttribute('data-category') || '').toLowerCase();

            if (filter === 'todos' || filter === itemCategory) {
                item.style.display = '';

                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);

            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.96)';

                setTimeout(() => {
                    if (item.style.opacity === '0') {
                        item.style.display = 'none';
                    }
                }, 300);
            }
        });
    });
});



        // ==========================================
        // 9. CONTEXTO DO BOTÃO WHATSAPP
        // ==========================================
        const wppBtn = document.querySelector('.whatsapp-float');
        const trackedSections = document.querySelectorAll('section[id]');
        
        if (wppBtn) {
            const defaultWppMsg = 'Olá, Carlinhos! Conheci a LCTUR pelo site e gostaria de saber quais são as próximas viagens.';
            const piranhasWppMsg = 'Olá, Carlinhos! Vi o pacote para Piranhas no site da LCTUR e gostaria de saber mais sobre a viagem de 13 a 15 de novembro de 2027.';
            const wppBaseUrl = 'https://wa.me/5582999761253';
            
            const updateWppContext = () => {
                let currentSection = '';
                const scrollPos = window.scrollY + window.innerHeight / 2;

                trackedSections.forEach(section => {
                    const top = section.offsetTop;
                    const height = section.offsetHeight;
                    
                    if (scrollPos >= top && scrollPos < top + height) {
                        currentSection = section.getAttribute('id');
                    }
                });

                let msg = defaultWppMsg;
                if (currentSection === 'piranhas') {
                    msg = piranhasWppMsg;
                }
                
                wppBtn.setAttribute('href', `${wppBaseUrl}?text=${encodeURIComponent(msg)}`);
            };

            window.addEventListener('scroll', updateWppContext, { passive: true });
            updateWppContext();
        }

        // ==========================================
        // 10. EFEITO PARALLAX SUTIL
        // ==========================================
        const heroBg = document.querySelector('.hero__background, .hero-bg');
        
        if (heroBg && !prefersReducedMotion) {
            let ticking = false;
            
            const applyParallax = () => {
                if (window.innerWidth > 768) {
                    const scrolled = window.scrollY;
                    heroBg.style.transform = `translateY(${scrolled * 0.25}px)`;
                } else {
                    heroBg.style.transform = 'translateY(0)';
                }
                ticking = false;
            };

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(applyParallax);
                    ticking = true;
                }
            }, { passive: true });
        }

        // ==========================================
        // 11. LAZY LOADING AVANÇADO
        // ==========================================
        const lazyElements = document.querySelectorAll('[data-src], [data-bg]');
        
        if ('IntersectionObserver' in window) {
            const lazyObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        
                        if (el.hasAttribute('data-src')) {
                            el.src = el.getAttribute('data-src');
                            el.removeAttribute('data-src');
                        }
                        
                        if (el.hasAttribute('data-bg')) {
                            el.style.backgroundImage = `url(${el.getAttribute('data-bg')})`;
                            el.removeAttribute('data-bg');
                        }
                        
                        observer.unobserve(el);
                    }
                });
            }, {
                rootMargin: '200px 0px',
                threshold: 0.01
            });

            lazyElements.forEach(el => lazyObserver.observe(el));
        }

        // ==========================================
        // 12. ATUALIZAR ANO (COPYRIGHT)
        // ==========================================
        const yearEl = document.querySelector('.current-year');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }
        
    }); // fim DOMContentLoaded

})();



/* =========================================================
   HERO CAROUSEL - LCTUR
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    const slides = document.querySelectorAll('.hero__slide');
    const indicators = document.querySelectorAll('.hero__indicator');

    if (!slides.length || !indicators.length) return;

    let currentSlide = 0;
    let autoplay;

    function showSlide(index) {

        slides.forEach((slide, i) => {
            slide.classList.toggle('hero__slide--active', i === index);
        });

        indicators.forEach((indicator, i) => {
            indicator.classList.toggle(
                'hero__indicator--active',
                i === index
            );
        });

        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function startAutoplay() {
        autoplay = setInterval(nextSlide, 6000);
    }

    function resetAutoplay() {
        clearInterval(autoplay);
        startAutoplay();
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            resetAutoplay();
        });
    });

    showSlide(0);
    startAutoplay();

});

