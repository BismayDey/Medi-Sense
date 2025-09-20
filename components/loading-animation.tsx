"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function LoadingAnimation() {
  return (
    <div className="w-24 h-24">
      <DotLottieReact
        src="https://lottie.host/a7b61e3d-58cc-4987-ae3d-5c637f7b1b28/8sfq4jhlQn.lottie"
        loop
        autoplay
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}
