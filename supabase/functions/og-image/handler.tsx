import satori from "npm:satori@0.10.9";

// Fetch a font to use with satori
const fontData = await fetch(
  "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff"
).then((res) => res.arrayBuffer());

export default async function handler(req: Request) {
  // Extract text from URL path
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  // Find the index of the function name and get the next part
  const funcName =  'og-image';
  const ogImageIndex = pathParts.findIndex(part => part === funcName);
  const customText = (ogImageIndex >= 0 && pathParts[ogImageIndex + 1])
    ? decodeURIComponent(pathParts[ogImageIndex + 1])
    : 'Hello SVG OG-image! Ossi was here.';

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

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

