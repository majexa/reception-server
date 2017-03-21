module.exports = [
  /**
   * @api {get} /updateDeviceToken Update device token
   * @apiName Updates device token
   * @apiGroup User
   *
   * @apiParam {String} deviceToken Device token
   */
  {
    method: 'GET',
    path: '/api/v1/updateDeviceToken',
    config: {
      auth: 'user'
    },
    handler: (request, reply) => {
      if (!request.query.deviceToken) {
        reply({error: 'deviceToken not defined'}).code(500);
        return;
      }
      request.db.User.update({
        _id: request.auth.credentials._id
      }, {
        deviceToken: request.query.deviceToken
      }, (err, r) => {
        if (err) {
          reply({error: err}).code(500);
        }
        reply({success: 1});
      });
    }
  }
];
