import nextPWA from '@ducanh2912/next-pwa';
import analyzer from '@next/bundle-analyzer';

const isProd = process.env.NODE_ENV === 'production';
const buildWithDocker = process.env.DOCKER === 'true';

// if you need to proxy the api endpoint to remote server
const API_PROXY_ENDPOINT = process.env.API_PROXY_ENDPOINT || '';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

const withBundleAnalyzer = analyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  workboxOptions: {
    skipWaiting: true,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath,
  compress: isProd,
  experimental: {
    optimizePackageImports: [
      'emoji-mart',
      '@emoji-mart/react',
      '@emoji-mart/data',
      '@icons-pack/react-simple-icons',
      '@lobehub/ui',
      'gpt-tokenizer',
      'chroma-js',
    ],
    webVitalsAttribution: ['CLS', 'LCP'],
  },

  output: buildWithDocker ? 'standalone' : undefined,

  reactStrictMode: true,

  rewrites: async () => [
    // due to google api not work correct in some countries
    // we need a proxy to bypass the restriction
    { destination: `${API_PROXY_ENDPOINT}/api/chat/google`, source: '/api/chat/google' },
  ],
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },

  webpack(config) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    // to fix shikiji compile error
    // refs: https://github.com/antfu/shikiji/issues/23
    config.module.rules.push({
      resolve: {
        fullySpecified: false,
      },
      test: /\.m?js$/,
      type: 'javascript/auto',
    });

    return config;
  },
};

export default isProd ? withBundleAnalyzer(withPWA(nextConfig)) : nextConfig;
