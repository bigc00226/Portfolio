import { access } from "node:fs/promises";
import path from "node:path";

const publicDir = path.join(process.cwd(), "public");

/**
 * Checks whether a file is actually present in /public.
 *
 * This runs on the server while the page is rendered, which lets the banner
 * decide whether to render a <video> element at all. Without it the browser
 * would request a video that is not there and log a 404 on every visit.
 */
export async function publicFileExists(publicPath: string): Promise<boolean> {
  try {
    await access(path.join(publicDir, publicPath.replace(/^\//, "")));
    return true;
  } catch {
    return false;
  }
}
