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

    // make container
    const divTimer = document.createElement("div");
    divTimer.style.color = "BLUE";

    const divHeader = $(".chakra-heading");
    if (!divHeader) {
      console.warn("No se encontró .chakra-heading en esta página");
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

    async function getCurrentState() {
      try {
        const div = $(".css-1d6wgrc .css-gab2yv");
        return div ? div.innerText : null;
      } catch {
        return null;
      }
    }

    async function getTMO() {
      const currentState = await getCurrentState();
      if (!currentState) return 0;
      const allStates = await getAllStates();
      if (!allStates) return 0;
      const stateObj = allStates.find(state => state.label === currentState);
      return stateObj ? stateObj.tmo : 0;
    }

    async function getTimerData() {
      const tmo = await getTMO();
      const currentState = await getCurrentState();
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
      const timeData = await getTimerData();
      if (!timeData) return;
      console.log(timeData)

      const endTime = calculateEndTime(timeData);

      // limpiar timer previo
      if (timer) {
        clearInterval(timer);
        timer = null;
      }

      if (getDiff(endTime) <= 0) {
        divTimer.innerText = "00:00:00";
        divTimer.style.color = "GRAY";
        return;
      }

      timer = setInterval(() => {
        const diff = getDiff(endTime);

        if (isPastLimit(diff)) divTimer.style.color = "RED";

        if (diff <= 0) {
          divTimer.innerText = "00:00:00";
          divTimer.style.color = "GRAY";
          clearInterval(timer);
          console.log("timer off");
          return;
        }

        divTimer.innerText = timeFormat(diff);
      }, 1000);
    }

    //btn refresh
    const btnRefreshTimer = document.createElement("button");
    btnRefreshTimer.innerText = "reload";
    btnRefreshTimer.addEventListener('click', loadTimer)
    divHeader.append(btnRefreshTimer)

    await loadTimer();
  })();
}
