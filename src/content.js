
import { $, timeFormat } from "./utils";
import { divTimer, divTimerContent, divTimerBottom , btnRefreshTimer, svgtime, svgalarm } from "./elements";
import { stopAlarm, unlockAudioOnFirstGesture, playAudio } from "./utils/audio";

if (window.__myTimerLoaded) {
  console.log("Timer ya cargado");
  
} else {
  window.__myTimerLoaded = true;

  (async () => {
    let timer = null;
    const currentLimit = 1.5;
    let alarmPlayed = false;
    const prealarm = chrome.runtime.getURL('sounds/pre-alarm.mp3');
    const alarm = chrome.runtime.getURL('sounds/alarm.mp3');

    divTimer.append(divTimerBottom);
    
    // -------------------------------
    unlockAudioOnFirstGesture();

    function playAlarm1(duration = 3000) {
      playAudio(prealarm, duration);
    }

    function playAlarm2(duration = 3000) {
      playAudio(alarm, duration);
    }    
    // -------------------------------

    
    const divHeader = $(".css-9x4cwg");
    if (!divHeader) {
      console.warn("No se encontró .css-9x4cwg en esta página");
      return; // salir si no existe
    }
    divHeader.append(divTimer);

    async function getAllStates() {
      return new Promise((resolve, reject)=>{
        chrome.runtime.sendMessage({ type: 'GET_TMOS' }, (resp) => {
          if(resp.ok) {
            resolve(resp.data);
          } else {
            reject(resp.error)
          }
        });     
      })        
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
        divTimerBottom.innerText = timeData.tmo ? `End: ${endTime.toLocaleTimeString()}` : "";

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
              svgalarm.style.display = 'block'
              svgtime.style.display = 'none'
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
      if (timer) { 
        clearInterval(timer); 
        timer = null; 
      }
      await loadTimer();
    })
    divHeader.append(btnRefreshTimer)


    const target = document.querySelector("#root");
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function ({mutation}) {
        console.log(mutation);
      });
    });
    const config = { attributes: true, childList: true, characterData: true };
    if(target) observer.observe(target, config);

  })();
}
