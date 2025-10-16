// Quando o usuário clica no botão "Fechar abas", executa a função abaixo:
document.getElementById('close-tabs').addEventListener('click', async () => {

  // Envia mensagem para o service worker pedindo para fechar as outras abas
  const res = await chrome.runtime.sendMessage({ type: 'CLOSE_OTHER_TABS' });

  // Exibe o número de abas fechadas no popup ou uma mensagem de erro
  document.getElementById('status').textContent = res && res.ok
    ? `Abas fechadas: ${res.closedCount}`
    : 'Erro ao fechar abas';
});
