import { parse } from "tldts";

export function getNameUrl(url: string) {
    const parsed = parse(url);
    return parsed.subdomain ? parsed.subdomain : parsed.domain || "no name";
  }