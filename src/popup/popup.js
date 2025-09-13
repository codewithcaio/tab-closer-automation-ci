document.getElementById('close-tabs').addEventListener('click', async () => {
  const res = await chrome.runtime.sendMessage({ type: 'CLOSE_OTHER_TABS' });
  document.getElementById('status').textContent = res && res.ok
    ? `Abas fechadas: ${res.closedCount}`
    : 'Erro ao fechar abas';
});
