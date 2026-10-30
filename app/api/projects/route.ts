import { forwardToKingsperl, staffOnly } from "@/lib/event-backend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export function POST(request: Request) { return forwardToKingsperl(request, "/api/projects"); }
export function GET() { return staffOnly(); }
