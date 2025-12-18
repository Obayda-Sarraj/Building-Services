// Authentication JavaScript
class AuthManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupRegistrationForms();
        this.setupLoginForms();
        this.setupRoleSelection();
        this.checkAuthentication();
    }
    
    setupRegistrationForms() {
        // Client Registration Form
        const clientForm = document.getElementById('client-registration-form');
        if (clientForm) {
            clientForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleClientRegistration();
            });
        }
        
        // Provider Registration Form
        const providerForm = document.getElementById('provider-registration-form');
        if (providerForm) {
            providerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProviderRegistration();
            });
        }
        
        // Location detection
        const detectLocationBtn = document.getElementById('client-detect-location');
        if (detectLocationBtn) {
            detectLocationBtn.addEventListener('click', () => {
                this.detectLocation('client-address');
            });
        }
        
        const providerDetectBtn = document.getElementById('detect-location');
        if (providerDetectBtn) {
            providerDetectBtn.addEventListener('click', () => {
                this.detectLocation('user-address');
            });
        }
    }
    
    setupLoginForms() {
        // Login tabs functionality
        const loginTabs = document.querySelectorAll('.login-tab');
        const loginForms = document.querySelectorAll('.login-form');
        
        loginTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-target');
                
                // Update active tab
                loginTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show corresponding form
                loginForms.forEach(form => {
                    form.classList.remove('active');
                    if (form.id === target) {
                        form.classList.add('active');
                    }
                });
            });
        });
        
        // Form submissions
        const clientLoginForm = document.getElementById('client-login-form');
        if (clientLoginForm) {
            clientLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin('client');
            });
        }
        
        const providerLoginForm = document.getElementById('provider-login-form');
        if (providerLoginForm) {
            providerLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin('provider');
            });
        }
    }
    
    setupRoleSelection() {
        const roleCards = document.querySelectorAll('.role-card');
        roleCards.forEach(card => {
            card.addEventListener('click', () => {
                const role = card.getAttribute('data-role');
                localStorage.setItem('selectedRole', role);
            });
        });
    }
    
    handleClientRegistration() {
        const formData = {
            firstName: document.getElementById('client-first-name').value,
            lastName: document.getElementById('client-last-name').value,
            email: document.getElementById('client-email').value,
            phone: document.getElementById('client-phone').value,
            address: document.getElementById('client-address').value,
            password: document.getElementById('client-password').value
        };
        
        // Basic validation
        if (!this.validateRegistration(formData)) {
            return;
        }
        
        // Show loading state
        this.showLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            // Save user data to localStorage
            const userData = {
                ...formData,
                id: this.generateId(),
                role: 'client',
                createdAt: new Date().toISOString()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');
            
            this.showNotification('Registration successful! Redirecting...', 'success');
            
            // Redirect to client profile
            setTimeout(() => {
                window.location.href = '../client/client-profile.html';
            }, 1500);
            
        }, 1000);
    }
    
    handleProviderRegistration() {
        const formData = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            companyName: document.getElementById('company-name').value,
            serviceType: document.getElementById('service-type').value,
            experience: document.getElementById('experience').value,
            address: document.getElementById('user-address').value,
            certifications: document.getElementById('certifications').value,
            password: document.getElementById('password').value
        };
        
        if (!this.validateRegistration(formData)) {
            return;
        }
        
        this.showLoading(true);
        
        setTimeout(() => {
            const userData = {
                ...formData,
                id: this.generateId(),
                role: 'provider',
                status: 'pending',
                createdAt: new Date().toISOString()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');
            
            this.showNotification('Registration submitted! Awaiting approval.', 'success');
            
            setTimeout(() => {
                window.location.href = '/features/provider/provider-profile.html';
            }, 1500);
            
        }, 1000);
    }
    
    handleLogin(userType) {
        const email = document.getElementById(`${userType}-email`).value;
        const password = document.getElementById(`${userType}-password`).value;
        
        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }
        
        this.showLoading(true);
        
        // Simulate login
        setTimeout(() => {
            // For demo purposes, create a user if none exists
            let user = JSON.parse(localStorage.getItem('currentUser'));
            
            if (!user) {
                user = {
                    id: this.generateId(),
                    firstName: 'Demo',
                    lastName: 'User',
                    email: email,
                    phone: '+1234567890',
                    address: '123 Demo Street',
                    role: userType,
                    createdAt: new Date().toISOString()
                };
                localStorage.setItem('currentUser', JSON.stringify(user));
            }
            
            localStorage.setItem('isLoggedIn', 'true');
            
            this.showNotification('Login successful!', 'success');
            
            // Redirect based on role
            setTimeout(() => {
                if (userType === 'client') {
                    window.location.href = '../client/client-profile.html';
                } else {
                    window.location.href = '../provider/provider-profile.html';
                }
            }, 1000);
            
        }, 1000);
    }
    
    validateRegistration(formData) {
        // Basic validation
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
            this.showNotification('Please fill in all required fields', 'error');
            return false;
        }
        
        if (formData.password.length < 8) {
            this.showNotification('Password must be at least 8 characters long', 'error');
            return false;
        }
        
        if (!this.validateEmail(formData.email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return false;
        }
        
        return true;
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    detectLocation(inputId) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    
                    // Simulate address detection
                    const addresses = [
                        "123 Main Street, Downtown, City",
                        "456 Oak Avenue, Business District, City", 
                        "789 Pine Road, Residential Area, City"
                    ];
                    
                    const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
                    document.getElementById(inputId).value = randomAddress;
                    
                    this.showNotification('Location detected successfully!', 'success');
                },
                (error) => {
                    console.error('Error getting location:', error);
                    this.showNotification('Unable to detect location. Please enter manually.', 'error');
                }
            );
        } else {
            this.showNotification('Geolocation is not supported by your browser.', 'error');
        }
    }
    
    checkAuthentication() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (isLoggedIn && currentUser) {
            // User is logged in, update UI if needed
            console.log('User is logged in:', currentUser);
        }
    }
    
    showLoading(show) {
        const buttons = document.querySelectorAll('button[type="submit"]');
        buttons.forEach(button => {
            if (show) {
                button.disabled = true;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            } else {
                button.disabled = false;
                // Reset button text based on form type
                if (button.closest('#client-registration-form')) {
                    button.innerHTML = 'Create Account';
                } else if (button.closest('#provider-registration-form')) {
                    button.innerHTML = 'Create Account';
                } else if (button.closest('#client-login-form')) {
                    button.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In as Client';
                } else if (button.closest('#provider-login-form')) {
                    button.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In as Provider';
                }
            }
        });
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        // Add to page
        const container = document.querySelector('.container') || document.body;
        container.insertBefore(notification, container.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    generateId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }
}

// Social login handlers
function handleSocialLogin(provider) {
    const authManager = new AuthManager();
    authManager.showNotification(`Connecting with ${provider}...`, 'info');
    
    // Simulate social login
    setTimeout(() => {
        authManager.showNotification(`${provider} login would be implemented here`, 'info');
    }, 1000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});



// admin-auth.js - Admin authentication logic
document.addEventListener('DOMContentLoaded', function() {
    // Check if current user is admin
    function checkAdminStatus() {
        const user = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
        
        if (user && user.role === 'admin') {
            // Redirect to admin dashboard if on login page
            if (window.location.pathname.includes('login.html')) {
                window.location.href = '../../features/admin/admin-dashboard.html';
            }
            
            // Add admin indicator to header if on main site
            if (!window.location.pathname.includes('admin-')) {
                const headerActions = document.querySelector('.header-actions');
                if (headerActions) {
                    const adminBtn = document.createElement('a');
                    adminBtn.href = '../../features/admin/admin-dashboard.html';
                    adminBtn.className = 'lang-toggle';
                    adminBtn.style.marginRight = '10px';
                    adminBtn.innerHTML = '<i class="fas fa-shield-alt"></i> Admin';
                    headerActions.insertBefore(adminBtn, headerActions.firstChild);
                }
            }
        }
    }
    
    // Handle admin login
    const adminEmails = [
        'admin@buildingcare.com',
        'superadmin@buildingcare.com',
        'manager@buildingcare.com',
        'support@buildingcare.com'
    ];
    
    const loginForms = document.querySelectorAll('.login-form');
    loginForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;
            
            // Check if admin email
            if (adminEmails.includes(email.toLowerCase())) {
                // Simulate admin login - In production, verify with backend
                if (password === 'admin123') { // Default admin password
                    const adminUser = {
                        id: 'admin001',
                        name: 'System Administrator',
                        email: email,
                        role: 'admin',
                        permissions: ['all']
                    };
                    
                    // Store in sessionStorage
                    sessionStorage.setItem('currentUser', JSON.stringify(adminUser));
                    sessionStorage.setItem('isAdmin', 'true');
                    
                    // Redirect to admin dashboard
                    window.location.href = '../../features/admin/admin-dashboard.html';
                    return;
                }
            }
            
            // Regular login logic continues...
        });
    });
    
    // Initialize admin check
    checkAdminStatus();
});