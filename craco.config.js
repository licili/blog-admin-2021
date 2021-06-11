const CracoLessPlugin = require('craco-less');

module.exports = (config, dev) => {
  // config: {env:'dev'} dev:undefined
  config.plugins = [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            // modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ]
  return config;
};