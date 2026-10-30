import { eventCollections, events, inspirationDirections } from "../../../event-catalog.ts";
import { profileForDirection } from "../../../design-profiles.ts";
import { normalizeGuestCount, normalizeReserve, scheduleCsv } from "../../../reference-schedule.ts";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext): Promise<Response> {
  const { id } = await context.params;
  const direction = inspirationDirections.find((item) => item.id === id);
  const error = (message: string, status: number) => new Response(message, {
    status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
  if (!direction) return error("Design not found", 404);

  const profile = profileForDirection(direction);
  const query = new URL(request.url).searchParams;
  const compatibleEvents = events.filter((event) => profile.occasionIds.includes(event.id));
  const requestedEvent = query.get("event");
  const collection = eventCollections.find((item) => item.directionIds.includes(direction.id));
  const event = requestedEvent
    ? compatibleEvents.find((item) => item.id === requestedEvent)
    : compatibleEvents.find((item) => item.title === collection?.defaultEventTitle) ?? compatibleEvents[0];
  if (!event) return error("Choose a compatible occasion for this design", 400);

  const numberFrom = (name: string) => {
    const value = query.get(name);
    return value?.trim() ? Number(value) : Number.NaN;
  };
  const guests = normalizeGuestCount(direction, numberFrom("guests"));
  const reserve = normalizeReserve(numberFrom("reserve"));
  const unit = profile.capacityBasis === "concurrent" ? "users" : "guests";
  const filename = `kingsperl-${direction.id}-${guests}-${unit}.csv`;
  return new Response(scheduleCsv(event, direction, guests, reserve), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
