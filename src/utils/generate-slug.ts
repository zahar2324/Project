const translit = (str: string): string => {
    const ua = "А-Б-В-Г-Д-Е-Є-Ж-З-И-І-Й-К-Л-М-Н-О-П-Р-С-Т-У-Ф-Х-Ц-Ч-Ш-Щ-Ь-Ю-Я-а-б-в-г-д-е-є-ж-з-и-і-й-к-л-м-н-о-п-р-с-т-у-ф-х-ц-ч-ш-щ-ь-ю-я".split("-");
    const en = "A-B-V-H-D-E-Ye-Zh-Z-Y-I-Y-K-L-M-N-O-P-R-S-T-U-F-Kh-Ts-Ch-Sh-Shch-Yu-Ya-a-b-v-h-d-e-ye-zh-z-y-i-y-k-l-m-n-o-p-r-s-t-u-f-kh-ts-ch-sh-shch-yu-ya".split("-");
  
    let res = "";
    for (let i = 0; i < str.length; i++) {
      const s = str.charAt(i);
      const n = ua.indexOf(s);
      res += n >= 0 ? en[n] : s;
    }
    return res;
  };
  
  export const generateSlug = (str: string): string => {
    let url: string = str.replace(/[\s]+/gi, '-');
    url = translit(url);
    
    url = url
      .replace(/[^0-9a-z\-_]+/gi, '') 
      .replace(/_{2,}/g, '_') 
      .replace(/-{2,}/g, '-') 
      .toLowerCase(); 
  
    return url;
  };
  