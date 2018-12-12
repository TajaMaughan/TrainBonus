// Initialize Firebase
var config = {
    apiKey: "AIzaSyCgHWAIPcV0aFmwXltWNAwEohUZ7EIA-pU",
    authDomain: "trainschedule-cfea1.firebaseapp.com",
    databaseURL: "https://trainschedule-cfea1.firebaseio.com",
    projectId: "trainschedule-cfea1",
    storageBucket: "trainschedule-cfea1.appspot.com",
    messagingSenderId: "512685090527"
};
firebase.initializeApp(config);

var database = firebase.database();
var name = "";
var destination = "";
var first = "";
var frequency = "";
var currentDate;
var currentTime;

function update() {
    currentDate = moment();
    currentTime.html(currentDate.format("HH:mm:ss"));
}

$(document).ready(function () {
    currentTime = $("#time");
    setInterval(update, 100);
})

$("#addTrain").on("click", function (event) {
    event.preventDefault();
    name = $("#nameValue").val().trim();
    destination = $("#destinationValue").val().trim();
    first = $("#firstValue").val().trim();
    frequency = $("#frequencyValue").val().trim();

    $("#nameValue").val("");
    $("#destinationValue").val("");
    $("#firstValue").val("");
    $("#frequencyValue").val("");



    database.ref().push({
        name: name,
        destination: destination,
        first: first,
        frequency: frequency,
    })
})

database.ref().on("child_added", function (snapshot) {
    var sv = snapshot.val();

    console.log(sv.name);
    console.log(sv.destination);
    console.log(sv.first);
    console.log(sv.frequency);

    var firstConverted = moment(sv.first, "HH:mm").subtract(1, "years");
    console.log(firstConverted);
    var timeDiff = moment(currentDate).diff(moment(firstConverted), "minutes");
    console.log("difference: " + timeDiff)
    var remaining = timeDiff % sv.frequency;
    console.log(remaining);
    var minutesLeft = sv.frequency - remaining;
    console.log(minutesLeft)
    var nextTrain = moment(currentDate).add(minutesLeft, "minutes");
    console.log(nextTrain);

    $("#trainData").append("<tr><td>" + sv.name + "</td><td>" + sv.destination + "</td><td>" + sv.frequency + "</td><td>" + nextTrain.format("HH:mm") + "</td><td>" + minutesLeft + "</td></tr>");
})
