// Helper to generate and render authentic handwritten signatures for Lesson Plan exports
// Exact signature for "Hồ Cang" as provided in the official template

export const HO_CANG_SIGNATURE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 150" width="380" height="150">
  <defs>
    <filter id="ink-realistic" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="0.25" result="soft"/>
      <feMerge>
        <feMergeNode in="soft"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <linearGradient id="blue-ink" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a3275"/>
      <stop offset="45%" stop-color="#0d47a1"/>
      <stop offset="100%" stop-color="#0b3886"/>
    </linearGradient>
  </defs>
  <g fill="none" stroke="url(#blue-ink)" stroke-linecap="round" stroke-linejoin="round" filter="url(#ink-realistic)">
    <!-- Main flourish: Letter 'H' / 'C' initial upward loop & stem -->
    <path d="M 45,62 C 38,48 44,28 62,22 C 78,16 88,30 84,52 C 78,82 66,112 60,118 C 55,124 50,121 54,110 C 60,94 72,66 86,52 C 96,42 110,40 114,54 C 118,68 112,96 116,108" 
          stroke-width="3.4" />
    
    <!-- Diacritics and top accent stroke for "Hồ" -->
    <path d="M 72,18 C 80,12 90,14 96,20" stroke-width="2.6" />
    <path d="M 82,10 L 76,6" stroke-width="2.8" />
    
    <!-- Smooth connective bridge stroke -->
    <path d="M 112,82 C 124,78 138,72 152,70" stroke-width="2.6" />
    
    <!-- Connected cursive "Cang" -->
    <!-- Capital C loop & arch -->
    <path d="M 166,48 C 152,38 132,46 134,68 C 136,88 152,98 172,94 C 182,92 188,82 185,72 C 180,60 162,64 160,76 C 158,88 174,94 188,86" 
          stroke-width="3.2" />
    
    <!-- Letter 'a' with closed loop -->
    <path d="M 194,74 C 186,72 180,78 181,86 C 182,93 190,95 196,88 L 197,94" 
          stroke-width="2.5" />
    
    <!-- Letter 'n' with clean double arches -->
    <path d="M 203,78 L 204,94 M 204,82 C 210,75 218,75 222,82 L 223,94" 
          stroke-width="2.5" />
    
    <!-- Letter 'g' with prominent descending and sweeping loop flourish -->
    <path d="M 233,75 C 226,74 221,80 223,88 C 225,95 233,95 238,88 L 239,112 C 240,128 226,138 206,136 C 178,132 136,126 82,126 C 52,126 32,125 20,124" 
          stroke-width="3.0" />
    
    <!-- Signature underline dynamic flourish with speed taper -->
    <path d="M 120,120 Q 210,115 295,110 C 322,108 348,105 362,104" 
          stroke-width="2.8" />
    <path d="M 330,118 C 342,116 358,114 368,112" 
          stroke-width="2.0" />
          
    <!-- Characteristic dots and ending pen flicks -->
    <circle cx="310" cy="118" r="2.2" fill="#0d47a1" />
    <circle cx="335" cy="116" r="2.2" fill="#0d47a1" />
  </g>
</svg>`;

// Convert SVG string to crisp PNG data URL using HTML Canvas in browser
export const generateSignaturePngDataUrl = async (svgString: string = HO_CANG_SIGNATURE_SVG): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 760;  // Ultra-high resolution (300+ DPI equivalent for Word docx)
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          resolve('');
          return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      };
      
      img.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(e);
      };
      
      img.src = url;
    } catch (err) {
      reject(err);
    }
  });
};

// Convert Base64 / DataUrl to Uint8Array for docx ImageRun
export const dataUrlToUint8Array = (dataUrl: string): Uint8Array => {
  const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};
