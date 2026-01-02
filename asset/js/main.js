const apiKey = "629abb62b1ae5affbd864eba93b24a22";

// ---------- Location Services ----------
function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        showNotification('Getting your location...', 'info');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    // Get city name from coordinates
                    const geoResponse = await fetch(
                        `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`
                    );

                    if (!geoResponse.ok) throw new Error('Location not found');

                    const geoData = await geoResponse.json();
                    const cityName = geoData[0]?.name || 'Your Location';

                    // Set city in search input and fetch weather
                    const inputCity = document.getElementById("city-name-search");
                    inputCity.value = cityName;
                    weatherDataDisplay();

                    // Center map on current location if map is initialized
                    if (weatherMap) {
                        weatherMap.setView([latitude, longitude], 10);
                        addWeatherMarker(latitude, longitude);
                    }

                    // Show success message
                    showNotification(`Weather for ${cityName} loaded!`, 'success');

                } catch (error) {
                    console.error('Error getting location weather:', error);
                    showNotification('Unable to fetch weather for your location', 'error');
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                showNotification('Unable to get your location. Please enable location services.', 'error');
            }
        );
    } else {
        showNotification('Geolocation is not supported by your browser.', 'error');
    }
}

// ---------- Notification System ----------
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.weather-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `weather-notification alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} position-fixed top-0 start-50 translate-middle-x mt-3`;
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
            ${message}
        </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

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
const concelMenu = document.getElementById("concel-menu");
const overlayMenu = document.getElementById("overlay-menu");

const currentWeather = document.getElementById("current-weather");
const hourlyWeather = document.getElementById("hourly-weather");
const daysForecastWeather = document.getElementById("days-forecast-weather");
const mapWeather = document.getElementById("map-weather");

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
            mapWeather.style.display = 'none';
        } else if (link.getAttribute("data-section") === 'hourly') {
            currentWeather.style.display = 'none';
            hourlyWeather.style.display = 'block';
            daysForecastWeather.style.display = 'none';
            mapWeather.style.display = 'none';
        }
        else if (link.getAttribute("data-section") === 'days-forecast') {
            currentWeather.style.display = 'none';
            hourlyWeather.style.display = 'none';
            daysForecastWeather.style.display = 'block';
            mapWeather.style.display = 'none';
        }
        else if (link.getAttribute("data-section") === 'map') {
            currentWeather.style.display = 'none';
            hourlyWeather.style.display = 'none';
            daysForecastWeather.style.display = 'none';
            mapWeather.style.display = 'block';
            initializeMap();
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

// Add location button event listener
document.addEventListener('DOMContentLoaded', function () {
    // Create location button
    const locationBtn = document.createElement('button');
    locationBtn.type = 'button';
    locationBtn.className = 'btn btn-outline-primary btn-sm ms-2';
    locationBtn.innerHTML = '<i class="fas fa-location-crosshairs me-1"></i>Location';
    locationBtn.onclick = getCurrentLocationWeather;

    // Add location button to search form
    const searchForm = document.getElementById('search-city');
    if (searchForm) {
        searchForm.appendChild(locationBtn);
    }

    // Check for URL parameters (existing functionality)
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

mobileMenu.addEventListener("click", () => {
    navBar.classList.toggle("active");
    mainContent.classList.toggle("active");
    overlayMenu.classList.toggle("active");
});

concelMenu.addEventListener("click", () => {
    navBar.classList.remove("active");
    mainContent.classList.remove("active");
    overlayMenu.classList.remove("active");
})

overlayMenu.addEventListener("click", () => {
    navBar.classList.remove("active");
    mainContent.classList.remove("active");
    overlayMenu.classList.remove("active");
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

// ---------- Map Functionality ----------
let weatherMap = null;
let weatherMarkers = new Map();

function initializeMap() {
    if (weatherMap) {
        return; // Map already initialized
    }

    const mapContainer = document.getElementById('weather-map');
    if (!mapContainer) {
        return;
    }

    // Initialize map
    weatherMap = L.map('weather-map').setView([40.7128, -74.0060], 5);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ' OpenStreetMap contributors'
    }).addTo(weatherMap);

    // Handle map clicks
    weatherMap.on('click', function (e) {
        const { lat, lng } = e.latlng;
        addWeatherMarker(lat, lng);
        // Also update the Today section with this location's weather
        getWeatherForTodaySection(lat, lng);
    });

    // Add some initial markers for major cities
    const majorCities = [
        { name: 'New York', lat: 40.7128, lon: -74.0060 },
        { name: 'London', lat: 51.5074, lon: -0.1278 },
        { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
        { name: 'Paris', lat: 48.8566, lon: 2.3522 },
        { name: 'Sydney', lat: -33.8688, lon: 151.2093 }
    ];

    // Add markers for major cities with a delay to avoid API rate limits
    majorCities.forEach((city, index) => {
        setTimeout(() => {
            addWeatherMarker(city.lat, city.lon);
        }, index * 1000);
    });

    // Initialize map controls
    initializeMapControls();
}

// Add weather marker
async function addWeatherMarker(lat, lon) {
    if (!weatherMap) return;

    // Remove existing marker at this location if any
    const markerKey = `${lat.toFixed(4)}_${lon.toFixed(4)}`;
    if (weatherMarkers.has(markerKey)) {
        weatherMap.removeLayer(weatherMarkers.get(markerKey));
    }

    // Show loading marker
    const loadingMarker = L.marker([lat, lon]).addTo(weatherMap);
    loadingMarker.bindPopup('<div class="loading-spinner"></div> Loading weather...').openPopup();

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
            throw new Error('Weather data not available');
        }

        const weatherData = await response.json();

        // Remove loading marker
        weatherMap.removeLayer(loadingMarker);

        // Get temperature color for marker
        const temp = Math.round(weatherData.main.temp);
        let tempColor = '#4ecdc4'; // Cold (<5°C)
        if (temp > 25) tempColor = '#ff6b6b'; // Hot (>25°C)
        else if (temp > 15) tempColor = '#ffd93d'; // Warm (15-25°C)
        else if (temp > 5) tempColor = '#6bcf7f'; // Mild (5-15°C)

        // Create weather marker with temperature-based color
        const weatherIcon = L.divIcon({
            html: `<i class="fas fa-map-marker-alt" style="color: ${tempColor}; font-size: 24px;"></i>`,
            iconSize: [24, 24],
            className: 'weather-marker-icon'
        });

        const marker = L.marker([lat, lon], { icon: weatherIcon }).addTo(weatherMap);
        marker.bindPopup(createWeatherPopup(weatherData));

        // Store marker
        weatherMarkers.set(markerKey, marker);

        return marker;
    } catch (error) {
        // Remove loading marker and show error
        weatherMap.removeLayer(loadingMarker);
        const errorMarker = L.marker([lat, lon]).addTo(weatherMap);
        errorMarker.bindPopup(`
            <div class="weather-popup">
                <h5>Weather Unavailable</h5>
                <p>Unable to fetch weather data for this location.</p>
            </div>
        `).openPopup();

        // Remove error marker after 3 seconds
        setTimeout(() => {
            weatherMap.removeLayer(errorMarker);
        }, 3000);
    }
}

// Create weather popup content
function createWeatherPopup(weatherData) {
    const temp = Math.round(weatherData.main.temp);
    const feelsLike = Math.round(weatherData.main.feels_like);
    const weather = weatherData.weather[0];
    const wind = weatherData.wind.speed;
    const humidity = weatherData.main.humidity;
    const pressure = weatherData.main.pressure;
    const visibility = (weatherData.visibility / 1000).toFixed(1);
    const clouds = weatherData.clouds.all;

    // Get temperature color
    let tempColor = '#4ecdc4'; // Cold (<5°C)
    if (temp > 25) tempColor = '#ff6b6b'; // Hot (>25°C)
    else if (temp > 15) tempColor = '#ffd93d'; // Warm (15-25°C)
    else if (temp > 5) tempColor = '#6bcf7f'; // Mild (5-15°C)

    return `
        <div class="weather-popup" style="min-width: 200px;">
            <h5 style="color: #4a6fa5; margin-bottom: 10px;">${weatherData.name}</h5>
            <div class="temp" style="font-size: 24px; font-weight: bold; color: ${tempColor};">${temp}°C</div>
            <div class="weather-desc" style="text-transform: capitalize; color: #6c757d; margin-bottom: 10px;">${weather.description}</div>
            <div class="details" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 14px;">
                <div class="detail-item" style="display: flex; align-items: center; gap: 5px;">
                    <i class="fas fa-temperature-half" style="color: #4a6fa5; width: 16px;"></i>
                    <span>Feels ${feelsLike}°C</span>
                </div>
                <div class="detail-item" style="display: flex; align-items: center; gap: 5px;">
                    <i class="fas fa-wind" style="color: #4a6fa5; width: 16px;"></i>
                    <span>${wind} m/s</span>
                </div>
                <div class="detail-item" style="display: flex; align-items: center; gap: 5px;">
                    <i class="fas fa-tint" style="color: #4a6fa5; width: 16px;"></i>
                    <span>${humidity}%</span>
                </div>
                <div class="detail-item" style="display: flex; align-items: center; gap: 5px;">
                    <i class="fas fa-gauge" style="color: #4a6fa5; width: 16px;"></i>
                    <span>${pressure} hPa</span>
                </div>
                <div class="detail-item" style="display: flex; align-items: center; gap: 5px;">
                    <i class="fas fa-eye" style="color: #4a6fa5; width: 16px;"></i>
                    <span>${visibility} km</span>
                </div>
                <div class="detail-item" style="display: flex; align-items: center; gap: 5px;">
                    <i class="fas fa-cloud" style="color: #4a6fa5; width: 16px;"></i>
                    <span>${clouds}%</span>
                </div>
            </div>
        </div>
    `;
}

// Get weather data for Today section from coordinates
async function getWeatherForTodaySection(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
            throw new Error('Weather data not available');
        }

        const weatherData = await response.json();

        // Update the Today section with this weather data
        displayWeatherData(weatherData);

        // Also get forecast data for hourly and daily tables
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );

        if (forecastResponse.ok) {
            const forecastData = await forecastResponse.json();
            displayTimebaseData(forecastData.list);
            hourlyDisplayWeather(forecastData.list);
            daysForecast(forecastData.list);
        }

        // Switch to Today section to show the updated weather
        const todayLink = document.querySelector("a[data-section='today']");
        if (todayLink) {
            listLinks.forEach(item => item.classList.remove("active"));
            todayLink.classList.add("active");
        }

        currentWeather.style.display = 'block';
        hourlyWeather.style.display = 'none';
        daysForecastWeather.style.display = 'none';
        mapWeather.style.display = 'none';

        // Update search input with the city name
        const inputCity = document.getElementById("city-name-search");
        if (inputCity) {
            inputCity.value = weatherData.name;
        }

        showNotification(`Weather updated for ${weatherData.name}`, 'success');

    } catch (error) {
        console.error('Error getting weather for Today section:', error);
        showNotification('Unable to fetch weather data for this location', 'error');
    }
}

// Function to get current location and update map/weather
function getCurrentLocation() {
    if (navigator.geolocation) {
        showNotification('Getting your location...', 'info');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // Center map on current location
                if (weatherMap) {
                    weatherMap.setView([lat, lon], 10);
                }

                // Add weather marker for current location
                addWeatherMarker(lat, lon);

                // Update Today section with current location weather
                getWeatherForTodaySection(lat, lon);

                showNotification('Location found! Weather updated.', 'success');
            },
            (error) => {
                console.error('Geolocation error:', error);
                showNotification('Unable to get your location. Please enable location services.', 'error');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        showNotification('Geolocation is not supported by your browser', 'error');
    }
}

// Clear all markers from map
function clearAllMarkers() {
    if (weatherMap && weatherMarkers.size > 0) {
        weatherMarkers.forEach(marker => {
            weatherMap.removeLayer(marker);
        });
        weatherMarkers.clear();
        showNotification('All markers cleared', 'info');
    }
}

// Search functionality
async function searchLocation(query) {
    if (!query.trim()) return;

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
        );

        if (!response.ok) throw new Error('Search failed');

        const results = await response.json();
        displaySearchResults(results);

    } catch (error) {
        console.error('Search error:', error);
        showNotification('Search failed. Please try again.', 'error');
    }
}

// Display search results
function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');

    if (results.length === 0) {
        searchResults.innerHTML = '<div class="p-2 text-muted">No results found</div>';
        searchResults.style.display = 'block';
        return;
    }

    searchResults.innerHTML = results.map(result => `
        <div class="search-result-item p-2 border-bottom" 
             style="cursor: pointer; transition: background 0.2s;"
             onmouseover="this.style.background='#f8f9fa'"
             onmouseout="this.style.background='white'"
             onclick="selectSearchResult(${result.lat}, ${result.lon}, '${result.display_name.replace(/'/g, "\\'")}')">
            <div class="fw-bold">${result.name}</div>
            <div class="text-muted small">${result.display_name}</div>
        </div>
    `).join('');

    searchResults.style.display = 'block';
}

// Select search result
function selectSearchResult(lat, lon, displayName) {
    const searchResults = document.getElementById('searchResults');
    const searchInput = document.getElementById('locationSearch');

    searchResults.style.display = 'none';
    searchInput.value = displayName;

    // Center map and add marker
    if (weatherMap) {
        weatherMap.setView([lat, lon], 10);
    }

    addWeatherMarker(lat, lon);
    getWeatherForTodaySection(lat, lon);
}

// Map layer switching
function switchMapLayer(layerType) {
    if (!weatherMap) return;

    // Remove existing tile layer
    weatherMap.eachLayer(layer => {
        if (layer instanceof L.TileLayer) {
            weatherMap.removeLayer(layer);
        }
    });

    let tileUrl;
    switch (layerType) {
        case 'satellite':
            tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
            break;
        case 'terrain':
            tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
            break;
        default:
            tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }

    L.tileLayer(tileUrl, {
        attribution: ' OpenStreetMap contributors'
    }).addTo(weatherMap);
}

// Show notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 250px;
        animation: slideInRight 0.3s ease;
    `;
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
            ${message}
        </div>
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize map controls when map is initialized
function initializeMapControls() {
    // Get current location button
    const getCurrentLocationBtn = document.getElementById('getCurrentLocation');
    if (getCurrentLocationBtn) {
        getCurrentLocationBtn.addEventListener('click', getCurrentLocationWeather);
    }

    // Clear markers button
    const clearMarkersBtn = document.getElementById('clearMarkers');
    if (clearMarkersBtn) {
        clearMarkersBtn.addEventListener('click', clearAllMarkers);
    }

    // Search input
    const searchInput = document.getElementById('locationSearch');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchLocation(e.target.value);
            }, 500);
        });

        // Hide search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                document.getElementById('searchResults').style.display = 'none';
            }
        });
    }

    // Map layer radio buttons
    const layerRadios = document.querySelectorAll('input[name="mapLayer"]');
    layerRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            switchMapLayer(e.target.value);
        });
    });
}
