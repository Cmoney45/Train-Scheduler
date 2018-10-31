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
  $(`#add-train`).on('click', event => {
    event.preventDefault();
    $(`#error-message`).remove()
    const errorAlert = $(`<div>`);
    errorAlert.addClass(`alert alert-danger`)
    errorAlert.attr(`id`,`error-message`)
    name = $(`#name`).val().trim();
        if (name === ""){
            errorAlert.html(`Please add a name for the train`)
            $("#name").after(errorAlert);
            return;
        } 
    destination = $(`#destination`).val().trim();
        if (destination === ""){
            errorAlert.html(`Please add a destination for the train`)
            $("#destination").after(errorAlert);
            return;
        } 
    startTime = $(`#time`).val().trim();
    if (startTime === ""){
        errorAlert.html(`Please add a time for the train`)
        $("#time").after(errorAlert);
        return;
    } 
    startTime = moment(startTime, "HH:mm").format("X");
    moment(startTime, "x").subtract(1,"years");
    frequency = $(`#frequency`).val().trim();
        if (frequency === ""){
            errorAlert.html(`Please add a frequency for the train`)
            $("#frequency").after(errorAlert);
            return;
        } 

    database.ref(`/trains`).push({
        name: name,
        destination: destination,
        startTime: startTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    })
})

  database.ref(`/trains`).on("child_added", childSnapshot => {
    const currentTime = moment()
    let trainStarted = childSnapshot.val().startTime
    const frequency = parseInt(childSnapshot.val().frequency)

    while (trainStarted <= currentTime){
        trainStarted = moment(trainStarted, "X").add(frequency,"m");
    }
    const minutesAway = Math.ceil(parseInt(moment(trainStarted,"X").format("X")-moment(currentTime,"X").format("X"))/60)
    $(`#currentTime`).html(`<p>Current Time: ${moment(currentTime).format("hh:mm a")}</p>`)
    // full list of items to the well
    const tableRow = $(`<tr>`);
    tableRow.append(`<td>${childSnapshot.val().name}`)
    tableRow.append(`<td>${childSnapshot.val().destination}`)
    if (frequency === 1){
        tableRow.append(`<td>${frequency.toLocaleString()} min`)
    } else {
    tableRow.append(`<td>${frequency.toLocaleString()} mins`)
    }
    tableRow.append(`<td>${trainStarted.format("hh:mm a")}`)
    if (minutesAway === 1) {
        tableRow.append(`<td class="alert-danger">${minutesAway.toLocaleString()} min`)
    } else {
    tableRow.append(`<td>${minutesAway.toLocaleString()} mins`)
    }

    $(`#trainTable`).append(tableRow)
          
    // Handle the errors
  }, errorObject => {
    console.log("Errors handled: " + errorObject.code);
});