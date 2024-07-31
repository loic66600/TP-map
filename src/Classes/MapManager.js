import mapboxgl from 'mapbox-gl';

class MapManager {
    constructor(config) {
        this.config = config; // Configuration de la carte
        this.markers = []; // Tableau pour stocker les marqueurs
    }

    // Initialisation de la carte
    initMap() {
        mapboxgl.accessToken = this.config.apiKey; // Clé d'API Mapbox
        this.map = new mapboxgl.Map({
            container: 'map', // ID de l'élément conteneur
            style: this.config.map_styles.satellite_streets, // Style de la carte
            center: [2.79, 42.68], // Centre de la carte
            zoom: 12 // Niveau de zoom initial
        });

        // Ajout du contrôle de navigation (zoom, rotation)
        const nav = new mapboxgl.NavigationControl();
        this.map.addControl(nav, 'top-left');
    }

    // Ajout d'un marqueur pour un événement
    addEventMarker(eventData) {
        const markerColor = this.getMarkerColor(eventData.startDate); // Couleur du marqueur en fonction de la date de début
        const marker = new mapboxgl.Marker({ color: markerColor })
            .setLngLat([eventData.longitude, eventData.latitude]) // Position du marqueur
            .addTo(this.map); // Ajout du marqueur à la carte

        // Création d'une popup détaillée
        const popup = new mapboxgl.Popup({ closeOnClick: false, closeButton: true, className: 'custom-popup' })
            .setLngLat([eventData.longitude, eventData.latitude]) // Position de la popup
            .setHTML(this.createPopupContent(eventData)); // Contenu HTML de la popup

        // Ajouter un événement de clic au marqueur pour afficher la popup
        marker.getElement().addEventListener('click', () => {
            popup.addTo(this.map);
        });

        // Ajouter des événements pour le survol
        marker.getElement().addEventListener('mouseenter', () => {
            const hoverPopup = new mapboxgl.Popup({ offset: 25 })
                .setLngLat(marker.getLngLat()) // Position de la popup de survol
                .setHTML(`<h3>${eventData.title}</h3><p>Début: ${this.formatDate(eventData.startDate)}</p><p>Fin: ${this.formatDate(eventData.endDate)}</p>`)
                .addTo(this.map);
            marker.setPopup(hoverPopup);
        });

        marker.getElement().addEventListener('mouseleave', () => {
            if (marker.getPopup()) marker.getPopup().remove();
        });

        // Stockage du marqueur et des données de l'événement
        this.markers.push({ marker, eventData, popup });
    }

    // Création du contenu HTML pour la popup
    createPopupContent(eventData) {
        const eventStatus = this.getEventStatus(eventData.startDate); // Statut de l'événement
        return `
            <div class="popup-content">
                <h3>${eventData.title}</h3>
                <p><strong>Description:</strong> ${eventData.description}</p>
                <p><strong>Début:</strong> ${this.formatDate(eventData.startDate)}</p>
                <p><strong>Fin:</strong> ${this.formatDate(eventData.endDate)}</p>
                <p><strong>Latitude:</strong> ${eventData.latitude}</p>
                <p><strong>Longitude:</strong> ${eventData.longitude}</p>
                <p class="${eventStatus.class}">${eventStatus.message}</p>
                <button class="btn btn-danger btn-sm" onclick="window.app.deleteEvent('${eventData.id}')">Supprimer</button>
                <button class="btn btn-primary btn-sm" onclick="window.app.editEvent('${eventData.id}')">Modifier</button>
            </div>
        `;
    }

    // Calcul du statut de l'événement en fonction de la date de début
    getEventStatus(startDate) {
        const eventDate = new Date(startDate);
        const currentDate = new Date();
        const diffTime = eventDate - currentDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

        if (diffDays > 3) {
            return {
                message: `Événement dans : ${diffDays} jours et ${diffHours} heures restants`,
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

    // Formatage de la date pour l'affichage
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }

    // Détermination de la couleur du marqueur en fonction de la date de début
    getMarkerColor(startDate) {
        const eventDate = new Date(startDate);
        const currentDate = new Date();
        const diffHours = (eventDate - currentDate) / (1000 * 60 * 60);

        if (diffHours > 72) return 'green'; // Plus de 72 heures
        if (diffHours > 0) return 'orange'; // Entre 0 et 72 heures
        return 'red'; // Passé
    }

    // Suppression de tous les marqueurs de la carte
    clearMarkers() {
        this.markers.forEach(({ marker, popup }) => {
            marker.remove();
            if (popup) popup.remove();
        });
        this.markers = [];
    }

    // Mise à jour des marqueurs (suppression et recréation)
    updateMarkers() {
        this.clearMarkers();
        this.markers.forEach(({ eventData }) => this.addEventMarker(eventData));
    }
}

export default MapManager;
