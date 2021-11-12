const result = document.querySelector(".result");
const distance = document.querySelector(".distance");
const posBtn = document.querySelector(".pos-btn");
const watchBtn = document.querySelector(".watch-btn");
const stopBtn = document.querySelector(".stop-btn");

let watchID;
let latitude;
let longitude;
let pos;
let timestamp;

posBtn.addEventListener("click", loadData);
watchBtn.addEventListener("click", getLocationUpdate);
stopBtn.addEventListener("click", stopRecording);

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition((pos) => {
    pos = pos;
    timestamp = pos.timestamp;
    latitude = pos.coords.latitude;
    longitude = pos.coords.longitude;
    watchBtn.classList.remove("hide");
    stopBtn.classList.remove("hide");
  });
} else {
  console.log("No location");
  result.innerHTML = "Couldn´t determine your location";
}

async function loadData() {
  //Fetching the address via API
  try {
    const res = await fetch(
      `https://geocode.xyz/${latitude},${longitude}?geoit=json&auth=851811454107780777374x81512`
    );
    let data = await res.json();
    if (data.error) {
      result.innerHTML = "Cannot get location " + data.error.message;
    }
    console.log(data);
    const htmlString = `Your coordinates are latitude ${latitude}, longitude ${longitude} and your address is ${data.staddress} in ${data.city}, ${data.country}.
                `;
    result.innerHTML = htmlString;
  } catch (err) {
    result.innerHTML = "Cannot get location" + err.message;
  }
}

function getLocationUpdate() {
  distance.innerHTML = "";

  function success(pos) {
    latitude = pos.coords.latitude;
    longitude = pos.coords.longitude;
  }

  function errorHandler(err) {
    if (err.code === 1) {
      result.innerHTML = "Error: Access is denied!";
    } else if (err.code === 2) {
      result.innerHTML = "Error: Position is unavailable!";
    }
  }

  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
  };

  watchID = navigator.geolocation.watchPosition(success, errorHandler, options);
}

function stopRecording() {
  navigator.geolocation.clearWatch(watchID);
  timestamp = new Date(timestamp);
  distance.innerHTML += `<li>${latitude}, ${longitude} at ${timestamp}</li>`;
}


