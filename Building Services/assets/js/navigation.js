// Navigation Configuration
class NavigationConfig {
    static getRoutes() {
        return {
            // Main pages
            home: {
                en: 'index.html',
                ar: 'index-ar.html'
            },
            
            // Features pages
            cleaning: {
                en: 'features/cleaning/cleaning-services.html',
                ar: 'features/cleaning/cleaning-services-ar.html'
            },
            maintenance: {
                en: 'features/maintenance/maintenance-services.html',
                ar: 'features/maintenance/maintenance-services-ar.html'
            },
            gallery: {
                en: 'features/gallery/gallery.html',
                ar: 'features/gallery/gallery-ar.html'
            },
            about: {
                en: 'features/about/about.html',
                ar: 'features/about/about-ar.html'
            },
            contact: {
                en: 'features/contact/contact.html',
                ar: 'features/contact/contact-ar.html'
            },
            faq: {
                en: 'features/faq/faq.html',
                ar: 'features/faq/faq-ar.html'
            },
            
            // Auth pages
            login: {
                en: 'features/auth/login.html',
                ar: 'features/auth/login.html' // Same file, language handled internally
            },
            register: {
                en: 'features/auth/role-selection.html',
                ar: 'features/auth/role-selection.html'
            },
            providerRegistration: {
                en: 'features/auth/provider-registration.html',
                ar: 'features/auth/provider-registration.html'
            },
            
            // Provider pages
            providerProfile: {
                en: 'features/provider/provider-profile.html',
                ar: 'features/provider/provider-profile.html'
            }
        };
    }
    
    static getPath(page, lang = 'en') {
        const routes = this.getRoutes();
        return routes[page]?.[lang] || routes[page]?.en || '#';
    }
    
    static updateAllLinks() {
        this.updateNavLinks();
        this.updateButtonLinks();
        this.updateFooterLinks();
        this.updateServiceCards();
    }
    
    static updateNavLinks() {
        const navLinks = document.querySelectorAll('.nav-link, [data-nav]');
        const currentLang = document.documentElement.lang || 'en';
        
        navLinks.forEach(link => {
            const page = link.getAttribute('href')?.replace('.html', '') || 
                         link.getAttribute('data-nav');
            
            if (page && page !== '#') {
                const newPath = this.getPath(this.getPageKey(page), currentLang);
                if (newPath && newPath !== '#') {
                    link.setAttribute('href', newPath);
                }
            }
        });
    }
    
    static updateButtonLinks() {
        const buttons = document.querySelectorAll('.service-btn, .cta-button, .btn[href]');
        const currentLang = document.documentElement.lang || 'en';
        
        buttons.forEach(button => {
            const href = button.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                const pageKey = this.getPageKeyFromHref(href);
                if (pageKey) {
                    const newPath = this.getPath(pageKey, currentLang);
                    if (newPath && newPath !== '#') {
                        button.setAttribute('href', newPath);
                    }
                }
            }
        });
    }
    
    static updateFooterLinks() {
        const footerLinks = document.querySelectorAll('.footer-links a');
        const currentLang = document.documentElement.lang || 'en';
        
        footerLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                const pageKey = this.getPageKeyFromHref(href);
                if (pageKey) {
                    const newPath = this.getPath(pageKey, currentLang);
                    if (newPath && newPath !== '#') {
                        link.setAttribute('href', newPath);
                    }
                }
            }
        });
    }
    
    static updateServiceCards() {
        const serviceCards = document.querySelectorAll('.service-card a, .service-detailed-card a');
        const currentLang = document.documentElement.lang || 'en';
        
        serviceCards.forEach(card => {
            const href = card.getAttribute('href');
            if (href && (href.includes('cleaning') || href.includes('maintenance'))) {
                const pageKey = href.includes('cleaning') ? 'cleaning' : 'maintenance';
                const newPath = this.getPath(pageKey, currentLang);
                if (newPath && newPath !== '#') {
                    card.setAttribute('href', newPath);
                }
            }
        });
    }
    
    static getPageKeyFromHref(href) {
        if (href.includes('cleaning')) return 'cleaning';
        if (href.includes('maintenance')) return 'maintenance';
        if (href.includes('gallery')) return 'gallery';
        if (href.includes('about')) return 'about';
        if (href.includes('contact')) return 'contact';
        if (href.includes('faq')) return 'faq';
        if (href.includes('login')) return 'login';
        if (href.includes('register')) return 'register';
        if (href.includes('provider-registration')) return 'providerRegistration';
        if (href.includes('provider-profile')) return 'providerProfile';
        if (href.includes('index')) return 'home';
        return null;
    }
    
    static getPageKey(page) {
        const pageMap = {
            'index': 'home',
            'cleaning-services': 'cleaning',
            'maintenance-services': 'maintenance',
            'gallery': 'gallery',
            'about': 'about',
            'contact': 'contact',
            'faq': 'faq',
            'login': 'login',
            'role-selection': 'register',
            'provider-registration': 'providerRegistration',
            'provider-profile': 'providerProfile'
        };
        
        return pageMap[page] || page;
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    NavigationConfig.updateAllLinks();
});

// Update links when language changes
window.addEventListener('languageChanged', (event) => {
    NavigationConfig.updateAllLinks();
});