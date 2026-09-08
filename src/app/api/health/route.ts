import { NextResponse } from "next/server";
import { getEnvironment, isVercel } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const hasDbConfig = Boolean(
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL
  );

  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: getEnvironment(),
      platform: isVercel() ? "vercel" : "standalone",
      database: {
        configured: hasDbConfig,
      },
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
