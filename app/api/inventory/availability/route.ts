import { staffOnly } from "@/lib/event-backend";

export function GET() { return staffOnly(); }
