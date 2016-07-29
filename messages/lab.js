// Your JavaScript goes here...

function parse()
{
	var doc = new XMLHttpRequest();
	
	doc.open("GET", "data.json", true);
	//doc.open("GET",  "https://messagehub.herokuapp.com/messages.json", true);
	
	doc.onreadystatechange = callback;
	
	doc.send(null);
	
	function callback()
	{
		if (doc.readyState == 4 && doc.status == 200) {
			var data = doc.responseText;
			var parsed = JSON.parse(data);
			var msg = ""
      
      		var old = document.getElementById("messages");
      		for (var i = 0; i < parsed.length; i++) {
      			//msg = '<p>' + parsed[i].content + " -" + parsed[i].username + '</p>';
      			msg = '<p>' + parsed[i].content + " " + '<span id = "smaller">' + parsed[i].username + '</span>'  + '</p>';
      			old.innerHTML += msg;
      		}
		}
	
		else if (doc.readyState == 4 && doc.status != 200) {
			document.getElementById("messages").innerHTML = "<p>Fail</p>";
		}
	}
}