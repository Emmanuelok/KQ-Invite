import { forwardToKingsperl } from "@/lib/event-backend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request, context: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await context.params;
  return forwardToKingsperl(request, `/api/projects/${encodeURIComponent(publicId)}/change-orders`);
}
