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
        const app = document.getElementById("app");
        app.innerHTML = '';

        // Création de la div pour la carte
        this.elDivMap = document.createElement("div");
        this.elDivMap.id = "map";
        this.elDivMap.style.width = "75%";
        this.elDivMap.style.height = "100vh";
        this.elDivMap.style.float = "left";

        // Création de la sidebar pour le formulaire
        this.elDivSidebar = document.createElement("div");
        this.elDivSidebar.id = "sidebar";
        this.elDivSidebar.style.width = "25%";
        this.elDivSidebar.style.height = "100vh";
        this.elDivSidebar.style.float = "right";
        this.elDivSidebar.style.padding = "20px";
        this.elDivSidebar.style.overflowY = "auto";

        this.elDivSidebar.innerHTML = `
            <h2>Créer un Événement</h2>
            <form id="eventForm">
                <div class="mb-3">
                    <label for="title" class="form-label">Titre de l'événement</label>
                    <input type="text" class="form-control" id="title" required>
                </div>
                <div class="mb-3">
                    <label for="description" class="form-label">Description de l'événement</label>
                    <textarea class="form-control" id="description" rows="3" required></textarea>
                </div>
                <div class="mb-3">
                    <label for="startDate" class="form-label">Date de début</label>
                    <input type="datetime-local" class="form-control" id="startDate" required>
                </div>
                <div class="mb-3">
                    <label for="endDate" class="form-label">Date de fin</label>
                    <input type="datetime-local" class="form-control" id="endDate" required>
                </div>
                <div class="mb-3">
                    <label for="latitude" class="form-label">Latitude</label>
                    <input type="number" class="form-control" id="latitude" step="any" required>
                </div>
                <div class="mb-3">
                    <label for="longitude" class="form-label">Longitude</label>
                    <input type="number" class="form-control" id="longitude" step="any" required>
                </div>
                <button type="submit" class="btn btn-primary">Créer l'événement</button>
            </form>
            <button id="clear-storage-btn" class="btn btn-danger mt-3">Supprimer les données</button>
        `;

        app.appendChild(this.elDivMap);
        app.appendChild(this.elDivSidebar);
    }

    initMap() {
        mapboxgl.accessToken = config.api.mapbox_gl.apiKey;
        this.map = new mapboxgl.Map({
            container: this.elDivMap,
            style: config.api.mapbox_gl.map_styles.satellite_streets,
            center: [2.79, 42.68],
            zoom: 12
        });
        const nav = new mapboxgl.NavigationControl();
        this.map.addControl(nav, 'top-left');
        this.map.on('click', this.handleClickMap.bind(this));

        // Ajout du bouton de mise à jour
        this.map.addControl(new mapboxgl.NavigationControl(), 'top-left');
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
            latitude: parseFloat(document.getElementById('latitude').value),
            longitude: parseFloat(document.getElementById('longitude').value)
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
            marker.togglePopup();
        });
        marker.getElement().addEventListener('mouseleave', () => {
            marker.togglePopup();
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
app.start();

export default app;