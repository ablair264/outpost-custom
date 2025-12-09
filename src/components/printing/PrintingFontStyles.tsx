import React from 'react';

/**
 * PrintingFontStyles - Shared font face declarations for printing pages
 * Include this component once at the top of each printing page
 */
const PrintingFontStyles: React.FC = () => (
  <style>{`
    @font-face {
      font-family: 'Hearns';
      src: url('/fonts/Hearns/Hearns.woff') format('woff'),
           url('/fonts/Hearns/Hearns.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Embossing Tape';
      src: url('/fonts/embossing_tape/embosst3.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Smilecake';
      src: url('/fonts/smilecake/Smilecake.otf') format('opentype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Neuzeit Grotesk';
      src: url('/fonts/neuzeit-grotesk-regular_freefontdownload_org/neuzeit-grotesk-regular.woff2') format('woff2'),
           url('/fonts/neuzeit-grotesk-regular_freefontdownload_org/neuzeit-grotesk-regular.woff') format('woff');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Neuzeit Grotesk Light';
      src: url('/fonts/font/NeuzeitGro-Lig.ttf') format('truetype');
      font-weight: 300;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Neuzeit Grotesk Bold';
      src: url('/fonts/font/NeuzeitGro-Bol.ttf') format('truetype');
      font-weight: bold;
      font-style: normal;
      font-display: swap;
    }

    /* Font utility classes */
    .hearns-font {
      font-family: 'Hearns', Georgia, serif;
      font-weight: normal;
    }
    .embossing-font {
      font-family: 'Embossing Tape', monospace;
      letter-spacing: 0.15em;
    }
    .smilecake-font {
      font-family: 'Smilecake', cursive;
      font-weight: normal;
    }
    .neuzeit-font {
      font-family: 'Neuzeit Grotesk', 'Helvetica Neue', sans-serif;
    }
    .neuzeit-light-font {
      font-family: 'Neuzeit Grotesk Light', 'Helvetica Neue', sans-serif;
      font-weight: 300;
    }
    .neuzeit-bold-font {
      font-family: 'Neuzeit Grotesk Bold', 'Helvetica Neue', sans-serif;
      font-weight: bold;
    }
  `}</style>
);

export default PrintingFontStyles;
