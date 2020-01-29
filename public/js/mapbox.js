export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoidm9sZGV2IiwiYSI6ImNrNXUxb2t5NzE1MGczam9uZGVjYjZ1ZXcifQ.aTKNBIbMmgnznEIfB0zUdw';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/voldev/ck5u1y57708571inxg99fj9z3',
    scrollZoom: false
    // center: [-118.113491, 34.111745],
    // zoom: 8
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // create marker
    const el = document.createElement('div');
    el.className = 'marker';
    // add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);
    // extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};
