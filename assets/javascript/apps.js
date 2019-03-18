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

   // converts the train name submitted into a vlue to be passed into firebase
   let name = $("#inputTrainName").val()
   console.log("Train Name: " + name)

   // converts the destination submitted into a value to be passed into firebase
   let destination = $("#inputDestination").val()
   console.log("Destination: " + destination)

   // converts the first train time submitted into a value to be passed into firebase
   let firstTrainTime = $("#inputFirstTrainTime").val()
   console.log("First Train Time: " + firstTrainTime)

   // converts the frequency in minutes of a train submitted into a value to be passed into firebase
   let frequency = $("#inputFrequency").val()
   console.log("Frequency: " + frequency)

   // defines a variable equal to the first train time minus one year displayed in minutes
   let firstTrainTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
   console.log(firstTrainTimeConverted);

   // displays the current time in a 24 hour Hour:Minute format
   let currentTime = moment();
   console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

   // declares a variable equal to the time of submission in minutes minus the firsTrainTimeConverted
   let diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
   console.log("DIFFERENCE IN TIME: " + diffTime);

   // finds the remainder of the previously declared variable divided by frequency to see how many minutes have passed since the last train
   let remainder = diffTime % frequency;
   console.log("Time SINCE LAST TRAIN: " + remainder + " minutes");
   // Minutes to Next Train
   let minutesTillTrain = frequency - remainder;
   console.log("MINUTES TILL TRAIN: " + minutesTillTrain);
    // Next Train
   let nextTrain = moment().add(minutesTillTrain, "minutes");
   console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

   // this pushes the variables declared above into the firebase database.
   // full disclosure, some of the documentation such as db or => are things I copied from Emile in the employee assignment.
    db.ref().push({
        //pushes the train name under the variable name "name"
        "name": name,
        //pushes the destination name under the variable name "destination"
        "destination": destination,
        //pushes the first train time under the variable name "firstTrain"
        "firstTrain": firstTrainTime,
        //pushes the train frequency under the variable name "frequency"
        "frequency": frequency,
        //pushes the next train time in HH:MM under the variable name "nextArrival"
        //THIS IS CONFUSING THE DATABASE AND REJECTING THE ENTIRE PUSH. Why?
        "nextArrival": moment(nextTrain).format("hh:mm"),
        //pushes the number of minutes until the next train under the variable name "minutesTillTrain"
        "minutesTillTrain": minutesTillTrain,
 
    })


})

let buildRow = function (name, destination, frequency, nextTrain, minutesTillTrain) {
   let row = $("<tr>")
   let emTrainName = $("<td>").text(name)
   let emDestination = $("<td>").text(destination)
   let emFrequency = $("<td>").text("Every " + frequency + " minutes")
   let emNextTrain = $("<td>").text(nextTrain)
   let emMinutesTillTrain = $("<td>").text(moment(nextTrain).format("hh:mm"))
   row.append(emTrainName, emDestination, emFrequency, emNextTrain, emMinutesTillTrain)
   $("#table-body").append(row)
}

db.ref().on('child_added', (snapshot) => {
   let val = snapshot.val()
   buildRow(val.name, val.destination, val.frequency, val.nextTrain)
})

//Originally added to buildRow: , val.monthlyRate, val.totalBilled