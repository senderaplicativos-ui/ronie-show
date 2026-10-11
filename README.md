# Ronie Suárez — Landing Page

Landing page estática (sem build step) para o cantor e compositor **Ronie Suárez**.
Pronta para publicar no GitHub Pages ou na Vercel sem nenhuma etapa de compilação.

## Estrutura

```
.
├── index.html          # página única, seções 01→contato
├── css/
│   └── styles.css      # design tokens + layout responsivo + animações
├js/
│   └── main.js         # IIFE vanilla, sem dependências
├── img/                # imagens otimizadas usadas pela página
├── material/           # fontes originais (docx de conteúdo, referências, PNGs)
├── vercel.json         # headers de cache e segurança
└── .gitignore
```

Não há `package.json`, bundler ou framework. Os três arquivos da raiz do site
(`index.html`, `css/styles.css`, `js/main.js`) são servidos como estão.

## Rodando localmente

Qualquer servidor estático serve. Exemplos:

```bash
python3 -m http.server 5173
# ou
npx serve .
```

Abrir `index.html` direto pelo `file://` também funciona, mas o embed do
YouTube e alguns comportamentos de cache se comportam melhor via HTTP.

## Publicando

**GitHub + Vercel**

```bash
git init
git add .
git commit -m "Landing page Ronie Suárez"
git branch -M main
git remote add origin git@github.com:USUARIO/ronie-show.git
git push -u origin main
```

Na Vercel: *Add New Project* → importar o repositório → framework **Other**,
build command vazio, output directory `.` (raiz). O `vercel.json` já cuida dos
headers.

## Design

Tokens em `:root` no topo de `css/styles.css`. Paleta escura com dourado:

| Token | Uso |
| --- | --- |
| `--black` `--ink` `--panel` | fundos em camadas |
| `--gold` `--gold-light` `--gold-deep` | acentos, bordas, ícones |
| `--gold-grad` | texto e botões com gradiente dourado |
| `--serif` | Cormorant Garamond — títulos |
| `--sans` | Jost — interface e corpo |
| `--script` | Parisienne — assinatura e acentos |

Tipografia e espaçamentos usam `clamp()`, então escalam de forma fluida entre
mobile e desktop. As grades de cards usam `repeat(auto-fit, minmax(...))`.

## Animação

Animação leve, toda via CSS, disparada por `IntersectionObserver`:

- `.reveal` → `.is-visible` com stagger de até 5 × 90 ms
- contadores do hero animam uma vez, com easing cúbico
- zoom lento de 22 s na foto do hero
- painéis do FAQ e modais com fade curto

Tudo é desligado sob `prefers-reduced-motion: reduce`, tanto no CSS quanto no
JS (que nesse caso aplica `.is-visible` em todos os elementos de uma vez).

## Acessibilidade

Skip link, navegação por teclado no acordeão e no slider (setas, Home, End),
`aria-expanded` / `aria-controls` nos controles, `role="status"` no retorno do
formulário, foco devolvido ao elemento de origem ao fechar lightbox e modal,
e contornos `:focus-visible` visíveis sobre fundo escuro.

## Slots de imagem

Cada moldura de imagem tem `class="media"` e `data-slot`. Se um arquivo em
`img/` estiver ausente, um listener em fase de captura no `<head>` marca a
moldura e o CSS renderiza **`falta: <caminho>`** sobre ela. Ou seja: erro de
nome de arquivo aparece na própria página, não só no console.

Arquivos esperados:

```
hero.jpg  retrato.jpg  publico.jpg
casamento.jpg  corporativo.jpg  festa.jpg  exclusivo.jpg
banda-completa.jpg  acustico-banda.jpg  voz-instrumento.jpg
galeria-03.jpg  galeria-06.jpg
palco-luzes-douradas.jpg  palco-com-publico.jpg  palco-ambar.jpg  palco-neon.jpg
```

## Pendências antes de ir ao ar

- [ ] **Depoimentos** — os três blocos são placeholders (`[Nome do cliente]`).
      Substituir por depoimentos reais autorizados.
- [ ] **Vídeo** — trocar `data-video-id="VIDEO_ID"` em `#videoModal` pelo ID
      real do YouTube. Enquanto estiver `VIDEO_ID`, o botão abre o YouTube em
      nova aba em vez de embutir o player.
- [x] **Redes sociais** — Instagram, YouTube, Facebook, X e Spotify
      apontando para os perfis reais (header, galeria, contato e footer).
- [ ] **Envio do formulário** — hoje o submit apenas valida e confirma
      localmente. Integrar endpoint próprio, serviço de formulário ou trocar
      por link `wa.me` com mensagem pré-montada.
- [ ] **FAQ comercial** — itens que dependem de informação ainda não definida
      (cachê, duração, equipamento incluso, deslocamento e hospedagem,
      pagamento e sinal, cancelamento) estão marcados como `PENDENTE` no HTML.
- [ ] **OG image** — `og:image` aponta para `img/hero.jpg` por caminho
      relativo; trocar pela URL absoluta do domínio final.

## Notas de produção (conteúdo)

Restrições vindas do documento de conteúdo aprovado, a serem respeitadas em
qualquer edição futura:

- Instagram e YouTube são as redes principais. **TikTok não entra no menu.**
- **Não** apresentar Ronie como cantor de cerimônia de casamento (recepção,
  jantar e festa, sim).
- **Não** inventar depoimentos, preços, duração de show, equipamentos,
  políticas de viagem ou condições comerciais.
- Direção visual premium, cinematográfica, masculina, contemporânea e
  editorial, coerente com o Press Kit.
