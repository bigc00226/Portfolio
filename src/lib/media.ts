import { access } from "node:fs/promises";
import path from "node:path";

const publicDir = path.join(process.cwd(), "public");

/**
 * /public に実際にファイルがあるかどうかを確認します。
 *
 * ページを組み立てるときにサーバー側で動くため、バナーは <video> 要素を
 * 出すかどうかを判断できます。これがないと、置いていない動画をブラウザが
 * 取りにいき、訪問のたびに 404 が記録されてしまいます。
 */
export async function publicFileExists(publicPath: string): Promise<boolean> {
  try {
    await access(path.join(publicDir, publicPath.replace(/^\//, "")));
    return true;
  } catch {
    return false;
  }
}
