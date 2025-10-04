// App State
let currentStep = 1;
let selectedService = null;
let selectedDate = null;
let selectedTime = null;
let bookingData = {};

// Services data
const services = [
    { id: 'haircut', name: 'Corte y Peinado', duration: 60, price: 15000 },
    { id: 'facial', name: 'Tratamiento Facial', duration: 90, price: 22500 },
    { id: 'manicure', name: 'Manicura', duration: 45, price: 10500 },
    { id: 'massage', name: 'Masaje Relajante', duration: 60, price: 24000 }
];

// Mock availability data (in a real app, this would come from a backend)
const availability = {
    // Each day has available time slots
    getAvailableSlots: (date) => {
        const dayOfWeek = new Date(date).getDay();
        const baseSlots = ['9:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

        // Weekend has fewer slots
        if (dayOfWeek === 0) return []; // Sunday closed
        if (dayOfWeek === 6) return ['9:00', '10:00', '11:00', '12:00', '14:00']; // Saturday shorter hours

        // Simulate some booked slots
        const bookedSlots = getBookedSlots(date);
        return baseSlots.filter(slot => !bookedSlots.includes(slot));
    }
};

// Simulate booked appointments (stored in localStorage)
function getBookedSlots(date) {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '{}');
    return bookings[date] || [];
}

function addBookedSlot(date, time) {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '{}');
    if (!bookings[date]) bookings[date] = [];
    bookings[date].push(time);
    localStorage.setItem('bookings', JSON.stringify(bookings));
}

// Initialize app
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
    setupEventListeners();
    setupPWAFeatures();
});

function initializeApp() {
    // Set minimum date to today
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dateInput = document.getElementById('appointment-date');
    dateInput.min = tomorrow.toISOString().split('T')[0];

    // Set maximum date to 3 months from now
    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 3);
    dateInput.max = maxDate.toISOString().split('T')[0];

    // Populate services in booking form
    populateServiceSelection();
}

function setupEventListeners() {
    // Date change listener
    document.getElementById('appointment-date').addEventListener('change', function () {
        selectedDate = this.value;
        updateTimeSlots();
    });

    // Service card clicks
    document.addEventListener('click', function (e) {
        if (e.target.closest('.service-card')) {
            selectService(e.target.closest('.service-card'));
        }

        if (e.target.classList.contains('time-slot') && !e.target.classList.contains('unavailable')) {
            selectTimeSlot(e.target);
        }
    });

    // Modal close
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', function (e) {
        const modal = document.getElementById('success-modal');
        if (e.target === modal) {
            closeModal();
        }
    });
}

function populateServiceSelection() {
    const serviceSelection = document.querySelector('.service-selection');
    serviceSelection.innerHTML = '';

    services.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.dataset.service = service.id;
        serviceCard.innerHTML = `
            <h3>${service.name}</h3>
            <p class="duration">${service.duration} minutos</p>
            <p class="price">$${service.price.toLocaleString('es-AR')}</p>
        `;
        serviceSelection.appendChild(serviceCard);
    });
}

function selectService(serviceCard) {
    // Remove previous selection
    document.querySelectorAll('.service-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Add selection to clicked card
    serviceCard.classList.add('selected');

    // Store selected service
    const serviceId = serviceCard.dataset.service;
    selectedService = services.find(s => s.id === serviceId);

    // Enable next button
    const nextButton = document.querySelector('#step1 .next-button');
    nextButton.disabled = false;
    nextButton.style.opacity = '1';
}

function updateTimeSlots() {
    if (!selectedDate) return;

    const timeSlotsContainer = document.getElementById('time-slots');
    const availableSlots = availability.getAvailableSlots(selectedDate);

    timeSlotsContainer.innerHTML = '';

    if (availableSlots.length === 0) {
        timeSlotsContainer.innerHTML = '<p>No hay horarios disponibles para esta fecha. Por favor elegí otra fecha.</p>';
        return;
    }

    availableSlots.forEach(time => {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.textContent = time;
        timeSlot.dataset.time = time;
        timeSlotsContainer.appendChild(timeSlot);
    });
}

function selectTimeSlot(timeSlot) {
    // Remove previous selection
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });

    // Add selection to clicked slot
    timeSlot.classList.add('selected');
    selectedTime = timeSlot.dataset.time;

    // Enable next button
    const nextButton = document.querySelector('#step2 .next-button');
    nextButton.disabled = false;
    nextButton.style.opacity = '1';
}

function nextStep(step) {
    // Validate current step
    if (!validateCurrentStep()) return;

    // Hide current step
    document.querySelector('.form-step.active').classList.remove('active');

    // Show next step
    document.getElementById(`step${step}`).classList.add('active');
    currentStep = step;

    // Update summary if going to final step
    if (step === 3) {
        updateBookingSummary();
    }
}

function prevStep(step) {
    document.querySelector('.form-step.active').classList.remove('active');
    document.getElementById(`step${step}`).classList.add('active');
    currentStep = step;
}

function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            if (!selectedService) {
                alert('Por favor seleccioná un servicio');
                return false;
            }
            break;
        case 2:
            if (!selectedDate || !selectedTime) {
                alert('Por favor seleccioná fecha y hora');
                return false;
            }
            break;
        case 3:
            const name = document.getElementById('customer-name').value;
            const email = document.getElementById('customer-email').value;
            const phone = document.getElementById('customer-phone').value;

            if (!name || !email || !phone) {
                alert('Por favor completá todos los campos obligatorios');
                return false;
            }

            if (!isValidEmail(email)) {
                alert('Por favor ingresá un email válido');
                return false;
            }
            break;
    }
    return true;
}

function updateBookingSummary() {
    const summary = document.getElementById('booking-summary');
    const formattedDate = new Date(selectedDate).toLocaleDateString('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    summary.innerHTML = `
        <p><strong>Servicio:</strong> ${selectedService.name}</p>
        <p><strong>Fecha:</strong> ${formattedDate}</p>
        <p><strong>Hora:</strong> ${selectedTime}</p>
        <p><strong>Duración:</strong> ${selectedService.duration} minutos</p>
        <p><strong>Precio:</strong> $${selectedService.price.toLocaleString('es-AR')}</p>
    `;
}

function confirmBooking() {
    if (!validateCurrentStep()) return;

    // Collect all booking data
    bookingData = {
        service: selectedService,
        date: selectedDate,
        time: selectedTime,
        customer: {
            name: document.getElementById('customer-name').value,
            email: document.getElementById('customer-email').value,
            phone: document.getElementById('customer-phone').value,
            notes: document.getElementById('customer-notes').value
        },
        timestamp: new Date().toISOString()
    };

    // Simulate booking process
    processBooking();
}

function processBooking() {
    // Add to booked slots
    addBookedSlot(selectedDate, selectedTime);

    // Store booking (in real app, this would be sent to server)
    const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    bookings.push(bookingData);
    localStorage.setItem('userBookings', JSON.stringify(bookings));

    // Show success modal
    showSuccessModal();

    // Reset form
    resetBookingForm();
}

function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    const confirmationDetails = document.getElementById('confirmation-details');

    const formattedDate = new Date(selectedDate).toLocaleDateString('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    confirmationDetails.innerHTML = `
        <div style="text-align: left; margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
            <h3>Detalles del Turno:</h3>
            <p><strong>Servicio:</strong> ${bookingData.service.name}</p>
            <p><strong>Fecha:</strong> ${formattedDate}</p>
            <p><strong>Hora:</strong> ${bookingData.time}</p>
            <p><strong>Cliente:</strong> ${bookingData.customer.name}</p>
            <p><strong>Email:</strong> ${bookingData.customer.email}</p>
            <p><strong>Teléfono:</strong> ${bookingData.customer.phone}</p>
            ${bookingData.customer.notes ? `<p><strong>Notas:</strong> ${bookingData.customer.notes}</p>` : ''}
        </div>
    `;

    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('success-modal').style.display = 'none';
}

function resetBookingForm() {
    // Reset variables
    selectedService = null;
    selectedDate = null;
    selectedTime = null;
    currentStep = 1;

    // Reset form
    document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
    document.getElementById('step1').classList.add('active');

    // Clear selections
    document.querySelectorAll('.service-card').forEach(card => card.classList.remove('selected'));
    document.getElementById('appointment-date').value = '';
    document.getElementById('time-slots').innerHTML = '';

    // Clear customer details
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-email').value = '';
    document.getElementById('customer-phone').value = '';
    document.getElementById('customer-notes').value = '';
}

// Utility functions
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// PWA Features
function setupPWAFeatures() {
    let deferredPrompt;
    const installBanner = document.getElementById('install-banner');
    const installButton = document.getElementById('install-button');
    const dismissButton = document.getElementById('dismiss-button');
    const heroInstallButton = document.getElementById('install-app-button');

    // Show install banner and hero button if PWA can be installed
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installBanner.classList.remove('hidden');

        // Show the hero install button
        if (heroInstallButton) {
            heroInstallButton.style.display = 'inline-block';
        }
    });

    // Handle install button click (banner)
    installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            deferredPrompt = null;
            installBanner.classList.add('hidden');
            if (heroInstallButton) {
                heroInstallButton.style.display = 'none';
            }
        }
    });

    // Handle hero install button click
    if (heroInstallButton) {
        heroInstallButton.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                deferredPrompt = null;
                installBanner.classList.add('hidden');
                heroInstallButton.style.display = 'none';
            } else {
                // Show manual install instructions
                showManualInstallInstructions();
            }
        });
    }

    // Handle dismiss button click
    dismissButton.addEventListener('click', () => {
        installBanner.classList.add('hidden');
        localStorage.setItem('installBannerDismissed', 'true');
    });

    // Check if banner was previously dismissed
    if (localStorage.getItem('installBannerDismissed')) {
        installBanner.classList.add('hidden');
    }

    // Hide banner when app is installed
    window.addEventListener('appinstalled', () => {
        installBanner.classList.add('hidden');
        if (heroInstallButton) {
            heroInstallButton.style.display = 'none';
        }
    });

    // Show hero button for iOS or if no install prompt is available
    setTimeout(() => {
        if (!deferredPrompt && heroInstallButton) {
            // Check if it's iOS or other browsers that need manual install
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const isStandalone = window.navigator.standalone === true;

            if ((isIOS && !isStandalone) || !deferredPrompt) {
                heroInstallButton.style.display = 'inline-block';
            }
        }
    }, 2000);
}

function showManualInstallInstructions() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    let instructions = '';

    if (isIOS) {
        instructions = `
            <h3>📱 Instalar en iOS:</h3>
            <ol>
                <li>Toca el botón <strong>Compartir</strong> 📤 (abajo en Safari)</li>
                <li>Desplázate y toca <strong>"Añadir a pantalla de inicio"</strong></li>
                <li>Confirma tocando <strong>"Añadir"</strong></li>
            </ol>
            <p><small>⚠️ Debe ser en Safari, no funciona en Chrome iOS</small></p>
        `;
    } else if (isAndroid) {
        instructions = `
            <h3>📱 Instalar en Android:</h3>
            <ol>
                <li>Toca el menú <strong>⋮</strong> (arriba a la derecha)</li>
                <li>Busca <strong>"Agregar a pantalla de inicio"</strong></li>
                <li>O <strong>"Instalar aplicación"</strong></li>
                <li>Confirma la instalación</li>
            </ol>
        `;
    } else {
        instructions = `
            <h3>💻 Instalar en Desktop:</h3>
            <ol>
                <li>Busca el ícono <strong>+</strong> en la barra de direcciones</li>
                <li>O usa el menú del navegador</li>
                <li>Selecciona <strong>"Instalar aplicación"</strong></li>
            </ol>
        `;
    }

    // Show instructions in a modal or alert
    const modal = document.getElementById('success-modal');
    const modalContent = modal.querySelector('.modal-content');
    const confirmationDetails = document.getElementById('confirmation-details');

    modalContent.querySelector('h2').innerHTML = '📱 ¿Cómo Instalar la App?';
    modalContent.querySelector('p').innerHTML = 'Sigue estos pasos para instalar la app en tu dispositivo:';
    confirmationDetails.innerHTML = `
        <div style="text-align: left; margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
            ${instructions}
        </div>
    `;

    modal.style.display = 'block';
}

// Offline support
window.addEventListener('online', () => {
    console.log('Back online');
    // Sync any pending bookings
});

window.addEventListener('offline', () => {
    console.log('Gone offline');
    // Show offline message if needed
});
