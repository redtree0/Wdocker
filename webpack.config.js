module.exports = {
  entry: {
    config : './public/js/config.js',
    io : "./public/js/io.js",
    container : './public/js/container.js',
    network : './public/js/network.js',
    image : './public/js/image.js',
    volume : './public/js/volume.js',
    table : './public/js/table.js'
  },
  output: {
    path: __dirname + '/public/js/bundle',
    filename: '[name].bundle.js'
  }
};
