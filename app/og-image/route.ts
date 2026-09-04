import chunk0 from "./chunks/00";
import chunk1 from "./chunks/01";
import chunk2 from "./chunks/02";
import chunk3 from "./chunks/03";
import chunk4 from "./chunks/04";
import chunk5 from "./chunks/05";
import chunk6 from "./chunks/06";
import chunk7 from "./chunks/07";
import chunk8 from "./chunks/08";
import chunk9 from "./chunks/09";
import chunk10 from "./chunks/10";
import chunk11 from "./chunks/11";
import chunk12 from "./chunks/12";
import chunk13 from "./chunks/13";
import chunk14 from "./chunks/14";
import chunk15 from "./chunks/15";

const IMAGE_BASE64 = [chunk0, chunk1, chunk2, chunk3, chunk4, chunk5, chunk6, chunk7, chunk8, chunk9, chunk10, chunk11, chunk12, chunk13, chunk14, chunk15].join("");
const IMAGE_BYTES = Uint8Array.from(atob(IMAGE_BASE64), (character) =>
  character.charCodeAt(0),
);

export function GET() {
  return new Response(IMAGE_BYTES, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": String(IMAGE_BYTES.byteLength),
      "Content-Type": "image/jpeg",
    },
  });
}
