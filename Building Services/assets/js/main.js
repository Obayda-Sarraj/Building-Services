// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mainNav = document.getElementById('main-nav');

if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('active');
    });
}

// Language Toggle
const langToggle = document.getElementById('lang-toggle');
const body = document.body;

if (langToggle) {
    langToggle.addEventListener('click', () => {
        if (body.classList.contains('rtl')) {
            body.classList.remove('rtl');
            langToggle.textContent = 'EN';
            // Here you would typically change all text content to English
            document.querySelectorAll('[data-en]').forEach(element => {
                element.textContent = element.getAttribute('data-en');
            });
        } else {
            body.classList.add('rtl');
            langToggle.textContent = 'AR';
            // Here you would typically change all text content to Arabic
            document.querySelectorAll('[data-ar]').forEach(element => {
                element.textContent = element.getAttribute('data-ar');
            });
        }
    });
}

// Testimonials Slider
const testimonialsContainer = document.getElementById('testimonials-container');
const sliderDots = document.querySelectorAll('.slider-dot');
let currentSlide = 0;

if (testimonialsContainer && sliderDots.length > 0) {
    function showSlide(index) {
        testimonialsContainer.style.transform = `translateX(-${index * 100}%)`;
        
        // Update active dot
        sliderDots.forEach(dot => dot.classList.remove('active'));
        sliderDots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    // Add click events to dots
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Auto slide every 5 seconds
    setInterval(() => {
        let nextSlide = (currentSlide + 1) % sliderDots.length;
        showSlide(nextSlide);
    }, 5000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (mainNav) {
                mainNav.classList.remove('active');
            }
        }
    });
});

// FAQ Accordion
document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isActive = answer.classList.contains('active');
            
            // Close all answers
            document.querySelectorAll('.faq-answer').forEach(ans => {
                ans.classList.remove('active');
            });
            
            // If this answer wasn't active, open it
            if (!isActive) {
                answer.classList.add('active');
            }
        });
    });
});

// Role Selection
document.addEventListener('DOMContentLoaded', function() {
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
});

// Auto-detect location
function detectLocation() {
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
                        document.getElementById('user-address').value = address;
                    })
                    .catch(error => {
                        console.error('Error getting address:', error);
                    });
            },
            function(error) {
                console.error('Error getting location:', error);
            }
        );
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Working Hours Management
document.addEventListener('DOMContentLoaded', function() {
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
});

// Form Validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'red';
            isValid = false;
        } else {
            input.style.borderColor = '';
        }
    });
    
    return isValid;
}

// Save Working Hours
function saveWorkingHours() {
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
    alert('Working hours saved successfully!');
}

// Load Working Hours
function loadWorkingHours() {
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load working hours if on provider registration page
    if (document.getElementById('working-hours-form')) {
        loadWorkingHours();
    }
    
    // Auto-detect location if on registration page
    if (document.getElementById('user-address')) {
        document.getElementById('detect-location').addEventListener('click', detectLocation);
    }
});



// Add to existing script.js

// Login Tab Switching
document.addEventListener('DOMContentLoaded', function() {
    // Login tab functionality
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
    }
    
    // Form submission handlers
    const clientLoginForm = document.getElementById('client-login-form');
    const providerLoginForm = document.getElementById('provider-login-form');
    
    if (clientLoginForm) {
        clientLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin('client');
        });
    }
    
    if (providerLoginForm) {
        providerLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin('provider');
        });
    }
});

// Handle login
function handleLogin(userType) {
    const email = document.getElementById(`${userType}-email`).value;
    const password = document.getElementById(`${userType}-password`).value;
    const rememberMe = document.getElementById(`${userType}-remember`).checked;
    
    // Simple validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Simulate login process
    console.log(`Logging in as ${userType}:`, { email, password, rememberMe });
    
    // Redirect based on user type
    setTimeout(() => {
        if (userType === 'client') {
            window.location.href = 'client-profile.html';
        } else {
            window.location.href = 'provider-profile.html';
        }
    }, 1000);
}

// Social login handlers
function handleSocialLogin(provider) {
    console.log(`Social login with ${provider}`);
    // Implement social login logic here
}

// Update navigation to highlight current page
function updateNavHighlight() {
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateNavHighlight();
    
    // Load working hours if on provider registration page
    if (document.getElementById('working-hours-form')) {
        loadWorkingHours();
    }
    
    // Auto-detect location if on registration page
    if (document.getElementById('user-address')) {
        document.getElementById('detect-location').addEventListener('click', detectLocation);
    }
});