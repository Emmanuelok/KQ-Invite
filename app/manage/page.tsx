import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { RsvpManager } from "@/components/rsvp-manager";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { isOrganiserEmail } from "@/lib/access";
import { getWeddingBackendOrigin } from "@/lib/backend-proxy";

export const metadata: Metadata = {
  title: "Organiser access — Kingsford & Perla",
  robots: { index: false, follow: false },
};

export default async function ManagePage() {
  const backendOrigin = getWeddingBackendOrigin();
  if (backendOrigin) redirect(`${backendOrigin}/manage`);

  const user = await requireChatGPTUser("/manage");
  if (!isOrganiserEmail(user.email)) redirect("/");
  return <RsvpManager organiserName={user.fullName ?? user.displayName} />;
}
