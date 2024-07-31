import mapboxgl from 'mapbox-gl';

class MapManager {
    constructor(config) {
        this.config = config;
        this.markers = [];
    }

    initMap() {
        mapboxgl.accessToken = this.config.apiKey;
        this.map = new mapboxgl.Map({
            container: 'map',
            style: this.config.map_styles.satellite_streets,
            center: [2.79, 42.68],
            zoom: 12
        });

        const nav = new mapboxgl.NavigationControl();
        this.map.addControl(nav, 'top-left');
    }

    addEventMarker(eventData) {
        const markerColor = this.getMarkerColor(eventData.startDate);
        const marker = new mapboxgl.Marker({ color: markerColor })
            .setLngLat([eventData.longitude, eventData.latitude])
            .addTo(this.map);

        // Créer une popup détaillée
        const popup = new mapboxgl.Popup({ closeOnClick: false, closeButton: true, className: 'custom-popup' })
            .setLngLat([eventData.longitude, eventData.latitude])
            .setHTML(this.createPopupContent(eventData))
            .addTo(this.map);

        // Ajouter un événement de clic au marqueur pour afficher la popup
        marker.getElement().addEventListener('click', () => {
            popup.addTo(this.map);
        });

        // Ajouter des événements pour le survol
        marker.getElement().addEventListener('mouseenter', () => {
            const hoverPopup = new mapboxgl.Popup({ offset: 25 })
                .setLngLat(marker.getLngLat())
                .setHTML(`<h3>${eventData.title}</h3><p>Début: ${this.formatDate(eventData.startDate)}</p><p>Fin: ${this.formatDate(eventData.endDate)}</p>`)
                .addTo(this.map);
            marker.setPopup(hoverPopup);
        });

        marker.getElement().addEventListener('mouseleave', () => {
            if (marker.getPopup()) marker.getPopup().remove();
        });

        this.markers.push({ marker, eventData });
    }

    createPopupContent(eventData) {
        const eventStatus = this.getEventStatus(eventData.startDate);
        return `
            <div class="popup-content">
                <h3>${eventData.title}</h3>
                <p><strong>Description:</strong> ${eventData.description}</p>
                <p><strong>Début:</strong> ${this.formatDate(eventData.startDate)}</p>
                <p><strong>Fin:</strong> ${this.formatDate(eventData.endDate)}</p>
                <p><strong>Latitude:</strong> ${eventData.latitude}</p>
                <p><strong>Longitude:</strong> ${eventData.longitude}</p>
                <p class="${eventStatus.class}">${eventStatus.message}</p>
                <button class="btn btn-danger btn-sm" onclick="app.deleteEvent('${eventData.id}')">Supprimer</button>
                <button class="btn btn-primary btn-sm" onclick="app.editEvent('${eventData.id}')">Modifier</button>
            </div>
        `;
    }

    getEventStatus(startDate) {
        const eventDate = new Date(startDate);
        const currentDate = new Date();
        const diffTime = eventDate - currentDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

        if (diffDays > 3) {
            return {
                message: `Événement dans plus de 3 jours: ${diffDays} jours et ${diffHours} heures restants`,
                class: 'status-future'
            };
        } else if (diffDays >= 0) {
            return {
                message: `Attention, commence dans ${diffDays} jours, ${diffHours} heures et ${diffMinutes} minutes`,
                class: 'status-soon'
            };
        } else {
            return {
                message: 'Événement dépassé: Quel dommage ! Vous avez raté cet événement !',
                class: 'status-past'
            };
        }
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }

    getMarkerColor(startDate) {
        const eventDate = new Date(startDate);
        const currentDate = new Date();
        const diffHours = (eventDate - currentDate) / (1000 * 60 * 60);

        if (diffHours > 72) return 'green';
        if (diffHours > 0) return 'orange';
        return 'red';
    }

    clearMarkers() {
        this.markers.forEach(({ marker }) => marker.remove());
        this.markers = [];
    }

    updateMarkers() {
        this.clearMarkers();
        this.markers.forEach(({ eventData }) => this.addEventMarker(eventData));
    }
}

export default MapManager;