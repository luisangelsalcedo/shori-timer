// Ejecutar content.js al hacer click en el icono
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
});

// // Escuchar mensajes desde content.js para reproducir sonido
// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//   if (msg.action === "playSound") {
//     const url = chrome.runtime.getURL("alarma.mp3");
//     const audio = new Audio(url);
//     audio.play().catch(err => console.error("Error al reproducir audio:", err));

//     // detener automáticamente después de X ms (default 3 segundos)
//     setTimeout(() => {
//       audio.pause();
//       audio.currentTime = 0;
//     }, msg.duration || 3000);
//   }
// });




/* 
manifest
,
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ]

*/