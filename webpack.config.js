let ExtractTextPlugin = require('extract-text-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/js/main.js',
    output : {
      path: 'dist/',
      filename: '[name].bundle.js'
    },
    devtool: 'source-map',
    module:{
      loaders:[
        {test: /\.html$/, exclude: 'node_modules', loader: 'html-loader'},
        {test: /\.scss$/, exclude: 'node_modules', loader: ExtractTextPlugin.extract(['css', 'sass'])},
        {test: /\.js$/, exclude: 'node_modules', loader: 'babel-loader'}
      ]
    },
    plugins:[
      new ExtractTextPlugin('app.bundle.css'),
      new HtmlWebpackPlugin({ template: './src/index.html'}),
      new CopyWebpackPlugin([{from: './src/electron_entry.js'}]),
    ],
    target: "electron"
}