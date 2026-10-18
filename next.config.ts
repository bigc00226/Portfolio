import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /*
   * デザインページは /design から / へ移しました。前のアドレスを開いても届くように、
   * / へ送ります。一時的な転送（307）なので、ブラウザに長く覚えられることはありません。
   */
  async redirects() {
    return [{ source: "/design", destination: "/", permanent: false }];
  },
};

export default nextConfig;
