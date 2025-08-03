"use client";

import { redirect } from "next/navigation";
import { useUser } from "@/shared/context/UserContext";

export default async function OnboardingPage() {
  const { user } = useUser();

  const lastStep = user?.onboarding_step === 0 ? "facilities" : "staff-invite";

  // Redirect to the last step the user was on
  redirect(`/onboarding/${lastStep}`);
}
