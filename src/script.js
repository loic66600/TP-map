import config from '../app.config.json';
import mapboxgl from 'mapbox-gl';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../assets/style.css';

class App {
    //properties
    elDivMap;
    elDivSidebar;
    map;
    events = [];

    start() {
        console.log("App started");
        this.loadDom();
        this.initMap();
        this.initForm();
        this.loadEventsFromLocalStorage();
    }

    loadDom() {
        // ... (le code pour loadDom reste inchangé)
    }

    initMap() {
        // ... (le code pour initMap reste inchangé)
    }

    handleClickMap(event) {
        const { lng, lat } = event.lngLat;
        document.getElementById('latitude').value = lat.toFixed(6);
        document.getElementById('longitude').value = lng.toFixed(6);
    }

    initForm() {
        document.getElementById('eventForm').addEventListener('submit', this.handleFormSubmit.bind(this));
        document.getElementById('clear-storage-btn').addEventListener('click', this.clearLocalStorage.bind(this));
    }

    handleFormSubmit(event) {
        event.preventDefault();
        
        const eventData = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            latitude: document.getElementById('latitude').value,
            longitude: document.getElementById('longitude').value
        };

        // Récupérer les données existantes du localStorage
        const existingData = JSON.parse(localStorage.getItem('eventDataList')) || [];

        // Ajouter les nouvelles données
        existingData.push(eventData);

        // Enregistrer à nouveau les données combinées dans le localStorage
        localStorage.setItem('eventDataList', JSON.stringify(existingData));

        alert('Les données de l\'événement ont été sauvegardées dans le localStorage.');

        // Réinitialiser le formulaire
        event.target.reset();

        // Mettre à jour la carte
        this.addEventMarker(eventData);
    }

    clearLocalStorage() {
        // Supprimer les données du localStorage
        localStorage.removeItem('eventDataList');

        alert('Les données de l\'événement ont été supprimées du localStorage.');

        // Réinitialiser la carte
        this.map.remove();
        this.initMap();
    }

    loadEventsFromLocalStorage() {
        const storedEvents = JSON.parse(localStorage.getItem('eventDataList')) || [];
        this.events = storedEvents;
        this.events.forEach(event => this.addEventMarker(event));
    }

    addEventMarker(eventData) {
        const markerColor = this.getMarkerColor(eventData.startDate);
        const marker = new mapboxgl.Marker({ color: markerColor })
            .setLngLat([eventData.longitude, eventData.latitude])
            .setPopup(new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<h3>${eventData.title}</h3><p>${eventData.description}</p><p>Début: ${eventData.startDate}</p><p>Fin: ${eventData.endDate}</p>`))
            .addTo(this.map);

        marker.getElement().addEventListener('mouseenter', () => {
            const popup = new mapboxgl.Popup({ offset: 25 })
                .setLngLat(marker.getLngLat())
                .setHTML(`<h3>${eventData.title}</h3><p>Début: ${eventData.startDate}</p><p>Fin: ${eventData.endDate}</p>`)
                .addTo(this.map);
            marker.setPopup(popup);
        });
        marker.getElement().addEventListener('mouseleave', () => {
            marker.getPopup().remove();
        });
    }

    getMarkerColor(startDate) {
        const eventDate = new Date(startDate);
        const currentDate = new Date();
        const diffDays = Math.ceil((eventDate - currentDate) / (1000 * 60 * 60 * 24));

        if (diffDays > 3) return 'green';
        if (diffDays >= 0) return 'orange';
        return 'red';
    }
}

const app = new App();

export default app;