

// const TMO = 30;
// const LIMIT = 1;

// const config = [
//     {label:"15 minutos", tmo : 15},
//     {label:"20 minutos", tmo : 20},
//     {label:"25 minutos", tmo : 25},
//     {label:"30 minutos", tmo : 30},
// ]

// const interface = document.createElement("div");
// interface.style.backgroundColor = "#ddd";
// interface.style.width = "160px";
// interface.style.height = "160px";
// interface.style.position = "absolute";
// interface.style.inset = "1rem 1rem auto auto";
// interface.style.borderRadius = ".5rem"

// const body = document.querySelector("body");
// body.append(interface)

// const setTMO = (tmo) => {
//     console.log(tmo)
// }

// config.forEach(({label, tmo}) => {
//     const button = document.createElement("button");    
//     button.textContent = label;
//     button.addEventListener("click", () => setTMO(tmo));
//     interface.append(button);
// });



// // //////////////////////////////////////////////////////////////


// const header = document.querySelector(".chakra-heading");
// header.style.display = "flex";
// header.style.alignItems = "center";

// const clockDiv = document.createElement("div");
// clockDiv.style.padding = "0 0 10px 10px";
// clockDiv.style.color = "BLUE"
// header.append(clockDiv);

// const entry = document.querySelector(".css-1742me7 div:nth-child(4)");
// const startTime = entry.innerText.split(" ")[3];

// const base = new Date();
// base.setHours(...startTime.split(':'), 0);

// const endTime = new Date(base.getTime() + TMO * 60 * 1000);
// console.log("Hora final:", endTime.toLocaleTimeString());

// const format = (ms) => {
//   const totalSec = Math.floor(ms / 1000);
//   const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
//   const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
//   const s = String(totalSec % 60).padStart(2, "0");
//   return `${h}:${m}:${s}`;
// }

// const clock = setInterval(() => {
//   const now = new Date();
//   const diff = endTime - now;

//   if(diff <= LIMIT*60*1000){
//   	clockDiv.style.color = "RED"
//   }

//   if (diff <= 0) {
//     console.log("00:00:00");
//     clearInterval(clock);
//     return;
//   }

//   clockDiv.innerText = format(diff);
// }, 1000);
console.log('vite project');