class EventManager {
    constructor() {
        this.events = [];
    }

    loadEventsFromLocalStorage() {
        const storedEvents = JSON.parse(localStorage.getItem('eventDataList')) || [];
        this.events = storedEvents;
    }

    saveEventsToLocalStorage() {
        localStorage.setItem('eventDataList', JSON.stringify(this.events));
    }

    createEventFromForm() {
        return {
            id: this.generateId(),
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            latitude: parseFloat(document.getElementById('latitude').value),
            longitude: parseFloat(document.getElementById('longitude').value)
        };
    }

    generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    addEvent(eventData) {
        this.events.push(eventData);
        this.saveEventsToLocalStorage();
    }

    deleteEvent(id) {
        this.events = this.events.filter(event => event.id !== id);
        this.saveEventsToLocalStorage();
    }

    updateEvent(updatedEvent) {
        const index = this.events.findIndex(event => event.id === updatedEvent.id);
        if (index !== -1) {
            this.events[index] = updatedEvent;
            this.saveEventsToLocalStorage();
        }
    }

    clearEvents() {
        this.events = [];
        localStorage.removeItem('eventDataList');
    }
}

export default EventManager;