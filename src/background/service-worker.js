chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'CLOSE_OTHER_TABS') {
    (async () => {
      const [activeTab] = await chrome.tabs.query({active: true, currentWindow: true});
      const allTabs = await chrome.tabs.query({currentWindow: true});
      let closedCount = 0;
      for (const tab of allTabs) {
        if (tab.id !== activeTab.id) {
          await chrome.tabs.remove(tab.id);
          closedCount++;
        }
      }
      sendResponse({ok: true, closedCount});
    })();
    return true; // Importante para indicar resposta assíncrona!
  }
});
