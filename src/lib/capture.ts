/*
 * Email capture config.
 *
 * CAPTURE_ENDPOINT is the GoHighLevel "Inbound Webhook" URL that receives form
 * posts from <EmailGate />. It is not a secret (it ships in the page), but it is
 * the one value that must be set before any gate goes live.
 *
 * SAFETY: while this is empty, every <EmailGate /> renders nothing and no
 * content is locked. A gate that hides content without capturing the email is
 * the worst of both worlds, so the gate fails open.
 *
 * Default below is the live "Website email capture (universal)" workflow.
 * Override with PUBLIC_GHL_CAPTURE_URL at build time; set that to an empty
 * string to switch every form and gate off.
 */
export const CAPTURE_ENDPOINT: string = import.meta.env.PUBLIC_GHL_CAPTURE_URL ??
  'https://services.leadconnectorhq.com/hooks/Zcj3rburZ83fWMm5n7k0/webhook-trigger/d8e161b5-49a0-410c-930f-ff2bf6658068';

export const captureEnabled = CAPTURE_ENDPOINT.length > 0;

/** Tag written to the GoHighLevel contact so Kasra can see which page a lead came from. */
export const sourceTag = (source: string) => `src:${source}`;
