
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBdsBtNWvMfEx89elX-O9FGw6m4xp3vmgY",
    authDomain: "train-scheduler-8c206.firebaseapp.com",
    databaseURL: "https://train-scheduler-8c206.firebaseio.com",
    projectId: "train-scheduler-8c206",
    storageBucket: "train-scheduler-8c206.appspot.com",
    messagingSenderId: "498294711551"
};
firebase.initializeApp(config);
var database = firebase.database()

$("#form").on("submit", function (e) {
    // e.preventDefault()
    database.ref("/trains").push({
        trainName: $("#train-name").val(),
        destination: $("#destination").val(),
        firstTrainTime: $("#first-train-time").val(),
        frequency: $("#frequency").val(),

    })

});


database.ref("/trains").on("child_added", function(childSnapshot){
    console.log(childSnapshot.val().trainName);
    // console.log(trainName);
    
    



 // Store everything coming from firebase database in variables
 var trainName = childSnapshot.val().trainName
 var destination = childSnapshot.val().destination
 var frequency = childSnapshot.val().frequency
 var firstTrainTime = childSnapshot.val().firstTrainTime

 // splits user inputed first time 09:40 to ["09", "40"]
 var timeArr = firstTrainTime.split(":")

 // Use the array to make a actual moment() and store in trainTime
 var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1])

 // maxMoment will now be either the current time or the first train arrival of the day. Whichever is further out
 var maxMoment = moment.max(moment(), trainTime)

 // If the first train has not come yet maxMoment is equal to trainTime (First train of the day) otherwise it is equal to the current moment
 if (maxMoment === trainTime) {

   // Format train arrival to be readable
   var tArrival = trainTime.format("hh:mm A");

   // Use trainTime and current moment() to calculate minutes unitl next arrival
   var tMinutes = trainTime.diff(moment(), "minutes");

 } else {

   // differenceTimes is how long it has passed since first train of day
   var differenceTimes = moment().diff(trainTime, "minutes");

   // tRemainder is the left over of taking the diffferenceTimes and modulus frequency.
   var tRemainder = differenceTimes % frequency;

   // tMinutes takes the frequency and - the remainder. This number is always less than frequency
   var tMinutes = frequency - tRemainder;

   // Next arrival is the current time plus the tMinutes
   var tArrival = moment().add(tMinutes, "m").format("hh:mm A");
 };

 // After completing calculations make a new table row
 var newRow =

 "<tr><td>"
 + trainName
 + "</td><td>"
 + destination
 + "</td><td>"
 + trainTime.format("hh:mm A")
 + "</td><td>"
 + frequency
 + "</td><td>"
 + tArrival
 + "</td><td>"
 + tMinutes
 + "</td></tr>"

 //After each row is completed append to the .table class
 $('.table').append(newRow)
});