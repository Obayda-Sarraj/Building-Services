// Client Profile JavaScript - Robust Version
document.addEventListener('DOMContentLoaded', function() {
    console.log('Client profile page loading...');
    
    // Initialize the client profile
    try {
        window.clientProfile = new ClientProfile();
        console.log('Client profile initialized successfully');
    } catch (error) {
        console.error('Error initializing client profile:', error);
        // Show error message to user
        alert('There was an error loading the profile page. Please try again.');
    }
});

class ClientProfile {
    constructor() {
        console.log('Creating ClientProfile instance...');
        this.currentUser = null;
        this.init();
    }
    
    init() {
        console.log('Initializing client profile...');
        try {
            this.checkAuthentication();
            this.setupNavigation();
            this.setupTabs();
            this.loadUserData();
            this.setupEventListeners();
            console.log('Client profile initialization complete');
        } catch (error) {
            console.error('Error in init:', error);
        }
    }
    
    checkAuthentication() {
        console.log('Checking authentication...');
        try {
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            console.log('isLoggedIn:', isLoggedIn);
            
            this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
            console.log('currentUser:', this.currentUser);
            
            if (!isLoggedIn || !this.currentUser || this.currentUser.role !== 'client') {
                console.log('User not authenticated, redirecting to login...');
                // Use relative path that works from any location
                window.location.href = 'auth/login.html';
                return false;
            }
            
            console.log('User authenticated successfully');
            return true;
        } catch (error) {
            console.error('Error in checkAuthentication:', error);
            return false;
        }
    }
    
    setupNavigation() {
        console.log('Setting up navigation...');
        try {
            // Logout functionality
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleLogout();
                });
                console.log('Logout button setup complete');
            } else {
                console.warn('Logout button not found');
            }
        } catch (error) {
            console.error('Error in setupNavigation:', error);
        }
    }
    
    setupTabs() {
        console.log('Setting up tabs...');
        try {
            const navLinks = document.querySelectorAll('.profile-nav-link');
            const tabs = document.querySelectorAll('.profile-tab');
            
            console.log(`Found ${navLinks.length} nav links and ${tabs.length} tabs`);
            
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    if (link.getAttribute('href').startsWith('#')) {
                        e.preventDefault();
                        
                        const targetTab = link.getAttribute('data-tab');
                        console.log('Switching to tab:', targetTab);
                        
                        // Update active nav link
                        navLinks.forEach(nl => nl.classList.remove('active'));
                        link.classList.add('active');
                        
                        // Show target tab
                        tabs.forEach(tab => {
                            tab.classList.remove('active');
                        });
                        
                        const targetTabElement = document.getElementById(targetTab);
                        if (targetTabElement) {
                            targetTabElement.classList.add('active');
                            console.log('Tab switched successfully');
                        } else {
                            console.warn(`Tab with ID ${targetTab} not found`);
                        }
                    }
                });
            });
        } catch (error) {
            console.error('Error in setupTabs:', error);
        }
    }
    
    loadUserData() {
        console.log('Loading user data...');
        try {
            if (this.currentUser) {
                // Update profile information
                const clientName = document.getElementById('client-name');
                const clientEmail = document.getElementById('client-email');
                
                if (clientName) {
                    clientName.textContent = 
                        `${this.currentUser.firstName || ''} ${this.currentUser.lastName || ''}`.trim() || 'John Doe';
                }
                
                if (clientEmail) {
                    clientEmail.textContent = this.currentUser.email || 'john.doe@example.com';
                }
                
                // Populate edit form with safe default values
                this.setFormValue('edit-first-name', this.currentUser.firstName || '');
                this.setFormValue('edit-last-name', this.currentUser.lastName || '');
                this.setFormValue('edit-email', this.currentUser.email || '');
                this.setFormValue('edit-phone', this.currentUser.phone || '');
                this.setFormValue('edit-address', this.currentUser.address || '');
                
                console.log('User data loaded successfully');
            } else {
                console.warn('No current user data available');
                // Set default values
                const clientName = document.getElementById('client-name');
                const clientEmail = document.getElementById('client-email');
                
                if (clientName) clientName.textContent = 'John Doe';
                if (clientEmail) clientEmail.textContent = 'john.doe@example.com';
            }
        } catch (error) {
            console.error('Error in loadUserData:', error);
        }
    }
    
    setFormValue(elementId, value) {
        try {
            const element = document.getElementById(elementId);
            if (element) {
                element.value = value;
            }
        } catch (error) {
            console.error(`Error setting value for ${elementId}:`, error);
        }
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        try {
            // Edit profile form
            const editForm = document.getElementById('edit-profile-form');
            if (editForm) {
                editForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleProfileUpdate();
                });
                console.log('Edit form listener added');
            }
            
            // New booking form
            const bookingForm = document.getElementById('new-booking-form');
            if (bookingForm) {
                bookingForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleNewBooking();
                });
                console.log('Booking form listener added');
            }
            
            // Booking filters
            const filterButtons = document.querySelectorAll('.booking-filters .btn');
            if (filterButtons.length > 0) {
                filterButtons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        filterButtons.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        const status = btn.getAttribute('data-status');
                        console.log('Filtering bookings by:', status);
                        this.filterBookings(status);
                    });
                });
                console.log('Booking filter listeners added');
            }
            
            // Initialize bookings display
            this.loadInitialBookings();
            
        } catch (error) {
            console.error('Error in setupEventListeners:', error);
        }
    }
    
    loadInitialBookings() {
        console.log('Loading initial bookings...');
        try {
            // Initialize bookings if they don't exist
            if (!localStorage.getItem('clientBookings')) {
                const sampleBookings = [
                    {
                        id: 'booking_1',
                        serviceType: 'cleaning',
                        serviceCategory: 'home-cleaning',
                        date: new Date(Date.now() + 86400000).toISOString(),
                        specialRequests: 'Please bring extra cleaning supplies',
                        address: '123 Main St, Apartment 4B',
                        status: 'upcoming',
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 'booking_2',
                        serviceType: 'maintenance',
                        serviceCategory: 'plumbing',
                        date: new Date(Date.now() - 86400000).toISOString(),
                        specialRequests: 'Leaking faucet in kitchen',
                        address: '123 Main St, Apartment 4B',
                        status: 'completed',
                        createdAt: new Date(Date.now() - 172800000).toISOString()
                    }
                ];
                localStorage.setItem('clientBookings', JSON.stringify(sampleBookings));
                console.log('Sample bookings created');
            }
            
            // Load and display bookings
            const bookings = JSON.parse(localStorage.getItem('clientBookings') || '[]');
            console.log(`Loaded ${bookings.length} bookings`);
            this.displayBookings(bookings);
            
        } catch (error) {
            console.error('Error in loadInitialBookings:', error);
        }
    }
    
    handleProfileUpdate() {
        console.log('Handling profile update...');
        try {
            const formData = {
                firstName: document.getElementById('edit-first-name')?.value || '',
                lastName: document.getElementById('edit-last-name')?.value || '',
                email: document.getElementById('edit-email')?.value || '',
                phone: document.getElementById('edit-phone')?.value || '',
                address: document.getElementById('edit-address')?.value || ''
            };
            
            // Update user data
            this.currentUser = { ...this.currentUser, ...formData };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            
            // Update displayed information
            this.loadUserData();
            
            this.showNotification('Profile updated successfully!', 'success');
            console.log('Profile updated successfully');
            
        } catch (error) {
            console.error('Error in handleProfileUpdate:', error);
            this.showNotification('Error updating profile. Please try again.', 'danger');
        }
    }
    
    handleNewBooking() {
        console.log('Handling new booking...');
        try {
            const formData = {
                serviceType: document.getElementById('service-type')?.value || '',
                serviceCategory: document.getElementById('service-category')?.value || '',
                date: document.getElementById('booking-date')?.value || '',
                specialRequests: document.getElementById('special-requests')?.value || '',
                address: document.getElementById('booking-address')?.value || '',
                status: 'upcoming',
                id: this.generateBookingId(),
                createdAt: new Date().toISOString()
            };
            
            // Validate required fields
            if (!formData.serviceType || !formData.serviceCategory || !formData.date || !formData.address) {
                this.showNotification('Please fill in all required fields', 'danger');
                return;
            }
            
            // Save booking
            const bookings = JSON.parse(localStorage.getItem('clientBookings') || '[]');
            bookings.push(formData);
            localStorage.setItem('clientBookings', JSON.stringify(bookings));
            
            this.showNotification('Booking request submitted successfully!', 'success');
            
            // Reset form
            const bookingForm = document.getElementById('new-booking-form');
            if (bookingForm) bookingForm.reset();
            
            // Switch to bookings tab
            const bookingsTabLink = document.querySelector('[data-tab="bookings"]');
            if (bookingsTabLink) bookingsTabLink.click();
            
            console.log('New booking created successfully');
            
        } catch (error) {
            console.error('Error in handleNewBooking:', error);
            this.showNotification('Error creating booking. Please try again.', 'danger');
        }
    }
    
    filterBookings(status) {
        console.log(`Filtering bookings by status: ${status}`);
        try {
            const bookings = JSON.parse(localStorage.getItem('clientBookings') || '[]');
            const filteredBookings = status === 'all' ? bookings : 
                bookings.filter(booking => booking.status === status);
            
            console.log(`Found ${filteredBookings.length} bookings for status: ${status}`);
            this.displayBookings(filteredBookings);
            
        } catch (error) {
            console.error('Error in filterBookings:', error);
        }
    }
    
    displayBookings(bookings) {
        console.log('Displaying bookings...');
        try {
            const bookingsList = document.querySelector('.bookings-list');
            if (!bookingsList) {
                console.warn('Bookings list element not found');
                return;
            }
            
            if (bookings.length === 0) {
                bookingsList.innerHTML = `
                    <div class="no-bookings text-center py-5">
                        <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                        <h4>No bookings found</h4>
                        <p class="text-muted">No bookings match your current filter.</p>
                        <button class="btn btn-primary" onclick="clientProfile.switchToNewBooking()">Book a Service</button>
                    </div>
                `;
                return;
            }
            
            bookingsList.innerHTML = bookings.map(booking => `
                <div class="booking-card">
                    <div class="booking-header">
                        <div class="booking-service">${this.formatServiceName(booking.serviceType)} - ${this.formatCategoryName(booking.serviceCategory)}</div>
                        <span class="booking-status status-${booking.status}">${this.formatStatus(booking.status)}</span>
                    </div>
                    <div class="booking-details">
                        <div class="booking-detail">
                            <span class="booking-label">Date & Time</span>
                            <span class="booking-value">${this.formatDate(booking.date)}</span>
                        </div>
                        <div class="booking-detail">
                            <span class="booking-label">Address</span>
                            <span class="booking-value">${booking.address || 'Not specified'}</span>
                        </div>
                        <div class="booking-detail">
                            <span class="booking-label">Requested On</span>
                            <span class="booking-value">${this.formatDate(booking.createdAt)}</span>
                        </div>
                    </div>
                    ${booking.specialRequests ? `
                        <div class="booking-detail">
                            <span class="booking-label">Special Requests</span>
                            <span class="booking-value">${booking.specialRequests}</span>
                        </div>
                    ` : ''}
                    <div class="booking-actions">
                        ${(booking.status === 'upcoming' || booking.status === 'pending') ? `
                            <button class="btn btn-sm btn-outline-danger" onclick="clientProfile.cancelBooking('${booking.id}')">Cancel</button>
                        ` : ''}
                        <button class="btn btn-sm btn-outline-primary" onclick="clientProfile.viewBookingDetails('${booking.id}')">View Details</button>
                    </div>
                </div>
            `).join('');
            
            console.log('Bookings displayed successfully');
            
        } catch (error) {
            console.error('Error in displayBookings:', error);
            bookingsList.innerHTML = `
                <div class="no-bookings text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                    <h4>Error loading bookings</h4>
                    <p class="text-muted">There was an error loading your bookings. Please refresh the page.</p>
                </div>
            `;
        }
    }
    
    switchToNewBooking() {
        const newBookingTab = document.querySelector('[data-tab="new-booking"]');
        if (newBookingTab) newBookingTab.click();
    }
    
    viewBookingDetails(bookingId) {
        console.log('Viewing booking details for:', bookingId);
        try {
            const bookings = JSON.parse(localStorage.getItem('clientBookings') || '[]');
            const booking = bookings.find(b => b.id === bookingId);
            
            if (booking) {
                this.showNotification(
                    `<strong>Booking Details:</strong><br>
                    <strong>Service:</strong> ${this.formatServiceName(booking.serviceType)} - ${this.formatCategoryName(booking.serviceCategory)}<br>
                    <strong>Date:</strong> ${this.formatDate(booking.date)}<br>
                    <strong>Status:</strong> ${this.formatStatus(booking.status)}<br>
                    <strong>Address:</strong> ${booking.address}<br>
                    ${booking.specialRequests ? `<strong>Special Requests:</strong> ${booking.specialRequests}` : ''}`,
                    'info'
                );
            }
        } catch (error) {
            console.error('Error in viewBookingDetails:', error);
        }
    }
    
    cancelBooking(bookingId) {
        console.log('Canceling booking:', bookingId);
        if (!confirm('Are you sure you want to cancel this booking?')) {
            return;
        }
        
        try {
            const bookings = JSON.parse(localStorage.getItem('clientBookings') || '[]');
            const bookingIndex = bookings.findIndex(b => b.id === bookingId);
            
            if (bookingIndex !== -1) {
                bookings[bookingIndex].status = 'cancelled';
                localStorage.setItem('clientBookings', JSON.stringify(bookings));
                
                // Get current filter and refresh
                const activeFilter = document.querySelector('.booking-filters .btn.active');
                const status = activeFilter ? activeFilter.getAttribute('data-status') : 'all';
                this.filterBookings(status);
                
                this.showNotification('Booking cancelled successfully!', 'success');
            }
        } catch (error) {
            console.error('Error in cancelBooking:', error);
            this.showNotification('Error cancelling booking', 'danger');
        }
    }
    
    handleLogout() {
        console.log('Logging out...');
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            // Use relative path
            window.location.href = 'auth/login.html';
        }
    }
    
    formatServiceName(serviceType) {
        const names = {
            'cleaning': 'Cleaning Service',
            'maintenance': 'Maintenance Service',
            'pest-control': 'Pest Control'
        };
        return names[serviceType] || serviceType;
    }
    
    formatCategoryName(category) {
        const names = {
            'home-cleaning': 'Home Cleaning',
            'common-area': 'Common Area Cleaning',
            'electrical': 'Electrical Maintenance',
            'plumbing': 'Plumbing Services'
        };
        return names[category] || category;
    }
    
    formatStatus(status) {
        const statusMap = {
            'pending': 'Pending',
            'upcoming': 'Upcoming',
            'confirmed': 'Confirmed',
            'in-progress': 'In Progress',
            'completed': 'Completed',
            'cancelled': 'Cancelled'
        };
        return statusMap[status] || status;
    }
    
    formatDate(dateString) {
        if (!dateString) return 'Not specified';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid date';
            
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid date';
        }
    }
    
    generateBookingId() {
        return 'booking_' + Math.random().toString(36).substr(2, 9);
    }
    
    showNotification(message, type = 'info') {
        try {
            // Remove any existing notifications
            const existingAlerts = document.querySelectorAll('.alert');
            existingAlerts.forEach(alert => alert.remove());
            
            const notification = document.createElement('div');
            notification.className = `alert alert-${type} alert-dismissible fade show`;
            notification.style.cssText = `
                position: fixed;
                top: 120px;
                right: 20px;
                z-index: 9999;
                min-width: 300px;
                max-width: 400px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            `;
            notification.innerHTML = `
                <div class="d-flex align-items-center">
                    <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'danger' ? 'fa-exclamation-circle' : 'fa-info-circle'} me-2"></i>
                    <span>${message}</span>
                    <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 5000);
            
        } catch (error) {
            console.error('Error showing notification:', error);
        }
    }
}