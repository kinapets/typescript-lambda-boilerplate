const slsw = require('serverless-webpack');
const slash = require('slash');
const path = require('path');

const dirname = path.resolve(process.platform === 'win32' ? slash(__dirname) : __dirname);

module.exports = {
    cache: false,
    target: 'node',
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    context: dirname,
    devtool: 'source-map',
    entry: slsw.lib.entries,

    module: {
        rules: [
            {
                test: /\.(ts)|(js)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: ['node_modules'],
    },
    output: {
        libraryTarget: 'commonjs2',
        path: `${dirname}/.webpack`,
        filename: '[name].js',
        sourceMapFilename: '[name].js.map',
    },
};
