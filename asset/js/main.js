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
        .then(response => {
            if (!response.ok) alert("city not found");
            return response.json();
        })
        .then(data => {
            displayWeatherData(data);
        })

    
    fetch(urlForecastTime)
        .then(res =>{
            return res.json()
        })
        .then(data => {
            displayTimebaseData(data.list)
            return data.list
        })
        .then(dataDate =>{
            console.log(dataDate)
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

    // 1️⃣ Collect data
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

    // 2️⃣ Render table rows
    for (let time in times) {
        const data = times[time];

        weatherTable.innerHTML += `
            <tr>
                <td>${time}</td>
                <td>${data ? Math.round(data.main.temp) : "N/A"} °C</td>
                <td>${data ? Math.round(data.main.feels_like) : "N/A"} °C</td>
                <td>${data ? data.main.humidity : "N/A"} %</td>
                <td>${data ? data.weather[0].description : "N/A"}</td>
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

const searchCity = document.getElementById("search-city");

// ---------- Events ----------
searchCity.addEventListener("submit", (e) => {
    e.preventDefault();
    weatherDataDisplay();
});

// Celsius ⇄ Fahrenheit toggle
toFahrenheit.addEventListener("change", () => {
    if (toFahrenheit.checked && (tempC &&feelsLikeC !== 0) ) {
        currentTemp.textContent = `${convertToFahrenheit(tempC)} °F`;
        feelsLike.textContent = `${convertToFahrenheit(feelsLikeC)} °F`;
    } else if(tempC&&feelsLikeC !== 0){
        currentTemp.textContent = `${tempC} °C`;
        feelsLike.textContent = `${feelsLikeC} °C`;
    }
});
// User authentication & Favorites
document.addEventListener('DOMContentLoaded', function() {
    const userNameDisplay = document.getElementById('userNameDisplay');
    const displayUserName = document.getElementById('displayUserName');
    const signupBtn = document.getElementById('signup-button');
    const loginBtn = document.getElementById('login-button');
    const logoutBtn = document.getElementById('logoutBtn');
    const addFavoriteBtn = document.getElementById('addFavoriteBtn');

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
        // Hide favorite button when not logged in
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('weatherAppUser');
            userNameDisplay.style.display = 'none';
            signupBtn.style.display = 'inline-block';
            loginBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
            // Redirect to login page
            window.location.href = '../index.html';
        });
    }

    // Favorite button functionality
    if (addFavoriteBtn) {
        addFavoriteBtn.addEventListener('click', function() {
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
    let favorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];
    
    if (!favorites.includes(city)) {
        favorites.push(city);
        localStorage.setItem('favoriteCities', JSON.stringify(favorites));
        alert(`${city} added to favorites!`);
        updateFavoriteButtonState(city);
    } else {
        favorites = favorites.filter(c => c !== city);
        localStorage.setItem('favoriteCities', JSON.stringify(favorites));
        alert(`${city} removed from favorites!`);
        updateFavoriteButtonState(city);
    }
}

// Update favorite button appearance
function updateFavoriteButtonState(city) {
    const addFavoriteBtn = document.getElementById('addFavoriteBtn');
    let favorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];
    
    if (favorites.includes(city)) {
        addFavoriteBtn.classList.add('favorite-active');
        addFavoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Remove from favorite';
    } else {
        addFavoriteBtn.classList.remove('favorite-active');
        addFavoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Add to favorite';
    }
}