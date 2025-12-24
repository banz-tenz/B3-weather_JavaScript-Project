// js

const aipKey = "629abb62b1ae5affbd864eba93b24a22";

// Validate city input
function validateCity(cityName) {
  const trimmedCity = cityName.trim();
  
  // Check if empty
  if (trimmedCity === "") {
    alert("⚠️ Please enter a city name!");
    return false;
  }
  
  // Check if too short
  if (trimmedCity.length < 2) {
    alert("⚠️ City name must be at least 2 characters long!");
    return false;
  }
  
  // Check for numbers
  if (/\d/.test(trimmedCity)) {
    alert("⚠️ City name cannot contain numbers!");
    return false;
  }
  
  // Check for invalid characters
  if (!/^[a-zA-Z\s\-']+$/.test(trimmedCity)) {
    alert("⚠️ Invalid city name! Only letters, spaces, hyphens, and apostrophes allowed.");
    return false;
  }
  
  return true;
}

// Search city on form submit
document.querySelector("form").addEventListener("submit", function(e) {
  e.preventDefault();
  const searchInput = document.querySelector("input[type='search']");
  const cityName = searchInput.value;
  
  if (validateCity(cityName)) {
    console.log("Valid city:", cityName);
    // Call weather API here
  }
  
  searchInput.value = "";
});
