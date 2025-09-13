# Tab Closer — Extensão para Google Chrome (Manifest V3)

Tab Closer é uma extensão para Google Chrome que fecha todas as abas, exceto a aba ativa, ideal para quem costuma trabalhar com várias abas abertas e deseja limpar rapidamente a janela do navegador.

---

## Funcionalidades

- Fecha todas as abas abertas, exceto a que está ativa.
- Interface simples e intuitiva no popup.
- Visual moderno e responsivo.
- Comunicação eficiente entre popup e background (service worker).

---

## Instalação Manual (modo desenvolvedor)

1. Baixe ou clone este repositório na sua máquina:  
git clone https://github.com/codewithcaio/bootcamp2-chrome-ext--caio.diniz.git

text
2. Abra o Google Chrome e acesse:  
`chrome://extensions/`
3. Ative o **Modo desenvolvedor** no canto superior direito.
4. Clique em **Carregar sem compactação** (Load unpacked).
5. Selecione a pasta raiz do projeto onde o código está.
6. O ícone da extensão aparecerá na barra de ferramentas do navegador.

---

## Como usar

1. Clique no ícone da extensão **Tab Closer** na barra de ferramentas do Chrome.
2. Na janela popup que abrir, clique no botão **Fechar abas**.
3. Todas as abas, exceto a atual, serão fechadas instantaneamente.
4. Uma mensagem exibirá quantas abas foram fechadas.

---

## Estrutura do projeto

my-chrome-extension/
├─ src/
│ ├─ popup/
│ │ ├─ popup.html
│ │ ├─ popup.js
│ │ └─ popup.css
│ ├─ background/
│ │ └─ service-worker.js
├─ icons/
│ ├─ icon16.png
│ ├─ icon32.png
│ ├─ icon48.png
│ └─ icon128.png
├─ docs/
│ └─ index.html
├─ manifest.json
├─ README.md
├─ LICENSE

text

---

## Tecnologias e APIs utilizadas

- Google Chrome Extensions (Manifest V3)
- HTML, CSS, JavaScript para popup e background scripts
- API Chrome Tabs para gerenciamento de abas

---

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

## Autor

Caio Diniz  
[GitHub](https://github.com/codewithcaio) | [LinkedIn](https://www.linkedin.com/in/codewithcaio)

---

## Página do projeto (GitHub Pages)

A landing page da extensão está disponível em:  
[https://codewithcaio.github.io/bootcamp2-chrome-ext--caio.diniz/](https://codewithcaio.github.io/bootcamp2-chrome-ext--caio.diniz/)

---

_Boa codificação!_