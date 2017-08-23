module.exports = {
  entry: {
    config : './public/js/module/config.js',
    dialog : './public/js/module/dialog.js',
    io : "./public/js/module/io.js",
    table : './public/js/module/table.js',
    container : './public/js/container.js',
    network : './public/js/network.js',
    image : './public/js/image.js',
    volume : './public/js/volume.js',
    dockerfile : './public/js/dockerfile.js',
    settings : './public/js/settings.js',
    terminal : './public/js/terminal.js',
    swarm : './public/js/swarm.js',
    service : './public/js/service.js',
    task : './public/js/task.js'
  },
  output: {
    path: __dirname + '/public/js/bundle',
    filename: '[name].bundle.js'
  }
};
