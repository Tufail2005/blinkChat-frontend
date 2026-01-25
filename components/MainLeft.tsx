"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LandingHero } from "./LandingHero";
import { EmailForm } from "./Email-form";
import { OTPForm } from "./otp-form";

type Step = "landing" | "email" | "otp";

export default function MainLeft() {
  const [step, setStep] = useState<Step>("landing");
  const [email, setEmail] = useState("");
  const router = useRouter();

  return (
    <>
      {step === "landing" && (
        <LandingHero onGetStarted={() => setStep("email")} />
      )}

      {step === "email" && (
        <EmailForm
          onSuccess={(email) => {
            setEmail(email);
            setStep("otp");
          }}
        />
      )}

      {step === "otp" && (
        <OTPForm
          email={email}
          onVerified={() => {
            router.push("/signup");
          }}
        />
      )}
    </>
  );
}
