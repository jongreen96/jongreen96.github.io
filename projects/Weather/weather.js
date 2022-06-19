let weatherData;
let locationData;
let backgroundData;

navigator.geolocation.getCurrentPosition(locationSuccess, locationError, {enableHighAccuracy: true, timeout: Infinity, maximumAge: 0});

async function getWeather(loc) {
    try {
        const weatherUrl = 'https://api.openweathermap.org/data/3.0/onecall?';
        const weatherApiKey = '&appid=86ad43d8ec41601957cd2489d3bf7f96';

        const request = `lat=${loc.latitude}&lon=${loc.longitude}&units=metric`;
        const response = await fetch(weatherUrl + request + weatherApiKey);
        if (response.ok) {
            const objRes = await response.json();
            weatherData = objRes;
        } 
    } catch (error) {
        console.log(error);
    }
}

async function getLocation(loc) {
    try {
        const locUrl = 'https://api.geoapify.com/v1/geocode/reverse?';
        const locApiKey = '&apiKey=4794fcae4c60457194a6bfeb5922a0b6';

        const request = `lat=${loc.latitude}&lon=${loc.longitude}&type=postcode&lang=en&limit=1&format=json`;
        const response = await fetch(locUrl + request + locApiKey);
        if (response.ok) {
            const objRes = await response.json();
            locationData = objRes;
        }
    } catch (error) {
        console.log(error);
    }
}

async function getBackground() {
    const bgUrl = 'https://api.unsplash.com/photos/random?';
    const bgApiKey = '&client_id=zjgDz6p-oWB-UxY_WOzIueuVj2pPRngLnzl2XWKr8yM';
    const request = `query=${weatherData.daily[0].weather[0].description}`;

    try {
        const response = await fetch(bgUrl + request + bgApiKey);
        if (response.ok) {
            const objRes = await response.json();
            backgroundData = objRes;
        }
    } catch (error) {
        console.log(error);
    }
}

async function locationSuccess(location) {
    await getWeather(location.coords);
    await getLocation(location.coords);
    await getBackground();
    drawResults(location.coords);
}

function locationError(error) {
    console.log(error);
}

function returnTime(unix) {
    const date = new Date(unix*1000);
    return date.getHours() + ':' + date.getMinutes();
}

function returnHour(unix) {
    const date = new Date(unix*1000);
    return date.getHours();
}

function returnDay(unix) {
    const date = new Date(unix*1000);
    return date.toDateString().slice(0,3);
}

function getDirection(deg) {
    if (deg > 335) return 'N';
    if (deg > 295) return 'NW';
    if (deg > 245) return 'W';
    if (deg > 205) return 'SW';
    if (deg > 155) return 'S';
    if (deg > 115) return 'SE';
    if (deg > 70) return 'E';
    if (deg > 25) return 'NE'
    if (deg > 0) return 'N';
}

function drawResults(loc) {
    // BACKGROUND
    document.querySelector('body').style.backgroundImage = `url('${backgroundData.urls.full}')`;

    // CURRENT
    const currentTemp = document.querySelector('.current-temp');
    const currentDetails = document.querySelector('.current-details');

    // Current temp
    currentTemp.parentNode.parentNode.children[0].innerHTML = locationData.results[0].city;
    currentTemp.children[0].innerHTML = Math.round(weatherData.current.temp*10)/10 + '°c';
    currentTemp.children[1].innerHTML = weatherData.current.weather[0].description;
    currentTemp.children[2].innerHTML = `Low: ${Math.round(weatherData.daily[0].temp.min*10)/10}° High: ${Math.round(weatherData.daily[0].temp.max*10)/10}°`;

    // Current Details
    currentDetails.children[0].innerHTML = `Sunrise-Set: ${returnTime(weatherData.current.sunrise)}-${returnTime(weatherData.current.sunset)}`;
    currentDetails.children[1].innerHTML = `Wind: ${weatherData.current.wind_speed}mph ${getDirection(weatherData.current.wind_deg)}`;
    currentDetails.children[2].innerHTML = `Pressure: ${weatherData.current.pressure} hPa`;
    currentDetails.children[3].innerHTML = `Humidity: ${weatherData.current.humidity}%`;
    currentDetails.children[4].innerHTML = `Visibility: ${weatherData.current.visibility / 1000 * 0.621} miles`;

    // RAIN
    // const rain = document.querySelector('.rain-container');

    // if (weatherData.daily[0].rain == null) {
    //     rain.parentNode.parentNode.style.display = 'none';
    // } else {
    //     for (let i = 0; i < rain.children.length; i++) {
    //         const bar = rain.children[i];    

    //         bar.style.height = weatherData.minutely[i].precipitation+1 + 'px';

    //         if (i === 59) {
    //             bar.style.height = '100px';
    //             bar.style.opacity = '0%';
    //         }
    //     }
    // }

    // HOUR
    const hourly = document.querySelector('.hour-container');

    for (let i = 0; i < hourly.children.length; i++) {
        const hour = hourly.children[i];

        hour.children[0].innerHTML = returnHour(weatherData.hourly[i].dt);
        hour.children[1].src = `http://openweathermap.org/img/wn/${weatherData.hourly[i].weather[0].icon}@2x.png`;
        hour.children[2].innerHTML = Math.round(weatherData.hourly[i].temp*10)/10 + '°';
    }

    // DAILY
    const daily = document.querySelector('.day-container');

    for (let i = 0; i < daily.children.length; i++) {
        const day = daily.children[i];

        day.children[0].innerHTML = returnDay(weatherData.daily[i].dt);
        day.children[1].src = `http://openweathermap.org/img/wn/${weatherData.daily[i].weather[0].icon}@2x.png`;
        day.children[2].innerHTML = '↑' + Math.round(weatherData.daily[i].temp.max*10)/10 + '°';
        day.children[3].innerHTML = '↓' + Math.round(weatherData.daily[i].temp.min*10)/10 + '°';
    }
}