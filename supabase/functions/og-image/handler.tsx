import satori from "npm:satori@0.10.9";

// Fetch a font to use with satori
const fontData = await fetch(
  "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff"
).then((res) => res.arrayBuffer());

export default async function handler(req: Request) {
  const svg = await satori(
    {
      type: 'div',
      props: {
        children: 'Hello OG image!',
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 128,
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

