//TODO: Fazer um tratamento do campo "municipio" para substituir caracteres especiais e minúsculos por simples e maiúsculos.

function getCityCoordinates(city) {
	var coordinates = { //coordenadas das cidades, removida a maioria por privacidade
		'CABEDELO': [-34.8304, -6.98021],
		'JOAO PESSOA': [-34.861, -7.11532],
	};

	return coordinates[city] || [0, 0]; // Valor padrão para coordenadas indefinidas ou "SEM ENDERECO"
}

function drawMarkerGeoChart(data) {
	var cityCount = {};

	// Contagem de pacientes por cidade
	data.forEach(function (patient) {
		var city = patient.municipio;

		if (cityCount[city]) {
			cityCount[city]++;
		} else {
			cityCount[city] = 1;
		}
	});

	var geojsonData = {
		type: 'FeatureCollection',
		features: []
	};

	for (var city in cityCount) {
		var feature = {
			type: 'Feature',
			properties: {
				city: city,
				count: cityCount[city]
			},
			geometry: {
				type: 'Point',
				coordinates: getCityCoordinates(city)
			}
		};

		geojsonData.features.push(feature);
	}

	var map = L.map('markerGeoChart').setView([-7.100, -37.000], 6);

	// Camada do OpenStreetMap
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '© OpenStreetMap contributors'
	}).addTo(map);

	// Dados geoespaciais
	L.geoJSON(geojsonData, {
		pointToLayer: function (feature, latlng) {
			return L.marker(latlng).bindPopup(feature.properties.city + '<br>Número de Pacientes: ' + feature.properties.count);
		}
	}).addTo(map);
}

$(document).ready(function () {
	$.ajax({
		url: 'backend/get_data.php',
		type: 'GET',
		dataType: 'json',
		success: function (data) {
			drawMarkerGeoChart(data);
		},
		error: function (xhr, status, error) {
			console.error('Erro ao obter dados:', status, error);
		}
	});
});