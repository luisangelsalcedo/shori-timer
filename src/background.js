// send messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (!message || typeof message.type !== 'string') {
        sendResponse({ ok: false, error: 'mensaje inválido' });
        return;
    }

    switch (message.type) {
        case 'GET_TMOS': {
            (async ()=>{
                try {
                    const resp = await fetch('tmos.json');
                    const data = await resp.json();
                    sendResponse({ ok: true, data });

                } catch (err) {
                    sendResponse({ ok: false, error: String(err) });
                }
            })();
            return true;
        } 
    }
});

// run extension
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
});

