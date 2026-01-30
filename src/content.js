//* TODO Quitar espacios a los TMO labels
//* TODO bajar volumen de los audios
//* TODO cambiar audios 1
// TODO cambiar audios 2
// TODO Documentacion (work) agregar el detalle del boton para silenciar el audio


import { $, timeFormat } from "./utils";
import { divTimer, timerDigits, timerData , btnRefreshTimer, svgtime, svgalarm } from "./elements";
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

    
    // -------------------------------
    unlockAudioOnFirstGesture();

    function playAlarm1(duration = 15000) {
      playAudio(prealarm, duration);
    }

    function playAlarm2(duration = 3000) {
      playAudio(alarm, duration);
    }    
    // -------------------------------

    
    const divHeader = $(".main_navbar > div > div > div");
    if (!divHeader) {
      console.warn("No se encontró .main_navbar en esta página");
      return; // salir si no existe
    }
    divHeader.append(divTimer);



    const styles = chrome.runtime.getURL('timer-styles.css');
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = styles;
    document.head.append(link);



    async function getAllStates() {
      return new Promise((resolve, reject)=>{
        chrome.runtime.sendMessage({ type: 'GET_TMOS' }, (resp) => {
          if(resp.ok) {
            resolve(resp.data);
          } else {
            console.error("Error cargando la lista de TMOS");
            reject(resp.error)
          }
        });     
      })        
    }

    function getCurrentProduct() {
       try {
        const div = $(".main_navbar + div > div > div > div:first-of-type p");
        const texto = div.textContent;
        const onlyProductText = texto.split(texto.split(" - ", 1)[0] + " - ")[1];
       
        return div ? onlyProductText.trim() : null;
      } catch {
        console.error("Error cargando el producto de Shori");
        return null;
      }
    }

    function getCurrentState() {
      try {
        const div = $(".css-1d6wgrc .css-vds986");
       
        return div ? div.innerText.trim() : null;
      } catch {
        console.error("Error cargando el estado de Shori");
        return null;
      }
    }

    async function getTMO() {
      const currentProduct = getCurrentProduct();
      const currentState = getCurrentState();
      const allStates = await getAllStates();
      
      if (!currentProduct || !currentState || !allStates) return 0;

      const stateObj = allStates.find(state => {
        // producto
        const procutTrim = state.product.toUpperCase();
        const currenProductTrim = currentProduct.trim().toUpperCase();

        // estado
        const labelTrim = state.label.toUpperCase();
        const currenStateTrim = currentState.trim().toUpperCase();

        return  procutTrim === currenProductTrim && 
                labelTrim === currenStateTrim
      });

      if(!stateObj) console.error("No coincide el TMO con la lista");
        
      return stateObj ? stateObj.tmo : 0;
    }

    async function getTimerData() {
      const tmo = await getTMO();
      const currentState = getCurrentState();
      const currentProduct = getCurrentProduct();
      const allStates = await getAllStates();

      try {
        const divTitle = $(".chakra-heading div:nth-child(1) p");
        const divCreateDate = $(".css-1742me7 div:nth-child(4) p:nth-child(2)");
        const divUpdateDate = $(".css-1742me7 div:nth-child(5) p:nth-child(2)");

        const ticket = divTitle ? divTitle.innerText.split(" ")[2] : "";
        const createTime = divCreateDate ? divCreateDate.innerText.split(" ")[1] : "";
        const updateTime = divUpdateDate ? divUpdateDate.innerText.split(" ")[1] : "";

        return { tmo, currentProduct, currentState, allStates, ticket, createTime, updateTime };
      } catch {
        if(!stateObj) console.error("Error cargando los tiempos de Shori");
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
        svgalarm.style.display = 'none'
        svgtime.style.display = 'block'



        // restore color   
        const timeData = await getTimerData();
        if (!timeData) return;
        console.log(timeData)
        
        const endTime = calculateEndTime(timeData);
        // HTML
        timerDigits.style.color = "BLUE";
        divTimer.style.display = "flex";
        timerData.innerText = timeData.tmo ? `End: ${endTime.toLocaleTimeString()}` : "";

        // limpiar timer previo
        if (timer) {
            clearInterval(timer);
            timer = null;
        }

        if (getDiff(endTime) <= 0) {
            timerDigits.innerText = "00:00:00";
            divTimer.style.display = "none";
            return;
        }

        timer = setInterval(() => {
            const diff = getDiff(endTime);

            if (isWarningTime(diff) && !alarmPlayed) {
              alarmPlayed = true;
              timerDigits.style.color = "RED";
              playAlarm1(30000); // sound
              svgalarm.style.display = 'block'
              svgtime.style.display = 'none'
            }

            if (diff <= 0) {
            timerDigits.innerText = "00:00:00";
            timerDigits.style.color = "GRAY";
            clearInterval(timer);
            playAlarm2(4000); // sound
            
            console.log("timer off");
            return;
            }

            timerDigits.innerText = timeFormat(diff);
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

    divHeader.append(btnRefreshTimer);
  })();
}
