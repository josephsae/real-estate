(function () {
    const lat = document.querySelector("#lat").value || 2.941855;
    const lng = document.querySelector("#lng").value || -75.253815;
    const map = L.map('map').setView([lat, lng], 16);
    let marker;

    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPad: true
    }).addTo(map)

    marker.on("moveend", (e) => {
        marker = e.target;
        const position = marker.getLatLng();
        map.panTo(new L.LatLng(position.lat, position.lng))

        geocodeService.reverse().latlng(position, 13).run((error, result) => {
            const { address = {}, latlng = {} } = result;
            marker.bindPopup(address?.LongLabel ?? "");

            document.querySelector(".street").textContent = address?.Address ?? "";
            document.querySelector("#street").value = address?.Address ?? "";
            document.querySelector("#lat").value = latlng?.lat ?? "";
            document.querySelector("#lng").value = latlng?.lng ?? "";
        });

    })
})();