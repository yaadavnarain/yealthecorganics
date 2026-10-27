export function isReservationRoot(url, hostHeader) {
  const host = (hostHeader || url.host).toLowerCase();
  return url.pathname === "/" && /^membership\.yealth\.mu(?::\d+)?$/.test(host);
}
