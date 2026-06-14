/** @type {import('next').NextConfig} */
const nextConfig = {
  // 100% 클라이언트 앱 → 정적 export. 서버 런타임이 없어 서버측 공격면이 제거된다.
  output: "export",
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default nextConfig;
