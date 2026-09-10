import { NextResponse } from "next/server";
import { generateAdsTxtContent } from "@/lib/ads";

export async function GET() {
  const clientId =
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ||
    process.env.ADSENSE_PUB_ID ||
    null;

  const content = generateAdsTxtContent(clientId);

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
