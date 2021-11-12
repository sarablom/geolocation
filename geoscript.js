const result = document.querySelector(".result");
const distance = document.querySelector(".distance");
const posBtn = document.querySelector(".pos-btn");
const watchBtn = document.querySelector(".watch-btn");
const stopBtn = document.querySelector(".stop-btn");

let watchID;

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition((pos) => {
    let latitude = pos.coords.latitude;
    let longitude = pos.coords.longitude;
    watchBtn.classList.remove("hide");
    stopBtn.classList.remove("hide");

    posBtn.addEventListener("click", () => {
      loadData();
    });

    watchBtn.addEventListener("click", getLocationUpdate());

    stopBtn.addEventListener("click", () => {
      navigator.geolocation.clearWatch(watchID);
    });

    const loadData = async () => {
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
    };

    function getLocationUpdate() {
      function success(pos) {
        let latitude = pos.coords.latitude;
        let longitude = pos.coords.longitude;
        let timestamp = pos.timestamp;
        timestamp = new Date(timestamp);
        distance.innerHTML += `<li>${latitude}, ${longitude} at ${timestamp}</li>`
      }

      function errorHandler(err) {
        if(err.code === 1) {
          result.innerHTML = "Error: Access is denied!";
       } else if( err.code === 2) {
          result.innerHTML = "Error: Position is unavailable!";
       }
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 60000,
      };

      watchID = navigator.geolocation.watchPosition(
        success,
        errorHandler,
        options
      );
      
    }
  });
} else {
  console.log("No location");
  result.innerHTML = "Couldn´t determine your location";
}

