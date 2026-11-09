/** URL validation is NOT permission to fetch; CricHeroes ToS prohibit scraping. */
export type ProfileLinkResult = { ok: true; canonicalUrl: string; profileId: string } | { ok: false; message: string };
const hostnames = new Set(['cricheroes.com','www.cricheroes.com','cricheroes.in','www.cricheroes.in']);
export function validateCricHeroesURL(value: string): ProfileLinkResult {
  let url: URL;
  try { url = new URL(value.trim()); } catch { return { ok:false, message:'Enter a full CricHeroes player profile URL starting with https://.' }; }
  if (url.protocol !== 'https:' || !hostnames.has(url.hostname.toLowerCase()) || url.username || url.password || url.port)
    return { ok:false, message:'Use an HTTPS link from cricheroes.com or cricheroes.in.' };
  const found = url.pathname.match(/^\/player-profile\/([1-9][0-9]{0,14})(?:\/[a-zA-Z0-9_-]{1,120})?\/?$/);
  if (!found) return {ok:false, message:'This does not look like a CricHeroes player profile link.'};
  if (url.hash) return {ok:false,message:'Remove the fragment from your player profile link.'};
  return {ok:true, profileId:found[1], canonicalUrl:`https://${url.hostname.toLowerCase()}/player-profile/${found[1]}`};
}
export interface AuthorizedProvider {
  readonly providerName: string;
  fetchPlayer(profileId: string): Promise<unknown>;
}
export function isAuthorizedIntegrationConfigured(): boolean { return false; }
