const webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry: './examples/src/index',
    output: {
        path: './examples/build',
        filename: 'bundle.js'
    },
    plugins: [],
    resolve: {
        modulesDirectories: ['./src'],
        extensions: ['.js'],
    },
    module: {
        loaders: [
            { test: /\.(js|jsx)$/, loader: 'babel', exclude: [/node_modules/] }
        ]
    }
};
