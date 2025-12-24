// main.js

document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login");
    const logoutBtn = document.getElementById("logout");
    const userNameSpan = document.getElementById("userName");

    // Check if user is logged in
    function checkLoginStatus() {
        const user = localStorage.getItem("currentUser");
        if (user) {
            const userData = JSON.parse(user);
            loginBtn.style.display = "none";
            logoutBtn.style.display = "block";
            userNameSpan.style.display = "inline";
            userNameSpan.textContent = `Welcome, ${userData.name}!`;
        } else {
            loginBtn.style.display = "block";
            logoutBtn.style.display = "none";
            userNameSpan.style.display = "none";
        }
    }

    // Initialize login status on page load
    checkLoginStatus();

    // Login button click - redirect to login page
    loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = 'components/login.html';
    });

    // Logout button click
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("currentUser");
        checkLoginStatus();
        alert("You have been logged out successfully!");
    });
});
const apiKey = "629abb62b1ae5affbd864eba93b24a22";


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
