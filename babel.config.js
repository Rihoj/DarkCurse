const path = require('path');
const jsConfig = require('./tsconfig.json')
module.exports = {
  ignore: [
    // "**/__mocks__/*",
  ],
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: [path.resolve(jsConfig.compilerOptions.baseUrl)],
        // stripExtensions: [".ts", ".js", ".jsx", ".es", ".es6", ".mjs"],
        alias: {
          "~": "./src",
          controllers: "./src/controllers/main",
          models: "./src/models",
          types: "./types",
          daos: "./src/daos",
          
        }
      }
    ]
  ]
};
