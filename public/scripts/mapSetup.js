let map = L.map('map').setView([27.9944024, -81.760254], 7); // Set the initial view to Florida
let markers = []; 
let propertyBook = {};

// #################################################################
// #### Onclick County Logic #######################################
// #################################################################

const setPropertyView = () => {
    var selectedValue = document.getElementById('property-dropdown').value;
    console.log('Selected option:', selectedValue);

    document.getElementById('price-tag').innerText = "$"+ propertyBook[selectedValue].PRICE + ".00";
    document.getElementById('square-feet-tag').innerText = propertyBook[selectedValue]['SQUARE FEET'] + " square feet";
    document.getElementById('beds-tag').innerText = propertyBook[selectedValue].BEDS;
    document.getElementById('baths-tag').innerText = propertyBook[selectedValue].BATHS;
    document.getElementById('learn-anchor').href = propertyBook[selectedValue]['URL (SEE https://www.redfin.com/buy-a-home/comparative-market-analysis FOR INFO ON PRICING)'];
}

const setVisualBackgroundImg = async (county) => {

    $('#stats-tab').html(
        '<div class="visual-body">' +
        
        '<p>' + county + ' Statistics</p>' +
        '<div class="row"></div>'
        
        + '</div>'
    );
    $('#visual-2').html(
        '<div class="visual-body">' +
        '<img src="assets/' + county + '_linegraph.png" /></div>'
    );

    let lowerCountyName = county.substring(0, county.indexOf("County") - 1);
    $('#visual-3').html(
        '<div class="visual-body">' +
        '<img src="assets/sales_vs_income_' + lowerCountyName + '.png" /></div>'
    );
    fetch('/api/props/' + lowerCountyName)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const options = data.map(option => 
                {
                    if (option.ADDRESS != undefined && option.ADDRESS != "") {
                        propertyBook[option.ADDRESS] = option;
                        return `<option value="${option.ADDRESS}">${option.ADDRESS}</option>`
                    }
                }
            );

            $('#view-tab').html(
                `
                <div class="visual-body form-group">
                    <select id="property-dropdown" class="form-control">${options.join('')}</select></div>
                    <div id="current-house-view">
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-tags-fill"></i><label>Price</label></span>
                            <p id="price-tag" class="form-control m-0"></p>
                        </div>
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-gear"></i><label>Square Feet</label></span>
                            <p id="square-feet-tag" class="form-control m-0"></p>
                        </div>
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-gear"></i><label>Beds</label></span>
                            <p id="beds-tag" class="form-control m-0"></p>
                        </div>
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-gear"></i><label>Baths</label></span>
                            <p id="baths-tag" class="form-control m-0"></p>
                        </div>
                        <div class="mt-2" id="learn-more-tag"><a id="learn-anchor">Learn More</a></div>
                    </div>
                </div>
                `
            );
            document.getElementById('property-dropdown').addEventListener('change', function() {
                setPropertyView();
            });



            
        })
        .catch(error => {
            console.error('Error fetching options:', error);
        });

        $('#stats-tab').html(
            `
            <div>
                <div>${county}'s Statistics</div>
                <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-tags-fill"></i><label>Mean Price</label></span>
                    <p id="mean-tag" class="form-control m-0"></p>
                </div>
            </div>
            `
        )
}


fetch('/api/counties_json')
    .then(response => response.json())
    .then(data => {

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
                        console.log(layer.feature.properties.NAMELSADCO.toLowerCase().substring(0, layer.feature.properties.NAMELSADCO.indexOf("County")).trim());
                        setVisualBackgroundImg(layer.feature.properties.NAMELSADCO); 
                        setPropertyView();
                        removeMarkers();
                        
                        fetch('/api/map_pins/' + layer.feature.properties.NAMELSADCO.toLowerCase().substring(0, layer.feature.properties.NAMELSADCO.indexOf("County")).trim())
                            .then(response => response.text())
                            .then(data => {
                                createMarkers(data);
                            })
                            .catch(error => {
                                console.error('Error fetching data:', error);
                            });
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

// #################################################################
// #### Toggle Properties Logic ####################################
// #################################################################

function createMarkers(data) {
    const rows = Papa.parse(data, { header: true, dynamicTyping: true }).data;

    rows.forEach(row => {
        const { LATITUDE, LONGITUDE, ADDRESS, PRICE, BEDS, BATHS } = row;

        if (LATITUDE && LONGITUDE) {
            const marker = L.marker([LATITUDE, LONGITUDE])
                .bindPopup(`<b>${ADDRESS}</b><br>${PRICE}, ${BEDS} beds, ${BATHS} baths`)
                .addTo(map);
            markers.push(marker);
        }
    });
}

function removeMarkers() {
    markers.forEach(marker => {
        map.removeLayer(marker);
    });
    markers = []; // Clear the markers array
}


// fetch('/api/map_pins/lee')
//     .then(response => response.text())
//     .then(data => {
//         createMarkers(data);
//     })
//     .catch(error => {
//         console.error('Error fetching data:', error);
//     });
// fetch('/api/map_pins/other')
//     .then(response => response.text())
//     .then(data => {
//         createMarkers(data);
//     })
//     .catch(error => {
//         console.error('Error fetching data:', error);
//     });

const toggleCheckbox = document.getElementById('toggleMarkers');
toggleCheckbox.addEventListener('change', function () {
    if (this.checked) {
        // Show markers
        markers.forEach(marker => {
            map.addLayer(marker);
        });
    } else {
        // Hide markers
        markers.forEach(marker => {
            map.removeLayer(marker);
        });
    }
});


// #################################################################
// #### Line Graph Logic ###########################################
// #################################################################

const imgElement = document.getElementById('img-vis-1');

// // Lee County Line Graph
// let offset = 72;
// for(let i = offset + 0; i <= offset + 5; i++) {
//     fetch(`/api/line_graph/${i}`)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             return response.blob();
//         })
//         .then(blob => {
//             const url = URL.createObjectURL(blob);
//             imgElement.src = url;
//         })
//         .catch(error => {
//             console.error('Error fetching image:', error);
//         });
//     console.log(i);
// }