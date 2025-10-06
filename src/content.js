import "./assets/styles.css";
import { $, timeFormat } from "./utils";
import { tmos } from "./data";
import { divTimer, divTimerContent, divTimerBottom , btnRefreshTimer } from "./elements";

if (window.__myTimerLoaded) {
  console.log("Timer ya cargado");
} else {
  window.__myTimerLoaded = true;

  (async () => {
    let timer = null;
    const currentLimit = 1;
    let alarmPlayed = false;

    divTimer.append(divTimerBottom);
    
    // -------------------------------

    let currentAudio = null;

    function playAudio(audio, duration = 3000){
      stopAlarm();
      currentAudio = new Audio(audio);
      currentAudio.autoplay = true;
      currentAudio.play().catch(err => console.error("Error al reproducir audio:", err));
      setTimeout(() => stopAlarm(), duration);
    }

    function playAlarm1(duration = 3000) {
      playAudio("https://www.sonidosmp3gratis.com/sounds/mario.mp3", duration);      
    }

    function playAlarm2(duration = 3000) {
      playAudio("https://www.sonidosmp3gratis.com/sounds/mario-bros%20game%20over.mp3", duration)
    }

    function stopAlarm() {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
      }
    }
    
    // -------------------------------

    

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
        
        // const response = await fetch("https://everisgroup-my.sharepoint.com/:u:/g/personal/lsalcedg_emeal_nttdata_com/EcdQ9EKUGU5PucRTQjfrcQgBFAtIwSqkGUFaMdFqYUJRtQ?e=En4ttd");
        // const  data = await response.json();
        // console.log(data);
        
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

    function isWarningTime(diff) {
      return diff <= currentLimit * 60 * 1000 && diff > 0;
    }

    function getDiff(endTime) {
      return endTime - new Date();
    }

    async function loadTimer() {
        // reset alarm
        alarmPlayed = false;
        stopAlarm();


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

            if (isWarningTime(diff) && !alarmPlayed) {
              alarmPlayed = true;
              divTimerContent.style.color = "RED";
              playAlarm1(11000); // sound
            }

            if (diff <= 0) {
            divTimerContent.innerText = "00:00:00";
            divTimerContent.style.color = "GRAY";
            clearInterval(timer);
            playAlarm2(4000); // sound
            console.log("timer off");
            return;
            }

            divTimerContent.innerText = timeFormat(diff);
            // automatic close 00:00:00
            if(!getCurrentState()){ 
              alarmPlayed = false;
              loadTimer();
            }

        }, 1000);
    }

    //btn refresh    
    btnRefreshTimer.addEventListener('click', async () => {
      stopAlarm();
      clearInterval(timer);
      await loadTimer();
    })
    divHeader.append(btnRefreshTimer)

    // await loadTimer();
  })();
}
