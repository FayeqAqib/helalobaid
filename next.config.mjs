/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "300mb",
    },
  },
  images: {
    domains: ["yourdomain.com"],
    // یا اگر از مسیرهای لوکال استفاده می‌کنید:
    // loader: 'custom',
  },
  // اجازه دسترسی به فایل‌های خارج از public
  async headers() {
    return [
      {
        source: "/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
