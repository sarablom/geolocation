const result = document.querySelector(".result");
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
      try {
        const res = await fetch(
          `https://geocode.xyz/${latitude},${longitude}?geoit=json&auth=851811454107780777374x81512`
        );
        let data = await res.json();
        if (data.error) {
          result.innerHTML = "Cannot get location" + data.error.message;
        }
        console.log(data);
        const htmlString = `Your coordinates are latitude ${latitude}, longitude ${longitude} and your address is ${data.staddress} in ${data.city}, ${data.country}.
                `;
        result.innerHTML = htmlString;
      } catch (err) {
        console.log("Error fetching");
        result.innerHTML = "Cannot get location" + err.message;
      }
    };

    function getLocationUpdate() {
      function success() {
        let latitude = pos.coords.latitude;
        let longitude = pos.coords.longitude;
        console.log(latitude, longitude);
      }

      function errorHandler() {
        result.innerHTML = "Couldn´t determine your location";
      }

      const options = {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 10000,
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

// if ("geolocation" in navigator) {

//     const watchID = navigator.geolocation.watchPosition(success, error, options);

//     watchBtn.addEventListener("click", () => {
//       console.log(watchID);
//     })
// }
