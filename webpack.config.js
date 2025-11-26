const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const glob = require('glob');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    // Automatically find all HTML files in the root directory
    const htmlFiles = glob.sync('./*.html');
    const htmlPlugins = htmlFiles.map(file => {
        const filename = path.basename(file);
        return new HtmlWebpackPlugin({
            template: file,
            filename: filename,
            inject: 'body',
        });
    });

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
                                api: 'modern', // Use the modern Sass API
                                sourceMap: !isProduction,
                                sassOptions: {
                                    quietDeps: true, // Suppress deprecation warnings from dependencies
                                    silenceDeprecations: [
                                        'legacy-js-api',
                                        'import',
                                        'global-builtin',
                                        'color-functions'
                                    ],
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
            ...htmlPlugins,
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