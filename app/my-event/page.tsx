import type { Metadata } from "next";
import EventWorkspace from "./workspace";

export const metadata: Metadata = { title: "My Event | Kingsperl Events", description: "Return to your event plan, organize next steps and securely open a saved Kingsperl project.", robots: { index: false, follow: false } };
export default function MyEventPage() { return <EventWorkspace />; }
