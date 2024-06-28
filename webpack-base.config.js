const { resolve } = require('node:path');

module.exports = {
    entry: './src/component.ts',
    output: {
        filename: 'index.mjs',
        path: resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        extensionAlias: {
            '.js': ['.js', '.ts'],
            '.cjs': ['.cjs', '.cts'],
            '.mjs': ['.mjs', '.mts'],
        },
    },
    module: {
        rules: [
            { test: /\.css$/, use: ['css-loader'] },
            { test: /\.html$/, use: ['html-loader'] },
            { test: /\.([cm]?ts|tsx)$/, use: ['ts-loader'] },
        ]
    }
}