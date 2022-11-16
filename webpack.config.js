const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
//as a replacement for webpack-config-utils
const ifProduction = (prodOption, devOption) => (process.env.NODE_ENV || '0').toLowerCase().trim() == "development" ? devOption : prodOption;//first value is for production second for dev/others

module.exports = {
    mode: ifProduction("development", "production"),
    entry: './src/tiny-slider.js',
    devtool: ifProduction(false, 'source-map'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: (e) => {
            runtime = e.chunk.name != "main";
            return ifProduction('tiny-slider' + (runtime ? ".run" : '') + '.min.js', 'tiny-slider' + (runtime ? ".run" : '') + '.js')
        },
        library: {
            name: "[name]",
            type: "var"
        },
        libraryTarget: "umd",
    },
    devServer: {
        static: path.resolve(__dirname, '.'),
        port: 8080
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: [MiniCssExtractPlugin.loader,
                'css-loader',
            {
                loader: "sass-loader",
                options: {
                    sourceMap: ifProduction(false, true)
                },
            }
            ],
        },
        {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, {
                loader: 'css-loader',
                options: {
                    sourceMap: ifProduction(false, true)
                }
            }],
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "tiny-slider.css",
        })
    ],
    optimization: {
        minimize: ifProduction(true, false),
        minimizer: [new TerserPlugin(),
        new CssMinimizerPlugin(),],
        runtimeChunk: true,
    }
};