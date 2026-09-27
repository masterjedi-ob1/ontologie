import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { taruviClient } from "./taruviClient";

/**
 * Hash parameter the build platform uses to hand this app a TaruviBase session
 * when it opens the preview, so the iframe starts signed in. The token is
 * adopted into the SDK's own storage and stripped from the URL before React
 * mounts; a fragment never reaches the server or the dev-server logs.
 */
const PREVIEW_SESSION_PARAM = "taruvi_session";

function adoptPreviewSession(): void {
  const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
  if (!hash) return;
  const params = new URLSearchParams(hash);
  const token = params.get(PREVIEW_SESSION_PARAM);
  if (!token) return;
  taruviClient.tokenClient.setTokens({ sessionToken: token });
  params.delete(PREVIEW_SESSION_PARAM);
  const rest = params.toString();
  window.history.replaceState(
    window.history.state,
    "",
    `${window.location.pathname}${window.location.search}${rest ? `#${rest}` : ""}`,
  );
}

adoptPreviewSession();

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
