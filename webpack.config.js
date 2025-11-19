const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /.s[ac]ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 8 * 1024 // 8kb
                    }
                },
                use: [{
                    loader: 'image-webpack-loader',
                    options: {
                        mozjpeg: {
                            quality: 65,
                        },
                        pngquant: {
                            quality: [0.65, 0.90],
                            speed: 4
                        },
                        gifsicle: {
                            interlaced: false,
                        },
                    },
                },],
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        }),
        new HtmlWebpackPlugin({
            title: 'Webpack Config',
        }),
        new ImageMinimizerPlugin({
            minimizerOptions: {
                // Lossy optimization
                plugins: [
                    'imagemin-mozjpeg',
                    'imagemin-pngquant',
                    // More plugins can be added here
                ],
            },
        }),
    ],
    devtool: 'source-map',
};