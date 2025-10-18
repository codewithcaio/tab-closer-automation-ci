import { test, expect, chromium } from '@playwright/test';
import path from 'node:path';
import os from 'os';

const dist = path.resolve(__dirname, '..', 'dist');
const userDataDir = path.join(os.tmpdir(), 'playwright_userdata');

test('Extensão fecha todas abas normais exceto a atual via popup', async () => {
  // Detecta se está rodando em ambiente CI
  const isCI = !!process.env.CI;

  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: isCI ? true : false, // CI => headless, local => visível
    args: [
      `--disable-extensions-except=${dist}`,
      `--load-extension=${dist}`,
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

  // Descobre o extensionId via backgroundPages/serviceWorkers
  const targets = [...context.backgroundPages(), ...context.serviceWorkers()];
  let extensionId = '';
  for (const t of targets) {
    if (t.url().startsWith('chrome-extension://')) {
      extensionId = t.url().split('/')[2];
      break;
    }
  }

  if (!extensionId) throw new Error('Não foi possível encontrar o ID da extensão no contexto!');

  const popupUrl = `chrome-extension://${extensionId}/src/popup/popup.html`;
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

  // Considera sucesso se só sobrou o popup
  const urlsRestantes = pagesRestantes.map(p => p.url());
  console.log("URLs restantes depois do clique:", urlsRestantes);

  expect(
    urlsRestantes.length === 1 &&
    urlsRestantes[0].startsWith('chrome-extension://')
  ).toBe(true);

  await context.close();
});
