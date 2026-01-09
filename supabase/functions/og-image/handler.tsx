import satori from "npm:satori@0.10.9";
import { createClient } from 'npm:@supabase/supabase-js@2'

const STORAGE_URL = "https://bavrzuzkuteozcymmsoq.supabase.co/storage/v1/object/public/public_images/sAMG/";

// Fetch a font to use with satori
const fontData = await fetch(
  "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff"
).then((res) => res.arrayBuffer());

/**
 * Handles requests for generating or retrieving Open Graph (OG) images as SVGs.
 * Extracts custom text from the URL path, attempts to fetch an existing SVG from storage,
 * and if not found, generates a new one using Satori, uploads it to Supabase storage, and returns it.
 * 
 * @param req - The incoming HTTP request object.
 * @returns A Response containing the SVG image with appropriate headers for caching.
 */
export default async function handler(req: Request) {
  // Extract text from URL path
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  // Find the index of the function name and get the next part
  const funcName =  'og-image';
  const ogImageIndex = pathParts.findIndex(part => part === funcName);
  const customText = (ogImageIndex >= 0 && pathParts[ogImageIndex + 1])
    ? decodeURIComponent(pathParts[ogImageIndex + 1])
    : 'The Anyim Ossi.';

  const storageRes = await fetch(`${STORAGE_URL}${customText}.svg`);
  if (storageRes.ok) {
    const svgContent = await storageRes.text();
    return new Response(svgContent, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  const svg = await satori(
    {
      type: 'div',
      props: {
        children: customText,
        style: {
          width: '50%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 64,
          background: 'lavender',
          fontFamily: 'Inter',
        },
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          weight: 400,
          style: 'normal',
        },
      ],
    }
  );

  // uplaod to supabase storage
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data, error } = await supabaseAdmin.storage.from('public_images').upload(
    `sAMG/${customText}.svg`,
    new Blob([svg], { type: 'image/svg+xml' }),
    {
      cacheControl: '31536000',
      upsert: true,
      contentType: 'image/svg+xml',
    }
  );
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

