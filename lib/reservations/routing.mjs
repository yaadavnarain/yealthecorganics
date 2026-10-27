export function isReservationRoot(url, hostHeader) {
  const host = (hostHeader || url.host).toLowerCase();
  return url.pathname === "/" && /^membership\.yealth\.mu(?::\d+)?$/.test(host);
}

export function isAgribusinessRoot(url, hostHeader) {
  const host = (hostHeader || url.host).toLowerCase();
  return url.pathname === "/" && /^agribusiness\.yealth\.mu(?::\d+)?$/.test(host);
}
