function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev, reward) {
    console.log(reward, ev)
    ev.dataTransfer.setData("text", ev.target.id + ";" + reward);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text").split(';');
    ev.target.appendChild(document.getElementById(data[0]));
    var timestamp =document.getElementById(data).getAttribute('value');
    var newStatus = document.getElementById(data).parentElement.id;
    // redirect to feed information to the server
	window.location.replace("/pastgoals?ts=" + timestamp + "&status=" + newStatus);
    document.getElementById(data[0]).innerHTML="<p>Reward: " + data[1] + "</p>"
}
