import { test, expect, chromium } from '@playwright/test';
import path from 'node:path';

const dist = path.resolve(__dirname, '..', 'dist');
const isCI = !!process.env.CI;
const extensionId = 'pkbnnhgoipfohgecjkjecbjhbmfihkcn';

test('Extensão fecha todas abas normais exceto a atual via popup', async () => {
  const context = await chromium.launchPersistentContext('', {
    headless: isCI,
    args: [
      `--disable-extensions-except=${dist}`,
      `--load-extension=${dist}`
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

  const popupUrl = `chrome-extension://${extensionId}/src/popup/popup.html`;
  const popupPage = await context.newPage();
  await popupPage.goto(popupUrl);
  await popupPage.click('#close-tabs');

  let tentativas = 0;
  let pagesRestantes = context.pages();
  while (pagesRestantes.length > 1 && tentativas < 10) {
    await new Promise(resolve => setTimeout(resolve, 500));
    pagesRestantes = context.pages();
    tentativas++;
  }

  const urlsRestantes = pagesRestantes.map(p => p.url());
  console.log("URLs restantes depois do clique:", urlsRestantes);

  expect(
    urlsRestantes.length === 1 &&
    urlsRestantes[0].startsWith(`chrome-extension://${extensionId}`)
  ).toBe(true);

  await context.close();
});
