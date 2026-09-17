/*
 * Browser-side email capture. Shared by <EmailGate /> and <EmailSignup /> so
 * every form on the site sends GoHighLevel the same fields in the same shape.
 *
 * ONE webhook, ONE workflow. What differs per form travels in the data:
 *   source      page or placement slug            -> contact source
 *   tag         "src:<source>"                    -> contact tag (where they came from)
 *   asset_name  what they asked for, if anything  -> first line of the welcome email
 *   asset_url   where to get it                   -> first line of the welcome email
 * A plain newsletter signup sends asset_name/asset_url empty and the welcome
 * email skips that line.
 */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const SUBSCRIBED_KEY = 'kd_subscribed';

function readJSON(store: Storage, key: string): Record<string, string> {
  try {
    return JSON.parse(store.getItem(key) ?? '{}') ?? {};
  } catch {
    return {};
  }
}

export interface CaptureInput {
  endpoint: string;
  email: string;
  firstName?: string;
  source: string;
  tag: string;
  assetName?: string;
  assetUrl?: string;
}

/** Build the payload (exported so it can be inspected in tests). */
export function buildPayload(input: CaptureInput): URLSearchParams {
  let first: Record<string, string> = {};
  let last: Record<string, string> = {};
  try {
    first = readJSON(localStorage, 'kd_first_touch');
    last = readJSON(sessionStorage, 'kd_last_touch');
  } catch {
    /* storage blocked */
  }
  const pick = (k: string) => last[k] ?? first[k] ?? '';
  return new URLSearchParams({
    email: input.email,
    first_name: input.firstName ?? '',
    source: input.source,
    tag: input.tag,
    asset_name: input.assetName ?? '',
    asset_url: input.assetUrl ?? '',
    page_url: location.origin + location.pathname,
    page_path: location.pathname,
    page_title: document.title,
    utm_source: pick('utm_source'),
    utm_medium: pick('utm_medium'),
    utm_campaign: pick('utm_campaign'),
    utm_term: pick('utm_term'),
    utm_content: pick('utm_content'),
    first_utm_source: first.utm_source ?? '',
    first_utm_medium: first.utm_medium ?? '',
    first_utm_campaign: first.utm_campaign ?? '',
    first_landing: first.landing ?? '',
    first_referrer: first.referrer ?? '',
    first_seen: first.at ?? '',
    fbclid: pick('fbclid'),
    gclid: pick('gclid'),
    referrer: last.referrer ?? first.referrer ?? '',
    consent: 'yes',
    submitted_at: new Date().toISOString(),
  });
}

/**
 * Post to the GoHighLevel webhook. Never throws: a network failure must not
 * punish the reader, so callers always proceed to their success state.
 */
export async function submitCapture(input: CaptureInput): Promise<void> {
  try {
    // no-cors: the webhook is cross-origin and we do not need to read the reply.
    await fetch(input.endpoint, { method: 'POST', mode: 'no-cors', body: buildPayload(input), keepalive: true });
  } catch {
    /* swallow */
  }
  try {
    localStorage.setItem(SUBSCRIBED_KEY, new Date().toISOString());
  } catch {
    /* private mode */
  }
  document.documentElement.classList.add('kd-subscribed');
}

/** Read + validate a capture form. Returns null (and shows the error) if invalid, 'bot' for honeypot hits. */
export function readForm(form: HTMLFormElement, errorEl: HTMLElement): { email: string; firstName: string } | 'bot' | null {
  errorEl.hidden = true;
  const data = new FormData(form);
  if (String(data.get('company_website') ?? '') !== '') return 'bot';
  const email = String(data.get('email') ?? '').trim();
  // First name is only enforced where the input is marked required (the gates), so the emails can open "Hey <name>,".
  const nameInput = form.querySelector<HTMLInputElement>('input[name="first_name"]');
  const firstName = String(data.get('first_name') ?? '').trim();
  if (nameInput?.required && firstName === '') {
    errorEl.textContent = 'Add your first name so I know who I am emailing.';
    errorEl.hidden = false;
    nameInput.focus();
    return null;
  }
  if (!EMAIL_RE.test(email)) {
    errorEl.textContent = 'That email does not look right. Check it and try again.';
    errorEl.hidden = false;
    return null;
  }
  return { email, firstName };
}
