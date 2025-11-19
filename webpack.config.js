const Encore = require('@symfony/webpack-encore');

Encore
    // directory where compiled assets will be stored
    .setOutputPath('public/build/')
    // public path used by the web server to access the output path
    .setPublicPath('/build')
    // only one entry file needed for now
    .addEntry('app', './src/index.js')
    // enables Sass/SCSS support
    .enableSassLoader()
    // enables source maps during development
    .enableSourceMaps(!Encore.isProduction())
    // enables versioning (hashed filenames) in production
    .enableVersioning(Encore.isProduction())
    // required by Encore
    .enableSingleRuntimeChunk()

    // copy fonts and images folders to build output
    .copyFiles({
        from: './assets/fonts',
        to: 'fonts/[path][name].[ext]'
    })
    .copyFiles({
        from: './assets/images',
        to: 'images/[path][name].[ext]'
    })
;

module.exports = Encore.getWebpackConfig();
