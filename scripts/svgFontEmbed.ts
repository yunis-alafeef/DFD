import fs from 'fs';

let cachedMainFontCss: string | null = null;
let cachedErdFontCss: string | null = null;

function readFontBase64(fontPath: string): string {
  return fs.readFileSync(fontPath).toString('base64');
}

function buildArabicAndSansFaces(): string {
  const kufiReg = readFontBase64('/usr/share/fonts/truetype/noto/NotoKufiArabic-Regular.ttf');
  const kufiBold = readFontBase64('/usr/share/fonts/truetype/noto/NotoKufiArabic-Bold.ttf');
  const sansArReg = readFontBase64('/usr/share/fonts/truetype/noto/NotoSansArabic-Regular.ttf');
  const sansArBold = readFontBase64('/usr/share/fonts/truetype/noto/NotoSansArabic-Bold.ttf');
  const libSansReg = readFontBase64('/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf');
  const libSansBold = readFontBase64('/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf');

  return `
      @font-face {
        font-family: 'Noto Kufi Arabic';
        font-style: normal;
        font-weight: 400;
        src: url('data:font/ttf;base64,${kufiReg}') format('truetype');
      }
      @font-face {
        font-family: 'Noto Kufi Arabic';
        font-style: normal;
        font-weight: 700;
        src: url('data:font/ttf;base64,${kufiBold}') format('truetype');
      }
      @font-face {
        font-family: 'Noto Sans Arabic';
        font-style: normal;
        font-weight: 400;
        src: url('data:font/ttf;base64,${sansArReg}') format('truetype');
      }
      @font-face {
        font-family: 'Noto Sans Arabic';
        font-style: normal;
        font-weight: 600;
        src: url('data:font/ttf;base64,${sansArBold}') format('truetype');
      }
      @font-face {
        font-family: 'Noto Sans Arabic';
        font-style: normal;
        font-weight: 700;
        src: url('data:font/ttf;base64,${sansArBold}') format('truetype');
      }
      @font-face {
        font-family: 'Liberation Sans';
        font-style: normal;
        font-weight: 400;
        src: url('data:font/ttf;base64,${libSansReg}') format('truetype');
      }
      @font-face {
        font-family: 'Liberation Sans';
        font-style: normal;
        font-weight: 700;
        src: url('data:font/ttf;base64,${libSansBold}') format('truetype');
      }`;
}

export function getMainSvgFontsCss(): string {
  if (cachedMainFontCss) return cachedMainFontCss;
  const libMonoReg = readFontBase64('/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf');
  const libMonoBold = readFontBase64('/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf');

  cachedMainFontCss = `${buildArabicAndSansFaces()}
      @font-face {
        font-family: 'Liberation Mono';
        font-style: normal;
        font-weight: 400;
        src: url('data:font/ttf;base64,${libMonoReg}') format('truetype');
      }
      @font-face {
        font-family: 'Liberation Mono';
        font-style: normal;
        font-weight: 700;
        src: url('data:font/ttf;base64,${libMonoBold}') format('truetype');
      }
      svg { text-rendering: geometricPrecision; shape-rendering: geometricPrecision; }
      text { font-kerning: normal; }
  `;
  return cachedMainFontCss;
}

export function getErdSvgFontsCss(): string {
  if (cachedErdFontCss) return cachedErdFontCss;
  const kufiBold = readFontBase64('/usr/share/fonts/truetype/noto/NotoKufiArabic-Bold.ttf');
  const sansArReg = readFontBase64('/usr/share/fonts/truetype/noto/NotoSansArabic-Regular.ttf');
  const sansArBold = readFontBase64('/usr/share/fonts/truetype/noto/NotoSansArabic-Bold.ttf');
  const libSansReg = readFontBase64('/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf');

  cachedErdFontCss = `
      @font-face {
        font-family: 'Noto Kufi Arabic';
        font-style: normal;
        font-weight: 700;
        src: url('data:font/ttf;base64,${kufiBold}') format('truetype');
      }
      @font-face {
        font-family: 'Noto Sans Arabic';
        font-style: normal;
        font-weight: 400;
        src: url('data:font/ttf;base64,${sansArReg}') format('truetype');
      }
      @font-face {
        font-family: 'Noto Sans Arabic';
        font-style: normal;
        font-weight: 600;
        src: url('data:font/ttf;base64,${sansArBold}') format('truetype');
      }
      @font-face {
        font-family: 'Noto Sans Arabic';
        font-style: normal;
        font-weight: 700;
        src: url('data:font/ttf;base64,${sansArBold}') format('truetype');
      }
      @font-face {
        font-family: 'Liberation Sans';
        font-style: normal;
        font-weight: 400;
        src: url('data:font/ttf;base64,${libSansReg}') format('truetype');
      }
      svg { text-rendering: geometricPrecision; shape-rendering: geometricPrecision; }
      text { font-kerning: normal; }
  `;
  return cachedErdFontCss;
}
