module.exports = [
  {
    method: 'POST',
    path: '/api/v1/mySchedule',
    config: {
      auth: 'user'
    },
    handler: (request, reply) => {
      request.db.MySchedule.update({
        user: request.auth.credentials._id
      }, {
        user: request.auth.credentials._id,
        date: request.payload.date
      }, {
        upsert: true
      }, () => {
        reply({success: 1});
      });
    }
  },
  {
    method: 'GET',
    path: '/api/v1/mySchedule',
    config: {
      auth: 'user'
    },
    handler: (request, reply) => {
      request.db.MySchedule.find({
        user: request.auth.credentials._id
      }, (err, schedules) => {
        reply(schedules);
      });
    }
  }
];