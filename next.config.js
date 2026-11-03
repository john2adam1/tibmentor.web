/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: [
      'dev.axadjonovsardorbek.uz',
      'prod.axadjonovsardorbek.uz',
      'minio.axadjonovsardorbek.uz',
      'dev.imedteam.uz',
      'prod.imedteam.uz',
      'via.placeholder.com'
    ],
  },
}

module.exports = nextConfig

