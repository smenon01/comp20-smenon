// map.js

function setUp()
{
	//set South Station first, as center
	var center = new google.maps.LatLng(42.352271, -71.05524200000001);
	
	var setMap = {
		zoom: 13, 
		center: center,
		mapTypeId: google.maps.MapTypeId.ROADMAP 
	};

	var map = new google.maps.Map(document.getElementById("map_canvas"), setMap);
	
	var stations = [["Alewife Station", 42.395428, -71.142483],
					["Davis Station", 42.39674, -71.121815],
					["Porter Square Station", 42.3884, -71.11914899999999],
					["Harvard Square Station", 42.373362, -71.118956],
					["Central Square Station", 42.365486, -71.103802],
					["Kendall/MIT Station", 42.36249079, -71.08617653],
					["Charles/MGH Station", 42.361166, -71.070628],
					["Park Street Station", 42.35639457, -71.0624242],
					["Downtown Crossing Station", 42.355518, -71.060225],
					["South Station", 42.352271, -71.05524200000001],
					["Broadway Station", 42.342622, -71.056967],
					["Andrew Station", 42.330154, -71.057655],
					["JFK/UMass Station", 42.320685, -71.052391],
					["Savin Hill Station", 42.31129, -71.053331],
					["Fields Corner", 42.300093, -71.061667],
					["Shawmut Station", 42.29312583, -71.06573796000001],
					["Ashmont Station", 42.284652, -71.06448899999999],
					["North Quincy Station", 42.275275, -71.029583],
					["Wollaston Station", 42.2665139, -71.0203369],
					["Quincy Center Station", 42.251809, -71.005409],
					["Quincy Adams Station", 42.233391, -71.007153],
					["Braintree Station", 42.2078543, -71.0011385]];
					
	var markers = [stations.length];
	var window = new google.maps.InfoWindow();
	var positions = [];
					
	for (var i = 0; i < stations.length; i++) {
		var pos = new google.maps.LatLng(stations[i][1], stations[i][2]);
		positions.push(pos);
		var marker = new google.maps.Marker({
			position: pos,
			title: stations[i][0],
			icon: 'mbta.png',
			map: map //add marker to map
		});
		markers.push(marker); // add to markers array
		
		//Googled this -- how to get 1 info window for multiple markers
        marker.addListener('click', (function(marker, i) {
          return function() {
          	window.setContent(marker.title);
          	window.open(map, marker);
          }
        })(marker, i));        

	} 	
		
	//add polyline
	var p1 = [];
	var p2 = [];
	for (var i = 0; i < 17; i++) {
		p1.push(positions[i]);
	}
	
	var path1 = new google.maps.Polyline({
		path: p1,
		geodesic: true,
		strokeColor: '#FF0000',
		strokeOpacity: 1.0,
		strokeWeight: 2
	 });
	path1.setMap(map);
	
	p2.push(positions[12]);
	for (var i = 17; i < positions.length; i++) {
		p2.push(positions[i]);
	}
	var path2 = new google.maps.Polyline({
		path: p2,
		geodesic: true,
		strokeColor: '#FF0000',
		strokeOpacity: 1.0,
		strokeWeight: 2
	 });
	path2.setMap(map);
	
}