const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const nextConfig = require('../next.config.js');

// Add bundle analyzer to webpack config
const withBundleAnalyzer = (config) => {
  config.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      analyzerPort: 8888,
      openAnalyzer: true,
    })
  );
  return config;
};

// Export modified config
module.exports = {
  ...nextConfig,
  webpack: (config, options) => {
    // Apply existing webpack config
    if (nextConfig.webpack) {
      config = nextConfig.webpack(config, options);
    }
    
    // Add bundle analyzer only for client build
    if (!options.isServer) {
      config = withBundleAnalyzer(config);
    }
    
    return config;
  },
};