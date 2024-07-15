// Generated using webpack-cli https://github.com/webpack/webpack-cli

const { resolve } = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
    entry: './src/example/index.mjs',
    output: {
        path: resolve(__dirname, 'dist'),
    },
    devServer: {
        open: true,
        host: 'localhost',
        static: {
            directory: resolve(__dirname, 'src', 'example', 'assets'),
            publicPath: '/assets'
        }
    },
    plugins: [
        new HtmlWebpackPlugin({template: 'src/example/index.html'}),
    ],
    module: {
        rules: [
            { test: /\.(js|jsx)$/i, loader: 'babel-loader', },
            { test: /\.css$/i, use: ['style-loader','css-loader'], },
            { test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i, type: 'asset', },
        ],
    },
};

module.exports = () => ({
    ...config,
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
});
