// js

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