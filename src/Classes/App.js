//on impoert la configuration
import config from '../app.config.json';
//on importe la librairie mapbox
import mapboxgl from 'mapbox-gl';
//import de  bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
//import bootstrap js
import 'bootstrap/dist/js/bootstrap.min.js';
//import de icone bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css';
//impot du style de map box
import 'mapbox-gl/dist/mapbox-gl.css';
//import  de notre propre style
import '../assets/style.css'


class App{
    //properties
    elDivMap;
    //proprieta instance de map
    map;

    start(){
        console.log("App started");
        this.loadDom();
        this.initMap();
    }


    //chargement du dom
loadDom(){
    //on creer notre div
    const app = document.getElementById("app");
    //on ajoute notre div
    this.elDivMap = document.createElement("div");
    this.elDivMap.id = "map";

    //on ajoute la div map au div app
    app.appendChild(this.elDivMap);

}



// initialisation de la map
initMap(){
    //on va renseigner notre clef d api a la librairie mapbox
    mapboxgl.accessToken = config.api.mapbox_gl.apiKey;
    //on creer notre instance de map
    this.map = new mapboxgl.Map({
        container: this.elDivMap,//on met l'id de notre div map
        style: config.api.mapbox_gl.map_styles.satellite_streets, //on met le style de la map
        center: [2.79, 42.68], //on met le centre de la map
        zoom: 12  //on met le zoom
    });

}




}
const app = new App();

 export default app