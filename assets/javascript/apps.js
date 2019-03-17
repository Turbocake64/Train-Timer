// Initialize Firebase
var config = {
   // api Key needed to access firebase
   apiKey: "AIzaSyAS324TOf56bNWK7AZjmVRvQa7WOnx5i44",
   // the domain or name of the database created
   authDomain: "employee-data-management-2a7f6.firebaseapp.com",
   // the url to the database
   databaseURL: "https://employee-data-management-2a7f6.firebaseio.com",
   // the ID for the database
   projectId: "employee-data-management-2a7f6",
   // it seems that storage buckets are the name for where your data is stored
   storageBucket: "employee-data-management-2a7f6.appspot.com",
   // I believe this is the ID used to access the database
   messagingSenderId: "1085767085116"
};


// This configures the firebase that we just initialized?
firebase.initializeApp(config);

// this defines the database as firebase.database(). So the database is a function of firebase?
let db = firebase.database();

$("#sumbit-button").on('click', function (event) {
   event.preventDefault()


   let name = $("#inputTrainName").val()
   console.log("Train Name: " + name)
   let destination = $("#inputDestination").val()
   console.log("Destination: " + destination)
   let firstTrainTime = $("#inputFirstTrainTime").val()
   console.log("First Train Time: " + firstTrainTime)
   let frequency = $("#inputFrequency").val()
   console.log("Frequency: " + frequency)
   let firstTrainTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
   console.log(firstTrainTimeConverted);
   let currentTime = moment();
   console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
   let diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
   console.log("DIFFERENCE IN TIME: " + diffTime);
   let remainder = diffTime % frequency;
   console.log("Time SINCE LAST TRAIN: " + remainder + " minutes");
   // Minutes to Next Train
   let minutesTillTrain = frequency - remainder;
   console.log("MINUTES TILL TRAIN: " + minutesTillTrain);
    // Next Train
   let nextTrain = moment().add(minutesTillTrain, "minutes");
   console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    db.ref().push({
        "name": name,
        "destination": destination,
        "firstTrain": firstTrainTime,
        "frequency": frequency,
        "nextArrival": nextTrain,
        "minutesTillTrain": minutesTillTrain,
 
    })


})

let buildRow = function (name, destination, frequency, nextTrain, minutesTillTrain) {
   let row = $("<tr>")
   let emTrainName = $("<td>").text(name)
   let emDestination = $("<td>").text(destination)
   let emFrequency = $("<td>").text("Every " + frequency + " minutes")
   let emNextTrain = $("<td>").text(nextTrain)
   let emMinutesTillTrain = $("<td>").text(minutesTillTrain)
   row.append(emTrainName, emDestination, emFrequency, emNextTrain)
   $("#table-body").append(row)
}

db.ref().on('child_added', (snapshot) => {
   let val = snapshot.val()
   buildRow(val.name, val.destination, val.frequency, val.nextTrain)
})

//Originally added to buildRow: , val.monthlyRate, val.totalBilled