export function isReservationRoot(url, hostHeader) {
  const host = (hostHeader || url.host).toLowerCase();
  return url.pathname === "/" && /^membership\.yealth\.mu(?::\d+)?$/.test(host);
}

export function isAgribusinessRoot(url, hostHeader) {
  const host = (hostHeader || url.host).toLowerCase();
  return url.pathname === "/" && /^agribusiness\.yealth\.mu(?::\d+)?$/.test(host);
}

export function isWebsiteFeedbackRoot(url, hostHeader) {
 return url.pathname === "/" && /^websitefeedback1\.yealth\.mu(?::\d+)?$/.test((hostHeader || url.host).toLowerCase());
}
