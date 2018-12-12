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

function updateTime() {
    currentDate = moment();
    currentTime.html(currentDate.format("HH:mm:ss"));
}

$(document).ready(function () {
    currentTime = $("#time");
    setInterval(updateTime, 100);
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

var reset = setInterval(function () {
    $("#trainData").html("");
    database.ref().on("child_added", function time(snapshot) {  
        var snapshot = snapshot.val();
        var firstConverted = moment(snapshot.first, "HH:mm");
        if (snapshot.first > moment().format("HH:mm")) {
            var firstTrainMinutes = moment(firstConverted).diff(moment(), "minutes");
            if (firstTrainMinutes >= 60) {
                firstTrainMinutes = moment(firstConverted).fromNow(true);

                $("#trainData").append("<tr><td>" + snapshot.name + "</td><td>" + snapshot.destination + "</td><td>" + snapshot.frequency + "</td><td>" + snapshot.first + "</td><td>~" + firstTrainMinutes + "</td></tr>");
            } else {
                $("#trainData").append("<tr><td>" + snapshot.name + "</td><td>" + snapshot.destination + "</td><td>" + snapshot.frequency + "</td><td>" + snapshot.first + "</td><td>" + firstTrainMinutes + "</td></tr>");
            }
        } else {
            var timeDiff = moment(currentDate).diff(moment(firstConverted), "minutes");
            var remaining = timeDiff % snapshot.frequency;
            var minutesLeft = snapshot.frequency - remaining;
            var nextTrain = moment(currentDate).add(minutesLeft, "minutes");

            $("#trainData").append("<tr><td>" + snapshot.name + "</td><td>" + snapshot.destination + "</td><td>" + snapshot.frequency + "</td><td>" + nextTrain.format("HH:mm") + "</td><td>" + minutesLeft + "</td></tr>");
        }
    })
})
