const KEEP_ALIVE_SCHEDULE = "*/14 * * * *";

export function startKeepAlive() {
  const base = process.env.FRONTEND_URL;

  if (!base) {
    console.warn("[cron] FRONTEND_URL not set — keep-alive disabled");
    return null;
  }

  let url;

  try {
    url = new URL("/health", base).href;
  } catch {
    console.warn(`[cron] invalid FRONTEND_URL "${base}" — keep-alive disabled`);
    return null;
  }

  return Bun.cron(KEEP_ALIVE_SCHEDULE, async () => {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(10_000),
      });

      await res.text();

      if (!res.ok) {
        console.warn(`[cron] health ping failed: ${res.status}`);
      }
    } catch (err) {
      console.error(
        "[cron] health ping error:",
        err instanceof Error ? err.message : err
      );
    }
  });
}