import { useEffect } from "react";

type Props = {
  botId?: string;
};

export default function ChatbotWidget({
  botId = "z3gvNx1NGRinJSBJDGYW",
}: Props) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Use a namespaced flag to avoid collisions and re-declarations
    const INJECT_FLAG = "__medisense_chatbot_widget_injected_v1";
    if ((window as any)[INJECT_FLAG]) return;

    const js = document.createElement("script");
    js.src = "https://chatbuild.vercel.app/widget.min.js";
    js.async = true;
    js.dataset.botId = botId;
    document.head.appendChild(js);

    // mark injected without exposing other globals like API_ENDPOINT
    (window as any)[INJECT_FLAG] = true;

    // Do not remove the injected script or unset the flag on cleanup. Removing
    // the script element does not undo globals created by the widget and
    // un-setting the flag allows re-injection which leads to duplicate
    // declarations (e.g. API_ENDPOINT). Keep the widget present for the
    // lifetime of the page session.
    return () => {};
  }, [botId]);

  return null;
}
