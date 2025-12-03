// Main JavaScript File - Handles common functionality
class MainApp {
    constructor() {
        this.currentSlide = 0;
        this.init();
    }
    
    init() {
        this.setupMobileMenu();
        this.setupLanguageToggle();
        this.setupSmoothScroll();
        this.setupTestimonialsSlider();
        this.setupFAQAccordion();
        this.setupRoleSelection();
        this.setupLoginTabs();
        this.setupWorkingHours();
        this.setupFormValidation();
        this.setupNavigation();
        this.setupBackToTop();
        this.setupModals();
        this.setupCurrentYear();
    }
    
    // Mobile Menu Toggle
    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mainNav = document.getElementById('main-nav');
        
        if (mobileMenuBtn && mainNav) {
            mobileMenuBtn.addEventListener('click', () => {
                mainNav.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');
                
                // Update aria-expanded
                const isExpanded = mainNav.classList.contains('active');
                mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
            });
            
            // Close mobile menu when clicking on a link
            const navLinks = mainNav.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mainNav.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                });
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    mainNav.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }
    
    // Language Toggle
    setupLanguageToggle() {
        const langToggle = document.getElementById('lang-toggle');
        const body = document.body;
        
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                if (body.classList.contains('rtl')) {
                    body.classList.remove('rtl');
                    langToggle.textContent = 'AR';
                    // Switch to English
                    this.switchToEnglish();
                } else {
                    body.classList.add('rtl');
                    langToggle.textContent = 'EN';
                    // Switch to Arabic
                    this.switchToArabic();
                }
                
                // Update navigation highlights
                this.updateNavHighlight();
            });
        }
    }
    
    switchToEnglish() {
        document.documentElement.lang = 'en';
        document.documentElement.dir = 'ltr';
        
        // Update text content for English
        document.querySelectorAll('[data-en]').forEach(element => {
            element.textContent = element.getAttribute('data-en');
        });
        
        // Update navigation links for English
        this.updateNavigationLinks('en');
    }
    
    switchToArabic() {
        document.documentElement.lang = 'ar';
        document.documentElement.dir = 'rtl';
        
        // Update text content for Arabic
        document.querySelectorAll('[data-ar]').forEach(element => {
            element.textContent = element.getAttribute('data-ar');
        });
        
        // Update navigation links for Arabic
        this.updateNavigationLinks('ar');
    }
    
    updateNavigationLinks(lang) {
        const navLinks = document.querySelectorAll('.nav-link');
        const routes = {
            en: {
                home: 'index.html',
                cleaning: 'features/cleaning/cleaning-services.html',
                maintenance: 'features/maintenance/maintenance-services.html',
                gallery: 'features/gallery/gallery.html',
                about: 'features/about/about.html',
                contact: 'features/contact/contact.html',
                faq: 'features/faq/faq.html',
                login: 'features/auth/login.html'
            },
            ar: {
                home: 'index-ar.html',
                cleaning: 'features/cleaning/cleaning-services-ar.html',
                maintenance: 'features/maintenance/maintenance-services-ar.html',
                gallery: 'features/gallery/gallery-ar.html',
                about: 'features/about/about-ar.html',
                contact: 'features/contact/contact-ar.html',
                faq: 'features/faq/faq-ar.html',
                login: 'features/auth/login.html'
            }
        };
        
        navLinks.forEach(link => {
            const page = link.getAttribute('data-nav') || link.getAttribute('href').split('/').pop().replace('.html', '');
            if (routes[lang][page]) {
                link.setAttribute('href', routes[lang][page]);
            }
        });
    }
    
    // Smooth Scroll for Anchor Links
    setupSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href === '#') return;
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without page jump
                    history.pushState(null, null, href);
                    
                    // Close mobile menu if open
                    const mainNav = document.getElementById('main-nav');
                    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
                    if (mainNav && mobileMenuBtn) {
                        mainNav.classList.remove('active');
                        mobileMenuBtn.classList.remove('active');
                        mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        });
    }
    
    // Testimonials Slider
    setupTestimonialsSlider() {
        const testimonialsContainer = document.getElementById('testimonials-container');
        const sliderDots = document.querySelectorAll('.slider-dot');
        
        if (testimonialsContainer && sliderDots.length > 0) {
            function showSlide(index) {
                testimonialsContainer.style.transform = `translateX(-${index * 100}%)`;
                
                // Update active dot
                sliderDots.forEach(dot => dot.classList.remove('active'));
                if (sliderDots[index]) {
                    sliderDots[index].classList.add('active');
                }
                
                this.currentSlide = index;
            }
            
            // Add click events to dots
            sliderDots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    showSlide.call(this, index);
                });
            });
            
            // Auto slide every 5 seconds
            setInterval(() => {
                let nextSlide = (this.currentSlide + 1) % sliderDots.length;
                showSlide.call(this, nextSlide);
            }, 5000);
        }
    }
    
    // FAQ Accordion
    setupFAQAccordion() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const answer = this.nextElementSibling;
                const isActive = answer.classList.contains('active');
                
                // Close all answers
                document.querySelectorAll('.faq-answer').forEach(ans => {
                    ans.classList.remove('active');
                });
                
                // Remove active class from all questions
                document.querySelectorAll('.faq-question').forEach(q => {
                    q.classList.remove('active');
                });
                
                // If this answer wasn't active, open it
                if (!isActive) {
                    answer.classList.add('active');
                    this.classList.add('active');
                }
            });
        });
    }
    
    // Role Selection
    setupRoleSelection() {
        const roleCards = document.querySelectorAll('.role-card');
        
        roleCards.forEach(card => {
            card.addEventListener('click', function() {
                // Remove selected class from all cards
                roleCards.forEach(c => c.classList.remove('selected'));
                
                // Add selected class to clicked card
                this.classList.add('selected');
                
                // Store selected role
                const role = this.getAttribute('data-role');
                localStorage.setItem('selectedRole', role);
            });
        });
    }
    
    // Login Tab Switching
    setupLoginTabs() {
        const loginTabs = document.querySelectorAll('.login-tab');
        const loginForms = document.querySelectorAll('.login-form');
        
        if (loginTabs.length > 0) {
            loginTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const target = this.getAttribute('data-target');
                    
                    // Update active tab
                    loginTabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Show corresponding form
                    loginForms.forEach(form => {
                        form.classList.remove('active');
                        if (form.id === target) {
                            form.classList.add('active');
                        }
                    });
                });
            });
            
            // Form submission handlers
            const clientLoginForm = document.getElementById('client-login-form');
            const providerLoginForm = document.getElementById('provider-login-form');
            
            if (clientLoginForm) {
                clientLoginForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    this.handleLogin('client');
                }.bind(this));
            }
            
            if (providerLoginForm) {
                providerLoginForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    this.handleLogin('provider');
                }.bind(this));
            }
        }
    }
    
    // Handle login
    handleLogin(userType) {
        const email = document.getElementById(`${userType}-email`)?.value;
        const password = document.getElementById(`${userType}-password`)?.value;
        const rememberMe = document.getElementById(`${userType}-remember`)?.checked;
        
        // Simple validation
        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Show loading state
        this.showNotification('Logging in...', 'info');
        
        // Simulate login process
        console.log(`Logging in as ${userType}:`, { email, password, rememberMe });
        
        // Redirect based on user type
        setTimeout(() => {
            if (userType === 'client') {
                window.location.href = 'features/client/client-profile.html';
            } else {
                window.location.href = 'features/provider/provider-profile.html';
            }
        }, 1000);
    }
    
    // Social login handlers
    handleSocialLogin(provider) {
        console.log(`Social login with ${provider}`);
        this.showNotification(`Connecting with ${provider}...`, 'info');
        // Implement social login logic here
    }
    
    // Working Hours Management
    setupWorkingHours() {
        const dayCheckboxes = document.querySelectorAll('.day-checkbox');
        
        dayCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const daySchedule = this.closest('.day-schedule');
                const timeSelectors = daySchedule.querySelector('.time-selectors');
                
                if (this.checked) {
                    timeSelectors.style.display = 'flex';
                } else {
                    timeSelectors.style.display = 'none';
                }
            });
        });
        
        // Load working hours if on provider page
        if (document.getElementById('working-hours-form')) {
            this.loadWorkingHours();
        }
    }
    
    // Save Working Hours
    saveWorkingHours() {
        const schedule = {};
        const daySchedules = document.querySelectorAll('.day-schedule');
        
        daySchedules.forEach(daySchedule => {
            const day = daySchedule.getAttribute('data-day');
            const checkbox = daySchedule.querySelector('.day-checkbox');
            const startTime = daySchedule.querySelector('.start-time');
            const endTime = daySchedule.querySelector('.end-time');
            
            if (checkbox.checked) {
                schedule[day] = {
                    start: startTime.value,
                    end: endTime.value
                };
            } else {
                schedule[day] = null;
            }
        });
        
        // Save to localStorage or send to server
        localStorage.setItem('workingHours', JSON.stringify(schedule));
        this.showNotification('Working hours saved successfully!', 'success');
    }
    
    // Load Working Hours
    loadWorkingHours() {
        const savedSchedule = localStorage.getItem('workingHours');
        
        if (savedSchedule) {
            const schedule = JSON.parse(savedSchedule);
            
            Object.keys(schedule).forEach(day => {
                const daySchedule = document.querySelector(`.day-schedule[data-day="${day}"]`);
                
                if (daySchedule && schedule[day]) {
                    const checkbox = daySchedule.querySelector('.day-checkbox');
                    const startTime = daySchedule.querySelector('.start-time');
                    const endTime = daySchedule.querySelector('.end-time');
                    const timeSelectors = daySchedule.querySelector('.time-selectors');
                    
                    checkbox.checked = true;
                    startTime.value = schedule[day].start;
                    endTime.value = schedule[day].end;
                    timeSelectors.style.display = 'flex';
                }
            });
        }
    }
    
    // Form Validation
    setupFormValidation() {
        const forms = document.querySelectorAll('form[data-validate]');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
            
            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    this.hideFormError(input);
                });
            });
        });
    }
    
    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('[required]');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(input) {
        const value = input.value.trim();
        const type = input.type;
        const isRequired = input.hasAttribute('required');
        
        // Clear previous errors
        this.hideFormError(input);
        
        // Required field validation
        if (isRequired && !value) {
            this.showFormError(input, 'This field is required');
            return false;
        }
        
        // Email validation
        if (type === 'email' && value && !this.validateEmail(value)) {
            this.showFormError(input, 'Please enter a valid email address');
            return false;
        }
        
        // Phone validation
        if (input.name === 'phone' && value && !this.validatePhone(value)) {
            this.showFormError(input, 'Please enter a valid phone number');
            return false;
        }
        
        // Password confirmation
        if (input.name === 'confirmPassword' && value) {
            const password = input.form.querySelector('input[name="password"]');
            if (password && value !== password.value) {
                this.showFormError(input, 'Passwords do not match');
                return false;
            }
        }
        
        return true;
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    validatePhone(phone) {
        const re = /^[\+]?[1-9][\d]{0,15}$/;
        return re.test(phone.replace(/[\s\-\(\)]/g, ''));
    }
    
    showFormError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup?.querySelector('.form-error');
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
            input.classList.add('error');
        }
    }
    
    hideFormError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup?.querySelector('.form-error');
        
        if (errorElement) {
            errorElement.classList.remove('show');
            input.classList.remove('error');
        }
    }
    
    // Navigation
    setupNavigation() {
        this.updateNavHighlight();
        
        // Auto-detect location if on registration page
        if (document.getElementById('user-address')) {
            document.getElementById('detect-location')?.addEventListener('click', this.detectLocation);
        }
    }
    
    updateNavHighlight() {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Auto-detect location
    detectLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    
                    // Reverse geocoding to get address
                    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
                        .then(response => response.json())
                        .then(data => {
                            const address = `${data.locality}, ${data.city}, ${data.countryName}`;
                            const addressInput = document.getElementById('user-address');
                            if (addressInput) {
                                addressInput.value = address;
                            }
                        })
                        .catch(error => {
                            console.error('Error getting address:', error);
                            this.showNotification('Error detecting location', 'error');
                        });
                }.bind(this),
                function(error) {
                    console.error('Error getting location:', error);
                    this.showNotification('Location access denied or not supported', 'error');
                }.bind(this)
            );
        } else {
            this.showNotification('Geolocation is not supported by this browser.', 'error');
        }
    }
    
    // Back to Top Button
    setupBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
        backToTop.setAttribute('aria-label', 'Back to top');
        
        // Add styles
        if (!document.querySelector('#back-to-top-styles')) {
            const styles = document.createElement('style');
            styles.id = 'back-to-top-styles';
            styles.textContent = `
                .back-to-top {
                    position: fixed;
                    bottom: 80px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                    background: var(--primary-medium);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    opacity: 0;
                    visibility: hidden;
                    transition: var(--transition);
                    z-index: 99;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: var(--shadow-md);
                }
                body.rtl .back-to-top {
                    right: auto;
                    left: 20px;
                }
                .back-to-top.visible {
                    opacity: 1;
                    visibility: visible;
                }
                .back-to-top:hover {
                    background: var(--primary-dark);
                    transform: translateY(-2px);
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(backToTop);
        
        // Show/hide based on scroll position
        window.addEventListener('scroll', this.throttle(() => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, 100));
        
        // Scroll to top when clicked
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Modal Handling
    setupModals() {
        const modals = document.querySelectorAll('.modal');
        
        modals.forEach(modal => {
            const closeBtn = modal.querySelector('.modal-close');
            const openBtn = document.querySelector(`[data-modal="${modal.id}"]`);
            
            // Open modal
            if (openBtn) {
                openBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openModal(modal);
                });
            }
            
            // Close modal
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.closeModal(modal);
                });
            }
            
            // Close on backdrop click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
            
            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    this.closeModal(modal);
                }
            });
        });
    }
    
    openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Update Copyright Year
    setupCurrentYear() {
        const yearElements = document.querySelectorAll('[data-current-year]');
        const currentYear = new Date().getFullYear();
        
        yearElements.forEach(element => {
            element.textContent = currentYear;
        });
    }
    
    // Utility Functions
    showNotification(message, type = 'info', duration = 5000) {
        // Implementation from your utils.js
        console.log(`[${type.toUpperCase()}] ${message}`);
        // You can integrate with your Utils.showNotification here
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the main app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MainApp();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MainApp;
}


// In your main.js
document.addEventListener('DOMContentLoaded', function() {
    const iframe = document.querySelector('.hero-3d-shape iframe');
    const container = document.querySelector('.hero-3d-shape');
    
    if (iframe) {
        container.classList.add('loading');
        iframe.addEventListener('load', function() {
            container.classList.remove('loading');
            container.classList.add('loaded');
        });
    }
});