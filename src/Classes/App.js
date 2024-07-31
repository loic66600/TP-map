// Importation des configurations et des librairies nécessaires
import config from '../app.config.json';
import mapboxgl from 'mapbox-gl';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../assets/style.css';
import EventManager from './EventManager.js';
import MapManager from './MapManager.js';

class App {
    // Propriétés de la classe
    elDivMap; // Élément div pour la carte
    elDivSidebar; // Élément div pour la barre latérale
    mapManager; // Instance de MapManager
    eventManager; // Instance de EventManager
    currentEditId = null; // ID de l'événement en cours de modification

    constructor() {
        // Initialisation des instances de EventManager et MapManager
        this.eventManager = new EventManager();
        this.mapManager = new MapManager(config.api.mapbox_gl);
    }

    start() {
        console.log("App started");
        this.loadDom();
        this.mapManager.initMap();
        this.initForm();
        this.eventManager.loadEventsFromLocalStorage();
        this.eventManager.events.forEach(event => this.mapManager.addEventMarker(event));
        this.mapManager.map.on('click', this.handleClickMap.bind(this));

        // Ajout du contrôle personnalisé de mise à jour
        this.mapManager.map.addControl(new UpdateControl(this), 'top-left');

        // Rendre l'instance de App accessible globalement
        window.app = this;
    }
    loadDom() {
        const app = document.getElementById("app");
        app.innerHTML = ''; // Réinitialisation du contenu de l'élément app

        // Création de la div pour la carte
        this.elDivMap = document.createElement("div");
        this.elDivMap.id = "map";
        this.elDivMap.style.width = "75%";
        this.elDivMap.style.height = "100vh";
        this.elDivMap.style.float = "left";

        // Création de la barre latérale pour le formulaire
        this.elDivSidebar = document.createElement("div");
        this.elDivSidebar.id = "sidebar";
        this.elDivSidebar.style.width = "25%";
        this.elDivSidebar.style.height = "100vh";
        this.elDivSidebar.style.float = "right";
        this.elDivSidebar.style.padding = "20px";
        this.elDivSidebar.style.overflowY = "auto";

        // Contenu HTML de la barre latérale
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
                <button type="submit" class="btn btn-primary">Créer l'événement ou modifier</button>
                <br><br>
                <div>
                <button type="submit" class="btn btn-success">Valider modification</button>
                </div>

            </form>
            <button id="clear-storage-btn" class="btn btn-danger mt-3">Supprimer les Événements</button>
        `;

        // Ajout des éléments div au DOM
        app.appendChild(this.elDivMap);
        app.appendChild(this.elDivSidebar);
    }

    initForm() {
        // Ajout des gestionnaires d'événements pour le formulaire et le bouton de suppression
        document.getElementById('eventForm').addEventListener('submit', this.handleFormSubmit.bind(this));
        document.getElementById('clear-storage-btn').addEventListener('click', this.clearLocalStorage.bind(this));
    }

    handleFormSubmit(event) {
        event.preventDefault(); // Empêche le rechargement de la page
        
        if (this.currentEditId) {
            // Si un événement est en cours de modification, mettre à jour les données
            const updatedEvent = this.eventManager.createEventFromForm();
            updatedEvent.id = this.currentEditId; // Conserver l'ID de l'événement
            this.eventManager.updateEvent(updatedEvent);
            this.currentEditId = null; // Réinitialiser l'ID en cours de modification
        } else {
            // Sinon, créer un nouvel événement
            const eventData = this.eventManager.createEventFromForm();
            this.eventManager.addEvent(eventData);
        }

        alert('Les données de l\'événement ont été sauvegardées .');

        // Réinitialisation du formulaire
        event.target.reset();

        // Mettre à jour la carte
        this.mapManager.clearMarkers();
        this.eventManager.events.forEach(event => this.mapManager.addEventMarker(event));
    }

    handleClickMap(event) {
        // Mise à jour des champs de latitude et longitude dans le formulaire avec les coordonnées du clic
        const { lng, lat } = event.lngLat;
        document.getElementById('latitude').value = lat.toFixed(6);
        document.getElementById('longitude').value = lng.toFixed(6);
    }

    clearLocalStorage() {
        // Suppression des données du localStorage
        this.eventManager.clearEvents();

        alert('Les données de l\'événement ont été supprimées.');

        // Réinitialisation de la carte
        this.mapManager.clearMarkers();
    }

    deleteEvent(id) {
        // Suppression d'un événement par ID
        this.eventManager.deleteEvent(id);
        this.mapManager.clearMarkers();
        this.eventManager.events.forEach(event => this.mapManager.addEventMarker(event));
    }

    editEvent(id) {
        // Modification d'un événement par ID
        const event = this.eventManager.events.find(event => event.id === id);
        if (event) {
            document.getElementById('title').value = event.title;
            document.getElementById('description').value = event.description;
            document.getElementById('startDate').value = event.startDate;
            document.getElementById('endDate').value = event.endDate;
            document.getElementById('latitude').value = event.latitude;
            document.getElementById('longitude').value = event.longitude;
            this.currentEditId = id; // Stocker l'ID de l'événement en cours de modification
        }
    }

    updateMarkers() {
        location.reload(); // Rafraîchit la page
    }
}

// Classe de contrôle personnalisé pour la mise à jour
class UpdateControl {
    constructor(app) {
        this.app = app;
    }

    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl';
        this._container.innerHTML = '<button class="btn btn-info"><i class="bi bi-arrow-clockwise"></i> Mettre à jour</button>';
        this._container.onclick = () => this.app.updateMarkers(); // Appel de la méthode updateMarkers pour rafraîchir la page
        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}

// Création et démarrage de l'application
const app = new App();
app.start();

export default app;
