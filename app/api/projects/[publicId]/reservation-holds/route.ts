import { staffOnly } from "@/lib/event-backend";

export function POST() { return staffOnly(); }
