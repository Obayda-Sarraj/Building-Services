// Client Profile JavaScript
class ClientProfile {
    constructor() {
        this.currentUser = null;
        this.init();
    }
    
    init() {
        this.checkAuthentication();
        this.setupNavigation();
        this.setupTabs();
        this.loadUserData();
        this.setupEventListeners();
    }
    
    checkAuthentication() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!isLoggedIn || !this.currentUser || this.currentUser.role !== 'client') {
            window.location.href = '/features/auth/login.html';
            return;
        }
    }
    
    setupNavigation() {
        // Logout functionality
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
    }
    
    setupTabs() {
        const navLinks = document.querySelectorAll('.profile-nav-link');
        const tabs = document.querySelectorAll('.profile-tab');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    
                    const targetTab = link.getAttribute('data-tab');
                    
                    // Update active nav link
                    navLinks.forEach(nl => nl.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Show target tab
                    tabs.forEach(tab => tab.classList.remove('active'));
                    document.getElementById(targetTab).classList.add('active');
                }
            });
        });
    }
    
    loadUserData() {
        if (this.currentUser) {
            // Update profile information
            document.getElementById('client-name').textContent = 
                `${this.currentUser.firstName} ${this.currentUser.lastName}`;
            document.getElementById('client-email').textContent = this.currentUser.email;
            
            // Populate edit form
            document.getElementById('edit-first-name').value = this.currentUser.firstName;
            document.getElementById('edit-last-name').value = this.currentUser.lastName;
            document.getElementById('edit-email').value = this.currentUser.email;
            document.getElementById('edit-phone').value = this.currentUser.phone;
            document.getElementById('edit-address').value = this.currentUser.address;
        }
    }
    
    setupEventListeners() {
        // Edit profile form
        const editForm = document.getElementById('edit-profile-form');
        if (editForm) {
            editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProfileUpdate();
            });
        }
        
        // New booking form
        const bookingForm = document.getElementById('new-booking-form');
        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewBooking();
            });
        }
        
        // Booking filters
        const filterButtons = document.querySelectorAll('.booking-filters .btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterBookings(btn.getAttribute('data-status'));
            });
        });
    }
    
    handleProfileUpdate() {
        const formData = {
            firstName: document.getElementById('edit-first-name').value,
            lastName: document.getElementById('edit-last-name').value,
            email: document.getElementById('edit-email').value,
            phone: document.getElementById('edit-phone').value,
            address: document.getElementById('edit-address').value
        };
        
        // Update user data
        this.currentUser = { ...this.currentUser, ...formData };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        // Update displayed information
        this.loadUserData();
        
        this.showNotification('Profile updated successfully!', 'success');
    }
    
    handleNewBooking() {
        const formData = {
            serviceType: document.getElementById('service-type').value,
            serviceCategory: document.getElementById('service-category').value,
            date: document.getElementById('booking-date').value,
            specialRequests: document.getElementById('special-requests').value,
            address: document.getElementById('booking-address').value,
            status: 'pending',
            id: this.generateBookingId(),
            createdAt: new Date().toISOString()
        };
        
        // Save booking
        const bookings = JSON.parse(localStorage.getItem('clientBookings') || '[]');
        bookings.push(formData);
        localStorage.setItem('clientBookings', JSON.stringify(bookings));
        
        this.showNotification('Booking request submitted successfully!', 'success');
        document.getElementById('new-booking-form').reset();
        
        // Switch to bookings tab
        document.querySelector('[data-tab="bookings"]').click();
    }
    
    filterBookings(status) {
        const bookings = JSON.parse(localStorage.getItem('clientBookings') || '[]');
        const filteredBookings = status === 'all' ? bookings : 
            bookings.filter(booking => booking.status === status);
        
        this.displayBookings(filteredBookings);
    }
    
    displayBookings(bookings) {
        const bookingsList = document.querySelector('.bookings-list');
        
        if (bookings.length === 0) {
            bookingsList.innerHTML = `
                <div class="no-bookings text-center py-5">
                    <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                    <h4>No bookings found</h4>
                    <p class="text-muted">No bookings match your current filter.</p>
                    <a href="#new-booking" class="btn btn-primary" data-tab="new-booking">Book a Service</a>
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
                        <span class="booking-value">${booking.address}</span>
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
                    ${booking.status === 'pending' ? `
                        <button class="btn btn-sm btn-outline-danger" onclick="clientProfile.cancelBooking('${booking.id}')">Cancel</button>
                    ` : ''}
                    <button class="btn btn-sm btn-outline-primary">View Details</button>
                </div>
            </div>
        `).join('');
    }
    
    cancelBooking(bookingId) {
        const bookings = JSON.parse(localStorage.getItem('clientBookings') || '[]');
        const bookingIndex = bookings.findIndex(b => b.id === bookingId);
        
        if (bookingIndex !== -1) {
            bookings[bookingIndex].status = 'cancelled';
            localStorage.setItem('clientBookings', JSON.stringify(bookings));
            this.filterBookings(document.querySelector('.booking-filters .btn.active').getAttribute('data-status'));
            this.showNotification('Booking cancelled successfully!', 'success');
        }
    }
    
    handleLogout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = '/features/auth/login.html';
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
            'confirmed': 'Confirmed',
            'in-progress': 'In Progress',
            'completed': 'Completed',
            'cancelled': 'Cancelled'
        };
        return statusMap[status] || status;
    }
    
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    generateBookingId() {
        return 'booking_' + Math.random().toString(36).substr(2, 9);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const container = document.querySelector('.profile-tab.active');
        container.insertBefore(notification, container.firstChild);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize client profile
const clientProfile = new ClientProfile();