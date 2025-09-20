import { useEffect } from "react";

type Props = {
  botId?: string;
};

export default function ChatbotWidget({
  botId = "z3gvNx1NGRinJSBJDGYW",
}: Props) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // prevent double injection
    if ((window as any).chatbotWidgetInjected) return;

    const js = document.createElement("script");
    js.src = "https://chatbuild.vercel.app/widget.min.js";
    js.async = true;
    js.dataset.botId = botId;
    document.head.appendChild(js);

    (window as any).chatbotWidgetInjected = true;

    return () => {
      // optional cleanup: remove injected script if you want
      const existing = document.querySelector(
        `script[src=\"https://chatbuild.vercel.app/widget.min.js\"]`
      );
      if (existing) existing.remove();
      delete (window as any).chatbotWidgetInjected;
    };
  }, [botId]);

  return null;
}
