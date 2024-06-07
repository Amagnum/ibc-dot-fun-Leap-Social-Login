/// <reference path="./env.d.ts" />
/// <reference path="./vercel.d.ts" />

const APP_URL =
  process.env.APP_URL ||
  (process.env.VERCEL && `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`) ||
  `${process.env.PROTOCOL || "http"}://${process.env.HOST || "localhost"}:${process.env.PORT || 3000}`;

/**
 * @type {import('next').NextConfig}
 * @see https://nextjs.org/docs/pages/api-reference/next-config-js
 */
let nextConfig = {
  env: {
    APP_URL,
  },
  eslint: {
    ignoreDuringBuilds: Boolean(process.env.VERCEL),
  },
  productionBrowserSourceMaps: true,
  rewrites: async () => [
    {
      source: "/.well-known/walletconnect.txt",
      destination: "/api/walletconnect/verify",
    },
    {
      source: "/api/rest/(.*)",
      destination: "/api/rest/handler",
    },
    {
      source: "/api/rpc/(.*)",
      destination: "/api/rpc/handler",
    },
    {
      source: "/api/skip/(.*)",
      destination: "/api/skip/handler",
    },
  ],
  transpilePackages:
    process.env.NODE_ENV === "test"
      ? [
          "@vercel/analytics",
          "@evmos/provider",
          "@evmos/transactions",
          "@evmos/eip712",
          "@evmos/proto",
          "@buf/cosmos_cosmos-sdk.bufbuild_es",
          "@buf/evmos_evmos.bufbuild_es",
          "@buf/cosmos_ibc.bufbuild_es",
          "wagmi",
          "@tanstack/query-sync-storage-persister",
          "@tanstack/react-query",
          "@tanstack/query-core",
          "@tanstack/react-query-persist-client",
          "@tanstack/query-persist-client-core",
          "@wagmi/core",
          "@wagmi/connectors",
          "viem",
          "abitype",
          "uuid",
        ]
      : [],
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && isServer) checkEnv();
    return config;
  },
};

/** @see https://docs.sentry.io/platforms/javascript/guides/nextjs */
const { withSentryConfig } = require("@sentry/nextjs");

/**
 * @type {Partial<import('@sentry/nextjs').SentryWebpackPluginOptions>}
 * @see https://github.com/getsentry/sentry-webpack-plugin#options
 */
const sentryWebpackConfig = {
  org: "skip-protocol",
  project: "ibc-dot-fun",
  silent: true,
};

/**
 * @type {import('@sentry/nextjs/types/config/types').UserSentryOptions}
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup
 */
const sentryOptions = {
  disableLogger: true,
  hideSourceMaps: false,
  transpileClientSDK: true,
  tunnelRoute: "/monitoring",
  widenClientFileUpload: true,
};

/** @see https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup */
nextConfig = withSentryConfig(nextConfig, sentryWebpackConfig, sentryOptions);

module.exports = nextConfig;

function checkEnv() {
  if (checkEnv.once) return;

  const log = require("next/dist/build/output/log");

  if (!process.env.POLKACHU_USER || !process.env.POLKACHU_PASSWORD) {
    log.warn("env POLKACHU_USER or POLKACHU_PASSWORD is not set, will use public nodes");
  }

  checkEnv.once = true;
}
