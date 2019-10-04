const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    mode: process.env.NODE_ENV,
    entry: [
        path.resolve('./src/index.js')
    ],
    output: {
        path: path.resolve('./docs'),
        filename: isProd ? '[name].[hash].js' : '[name].js'
    },
    optimization: {
        splitChunks: {
            // include all types of chunks
            chunks: 'all'
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'random name'
        })
    ]
};
