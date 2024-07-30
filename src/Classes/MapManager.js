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
            .setPopup(new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<h3>${eventData.title}</h3><p>${eventData.description}</p><p>Début: ${eventData.startDate}</p><p>Fin: ${eventData.endDate}</p>`))
            .addTo(this.map);

        marker.getElement().addEventListener('mouseenter', () => marker.togglePopup());
        marker.getElement().addEventListener('mouseleave', () => marker.togglePopup());

        this.markers.push(marker);
    }

    getMarkerColor(startDate) {
        const eventDate = new Date(startDate);
        const currentDate = new Date();
        const diffDays = Math.ceil((eventDate - currentDate) / (1000 * 60 * 60 * 24));

        if (diffDays > 3) {
            return 'green';
        } else if (diffDays >= 0) {
            return 'orange';
        } else {
            return 'red';
        }
    }

    clearMarkers() {
        this.markers.forEach(marker => marker.remove());
        this.markers = [];
    }
}

export default MapManager;