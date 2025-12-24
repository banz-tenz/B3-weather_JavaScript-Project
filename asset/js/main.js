// js

const apiKey = "629abb62b1ae5affbd864eba93b24a22";

// User authentication
document.addEventListener('DOMContentLoaded', function() {
    const userNameDisplay = document.getElementById('userNameDisplay');
    const displayUserName = document.getElementById('displayUserName');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // Check if user is logged in
    const weatherAppUser = localStorage.getItem('weatherAppUser');
    
    if (weatherAppUser) {
        try {
            const user = JSON.parse(weatherAppUser);
            // Show user info and hide login button
            displayUserName.textContent = user.name;
            userNameDisplay.style.display = 'inline-block';
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'inline-block';
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    } else {
        // Show login button and hide logout
        userNameDisplay.style.display = 'none';
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('weatherAppUser');
            userNameDisplay.style.display = 'none';
            loginBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
            // Redirect to login page
            window.location.href = '../index.html';
        });
    }
});

function getWeatherData(){
    
    const inputCity = document.getElementById("city-name-search");
    let cityName = inputCity.value;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => {
            if(!response.ok){
                throw new Error("City not found")
            }
            return response.json();
        })
        .then(data =>{
            console.log(data)
            displayWeatherData(data);
        })
        .catch(error=>{
            console.log(error)
        })
}

function displayWeatherData(data){
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    // console.log(cityName)
}

// display data weather DOM
const cityName = document.getElementById("city-name");

const searchCity = document.getElementById("search-city");

searchCity.addEventListener("submit", (e)=>{
    e.preventDefault();
    getWeatherData()
})