const push = require('../utils/push');

module.exports = [
  {
    method: 'POST',
    path: '/api/v1/user/push',
    config: {
      auth: 'user'
    },
    handler: (request, reply) => {
      if (!request.auth.credentials.deviceToken) {
        reply({error: 'deviceToken not defined'}).code(500);
        return;
      }
      push(
        request.auth.credentials.deviceToken, {
          title: request.payload.title,
          body: request.payload.body
        }
      );
      reply({success: 1});
    }
  }
];
