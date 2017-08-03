module.exports = {
  entry: {
    config : './public/js/config.js',
    dialog : './public/js/dialog.js',
    io : "./public/js/io.js",
    container : './public/js/container.js',
    network : './public/js/network.js',
    image : './public/js/image.js',
    volume : './public/js/volume.js',
    dockerfile : './public/js/dockerfile.js',
    settings : './public/js/settings.js',
    terminal : './public/js/terminal.js',
    swarm : './public/js/swarm.js',
    table : './public/js/table.js'
  },
  output: {
    path: __dirname + '/public/js/bundle',
    filename: '[name].bundle.js'
  }
};
