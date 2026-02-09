UPDATE public.products 
SET cart_image = REGEXP_REPLACE(
    cart_image, 
    '(<rect width="841\.89" height="1192\.33" rx="180" ry="180" style="fill: #010202); stroke: #[0-9a-fA-F]{6}; stroke-width: 3;(")', 
    '\1\2', 
    'g'
);