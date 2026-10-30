import { forwardToKingsperl } from "@/lib/event-backend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export function POST(request: Request) { return forwardToKingsperl(request, "/api/inquiries"); }
