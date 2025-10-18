import { test, expect, chromium } from '@playwright/test';
import path from 'node:path';
import os from 'node:os';

const dist = path.resolve(__dirname, '..', 'dist');
const userDataDir = path.join(os.tmpdir(), 'playwright_userdata');

test('Extensão fecha todas abas normais exceto a atual via popup', async () => {
  const isCI = !!process.env.CI;

  // Lança Chromium com a extensão
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: isCI,
    args: [
      `--disable-extensions-except=${dist}`,
      `--load-extension=${dist}`,
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  // Abas de teste
  await context.newPage().then(p => p.goto('https://example.com/1'));
  await context.newPage().then(p => p.goto('https://example.com/2'));
  await context.newPage().then(p => p.goto('https://example.com/3'));

  // Pega a backgroundPage da extensão
  const background = context.backgroundPages()[0];
  if (!background) throw new Error('Background da extensão não encontrado');

  // Envia mensagem para fechar abas (via background)
  await background.evaluate(() => {
    // @ts-ignore
    chrome.runtime.sendMessage({ type: 'CLOSE_OTHER_TABS' });
  });

  // Espera até que só reste 1 aba
  let pages = context.pages();
  let attempts = 0;
  while (pages.length > 1 && attempts < 20) {
    await new Promise(res => setTimeout(res, 500));
    pages = context.pages();
    attempts++;
  }

  // Verifica se só sobrou a aba da extensão
  const urls = pages.map(p => p.url());
  console.log('Abas restantes:', urls);
  expect(urls.length).toBe(1);
  expect(urls[0].startsWith('chrome-extension://')).toBe(true);

  await context.close();
});
