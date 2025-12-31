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

    const urlcurrentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const urlForecastTime = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(urlcurrentWeather)
        .then((response) => {
            if (!response.ok) alert("city not found");
            return response.json();
        })
        .then((data) => {
            displayWeatherData(data);
        })



    fetch(urlForecastTime)
        .then(res => {
            return res.json()
        })
        .then(data => {
            displayTimebaseData(data.list)
            return data.list
        })
        .then(dataDate => {
            // console.log(dataDate)
            hourlyDisplayWeather(dataDate);
            daysForecast(dataDate);
        });
}

function daysForecast(list) {

    daysForecastTable.innerHTML = "";

    const dates = {};

    list.forEach(item => {
        const date = new Date(item.dt_txt);
        const dateStr = date.toISOString().split('T')[0];

        if (!dates[dateStr]) {

            dates[dateStr] = item;
        }
    });


    const dailyForecastArray = Object.values(dates);

    dailyForecastArray.forEach(forecast => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${new Date(forecast.dt_txt).toLocaleDateString('en-US', { weekday: 'long' })}</td>
            <td>${forecast.main.temp.toFixed(1)} °C</td>
            <td>${forecast.main.feels_like.toFixed(1)} °C</td>
            <td>${forecast.weather[0].main}</td>
            <td>${forecast.main.humidity} %</td>
        `;

        daysForecastTable.appendChild(row);
    });
}


function hourlyDisplayWeather(list) {
    const today = new Date().getDate();
    hourlyTable.innerHTML = "";

    list.forEach(item => {
        const date = new Date(item.dt_txt);
        const dateDay = date.getDate();

        if (today !== dateDay) {
            return;
        } else {
            const hour = date.getHours();
            const temp = Math.round(item.main.temp);
            const feels_like = Math.round(item.main.feels_like);
            const weatherCondition = item.weather[0].main;
            const humidity = item.main.humidity;
            hourlyTable.innerHTML += `
            <tr>
                <td>${hour} : 00</td>
                <td>${item ? temp : "N/A"} °C</td>
                <td>${item ? feels_like : "N/A"} °C</td>
                <td>${item ? weatherCondition : "N/A"}</td>
                <td>${item ? humidity : "N/A"} %</td>
                
            </tr>
        `;

        }

    })
}

function displayTimebaseData(list) {
    const today = new Date().getDate();
    weatherTable.innerHTML = ""; // clear table first

    const times = {
        Morning: null,
        Afternoon: null,
        Evening: null,
        Night: null,
    };

    // 1️ Collect data
    list.forEach(item => {
        const date = new Date(item.dt_txt);
        const hour = date.getHours();

        if (date.getDate() !== today) return;

        if (hour >= 6 && hour < 12 && !times.Morning) {
            times.Morning = item;
        } else if (hour >= 12 && hour < 18 && !times.Afternoon) {
            times.Afternoon = item;
        } else if (hour >= 18 && hour < 21 && !times.Evening) {
            times.Evening = item;
        } else if (!times.Night) {
            times.Night = item;
        }
    });

    // 2️ Render table rows
    for (let time in times) {
        const data = times[time];

        weatherTable.innerHTML += `
            <tr>
                <td>${time}</td>
                <td>${data ? Math.round(data.main.temp) : "N/A"} °C</td>
                <td>${data ? Math.round(data.main.feels_like) : "N/A"} °C</td>
                <td>${data ? data.weather[0].main : "N/A"}</td>
                <td>${data ? data.main.humidity : "N/A"} %</td>
                
            </tr>
        `;
    }
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
    updateFavoriteButtonState(cityName.textContent);
}

function getCityOnly(cityText) {
    if (!cityText) return "";
    return String(cityText).split(",")[0].trim();
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
const weatherTable = document.getElementById("weather-table");
const hourlyTable = document.getElementById("hourly-table-data");
const daysForecastTable = document.getElementById("days-forecast-table");
const overLay = document.getElementById("overlay");
const mobileMenu = document.getElementById("mobileMenu");
const navBar = document.getElementById("nav-bar");
const mainContent = document.getElementById("main-content");
const concelMenu  = document.getElementById("concel-menu");

const currentWeather = document.getElementById("current-weather");
const hourlyWeather = document.getElementById("hourly-weather");
const daysForecastWeather = document.getElementById("days-forecast-weather");

function loading(time) {
    overLay.classList.add("loading");

    setTimeout(() => {
        overLay.classList.remove("loading");
    }, time);
}

const listLinks = document.querySelectorAll("li a");
listLinks.forEach(link => {
    // link.classList.remove("active");
    link.addEventListener("click", () => {

        listLinks.forEach(item => {
            item.classList.remove("active");
        });

        link.classList.add("active");

        loading(1000);

        if (link.getAttribute("data-section") === 'today') {
            currentWeather.style.display = 'block';
            hourlyWeather.style.display = 'none';
            daysForecastWeather.style.display = 'none';
        } else if (link.getAttribute("data-section") === 'hourly') {
            currentWeather.style.display = 'none';
            hourlyWeather.style.display = 'block';
            daysForecastWeather.style.display = 'none';
        }
        else if (link.getAttribute("data-section") === 'days-forecast') {
            currentWeather.style.display = 'none';
            hourlyWeather.style.display = 'none';
            daysForecastWeather.style.display = 'block';
        }
    })
})

const searchCity = document.getElementById("search-city");

// ---------- Events ----------
searchCity.addEventListener("submit", (e) => {

    e.preventDefault();
    weatherDataDisplay();
    loading(600);
});

mobileMenu.addEventListener("click", ()=>{
    navBar.classList.toggle("active");
    mainContent.classList.toggle("active");
});

concelMenu.addEventListener("click", ()=>{
    navBar.classList.remove("active");
    mainContent.classList.remove("active");
})

// Auto-load city from URL (e.g. coming from favorites.html)
document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const cityParam = params.get('city');
    if (!cityParam) return;
    // Ensure Today section is visible when coming from favorites
    const todayLink = document.querySelector("a[data-section='today']");
    if (todayLink) {
        listLinks.forEach(item => item.classList.remove("active"));
        todayLink.classList.add("active");
    }

    if (currentWeather) currentWeather.style.display = 'block';
    if (hourlyWeather) hourlyWeather.style.display = 'none';
    if (daysForecastWeather) daysForecastWeather.style.display = 'none';
    const inputCity = document.getElementById("city-name-search");
    if (!inputCity) return;

    inputCity.value = cityParam;
    weatherDataDisplay();
    loading(600);
});

toFahrenheit.addEventListener("change", () => {
    if (toFahrenheit.checked && (tempC && feelsLikeC !== 0)) {
        currentTemp.textContent = `${convertToFahrenheit(tempC)} °F`;
        feelsLike.textContent = `${convertToFahrenheit(feelsLikeC)} °F`;
    } else if (tempC && feelsLikeC !== 0) {
        currentTemp.textContent = `${tempC} °C`;
        feelsLike.textContent = `${feelsLikeC} °C`;
    }
});
// User authentication & Favorites
document.addEventListener('DOMContentLoaded', function () {
    const userNameDisplay = document.getElementById('userNameDisplay');
    const displayUserName = document.getElementById('displayUserName');
    const signupBtn = document.getElementById('signup-button');
    const loginBtn = document.getElementById('login-button');
    const logoutBtn = document.getElementById('logoutBtn');
    const addFavoriteBtn = document.getElementById('add-to-favorite');
    const favoritesBtn = document.getElementById('favoritesBtn');

    // Check if user is logged in
    const weatherAppUser = localStorage.getItem('weatherAppUser');

    if (weatherAppUser) {
        try {
            const user = JSON.parse(weatherAppUser);
            // Show user info and hide login button

            displayUserName.textContent = user.name || user.fullname || 'User';
            userNameDisplay.style.display = 'inline-block';
            signupBtn.style.display = 'none';
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'inline-block';
            favoritesBtn.style.display = 'inline-block';
            // Show favorite button when logged in
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    } else {
        // Show login button and hide logout
        userNameDisplay.style.display = 'none';
        signupBtn.style.display = 'inline-block';
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        favoritesBtn.style.display = 'none';
        // Hide favorite button when not logged in
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('weatherAppUser');
            userNameDisplay.style.display = 'none';
            signupBtn.style.display = 'inline-block';
            loginBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
            favoritesBtn.style.display = 'none';
            // Redirect to login page
            window.location.href = '../index.html';
        });
    }

    // Favorite button functionality
    if (addFavoriteBtn) {
        addFavoriteBtn.addEventListener('click', function () {
            const cityName = document.getElementById('city-name').textContent;
            if (cityName && cityName !== 'Loading') {
                addToFavorites(cityName);
            } else {
                alert('Please search for a city first');
            }
        });
    }
});

// Add city to favorites
function addToFavorites(city) {
    const cityOnly = getCityOnly(city);
    let favorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];

    if (!favorites.includes(cityOnly)) {
        favorites.push(cityOnly);
        localStorage.setItem('favoriteCities', JSON.stringify(favorites));
        updateFavoriteButtonState(cityOnly);
    } else {
        favorites = favorites.filter(c => c !== cityOnly);
        localStorage.setItem('favoriteCities', JSON.stringify(favorites));
        updateFavoriteButtonState(cityOnly);
    }
}

// Update favorite button appearance
function updateFavoriteButtonState(city) {
    const addFavoriteBtn = document.getElementById('add-to-favorite');
    let favorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];
    const cityOnly = getCityOnly(city);

    if (favorites.includes(cityOnly)) {
        addFavoriteBtn.classList.add('favorite-active');
        addFavoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Remove from favorite';
        addFavoriteBtn.style.background = '#ff6b6b';
        addFavoriteBtn.style.borderColor = '#ff6b6b';
        addFavoriteBtn.style.color = 'white';
    } else {
        addFavoriteBtn.classList.remove('favorite-active');
        addFavoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Add to favorite';
        addFavoriteBtn.style.background = 'transparent';
        addFavoriteBtn.style.borderColor = '#ffc107';
        addFavoriteBtn.style.color = '#ffc107';
    }
}