import "./assets/styles.css";
import { $, timeFormat } from "./utils";
import { tmos } from "./data";
import { divTimer, divTimerContent, btnRefreshTimer } from "./elements";

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
    btnRefreshTimer.addEventListener('click', loadTimer)
    divHeader.append(btnRefreshTimer)

    await loadTimer();
  })();
}
