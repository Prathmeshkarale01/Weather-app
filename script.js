const apiKey = "331ca92302e15a439c9d10c2f72bc394";

const cityInput = document.getElementById("cityInput");
const countryInput = document.getElementById("countryInput");
const searchBtn = document.getElementById("searchBtn");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const weatherIcon = document.getElementById("weatherIcon");
const timeDisplay = document.getElementById("time");

const sun = document.querySelector(".sun");
const moon = document.querySelector(".moon");
const clouds = document.querySelectorAll(".cloud");
const rain = document.querySelector(".rain");
const snow = document.querySelector(".snow");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  const country = countryInput.value.trim().toUpperCase();
  if (city && country) getWeather(city, country);
});

// Generate stars
function createStars() {
  const starsContainer = document.querySelector(".stars");
  starsContainer.innerHTML = "";
  const starCount = 50;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.classList.add("star");
    star.style.top = `${Math.random()*80}%`;
    star.style.left = `${Math.random()*100}%`;
    const size = Math.random()*3+1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    const duration = Math.random()*60+40;
    star.style.animationDuration = `${duration}s, ${Math.random()*3+2}s`;
    starsContainer.appendChild(star);
  }
}
createStars();

// Fetch weather
async function getWeather(city, country) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.cod === "404") { alert("City/Country not found!"); return; }
  displayWeather(data);
}

// Display weather
function displayWeather(data) {
  const temp = data.main.temp;
  const desc = data.weather[0].description;
  const condition = data.weather[0].main.toLowerCase();

  const timezoneOffset = data.timezone;
  const localDate = new Date(Date.now() + timezoneOffset * 1000);
  const hour = localDate.getUTCHours();

  cityName.textContent = `${data.name}, ${data.sys.country}`;
  temperature.textContent = `${temp.toFixed(1)}°C`;
  description.textContent = desc;

  updateVisuals(temp, condition, hour);
  updateIcon(condition, hour);
  updateTime();
  setInterval(updateTime, 1000);
}

// Update visuals
function updateVisuals(temp, condition, hour) {
  const body = document.body;
  sun.style.opacity=0; moon.style.opacity=0;
  rain.style.opacity=0; snow.style.opacity=0;
  clouds.forEach(c=>c.style.opacity=0);
  document.querySelectorAll(".star").forEach(s=>s.style.opacity=0);

  const isNight = hour<6 || hour>18;
  if(isNight){
    body.style.background="linear-gradient(to right,#0f2027,#203a43,#2c5364)";
    moon.style.opacity=1;
    document.querySelectorAll(".star").forEach(s=>s.style.opacity=Math.random());
    clouds.forEach(c=>c.style.opacity=0.5);
  } else {
    if(condition.includes("clear")){ body.style.background="linear-gradient(to right,#ff9a9e,#fad0c4)"; sun.style.opacity=1; }
    else if(condition.includes("cloud")){ body.style.background="linear-gradient(to right,#83a4d4,#b6fbff)"; clouds.forEach(c=>c.style.opacity=1);}
    else if(condition.includes("rain")||condition.includes("drizzle")){ body.style.background="linear-gradient(to right,#2c3e50,#4ca1af)"; rain.style.opacity=1; clouds.forEach(c=>c.style.opacity=1);}
    else if(condition.includes("snow")){ body.style.background="linear-gradient(to right,#e0eafc,#cfdef3)"; snow.style.opacity=1;}
    else if(condition.includes("thunderstorm")){ body.style.background="linear-gradient(to right,#141E30,#243B55)"; clouds.forEach(c=>c.style.opacity=1);}
    else{ body.style.background="linear-gradient(to right,#74ebd5,#ACB6E5)";}
  }
}

// Update icons
function updateIcon(condition,hour){
  const isNight=hour<6||hour>18;
  const iconMap={clear:isNight?"fa-moon":"fa-sun",clouds:"fa-cloud",rain:"fa-cloud-showers-heavy",drizzle:"fa-cloud-rain",thunderstorm:"fa-bolt",snow:"fa-snowflake",mist:"fa-smog"};
  weatherIcon.className=`fas ${iconMap[condition]||"fa-sun"}`;
}

// Time display
function updateTime(){ const now=new Date(); timeDisplay.textContent=now.toLocaleTimeString(); }

// Auto refresh
setInterval(()=>{ if(cityName.textContent) getWeather(cityInput.value.trim(),countryInput.value.trim().toUpperCase()); },60000);
