import { test, expect, chromium } from '@playwright/test';

const EXTENSION_ID = 'pkbnnhgoipfohgecjkjecbjhbmfihkcn'; // seu ID fixo da extensão

test('Extensão fecha todas abas normais exceto a atual via popup', async () => {
  const context = await chromium.launchPersistentContext('', {
    headless: false, // precisa ser false para testar extensão
    args: [
      `--disable-extensions-except=dist`,
      `--load-extension=dist`,
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  // Cria três abas normais
  const page1 = await context.newPage();
  await page1.goto('https://example.com/1');
  const page2 = await context.newPage();
  await page2.goto('https://example.com/2');
  const page3 = await context.newPage();
  await page3.goto('https://example.com/3');
  await page2.bringToFront();

  // Abre o popup da extensão usando EXTENSION_ID fixo
  const popupUrl = `chrome-extension://${EXTENSION_ID}/src/popup/popup.html`;
  const popupPage = await context.newPage();
  await popupPage.goto(popupUrl);
  await popupPage.click('#close-tabs');

  // Aguarda máximo 10 tentativas para o resultado acontecer
  let tentativas = 0;
  let pagesRestantes = context.pages();
  while (pagesRestantes.length > 1 && tentativas < 10) {
    await new Promise(resolve => setTimeout(resolve, 500));
    pagesRestantes = context.pages();
    tentativas++;
  }

  // Mostra no terminal para debug
  const urlsRestantes = pagesRestantes.map(p => p.url());
  console.log("URLs restantes depois do clique:", urlsRestantes);

  // Considera sucesso se só sobrou o popup
  expect(
    urlsRestantes.length === 1 &&
    urlsRestantes[0].startsWith('chrome-extension://')
  ).toBe(true);

  await context.close();
});
