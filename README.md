# Estudio de Belleza## Sistema de Turnos

### Características:
- **Selección de Fecha**: Elegí entre fechas disponibles (desde mañana)
- **Horarios**: Ve los horarios disponibles para la fecha seleccionada
- **Selección de Servicio**: Elegí entre los servicios disponibles
- **Datos del Cliente**: Ingresá información de contacto y pedidos especiales
- **Confirmación**: Confirmación instantánea de reserva con detalles

### Horarios de Atención:
- Lunes a Viernes: 9:00 - 19:00
- Sábado: 9:00 - 17:00
- Domingo: Cerradorogressive Web App para un estudio de belleza con funcionalidad de reserva de turnos.

## Características

- ✨ **Vitrina de Servicios**: Muestra servicios de belleza disponibles con precios
- 📅 **Reserva de Turnos**: Sistema interactivo de reservas con selección de fecha/hora
- 📱 **Funciones PWA**: App instalable con soporte offline
- 🎨 **Diseño Responsivo**: Funciona en todos los dispositivos
- 💾 **Almacenamiento Local**: Turnos guardados localmente
- 🔄 **Service Worker**: Funcionalidad offline y caché

## Servicios Ofrecidos

- Corte y Peinado (60 min - $15.000)
- Tratamiento Facial (90 min - $22.500)
- Manicura (45 min - $10.500)
- Masaje Relajante (60 min - $24.000)

## Appointment System

### Features:
- **Date Selection**: Choose from available dates (tomorrow onwards)
- **Time Slots**: View available time slots for selected date
- **Service Selection**: Choose from available services
- **Customer Details**: Enter contact information and special requests
- **Confirmation**: Instant booking confirmation with details

### Business Hours:
- Monday-Friday: 9:00 AM - 6:00 PM
- Saturday: 9:00 AM - 2:00 PM
- Sunday: Closed

## Technical Features

### PWA Capabilities:
- **Installable**: Can be installed on mobile devices and desktop
- **Offline Support**: Core functionality works offline
- **Service Worker**: Caches resources for fast loading
- **Web App Manifest**: Provides native app-like experience

### Technologies Used:
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript**: Vanilla JS for interactivity
- **Local Storage**: Client-side data persistence
- **Service Worker**: PWA functionality

## Setup Instructions

1. Clone or download this repository
2. Add your own app icons to the `/icons` directory (see icon requirements below)
3. Update the contact information in `index.html`
4. Customize services, pricing, and availability in `app.js`
5. Deploy to GitHub Pages or any static hosting service

## Icon Requirements

Create the following icon sizes and place them in the `/icons` directory:
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

## GitHub Pages Deployment

1. Push your code to a GitHub repository
2. Go to repository Settings → Pages
3. Select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Your PWA will be available at `https://yourusername.github.io/repository-name`

## Customization

### Services:
Edit the `services` array in `app.js` to modify available services:

```javascript
const services = [
    { id: 'haircut', name: 'Haircut & Styling', duration: 60, price: 50 },
    // Add more services...
];
```

### Availability:
Modify the `availability.getAvailableSlots()` function in `app.js` to change available time slots.

### Styling:
Update CSS custom properties in `styles.css` to change colors and branding:

```css
:root {
    --primary-color: #ff6b9d;
    --secondary-color: #c44569;
    --accent-color: #f8b500;
    /* ... */
}
```

## Browser Support

- Chrome/Edge 80+
- Safari 13+
- Firefox 75+
- Mobile browsers with PWA support

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues and enhancement requests!

---

**Note**: This is a client-side only application. For production use, consider integrating with a backend service for appointment management, email notifications, and payment processing.
