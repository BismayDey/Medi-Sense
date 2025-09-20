"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4">
          <DotLottieReact
            src="https://lottie.host/a7b61e3d-58cc-4987-ae3d-5c637f7b1b28/8sfq4jhlQn.lottie"
            autoplay
            loop
            style={{ height: "100%", width: "100%" }}
          />
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Loading your meal planner
        </h2>
        <p className="text-gray-500">
          Preparing your personalized experience...
        </p>
      </div>
    </div>
  );
}
