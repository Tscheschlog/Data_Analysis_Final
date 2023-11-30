
const setVisualBackgroundImg = (county) => {
    $('#visual-2').html(county);
    console.log(county);

    fetch(`/api/get_svg/${county}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(svgContent => {
            // Use the SVG content as needed
            console.log(svgContent);
        })
        .catch(error => {
            console.error('Error fetching SVG:', error.message);
        });
}

fetch('/api/counties_json')
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
                    mouseout: resetHighlight,
                    click: function (e) {
                        setVisualBackgroundImg(layer.feature.properties.NAMELSADCO); 
    
                        console.log(layer.feature.properties.NAMELSADCO);
                    }
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