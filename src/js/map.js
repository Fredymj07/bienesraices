/* eslint-disable no-undef */
(function() {
    const lat = 4.5848455;
    const lng = -74.155303;
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    let marker;
    // Permite utilizar un provider y un geocoder para obtener la información de la calle ubicada con el pin
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Implementación del pin de ubicación
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    })
    .addTo(mapa);

    // Detección del movimiento del pin
    marker.on('moveend', function(event) {
        marker = event.target;
        const position = marker.getLatLng();
        mapa.panTo(new L.LatLng(position.lat, position.lng));

        // Obtener la información de la calle tan pronto se suelta el pin
        geocodeService.reverse().latlng(position, 16).run(function (error, result) {
            
            // Información de la ubicación del pin
            marker.bindPopup(result.address.LongLabel);

            // Llenado de los campos ocultos del mapa
            document.querySelector('.street').textContent = result?.address?.Address ?? '';
            document.querySelector('#street').value = result?.address?.Address ?? '';
            document.querySelector('#lat').value = result?.latlng?.lat ?? '';
            document.querySelector('#lng').value = result?.latlng?.lng ?? '';
        })
    });
})()