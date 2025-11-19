import { Map, TileLayer, Marker, Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerIconRestaurant from './images/restaurant-location-icon.png';

const icon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

const restaurantIcon = new Icon({
  iconUrl: markerIconRestaurant,
  iconRetinaUrl: markerIconRestaurant,
  iconSize: [41, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

export const ICONS = {
  restaurant: restaurantIcon,
  userIcon: icon,
};

export class LeafletMap {
  constructor(containerId, coordinates = [51.505, -0.09], zoom = 13, readOnly = false, icon = ICONS.userIcon) {
    this.map = new Map(containerId).setView(coordinates, zoom);
    new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: false }).addTo(this.map);

    this.marker = new Marker(coordinates, { icon, draggable: !readOnly }).addTo(this.map);
  }

  addRestaurantMarker(coordinates, popupText = 'Café/Restaurant sans nom') {
    return new Marker(coordinates, { icon: restaurantIcon }).addTo(this.map).bindPopup(popupText).openPopup();
  }

  setView(coordinates, zoom) {
    this.map.setView(coordinates, zoom);
  }

  setMarker(coordinates, popupText = 'Vous êtes ici.') {
    this.marker.setLatLng(coordinates).bindPopup(popupText).openPopup();
  }

  addMarker(coordinates, popupText = 'Café/Restaurant sans nom') {
    return new Marker(coordinates, { icon }).addTo(this.map).bindPopup(popupText).openPopup();
  }

  drawConnectionLine(from, to) {
    if (this.connectionLine) {
      this.map.removeLayer(this.connectionLine);
    }

    this.connectionLine = L.polyline([from, to], {
      color: '#ff69b4',
      weight: 3,
      opacity: 0.9,
      dashArray: '10, 10',
    }).addTo(this.map);

    this.map.fitBounds(this.connectionLine.getBounds(), { padding: [50, 50] });
  }
}
