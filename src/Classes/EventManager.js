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
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            latitude: parseFloat(document.getElementById('latitude').value),
            longitude: parseFloat(document.getElementById('longitude').value)
        };
    }

    addEvent(eventData) {
        this.events.push(eventData);
        this.saveEventsToLocalStorage();
    }

    clearEvents() {
        this.events = [];
        localStorage.removeItem('eventDataList');
    }
}

export default EventManager;