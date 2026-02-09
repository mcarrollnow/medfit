-- Update products with Yellow SVG (Weightloss)
UPDATE public.products 
SET cart_image = '<?xml version="1.0" encoding="UTF-8"?>
<svg id="Camada_2" data-name="Camada 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 841.89 1192.33">
  <defs>
    <linearGradient id="linear-gradient" x1="743.43" y1="-449.84" x2="743.43" y2="281.51" gradientTransform="translate(1156.86 680.33) rotate(-180) scale(1 -1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#1a1a0a"/>
      <stop offset=".07" stop-color="#1d1d0b"/>
      <stop offset=".16" stop-color="#2b2b11"/>
      <stop offset=".21" stop-color="#3a3a16"/>
      <stop offset=".24" stop-color="#4d4d1e"/>
      <stop offset=".31" stop-color="#6b6b2a"/>
      <stop offset=".41" stop-color="#9a9a3d"/>
      <stop offset=".43" stop-color="#a8a843"/>
      <stop offset=".46" stop-color="#baba4a"/>
      <stop offset=".53" stop-color="#e0e054"/>
      <stop offset=".59" stop-color="#f5f559"/>
      <stop offset=".62" stop-color="#fff95e"/>
      <stop offset=".67" stop-color="#f5f059"/>
      <stop offset=".75" stop-color="#e0d54a"/>
      <stop offset=".86" stop-color="#c1b03d"/>
      <stop offset=".88" stop-color="#bba83a"/>
      <stop offset=".9" stop-color="#ab9a34"/>
      <stop offset=".92" stop-color="#91822c"/>
      <stop offset=".95" stop-color="#6d6321"/>
      <stop offset=".98" stop-color="#3f3a13"/>
      <stop offset="1" stop-color="#161508"/>
    </linearGradient>
    <linearGradient id="linear-gradient-2" x1="743.43" y1="-455.39" x2="743.43" y2="275.95" gradientTransform="translate(1156.86 787.39) rotate(-180) scale(1 -.68)" xlink:href="#linear-gradient"/>
  </defs>
  <g id="Camada_1-2" data-name="Camada 1-2">
    <g>
      <rect width="841.89" height="1192.33" rx="180" ry="180" style="fill: #010202; stroke: #fff95e; stroke-width: 3;"/>
      <rect x="165.77" y="230.49" width="495.32" height="731.35" rx="247.66" ry="247.66" style="fill: url(#linear-gradient);"/>
      <path d="M413.43,975.25h0c-136.78,0-247.66-110.88-247.66-247.66h0c0-136.78,110.88-247.66,247.66-247.66h0c136.78,0,247.66,110.88,247.66,247.66h0c0,136.78-110.88,247.66-247.66,247.66Z" style="fill: url(#linear-gradient-2);"/>
    </g>
  </g>
</svg>'
WHERE base_name IN ('BPC-157', 'IGF-1 LR3', 'NAD+', 'PEG-MGF', 'Retatrutide', 'Semaglutide', 'Tirzepatide');

-- Update products with Purple SVG (Growth)
UPDATE public.products 
SET cart_image = '<?xml version="1.0" encoding="UTF-8"?>
<svg id="Camada_2" data-name="Camada 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 841.89 1192.33">
  <defs>
    <linearGradient id="linear-gradient" x1="743.43" y1="-449.84" x2="743.43" y2="281.51" gradientTransform="translate(1156.86 680.33) rotate(-180) scale(1 -1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#0d0220"/>
      <stop offset=".07" stop-color="#0f0226"/>
      <stop offset=".16" stop-color="#160333"/>
      <stop offset=".21" stop-color="#1d0444"/>
      <stop offset=".24" stop-color="#260555"/>
      <stop offset=".31" stop-color="#360677"/>
      <stop offset=".41" stop-color="#4d08aa"/>
      <stop offset=".43" stop-color="#5308bb"/>
      <stop offset=".46" stop-color="#5a08cc"/>
      <stop offset=".53" stop-color="#6009ee"/>
      <stop offset=".59" stop-color="#6309fa"/>
      <stop offset=".62" stop-color="#6609ff"/>
      <stop offset=".67" stop-color="#6009fa"/>
      <stop offset=".75" stop-color="#5508e6"/>
      <stop offset=".86" stop-color="#4407c1"/>
      <stop offset=".88" stop-color="#4106bb"/>
      <stop offset=".9" stop-color="#3b06ab"/>
      <stop offset=".92" stop-color="#330591"/>
      <stop offset=".95" stop-color="#28046d"/>
      <stop offset=".98" stop-color="#1a033f"/>
      <stop offset="1" stop-color="#0a0116"/>
    </linearGradient>
    <linearGradient id="linear-gradient-2" x1="743.43" y1="-455.39" x2="743.43" y2="275.95" gradientTransform="translate(1156.86 787.39) rotate(-180) scale(1 -.68)" xlink:href="#linear-gradient"/>
  </defs>
  <g id="Camada_1-2" data-name="Camada 1-2">
    <g>
      <rect width="841.89" height="1192.33" rx="180" ry="180" style="fill: #010202; stroke: #6609ff; stroke-width: 3;"/>
      <rect x="165.77" y="230.49" width="495.32" height="731.35" rx="247.66" ry="247.66" style="fill: url(#linear-gradient);"/>
      <path d="M413.43,975.25h0c-136.78,0-247.66-110.88-247.66-247.66h0c0-136.78,110.88-247.66,247.66-247.66h0c136.78,0,247.66,110.88,247.66,247.66h0c0,136.78-110.88,247.66-247.66,247.66Z" style="fill: url(#linear-gradient-2);"/>
    </g>
  </g>
</svg>'
WHERE base_name IN ('AOD-9604', 'CJC-1295 w DAC', 'CJC-1295 w/o DAC', 'DSIP', 'GHRP-2', 'Hexarelin', 'Ipamorelin', 'Selank', 'Semax', 'Sermorelin', 'SS-31', 'Tesamorelin');

-- Update products with Red SVG (Sexual)
UPDATE public.products 
SET cart_image = '<?xml version="1.0" encoding="UTF-8"?>
<svg id="Camada_2" data-name="Camada 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 841.89 1192.33">
  <defs>
    <linearGradient id="linear-gradient" x1="743.43" y1="-449.84" x2="743.43" y2="281.51" gradientTransform="translate(1156.86 680.33) rotate(-180) scale(1 -1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#1d0008"/>
      <stop offset=".07" stop-color="#22000a"/>
      <stop offset=".16" stop-color="#33000f"/>
      <stop offset=".21" stop-color="#440014"/>
      <stop offset=".24" stop-color="#55001a"/>
      <stop offset=".31" stop-color="#770024"/>
      <stop offset=".41" stop-color="#aa0030"/>
      <stop offset=".43" stop-color="#bb0035"/>
      <stop offset=".46" stop-color="#cc0039"/>
      <stop offset=".53" stop-color="#dd003e"/>
      <stop offset=".59" stop-color="#e30040"/>
      <stop offset=".62" stop-color="#e60041"/>
      <stop offset=".67" stop-color="#dd003e"/>
      <stop offset=".75" stop-color="#cc0039"/>
      <stop offset=".86" stop-color="#aa0030"/>
      <stop offset=".88" stop-color="#a1002d"/>
      <stop offset=".9" stop-color="#910029"/>
      <stop offset=".92" stop-color="#770022"/>
      <stop offset=".95" stop-color="#550019"/>
      <stop offset=".98" stop-color="#33000f"/>
      <stop offset="1" stop-color="#110005"/>
    </linearGradient>
    <linearGradient id="linear-gradient-2" x1="743.43" y1="-455.39" x2="743.43" y2="275.95" gradientTransform="translate(1156.86 787.39) rotate(-180) scale(1 -.68)" xlink:href="#linear-gradient"/>
  </defs>
  <g id="Camada_1-2" data-name="Camada 1-2">
    <g>
      <rect width="841.89" height="1192.33" rx="180" ry="180" style="fill: #010202; stroke: #e60041; stroke-width: 3;"/>
      <rect x="165.77" y="230.49" width="495.32" height="731.35" rx="247.66" ry="247.66" style="fill: url(#linear-gradient);"/>
      <path d="M413.43,975.25h0c-136.78,0-247.66-110.88-247.66-247.66h0c0-136.78,110.88-247.66,247.66-247.66h0c136.78,0,247.66,110.88,247.66,247.66h0c0,136.78-110.88,247.66-247.66,247.66Z" style="fill: url(#linear-gradient-2);"/>
    </g>
  </g>
</svg>'
WHERE base_name IN ('HCG', 'HMG 75iu/vial', 'Kisspeptin-10', 'Melanotan 2', 'Oxytocin Acetate', 'PT-141');

-- Update products with Pink SVG (Sleep)
UPDATE public.products 
SET cart_image = '<?xml version="1.0" encoding="UTF-8"?>
<svg id="Camada_2" data-name="Camada 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 841.89 1192.33">
  <defs>
    <linearGradient id="linear-gradient" x1="743.43" y1="-449.84" x2="743.43" y2="281.51" gradientTransform="translate(1156.86 680.33) rotate(-180) scale(1 -1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#200a20"/>
      <stop offset=".07" stop-color="#260d26"/>
      <stop offset=".16" stop-color="#331433"/>
      <stop offset=".21" stop-color="#441a44"/>
      <stop offset=".24" stop-color="#552255"/>
      <stop offset=".31" stop-color="#773377"/>
      <stop offset=".41" stop-color="#aa3aaa"/>
      <stop offset=".43" stop-color="#bb40bb"/>
      <stop offset=".46" stop-color="#cc44cc"/>
      <stop offset=".53" stop-color="#ee49ee"/>
      <stop offset=".59" stop-color="#fa4bfa"/>
      <stop offset=".62" stop-color="#ff4dfd"/>
      <stop offset=".67" stop-color="#fa4bfa"/>
      <stop offset=".75" stop-color="#ee49ee"/>
      <stop offset=".86" stop-color="#cc44cc"/>
      <stop offset=".88" stop-color="#bb40bb"/>
      <stop offset=".9" stop-color="#aa3aaa"/>
      <stop offset=".92" stop-color="#913391"/>
      <stop offset=".95" stop-color="#6d286d"/>
      <stop offset=".98" stop-color="#441a44"/>
      <stop offset="1" stop-color="#160816"/>
    </linearGradient>
    <linearGradient id="linear-gradient-2" x1="743.43" y1="-455.39" x2="743.43" y2="275.95" gradientTransform="translate(1156.86 787.39) rotate(-180) scale(1 -.68)" xlink:href="#linear-gradient"/>
  </defs>
  <g id="Camada_1-2" data-name="Camada 1-2">
    <g>
      <rect width="841.89" height="1192.33" rx="180" ry="180" style="fill: #010202; stroke: #ff4dfd; stroke-width: 3;"/>
      <rect x="165.77" y="230.49" width="495.32" height="731.35" rx="247.66" ry="247.66" style="fill: url(#linear-gradient);"/>
      <path d="M413.43,975.25h0c-136.78,0-247.66-110.88-247.66-247.66h0c0-136.78,110.88-247.66,247.66-247.66h0c136.78,0,247.66,110.88,247.66,247.66h0c0,136.78-110.88,247.66-247.66,247.66Z" style="fill: url(#linear-gradient-2);"/>
    </g>
  </g>
</svg>'
WHERE base_name IN ('Epithalon');

-- Update products with Blue SVG (Appetite)
UPDATE public.products 
SET cart_image = '<?xml version="1.0" encoding="UTF-8"?>
<svg id="Camada_2" data-name="Camada 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 841.89 1192.33">
  <defs>
    <linearGradient id="linear-gradient" x1="743.43" y1="-449.84" x2="743.43" y2="281.51" gradientTransform="translate(1156.86 680.33) rotate(-180) scale(1 -1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#021120"/>
      <stop offset=".07" stop-color="#031426"/>
      <stop offset=".16" stop-color="#051e33"/>
      <stop offset=".21" stop-color="#072844"/>
      <stop offset=".24" stop-color="#093355"/>
      <stop offset=".31" stop-color="#0c4477"/>
      <stop offset=".41" stop-color="#0e5faa"/>
      <stop offset=".43" stop-color="#0f66bb"/>
      <stop offset=".46" stop-color="#0f70cc"/>
      <stop offset=".53" stop-color="#1080ee"/>
      <stop offset=".59" stop-color="#1084fa"/>
      <stop offset=".62" stop-color="#1086ff"/>
      <stop offset=".67" stop-color="#1080fa"/>
      <stop offset=".75" stop-color="#0f70e6"/>
      <stop offset=".86" stop-color="#0e5fc1"/>
      <stop offset=".88" stop-color="#0d58bb"/>
      <stop offset=".9" stop-color="#0c4fab"/>
      <stop offset=".92" stop-color="#0b4491"/>
      <stop offset=".95" stop-color="#09336d"/>
      <stop offset=".98" stop-color="#061f3f"/>
      <stop offset="1" stop-color="#020b16"/>
    </linearGradient>
    <linearGradient id="linear-gradient-2" x1="743.43" y1="-455.39" x2="743.43" y2="275.95" gradientTransform="translate(1156.86 787.39) rotate(-180) scale(1 -.68)" xlink:href="#linear-gradient"/>
  </defs>
  <g id="Camada_1-2" data-name="Camada 1-2">
    <g>
      <rect width="841.89" height="1192.33" rx="180" ry="180" style="fill: #010202; stroke: #1086ff; stroke-width: 3;"/>
      <rect x="165.77" y="230.49" width="495.32" height="731.35" rx="247.66" ry="247.66" style="fill: url(#linear-gradient);"/>
      <path d="M413.43,975.25h0c-136.78,0-247.66-110.88-247.66-247.66h0c0-136.78,110.88-247.66,247.66-247.66h0c136.78,0,247.66,110.88,247.66,247.66h0c0,136.78-110.88,247.66-247.66,247.66Z" style="fill: url(#linear-gradient-2);"/>
    </g>
  </g>
</svg>'
WHERE base_name IN ('Cagrilintide');

-- Update products with Green SVG (Healing)
UPDATE public.products 
SET cart_image = '<?xml version="1.0" encoding="UTF-8"?>
<svg id="Camada_2" data-name="Camada 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 841.89 1192.33">
  <defs>
    <linearGradient id="linear-gradient" x1="743.43" y1="-449.84" x2="743.43" y2="281.51" gradientTransform="translate(1156.86 680.33) rotate(-180) scale(1 -1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#092010"/>
      <stop offset=".07" stop-color="#0b2613"/>
      <stop offset=".16" stop-color="#0f331a"/>
      <stop offset=".21" stop-color="#144422"/>
      <stop offset=".24" stop-color="#1a552b"/>
      <stop offset=".31" stop-color="#24773c"/>
      <stop offset=".41" stop-color="#30aa55"/>
      <stop offset=".43" stop-color="#35bb5e"/>
      <stop offset=".46" stop-color="#39cc66"/>
      <stop offset=".53" stop-color="#40ee72"/>
      <stop offset=".59" stop-color="#44fa78"/>
      <stop offset=".62" stop-color="#47ff7b"/>
      <stop offset=".67" stop-color="#44fa78"/>
      <stop offset=".75" stop-color="#3de66e"/>
      <stop offset=".86" stop-color="#30c15a"/>
      <stop offset=".88" stop-color="#2dbb55"/>
      <stop offset=".9" stop-color="#29ab4f"/>
      <stop offset=".92" stop-color="#229143"/>
      <stop offset=".95" stop-color="#196d32"/>
      <stop offset=".98" stop-color="#0f3f1e"/>
      <stop offset="1" stop-color="#05160a"/>
    </linearGradient>
    <linearGradient id="linear-gradient-2" x1="743.43" y1="-455.39" x2="743.43" y2="275.95" gradientTransform="translate(1156.86 787.39) rotate(-180) scale(1 -.68)" xlink:href="#linear-gradient"/>
  </defs>
  <g id="Camada_1-2" data-name="Camada 1-2">
    <g>
      <rect width="841.89" height="1192.33" rx="180" ry="180" style="fill: #010202; stroke: #47ff7b; stroke-width: 3;"/>
      <rect x="165.77" y="230.49" width="495.32" height="731.35" rx="247.66" ry="247.66" style="fill: url(#linear-gradient);"/>
      <path d="M413.43,975.25h0c-136.78,0-247.66-110.88-247.66-247.66h0c0-136.78,110.88-247.66,247.66-247.66h0c136.78,0,247.66,110.88,247.66,247.66h0c0,136.78-110.88,247.66-247.66,247.66Z" style="fill: url(#linear-gradient-2);"/>
    </g>
  </g>
</svg>'
WHERE base_name IN ('Adipotide', 'PNC-27', 'TB-500', 'Thymosin Alpha-1', 'Thymulin');

-- Update products with Orange SVG (Energy)
UPDATE public.products 
SET cart_image = '<?xml version="1.0" encoding="UTF-8"?>
<svg id="Camada_2" data-name="Camada 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 841.89 1192.33">
  <defs>
    <linearGradient id="linear-gradient" x1="743.43" y1="-449.84" x2="743.43" y2="281.51" gradientTransform="translate(1156.86 680.33) rotate(-180) scale(1 -1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#201309"/>
      <stop offset=".07" stop-color="#26160b"/>
      <stop offset=".16" stop-color="#331e0f"/>
      <stop offset=".21" stop-color="#442714"/>
      <stop offset=".24" stop-color="#55321a"/>
      <stop offset=".31" stop-color="#774524"/>
      <stop offset=".41" stop-color="#aa6030"/>
      <stop offset=".43" stop-color="#bb6a35"/>
      <stop offset=".46" stop-color="#cc7539"/>
      <stop offset=".53" stop-color="#ee8840"/>
      <stop offset=".59" stop-color="#fa9243"/>
      <stop offset=".62" stop-color="#ff9845"/>
      <stop offset=".67" stop-color="#fa9243"/>
      <stop offset=".75" stop-color="#e6833d"/>
      <stop offset=".86" stop-color="#c16e33"/>
      <stop offset=".88" stop-color="#bb6a31"/>
      <stop offset=".9" stop-color="#ab602d"/>
      <stop offset=".92" stop-color="#915228"/>
      <stop offset=".95" stop-color="#6d3e1f"/>
      <stop offset=".98" stop-color="#3f2413"/>
      <stop offset="1" stop-color="#160d06"/>
    </linearGradient>
    <linearGradient id="linear-gradient-2" x1="743.43" y1="-455.39" x2="743.43" y2="275.95" gradientTransform="translate(1156.86 787.39) rotate(-180) scale(1 -.68)" xlink:href="#linear-gradient"/>
  </defs>
  <g id="Camada_1-2" data-name="Camada 1-2">
    <g>
      <rect width="841.89" height="1192.33" rx="180" ry="180" style="fill: #010202; stroke: #ff9845; stroke-width: 3;"/>
      <rect x="165.77" y="230.49" width="495.32" height="731.35" rx="247.66" ry="247.66" style="fill: url(#linear-gradient);"/>
      <path d="M413.43,975.25h0c-136.78,0-247.66-110.88-247.66-247.66h0c0-136.78,110.88-247.66,247.66-247.66h0c136.78,0,247.66,110.88,247.66,247.66h0c0,136.78-110.88,247.66-247.66,247.66Z" style="fill: url(#linear-gradient-2);"/>
    </g>
  </g>
</svg>'
WHERE base_name IN ('MOTS-C', 'SLU-PP-32', 'PEG-MGF');

-- Update products with Gray SVG (Beauty)
UPDATE public.products 
SET cart_image = '<?xml version="1.0" encoding="UTF-8"?>
<svg id="Camada_2" data-name="Camada 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 841.89 1192.33">
  <defs>
    <linearGradient id="linear-gradient" x1="743.43" y1="-449.84" x2="743.43" y2="281.51" gradientTransform="translate(1156.86 680.33) rotate(-180) scale(1 -1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#101010"/>
      <stop offset=".07" stop-color="#131313"/>
      <stop offset=".16" stop-color="#1a1a1a"/>
      <stop offset=".21" stop-color="#222222"/>
      <stop offset=".24" stop-color="#2b2b2b"/>
      <stop offset=".31" stop-color="#3c3c3c"/>
      <stop offset=".41" stop-color="#555555"/>
      <stop offset=".43" stop-color="#5e5e5e"/>
      <stop offset=".46" stop-color="#666666"/>
      <stop offset=".53" stop-color="#747474"/>
      <stop offset=".59" stop-color="#7c7c7c"/>
      <stop offset=".62" stop-color="#818181"/>
      <stop offset=".67" stop-color="#7c7c7c"/>
      <stop offset=".75" stop-color="#737373"/>
      <stop offset=".86" stop-color="#606060"/>
      <stop offset=".88" stop-color="#5d5d5d"/>
      <stop offset=".9" stop-color="#555555"/>
      <stop offset=".92" stop-color="#494949"/>
      <stop offset=".95" stop-color="#363636"/>
      <stop offset=".98" stop-color="#1f1f1f"/>
      <stop offset="1" stop-color="#0b0b0b"/>
    </linearGradient>
    <linearGradient id="linear-gradient-2" x1="743.43" y1="-455.39" x2="743.43" y2="275.95" gradientTransform="translate(1156.86 787.39) rotate(-180) scale(1 -.68)" xlink:href="#linear-gradient"/>
  </defs>
  <g id="Camada_1-2" data-name="Camada 1-2">
    <g>
      <rect width="841.89" height="1192.33" rx="180" ry="180" style="fill: #010202; stroke: #818181; stroke-width: 3;"/>
      <rect x="165.77" y="230.49" width="495.32" height="731.35" rx="247.66" ry="247.66" style="fill: url(#linear-gradient);"/>
      <path d="M413.43,975.25h0c-136.78,0-247.66-110.88-247.66-247.66h0c0-136.78,110.88-247.66,247.66-247.66h0c136.78,0,247.66,110.88,247.66,247.66h0c0,136.78-110.88,247.66-247.66,247.66Z" style="fill: url(#linear-gradient-2);"/>
    </g>
  </g>
</svg>'
WHERE base_name IN ('GHK-Cu', 'Snap-8');