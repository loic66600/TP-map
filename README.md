```markdown
# 🗺️ Projet Mapbox avec Node.js et Vite

Ce projet utilise l'API `mapbox-gl` pour afficher une carte satellite avec des rues en utilisant une application Node.js avec Vite et du JavaScript vanilla.

## 🚀 Démarrage rapide

### Prérequis

- Node.js (version 14 ou supérieure)
- NPM (version 6 ou supérieure)

### Installation initiale

1. Créez un nouveau projet Vite :
   ```bash
   npm create vite@latest
   ```

2. Installez les dépendances nécessaires :
   ```bash
   npm i mapbox-gl
   ```
   ```bash
   npm i bootstrap-icons
   ```

3. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

## 🗺️ Utilisation de l'API Mapbox

### Configuration de base

1. **Obtenez une clé API Mapbox** : Rendez-vous sur [Mapbox](https://www.mapbox.com/) et créez un compte pour obtenir une clé API.

2. **Ajoutez votre clé API dans votre code** : Créez un fichier `.env`ou `app.config.json` à la racine de votre projet et ajoutez votre clé API :
   ```
   VITE_MAPBOX_API_KEY=your_mapbox_api_key
   ```

### Exemple de code

Voici un exemple de code pour afficher une carte satellite avec des rues en utilisant `mapbox-gl` :

```javascript
// main.js
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
```

### Structure des fichiers

Assurez-vous que votre fichier HTML contient un élément avec l'ID `map` pour que la carte puisse être rendue :

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mapbox Project</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <div id="map" style="width: 100%; height: 100vh;"></div>
    <script type="module" src="/main.js"></script>
</body>
</html>
```

### Styles CSS

Ajoutez des styles de base pour que la carte prenne tout l'espace disponible :

```css
/* style.css */
body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
}

#map {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
}
```

## 📦 Commandes NPM

Voici les principales commandes NPM pour gérer votre projet :

```bash
npm create vite@latest
```
```bash
npm i mapbox-gl
```
```bash
npm i bootstrap-icons
```
```bash
npm run dev
```

## 📝 Notes

- Assurez-vous de remplacer `your_mapbox_api_key` par votre clé API Mapbox réelle.
- Vous pouvez personnaliser les styles de la carte en modifiant le paramètre `style` dans la configuration de la carte.

## 🤝 Contribution

Les contributions à ce projet sont les bienvenues. N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---
```
