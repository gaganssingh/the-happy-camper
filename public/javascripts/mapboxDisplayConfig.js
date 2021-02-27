mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 7, // starting zoom
});

// Adding PIN to the map
const markerOptions = { color: "red" };
new mapboxgl.Marker(markerOptions)
  .setLngLat(campground.geometry.coordinates)
  .addTo(map);
