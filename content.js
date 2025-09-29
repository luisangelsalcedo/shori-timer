
const TMO = 30;
const LIMIT = 1;


const header = document.querySelector(".chakra-heading");
header.style.display = "flex";
header.style.alignItems = "center";

const clockDiv = document.createElement("div");
clockDiv.style.padding = "0 0 10px 10px";
clockDiv.style.color = "BLUE"
header.append(clockDiv);

const entry = document.querySelector(".css-1742me7 div:nth-child(4)");
const startTime = entry.innerText.split(" ")[3];

const base = new Date();
base.setHours(...startTime.split(':'), 0);

const endTime = new Date(base.getTime() + TMO * 60 * 1000);
console.log("Hora final:", endTime.toLocaleTimeString());

const format = (ms) => {
  const totalSec = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const s = String(totalSec % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

const clock = setInterval(() => {
  const now = new Date();
  const diff = endTime - now;

  if(diff <= LIMIT*60*1000){
  	clockDiv.style.color = "RED"
  }

  if (diff <= 0) {
    console.log("00:00:00");
    clearInterval(clock);
    return;
  }

  clockDiv.innerText = format(diff);
}, 1000);
