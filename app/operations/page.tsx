import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EVENTS_BACKEND } from "@/lib/event-backend";

export const metadata: Metadata = {
  title: "Operations | Kingsperl Events",
  robots: { index: false, follow: false },
};

export default function OperationsPage() {
  redirect(`${EVENTS_BACKEND}/operations`);
}
