var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
var APP_DIR = path.resolve(__dirname, 'src/client/app');
var STYLE_DIR = path.resolve(__dirname, 'src/stylesheets');

var config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module : {
  	loaders : [
  		{
  			test : /\.jsx?/,
  			include : APP_DIR,
  			loader : 'babel'
  		},
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ["react-hot", "babel-loader"]
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
        include: STYLE_DIR
      },
      {
        test: /\.scss$/,
        loader:ExtractTextPlugin.extract('css!sass')
      }
  	]
  },
  plugins: [
    new ExtractTextPlugin('style.css', {
      allChunks: true
    })
  ]

};

module.exports = config;