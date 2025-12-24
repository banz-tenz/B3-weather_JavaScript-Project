const apiKey = "629abb62b1ae5affbd864eba93b24a22";

// ---------- Temperature Convert ----------
function convertToFahrenheit(celsius) {
    return Math.round((celsius * 9 / 5) + 32);
}

function convertToCelsius(fahrenheit) {
    return Math.round((fahrenheit - 32) * 5 / 9);
}

// ---------- Fetch Weather ----------
function weatherDataDisplay() {
    const inputCity = document.getElementById("city-name-search");
    const city = inputCity.value;

    if (!city) return alert("Please enter a city name");

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("City not found");
            return response.json();
        })
        .then(data => {
            displayWeatherData(data);
        })
        .catch(error => {
            alert(error.message);
        });
}


let tempC = 0;
let feelsLikeC = 0;

function displayWeatherData(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;

    tempC = Math.round(data.main.temp);
    feelsLikeC = Math.round(data.main.feels_like);

    currentTemp.textContent = `${tempC} °C`;
    feelsLike.textContent = `${feelsLikeC} °C`;

    const weather = data.weather[0].main;
    weatherCondition.textContent = weather;

    if (weather === "Clouds") {
        weatherIcon.src = "asset/images/icons-weather/cloudy.png";
    } else if (weather === "Clear") {
        weatherIcon.src = "asset/images/icons-weather/sun.png";
    } else if (weather === "Rain") {
        weatherIcon.src = "asset/images/icons-weather/weather.png";
    } else if (weather === "Snow") {
        weatherIcon.src = "asset/images/icons-weather/weather.png";
    }

    windSpeed.textContent = `${data.wind.speed} m/s`;
    humidity.textContent = `${data.main.humidity} %`;
    pressure.textContent = `${data.main.pressure} hPa`;
}

// ---------- DOM ----------
const cityName = document.getElementById("city-name");
const currentTemp = document.getElementById("current-temp");
const weatherCondition = document.getElementById("weather-condiction");
const weatherIcon = document.getElementById("weather-icon");
const windSpeed = document.getElementById("wind-speed");
const humidity = document.getElementById("humidity");
const feelsLike = document.getElementById("feels-like");
const pressure = document.getElementById("pressure");
const toFahrenheit = document.getElementById("toFarinhiet");

const searchCity = document.getElementById("search-city");

// ---------- Events ----------
searchCity.addEventListener("submit", (e) => {
    e.preventDefault();
    weatherDataDisplay();
});

// Celsius ⇄ Fahrenheit toggle
toFahrenheit.addEventListener("change", () => {
    if (toFahrenheit.checked) {
        currentTemp.textContent = `${convertToFahrenheit(tempC)} °F`;
        feelsLike.textContent = `${convertToFahrenheit(feelsLikeC)} °F`;
    } else {
        currentTemp.textContent = `${tempC} °C`;
        feelsLike.textContent = `${feelsLikeC} °C`;
    }
});
