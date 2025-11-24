const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        mode: isProduction ? 'production' : 'development',
        entry: './src/index.js',
        output: {
            filename: isProduction ? 'js/[name].[contenthash].js' : 'js/[name].js',
            path: path.resolve(__dirname, 'dist'),
            clean: true,
            assetModuleFilename: 'assets/[name][ext]',
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: !isProduction,
                                sassOptions: {
                                    quietDeps: true, // Suppress deprecation warnings from dependencies
                                    verbose: false
                                }
                            }
                        },
                    ],
                },
                {
                    test: /\.css$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    type: 'asset',
                    parser: {
                        dataUrlCondition: {
                            maxSize: 8 * 1024 // 8kb
                        }
                    },
                },
                {
                    test: /\.(eot|ttf|woff|woff2|otf)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[name][ext]'
                    }
                },
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: isProduction ? 'css/[name].[contenthash].css' : 'css/[name].css',
            }),
            new HtmlWebpackPlugin({
                template: './index.html',
                filename: 'index.html',
                inject: 'body',
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { 
                        from: 'public', 
                        to: '',
                        noErrorOnMissing: true
                    }
                ],
            }),
        ],
        devServer: {
            static: [
                {
                    directory: path.join(__dirname, 'dist'),
                },
                {
                    directory: path.join(__dirname, 'public'),
                }
            ],
            compress: true,
            port: 8080,
            hot: true,
            open: true,
        },
        devtool: isProduction ? 'source-map' : 'eval-source-map',
        resolve: {
            extensions: ['.js', '.json'],
        },
    };
};