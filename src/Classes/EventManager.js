class EventManager {
    constructor() {
        // Initialise un tableau vide pour stocker les événements
        this.events = [];
    }

    // Charge les événements depuis le localStorage
    loadEventsFromLocalStorage() {
        // Récupère les événements stockés dans le localStorage sous la clé 'eventDataList'
        // Si aucun événement n'est trouvé, initialise un tableau vide
        const storedEvents = JSON.parse(localStorage.getItem('eventDataList')) || [];
        // Met à jour la propriété events avec les événements récupérés
        this.events = storedEvents;
    }

    // Sauvegarde les événements dans le localStorage
    saveEventsToLocalStorage() {
        // Convertit le tableau events en chaîne JSON et le stocke dans le localStorage sous la clé 'eventDataList'
        localStorage.setItem('eventDataList', JSON.stringify(this.events));
    }

    // Crée un événement à partir des données du formulaire
    createEventFromForm() {
        // Retourne un objet événement avec les données récupérées du formulaire
        return {
            id: this.generateId(), // Génère un ID unique pour l'événement
            title: document.getElementById('title').value, // Récupère la valeur du champ 'title'
            description: document.getElementById('description').value, // Récupère la valeur du champ 'description'
            startDate: document.getElementById('startDate').value, // Récupère la valeur du champ 'startDate'
            endDate: document.getElementById('endDate').value, // Récupère la valeur du champ 'endDate'
            latitude: parseFloat(document.getElementById('latitude').value), // Récupère et convertit la valeur du champ 'latitude' en nombre
            longitude: parseFloat(document.getElementById('longitude').value) // Récupère et convertit la valeur du champ 'longitude' en nombre
        };
    }

    // Génère un ID unique pour un événement
    generateId() {
        // Génère une chaîne aléatoire de 9 caractères en utilisant des caractères alphanumériques
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    // Ajoute un événement au tableau events et le sauvegarde dans le localStorage
    addEvent(eventData) {
        // Ajoute l'objet événement au tableau events
        this.events.push(eventData);
        // Sauvegarde le tableau events mis à jour dans le localStorage
        this.saveEventsToLocalStorage();
    }

    // Supprime un événement par ID
    deleteEvent(id) {
        // Filtre le tableau events pour ne conserver que les événements dont l'ID est différent de celui à supprimer
        this.events = this.events.filter(event => event.id !== id);
        // Sauvegarde le tableau events mis à jour dans le localStorage
        this.saveEventsToLocalStorage();
    }

    // Met à jour un événement existant
    updateEvent(updatedEvent) {
        // Trouve l'index de l'événement à mettre à jour dans le tableau events
        const index = this.events.findIndex(event => event.id === updatedEvent.id);
        // Si l'événement est trouvé, met à jour l'événement à l'index trouvé
        if (index !== -1) {
            this.events[index] = updatedEvent;
            // Sauvegarde le tableau events mis à jour dans le localStorage
            this.saveEventsToLocalStorage();
        }
    }

    // Supprime tous les événements
    clearEvents() {
        // Vide le tableau events
        this.events = [];
        // Supprime la clé 'eventDataList' du localStorage
        localStorage.removeItem('eventDataList');
    }
}

export default EventManager;
