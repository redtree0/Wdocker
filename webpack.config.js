module.exports = {
  entry: {
    config : './public/js/config.js',
    container : './public/js/container.js',
    network : './public/js/network.js',
    table : './public/js/table.js'
  },
  output: {
    path: __dirname + '/public/js/bundle',
    filename: '[name].bundle.js'
  }
};
