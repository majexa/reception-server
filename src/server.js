const Inert = require('inert');
const Cors = require('hapi-cors');
const colors = require('colors');

process.on('unhandledRejection', (err, promise) => {
  console.error(`Uncaught error in`, promise);
  console.error(err);
});

const debugRoutes = function (routes) {
  for (let route of routes) {
    console.log(route.method.blue + ' ' + route.path.cyan);
  }
  return routes;
};

module.exports = function (config) {
  const dbConnect = require('./lib/db');
  dbConnect().then((models) => {
    const Hapi = require('hapi');
    const server = new Hapi.Server();
    server.connection(config);

    server.register(Inert, (err) => {
      if (err) throw err;
    });
    server.decorate('request', 'db', models);

    server.register([
      {
        register: require('good'),
        options: {
          reporters: {
            console: [{
              module: 'good-squeeze',
              name: 'Squeeze',
              args: [{error: '*', log: '*', request: '*', response: '*'}]
            }, {
              module: 'good-console'
            }, 'stdout']
          }
        }
      },
      {
        register: Cors,
        options: {
          origins: ['*'],
          headers: ['x-request', 'x-requested-with', 'authorization', 'Content-Type']
        }
      },
      {"register": require('hapi-auth-bearer-token')}
    ], (error) => {
      if (error)
        return console.error(error);
      require('./lib/auth/user')(server);
      server.route(debugRoutes(require('./lib/crudRoutes/user')));
      server.route(debugRoutes(require('./lib/routes/login')));
      server.route(debugRoutes(require('./lib/routes/deviceToken')));
      server.route(debugRoutes(require('./lib/routes/mySchedule')));
      server.route(debugRoutes(require('./lib/routes/push')));
      server.route(debugRoutes(require('./lib/routes/geolocation')));
      server.start((err) => {
        if (err)
          throw err;
        console.log(`Server running at: ${server.info.uri}`);
      });
    });
  });
};
