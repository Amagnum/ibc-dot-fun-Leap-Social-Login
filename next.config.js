/** @type {import('next').NextConfig} */

const withTM = require('next-transpile-modules')(['@leapwallet/cosmos-social-login-capsule-provider-ui', '@leapwallet/cosmos-social-login-capsule-provider']);

const nextConfig = {
  productionBrowserSourceMaps: true,
  rewrites: async () => {
    return [
      {
        source: "/nodes/:chainID/:path*",
        destination: "/api/proxy",
      },
    ];
  },
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
        ]
      : [],
};


module.exports = withTM(nextConfig);
