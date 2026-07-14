const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer/expo')
  };
  config.resolver = {
    ...resolver,
    assetExts: [...resolver.assetExts.filter((ext) => ext !== 'svg'), 'wasm'],
    sourceExts: [...resolver.sourceExts, 'svg'],
    resolveRequest: (context, moduleName, platform) => {
      if (platform === 'web' && moduleName === 'react-native-maps') {
        return context.resolveRequest(context, '@teovilla/react-native-web-maps', platform);
      }
      return context.resolveRequest(context, moduleName, platform);
    }
  };

  return config;
})();
