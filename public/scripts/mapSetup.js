fetch('../../backend/data/florida_counties.json')
        .then(response => response.json())
        .then(data => {
            const map = L.map('map').setView([27.9944024, -81.760254], 7); // Set the initial view to Florida

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            const defaultStyle = {
                weight: 2,
                color: 'green',
                dashArray: '3',
                fillOpacity: 0.2
            };

            L.geoJSON(data).addTo(map);
            L.geoJSON(data, {
                style: defaultStyle,
                onEachFeature: function (feature, layer) {
                    layer.on({
                        mouseover: highlightFeature,
                        mouseout: resetHighlight
                    });
                }
            }).addTo(map);

            // Function to highlight the feature (county)
            function highlightFeature(e) {
                const layer = e.target;

                const countyName = layer.feature.properties.NAMELSADCO;
                layer.bindPopup(`<div class="county-popup">${countyName}</div>`, {}).openPopup();

                // console.log(layer.feature.properties);

                layer.setStyle({
                    weight: 2,
                    color: '#eeff',
                    dashArray: '3',
                    fillOpacity: 0.5
                });

                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    layer.bringToFront();
                }
            }

            // Function to reset the highlight
            function resetHighlight(e) {
                const layer = e.target;

                layer.setStyle(defaultStyle);
            }
});   