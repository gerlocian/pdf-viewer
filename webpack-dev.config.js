const { resolve } = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack-base.config');

module.exports = {
    ...baseConfig,
    entry: './dev/index.mjs',
    devServer: {
        hot: true,
        static: {
            directory: resolve(__dirname, 'dev', 'assets')
        }
    },
    devtool: 'source-map',
    plugins: [new HtmlWebpackPlugin]
};