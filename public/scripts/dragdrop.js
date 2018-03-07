function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    console.log(ev);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    var timestamp =document.getElementById(data).getAttribute('value');
    var newStatus = document.getElementById(data).parentElement.id;
    // redirect to feed information to the server
	window.location.replace("/pastgoals?ts=" + timestamp + "&status=" + newStatus);
}
