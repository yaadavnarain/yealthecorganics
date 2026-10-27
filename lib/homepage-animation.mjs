// A fresh mount also waits a full second on client-side return navigation.
export function scheduleAfterPageLoad(page, start) {
  let timer;
  let cancelled = false;
  const schedule = () => {
    const scheduledAt = page.performance.now();
    timer = page.setTimeout(() => {
      if (!cancelled) start({ scheduledAt, startedAt: page.performance.now() });
    }, 1000);
  };
  if (page.document.readyState === "complete") schedule();
  else page.addEventListener("load", schedule, { once: true });
  return () => {
    cancelled = true;
    page.removeEventListener("load", schedule);
    if (timer !== undefined) page.clearTimeout(timer);
  };
}
