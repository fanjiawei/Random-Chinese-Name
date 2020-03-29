const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    mode: process.env.NODE_ENV,
    entry: [
        path.resolve('./src/index.jsx')
    ],
    output: {
        path: path.resolve('./docs'),
        filename: isProd ? '[name].[hash].js' : '[name].js'
    },
    resolve: {
        extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx']
    },
    optimization: {
        splitChunks: {
            // include all types of chunks
            chunks: 'all'
        }
    },
    module: {
        rules: [
            {
                test:/.jsx?$/,
                exclude: /node_module/,
                use: 'babel-loader'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'random name'
        })
    ]
};
