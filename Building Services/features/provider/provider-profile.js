// Provider Profile JavaScript
class ProviderProfile {
    constructor() {
        this.currentUser = null;
        this.init();
    }
    
    init() {
        this.checkAuthentication();
        this.setupNavigation();
        this.loadUserData();
        this.setupEventListeners();
        this.loadBookings();
    }
    
    checkAuthentication() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!isLoggedIn || !this.currentUser || this.currentUser.role !== 'provider') {
            // Redirect to login page with correct path
            window.location.href = '../auth/login.html';
            return;
        }
    }
    
    setupNavigation() {
        // Logout functionality
        const logoutBtn = document.querySelector('.btn-outline-danger');
        if (logoutBtn && logoutBtn.textContent.includes('Logout')) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
        
        // Edit Profile button
        const editProfileBtn = document.querySelector('.btn-outline-primary');
        if (editProfileBtn && editProfileBtn.textContent.includes('Edit Profile')) {
            editProfileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNotification('Edit profile feature coming soon!', 'info');
            });
        }
        
        // Show My Services button
        const showServicesBtn = document.querySelector('.btn-primary');
        if (showServicesBtn && showServicesBtn.textContent.includes('Show My Services')) {
            showServicesBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNotification('My services feature coming soon!', 'info');
            });
        }
    }
    
    loadUserData() {
        if (this.currentUser) {
            // Update profile information if available
            const profileName = document.querySelector('.profile-info h2');
            const profileEmail = document.querySelector('.profile-info .text-muted:nth-of-type(1)');
            const profilePhone = document.querySelector('.profile-info .text-muted:nth-of-type(2)');
            
            if (profileName && this.currentUser.firstName && this.currentUser.lastName) {
                profileName.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
            }
            
            if (profileEmail && this.currentUser.email) {
                profileEmail.textContent = this.currentUser.email;
            }
            
            if (profilePhone && this.currentUser.phone) {
                profilePhone.textContent = this.currentUser.phone;
            }
        }
    }
    
    loadBookings() {
        // Initialize bookings if they don't exist
        if (!localStorage.getItem('providerBookings')) {
            // Create some sample bookings for demonstration
            const sampleBookings = [
                {
                    id: 'booking_1',
                    service: 'Electrical Repair',
                    client: 'Sarah Johnson',
                    date: new Date('2023-10-15').toISOString(),
                    status: 'completed',
                    price: 120
                },
                {
                    id: 'booking_2',
                    service: 'Lighting Installation',
                    client: 'Michael Brown',
                    date: new Date('2023-10-18').toISOString(),
                    status: 'scheduled',
                    price: 250
                },
                {
                    id: 'booking_3',
                    service: 'Electrical Inspection',
                    client: 'Emily Davis',
                    date: new Date('2023-10-20').toISOString(),
                    status: 'pending',
                    price: 80
                },
                {
                    id: 'booking_4',
                    service: 'Circuit Breaker Repair',
                    client: 'Robert Wilson',
                    date: new Date('2023-10-10').toISOString(),
                    status: 'completed',
                    price: 180
                },
                {
                    id: 'booking_5',
                    service: 'Outlet Installation',
                    client: 'Lisa Anderson',
                    date: new Date('2023-10-22').toISOString(),
                    status: 'pending',
                    price: 60
                }
            ];
            localStorage.setItem('providerBookings', JSON.stringify(sampleBookings));
        }
    }
    
    setupEventListeners() {
        // Details buttons in table
        const detailButtons = document.querySelectorAll('.btn-outline-primary.btn-sm');
        detailButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showBookingDetails(btn);
            });
        });
        
        // Update statistics
        this.updateStatistics();
    }
    
    showBookingDetails(button) {
        const row = button.closest('tr');
        const service = row.cells[0].textContent;
        const client = row.cells[1].textContent;
        const date = row.cells[2].textContent;
        const status = row.cells[3].querySelector('.badge').textContent;
        
        this.showNotification(
            `Booking Details:<br>
            <strong>Service:</strong> ${service}<br>
            <strong>Client:</strong> ${client}<br>
            <strong>Date:</strong> ${date}<br>
            <strong>Status:</strong> ${status}`,
            'info'
        );
    }
    
    updateStatistics() {
        const bookings = JSON.parse(localStorage.getItem('providerBookings') || '[]');
        
        // Calculate monthly earnings
        const currentMonth = new Date().getMonth();
        const monthlyBookings = bookings.filter(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate.getMonth() === currentMonth && booking.status === 'completed';
        });
        
        const monthlyEarnings = monthlyBookings.reduce((total, booking) => total + (booking.price || 0), 0);
        
        // Update earnings display
        const earningsElement = document.querySelector('.text-primary');
        if (earningsElement && earningsElement.tagName === 'H2') {
            earningsElement.textContent = `$${monthlyEarnings.toLocaleString()}`;
        }
        
        // Count active bookings
        const activeBookings = bookings.filter(booking => 
            booking.status === 'scheduled' || booking.status === 'pending'
        ).length;
        
        // Update active bookings display
        const bookingsElement = document.querySelector('.text-success');
        if (bookingsElement && bookingsElement.tagName === 'H2') {
            bookingsElement.textContent = activeBookings;
        }
    }
    
    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            // Redirect to login page with correct path
            window.location.href = '../auth/login.html';
        }
    }
    
    showNotification(message, type = 'info') {
        // Remove any existing notifications
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
        
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
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
    }
}

// Initialize provider profile when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.providerProfile = new ProviderProfile();
});