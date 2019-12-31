path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { VueLoaderPlugin } = require('vue-loader')
const NODE_ENV = process.env.NODE_ENV;

function getPlugins() {
    const plugins = [];

    plugins.push(extractHTML);
    plugins.push(new VueLoaderPlugin());
    plugins.push(new MiniCssExtractPlugin({
                    filename: "css/styles.[hash].css",
                     chunkFilename: "[id].css"})); 
    plugins.push(new webpack.DefinePlugin({
                    'process.env': {
                        isStaging: (NODE_ENV === 'development' || NODE_ENV === 'staging'),
                        NODE_ENV: '"'+NODE_ENV+'"'
                     }}));

    if (process.env.NODE_ENV === "production") {
        plugins.push(new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            output: {
                comments: false
            },
            compressor: {
                warnings: false
            }
        }));
    } else {
        plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    return plugins;
}

const setPath = function(folderName) {
  return path.join(__dirname, folderName);
}

const buildingForLocal = () => {
  return (NODE_ENV === 'development');
};

const setPublicPath = () => {
  let env = NODE_ENV;
  if (env === 'production') {
    return 'https://your-directory/production/';
  } else if (env === 'staging') {
    return 'https://your-directory/staging/';
  } else {
    return '/';
  }
};

const extractHTML = new HtmlWebpackPlugin({
  title: 'History Search',
  filename: 'index.html',
  inject: true,
  template: setPath('/src/tpl/tpl.ejs'),
  minify: {
    removeAttributeQuotes: true,
    collapseWhitespace: true,
    html5: true,
    minifyCSS: true,
    removeComments: true,
    removeEmptyAttributes: true
  },
  environment: process.env.NODE_ENV,
  isLocalBuild: buildingForLocal(),
  imgPath: (!buildingForLocal()) ? 'assets' : 'src/assets'
});


const config = {
  optimization:{
    runtimeChunk: false,
    splitChunks: {
      chunks: "all", //Taken from https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693
    }
  },
  resolveLoader: {
    modules: [setPath('node_modules')]
  },
  mode: buildingForLocal() ? 'development' : 'production',
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    historyApiFallback: true,
    noInfo: false,
    overlay: true,
    hot: true,
    watchOptions: {
        poll: true
    }
  },
  resolve: {
    extensions: ['.js', '.ts','.jsx', '.tsx'],
    alias: {
      Actions: path.resolve(__dirname, 'src'),
    },
  },
  plugins: getPlugins(), 
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader', options: { loaders: { js: 'awesome-typescript-loader?silent=true' } }
      },
      {
          test: /\.styl(us)?$/,
          use: [
              'vue-style-loader',
              'css-loader',
              'stylus-loader'
          ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: "babel-loader",
          options: { presets: ["@babel/preset-env"] }
        }]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      },

      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]?[hash]',
          useRelativePath: buildingForLocal()
        }
      }    
    ]
  },
};
module.exports = config; 
