// map.js

request = new XMLHttpRequest();
//request.open("GET", "https://sheltered-forest-5520.herokuapp.com/redline.json", true);
requestPost = new XMLHttpRequest();

var myLat; 
var myLng;


navigator.geolocation.getCurrentPosition(function (position) {
	success(position);
	//request.open("GET", "http://localhost:5000/redline.json", true);
	request.open("GET", "https://still-ridge-53158.herokuapp.com/redline.json", true);
	request.onreadystatechange = setUp;
	request.send(null);	
});

function success(position) {
	myLat = position.coords.latitude;
	myLng = position.coords.longitude;
} 
	
function setUp()
{
	//requestPost.open("POST", "http://localhost:5000/position?lat=" + myLat + "&lng=" + myLng, true);
	
	if (request.readyState == 4 && request.status == 200) {
		data = request.responseText;
		schedule = JSON.parse(data);
		
		requestPost.onreadystatechange = function () {
		if (requestPost.readyState == 4 && requestPost.status == 200) {
			console.log("POST complete");
		}
		};
		requestPost.open("POST", "https://still-ridge-53158.herokuapp.com/position?lat=" + myLat + "&lng=" + myLng, true);
		requestPost.send(null);
	}
	else if (request.readyState == 4 && request.status != 200) {
		alert("fail");
	}
	
	//set South Station first, as center
	var center = new google.maps.LatLng(42.352271, -71.05524200000001);
	
	var setMap = {
		zoom: 13, 
		center: center,
		mapTypeId: google.maps.MapTypeId.ROADMAP 
	};

	var map = new google.maps.Map(document.getElementById("map_canvas"), setMap);
	
	var stations = [["Alewife", 42.395428, -71.142483],
					["Davis", 42.39674, -71.121815],
					["Porter Square", 42.3884, -71.11914899999999],
					["Harvard Square", 42.373362, -71.118956],
					["Central Square", 42.365486, -71.103802],
					["Kendall/MIT", 42.36249079, -71.08617653],
					["Charles/MGH", 42.361166, -71.070628],
					["Park Street", 42.35639457, -71.0624242],
					["Downtown Crossing", 42.355518, -71.060225],
					["South Station", 42.352271, -71.05524200000001],
					["Broadway", 42.342622, -71.056967],
					["Andrew", 42.330154, -71.057655],
					["JFK/UMass", 42.320685, -71.052391],
					["Savin Hill", 42.31129, -71.053331],
					["Fields Corner", 42.300093, -71.061667],
					["Shawmut", 42.29312583, -71.06573796000001],
					["Ashmont", 42.284652, -71.06448899999999],
					["North Quincy", 42.275275, -71.029583],
					["Wollaston", 42.2665139, -71.0203369],
					["Quincy Center", 42.251809, -71.005409],
					["Quincy Adams", 42.233391, -71.007153],
					["Braintree", 42.2078543, -71.0011385]];
					
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
			map: map 
		});
		markers.push(marker); // add to markers array
		
		marker.addListener('click', function() {
       		var words = " ";
          	for (i = 0; i < schedule["TripList"]["Trips"].length; i++) {
				for (j = 0; j < schedule["TripList"]["Trips"][i]["Predictions"].length; j++) {
					if (schedule["TripList"]["Trips"][i]["Predictions"][j]["Stop"] == this.title 
					&& schedule["TripList"]["Trips"][i]["Predictions"][j]["Seconds"] > 0) {
						words += "<p>" + schedule["TripList"]["Trips"][i]["Destination"] + " bound: " 
							+ schedule["TripList"]["Trips"][i]["Predictions"][j]["Seconds"] +
							" seconds " + "</p>";
					}
				}
			}
          	window.setContent(this.title + " - " + "<p>" +  words + "</p>");
          	window.open(map, this);		
		});        
	} 	
		
	//add polylines
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
	
	//current location
	
	navigator.geolocation.getCurrentPosition(function (position) {
		success(position);
		var me = new google.maps.LatLng(myLat, myLng);
		var myLocation = new google.maps.Marker({
			position: me,
			map: map,
			title: 'You are here'
		});
		var close = findClosest(position);
		var inMiles = haversine(stations[close][1], stations[close][2])* 0.621371; 
	
		var link = [];
		link.push(me);
		link.push(positions[close]);
	
		var path3 = new google.maps.Polyline({
			path: link,
			geodesic: true, 
			strokeColor: '#3333ff',
			strokeOpacity: 1.0,
			strokeWeight: 2
		});
		path3.setMap(map);
		
		var contentString = '<h1>' + stations[close][0] + '</h1>' +
							'<p>' + inMiles + " miles" + '</p>';
		
		myLocation.addListener('click', function() {
			window.setContent(contentString);
			window.open(map, myLocation);
		});
	});
	
	/*function success(position) {
		myLat = position.coords.latitude;
		myLng = position.coords.longitude;
	}	*/
	function findClosest(position) {
		var min = 0; //index of station in array that is minimum distance
		
		var latOther = stations[0][1];
		var lngOther = stations[0][2];	
			
		var distance = haversine(latOther, lngOther);
		for (var i = 1; i < stations.length; i++) {
			latOther = stations[i][1];
			lngOther = stations[i][2];
			var nextDist = haversine(latOther, lngOther);
			if (nextDist < distance) {
				min = i;
			}
		}
		return min;
	}
	// Haversine Formula implementation found: 
		//http://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript	
	function haversine(la2, ln2) {
		Number.prototype.toRad = function() {
			return this * Math.PI / 180;
		}
		var lat1 = myLat;
		var lng1 = myLng;
		var lat2 = la2;
		var lng2 = ln2;	
		
		var R = 6371;
		var x1 = lat2-lat1; 
		var dLat = x1.toRad();
		var x2 = lng2-lng1;
		var dLon = x2.toRad(); 
		var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
				Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
				Math.sin(dLon/2) * Math.sin(dLon/2);  
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; 
        return d;
    }	
}


