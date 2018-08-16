// Initialize Firebase
const config = {
apiKey: "AIzaSyArHbJaBKPEItV47UsCeMciE_M_lzFxo-4",
authDomain: "cas-train-scheduler.firebaseapp.com",
databaseURL: "https://cas-train-scheduler.firebaseio.com",
projectId: "cas-train-scheduler",
storageBucket: "cas-train-scheduler.appspot.com",
messagingSenderId: "640751313778"
};

// Initialize database
firebase.initializeApp(config);

// Creat var for database to easily reference

let database = firebase.database();

// Create base names
let name = "";
let destination = "";
let startTime = 0;
let frequency = 0;


// Create on click event
  $(`#add-train`).on('click', function(event){
      event.preventDefault();

      name = $(`#name`).val().trim();
      destination = $(`#destination`).val().trim();
      startTime = $(`#time`).val().trim();
      startTime = moment(startTime, "HH:mm").format("x");
      moment(startTime, "x").subtract(1,"years");
      frequency = $(`#frequency`).val().trim();

      database.ref(`/trains`).push({
          name: name,
          destination: destination,
          startTime: startTime,
          frequency: frequency,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
      })
  })

  database.ref(`/trains`).on("child_added", function(childSnapshot) {
    const frequency = childSnapshot.val().frequency
    const minutesUntilArrival = Math.floor(frequency - (moment().format("mm")%frequency))

    // full list of items to the well
    const tableRow = $(`<tr>`);
    tableRow.append(`<td>${childSnapshot.val().name}`)
    tableRow.append(`<td>${childSnapshot.val().destination}`)
    tableRow.append(`<td>${frequency.toLocaleString()} mins`)
    tableRow.append(`<td>${moment(moment().add(minutesUntilArrival, `minutes`)).format("hh:mm a")}`)
    tableRow.append(`<td>${minutesUntilArrival.toLocaleString()} mins`)


    $(`#employeeTable`).append(tableRow)
          
    // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});