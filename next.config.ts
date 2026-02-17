import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Ignores typescript build errors
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  basePath: '/atan',
  assetPrefix: "/atan",

  /**
   * 
   * This change creates a .next/standalone directory during the build process, 
   * which includes only the necessary files and a bundled node_modules folder, 
   * eliminating the need to copy the entire node_modules directory. 
   */
  output: 'standalone', // 
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
    
    turbopack: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  
};

export default nextConfig;
