mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/outdoors-v11", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 7, // starting zoom
});

// Adding PIN to the map
const markerOptions = { color: "red" };
const popupOptions = new mapboxgl.Popup({
  offset: 25,
  closeOnClick: true,
}).setHTML(
  `<h4>${campground.title}</h4>
  <p>${campground.location}`
);

new mapboxgl.Marker(markerOptions)
  .setLngLat(campground.geometry.coordinates)
  .setPopup(popupOptions)
  .addTo(map);
