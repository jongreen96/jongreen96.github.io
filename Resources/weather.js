const weatherUrl = 'https://api.openweathermap.org/data/3.0/onecall?';
const locUrl = 'https://api.geoapify.com/v1/geocode/reverse?';
const weatherApiKey = '&appid=86ad43d8ec41601957cd2489d3bf7f96';
const locApiKey = '&apiKey=4794fcae4c60457194a6bfeb5922a0b6'

let weatherObj;
let locObj;

navigator.geolocation.getCurrentPosition(locationSuccess, locationError, {enableHighAccuracy: true, timeout: Infinity, maximumAge: 0});

async function getWeather(loc) {
    try {
        const request = `lat=${loc.latitude}&lon=${loc.longitude}&units=metric`;
        const response = await fetch(weatherUrl + request + weatherApiKey);
        if (response.ok) {
            const objRes = await response.json();
            console.log(objRes);
            weatherObj = objRes;
        } 
    } catch (error) {
        console.log(error);
    }
}

async function getLocation(loc) {
    try {
        const request = `lat=${loc.latitude}&lon=${loc.longitude}&type=postcode&lang=en&limit=1&format=json`;
        const response = await fetch(locUrl + request + locApiKey);
        if (response.ok) {
            const objRes = await response.json();
            console.log(objRes);
            locObj = objRes;
            drawResults(loc);
        }
    } catch (error) {
        console.log(error);
    }
}

function locationSuccess(location) {
    getWeather(location.coords);
    getLocation(location.coords);
}

function locationError(error) {
    console.log(error);
}

const loc = document.getElementById('loc');
const temp = document.getElementById('temp');
const feelsLike = document.getElementById('feels-like');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');

// loc.innerHTML = locObj.results[0].city;
function drawResults(location) {
    loc.innerHTML = locObj.results[0].city + '  ' + location.latitude + '  ' + location.longitude;
    temp.innerHTML = weatherObj.current.temp + '°c';
    feelsLike.innerHTML = weatherObj.current.feels_like + '°c';
    sunrise.innerHTML = weatherObj.current.sunrise;
    sunset.innerHTML = weatherObj.current.sunset;
}
