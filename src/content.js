import "./assets/styles.css";
import {$, timeFormat} from "./utils";
import {tmos} from "./data";

if (window.__myTimerLoaded) {
  console.log("Timer ya cargado");
} else {
  window.__myTimerLoaded = true;

  (async () => {
    let timer = null;
    const currentLimit = 1;
    
    // // ------------ sound api 
    // let audioCtx = null;
    // let oscillator = null;
    // let gainNode = null;

    // function playSound(duration = 3000) {
    //     const audioUrl = chrome.runtime.getURL("assets/alarma.mp3");
        
    //     // crear un elemento audio invisible en la página
    //     const audio = document.createElement("audio");
    //     audio.src = audioUrl;
    //     audio.autoplay = true;
    //     audio.volume = 1;
    //     audio.style.display = "none";
    //     document.body.appendChild(audio);

    //     // detener después de X ms
    //     setTimeout(() => {
    //         audio.pause();
    //         audio.currentTime = 0;
    //         document.body.removeChild(audio);
    //     }, duration);
    // }

    // function stopBeep() {
    //     if (oscillator) {
    //         oscillator.stop();
    //         oscillator.disconnect();
    //         oscillator = null;
    //     }
    //     if (gainNode) {
    //         gainNode.disconnect();
    //         gainNode = null;
    //     }
    //     if (audioCtx) {
    //         audioCtx.close();
    //         audioCtx = null;
    //     }
    // }
    // // ------------ end sound api 
    // function playSound(duration = 3000) {
    //     const url = chrome.runtime.getURL("assets/sound.mp3");
    //     const audio = new Audio(url);
    //     audio.play().catch(err => console.error("Error al reproducir audio:", err));

    //     // detener automáticamente después de X ms
    //     setTimeout(() => {
    //         audio.pause();
    //         audio.currentTime = 0;
    //     }, duration);
    // }
    // function notifySound() {
    // chrome.runtime.sendMessage({ action: "playSound", duration: 3000 });
    // }

    

    // make container
    const divTimer = document.createElement("div");
    
    divTimer.style.position = "absolute";
    divTimer.style.backgroundColor = "white";
    divTimer.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, .2)";
    divTimer.style.top = "100%";
    divTimer.style.right = "1rem";
    divTimer.style.padding = ".5rem 1rem";
    divTimer.style.fontSize = "1.3rem";
    divTimer.style.borderRadius = "0 0 8px 8px";

    const imageTimer = `<svg width="800px" height="800px" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--gis" preserveAspectRatio="xMidYMid meet"><path d="M42 0a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h3v5.295C23.364 15.785 6.5 34.209 6.5 56.5C6.5 80.483 26.017 100 50 100s43.5-19.517 43.5-43.5a43.22 43.22 0 0 0-6.72-23.182l4.238-3.431l1.888 2.332a2 2 0 0 0 2.813.297l3.11-2.518a2 2 0 0 0 .294-2.812L89.055 14.75a2 2 0 0 0-2.813-.297l-3.11 2.518a2 2 0 0 0-.294 2.812l1.889 2.332l-4.22 3.414C73.77 18.891 64.883 14.435 55 13.297V8h3a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H42zm8 20c20.2 0 36.5 16.3 36.5 36.5S70.2 93 50 93S13.5 76.7 13.5 56.5S29.8 20 50 20zm.002 7.443L50 56.5l23.234 17.447a29.056 29.056 0 0 0 2.758-30.433a29.056 29.056 0 0 0-25.99-16.07z" fill="#000000"></path></svg>`;
    const divTimerContent = document.createElement("div");
    divTimerContent.style.color = "BLUE";
    divTimerContent.style.fontWeight = "bold";

    const divTimerTop = document.createElement("div");
    divTimerTop.style.display = "flex";
    divTimerTop.style.alignItems = "center";
    divTimerTop.style.justifyContent = "center";
    divTimerTop.style.gap = "10px";

    const divTimerBottom = document.createElement("div");
    divTimerBottom.style.fontSize = "11px";
    divTimerBottom.style.whiteSpace = "nowrap";
    divTimerBottom.style.overflow = "hidden";
    divTimerBottom.style.textOverflow = "ellipsis";
    divTimerBottom.style.width = "100px";  
    divTimerBottom.style.textAlign = "center";
    
    divTimerTop.innerHTML = imageTimer; 
    divTimerTop.append(divTimerContent)
    divTimer.append(divTimerTop);
    divTimer.append(divTimerBottom);

    const svgtime = divTimerTop.querySelector("svg");
    svgtime.style.width = "16px";
    svgtime.style.height = "16px";
    svgtime.querySelector("path").style.fill = "#005b96"

    // const divHeader = $(".chakra-heading");
    const divHeader = $(".css-9x4cwg");
    if (!divHeader) {
      console.warn("No se encontró .css-9x4cwg en esta página");
      return; // salir si no existe
    }
    divHeader.append(divTimer);

    async function getAllStates() {
      try {
        // const runtime = typeof browser !== "undefined" ? browser : chrome;
        // const url = runtime.runtime.getURL("tmos.json");
        // const response = await fetch(url);
        // return await response.json();

        return tmos
      } catch (error) {
        console.error("Error cargando tmos.json:", error);
        return null;
      }
    }

    function getCurrentState() {
      try {
        const div = $(".css-1d6wgrc .css-gab2yv");
        return div ? div.innerText : null;
      } catch {
        return null;
      }
    }

    async function getTMO() {
      const currentState = getCurrentState();
      if (!currentState) return 0;
      const allStates = await getAllStates();
      if (!allStates) return 0;

      const stateObj = allStates.find(state => state.label === currentState);
      return stateObj ? stateObj.tmo : 0;
    }

    async function getTimerData() {
      const tmo = await getTMO();
      const currentState = getCurrentState();
      const allStates = await getAllStates();

      try {
        const divTitle = $(".chakra-heading div:nth-child(1) p");
        const divCreateDate = $(".css-1742me7 div:nth-child(4) p:nth-child(2)");
        const divUpdateDate = $(".css-1742me7 div:nth-child(5) p:nth-child(2)");

        const ticket = divTitle ? divTitle.innerText.split(" ")[2] : "";
        const createTime = divCreateDate ? divCreateDate.innerText.split(" ")[1] : "";
        const updateTime = divUpdateDate ? divUpdateDate.innerText.split(" ")[1] : "";

        return { tmo, currentState, allStates, ticket, createTime, updateTime };
      } catch {
        return null;
      }
    }

    function calculateEndTime({ updateTime: time, tmo }) {
      const base = new Date();
      base.setHours(...time.split(":"), 0);
      const endTime = new Date(base.getTime() + tmo * 60 * 1000);
      console.log("Hora final:", endTime.toLocaleTimeString());
      return endTime;
    }

    function isPastLimit(diff) {
      return diff <= currentLimit * 60 * 1000;
    }

    function getDiff(endTime) {
      return endTime - new Date();
    }

    async function loadTimer() {
        // restore color   
        const timeData = await getTimerData();
        if (!timeData) return;
        console.log(timeData)
        
        const endTime = calculateEndTime(timeData);
        // HTML
        divTimerContent.style.color = "BLUE";
        divTimer.style.display = "block";
        divTimerBottom.innerText = timeData.tmo ? `TMO: ${timeData.tmo}m` : "";

        // limpiar timer previo
        if (timer) {
            clearInterval(timer);
            timer = null;
        }

        if (getDiff(endTime) <= 0) {
            divTimerContent.innerText = "00:00:00";
            divTimer.style.display = "none";
            return;
        }

        timer = setInterval(() => {
            const diff = getDiff(endTime);

            if (isPastLimit(diff)) divTimerContent.style.color = "RED";

            if (diff <= 0) {
            divTimerContent.innerText = "00:00:00";
            divTimerContent.style.color = "GRAY";
            clearInterval(timer);
            //   beep(3000); // sound
            //   playSound(3000); 
            //   notifySound();
            console.log("timer off");
            return;
            }

            divTimerContent.innerText = timeFormat(diff);
            // automatic close 00:00:00
            if(!getCurrentState()) loadTimer();

        }, 1000);
    }

    //btn refresh
    const btnRefreshTimer = document.createElement("button");
    btnRefreshTimer.innerText = "Reload";
    btnRefreshTimer.style.color = "white";
    btnRefreshTimer.style.padding = "5px";
    btnRefreshTimer.addEventListener('click', loadTimer)
    divHeader.append(btnRefreshTimer)

    await loadTimer();
  })();
}
