const result = document.querySelector(".result");
const distance = document.querySelector(".distance");
const posBtn = document.querySelector(".pos-btn");
const watchBtn = document.querySelector(".watch-btn");
const stopBtn = document.querySelector(".stop-btn");
const distanceBtn = document.querySelector(".distance-btn");

let watchID;
let latitude;
let longitude;
let pos;
let timestamp;
let time;
let posArray = [];

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
    //timestamp = timestamp.getDate() + timestamp.getMonth()
    timestamp = new Date(timestamp);
    time = timestamp.toLocaleString();
    posArray.push({
      lat: pos.coords.latitude,
      lon: pos.coords.longitude,
      time: time
    });
    console.log(posArray);
 
    let htmlString = '';
    htmlString = posArray
    .map((position) => {
      return `<li className="listItem">Latitude: ${position.lat}, Longitude: ${position.lon} at ${position.time}</li>`;
    }).join();
    
    htmlString.replace('"','');
      
    distance.innerHTML = htmlString;
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
    timeout: 5000,
    maximumAge: 0,
  };

  watchID = navigator.geolocation.watchPosition(success, errorHandler, options);
}

function stopRecording() {
  navigator.geolocation.clearWatch(watchID);
  distance.classList.remove("hide");
  distanceBtn.classList.remove("hide");
}

function calculateDistance() {
  let lat1 = 57.6870068;
  let lat2 = 57.6963043;
  let lon1 = 11.9182804;
  let lon2 = 11.9355128;
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres
  console.log(Math.round(d));

  //const just = posArray.forEach((pos) => {});
}

distanceBtn.addEventListener("click", calculateDistance);
