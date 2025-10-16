// Ouvinte para mensagens do popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  // Verifica se veio pedido para fechar abas
  if (msg.type === 'CLOSE_OTHER_TABS') {
    (async () => {

      // Obtém a aba ativa
      const [activeTab] = await chrome.tabs.query({active: true, currentWindow: true});

      // Obtém todas as abas abertas na janela atual
      const allTabs = await chrome.tabs.query({currentWindow: true});

      let closedCount = 0;

      // Fecha todas as abas exceto a ativa
      for (const tab of allTabs) {
        if (tab.id !== activeTab.id) {
          await chrome.tabs.remove(tab.id);
          closedCount++;
        }
      }

      // Retorna ao popup o resultado
      sendResponse({ok: true, closedCount});
    })();

    // Necessário para resposta assíncrona
    return true;
  }
});
