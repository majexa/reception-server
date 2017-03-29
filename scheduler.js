const notify = require('./src/lib/utils/notify');

userId = this.db.ObjectID(userId);
return this.db.collection('users').findOne({
  _id: userId
}, function(err, user) {
  var _message;
  if (!user) {
    console.log('user not found');
    return;
  }
  if (!user.deviceToken) {
    console.log('no deviceToken. push skipped');
    return;
  }
  _message = {
    to: user.deviceToken,
    data: message,
    notification: {
      title: 'Новое сообщение',
      body: message.message
    }
  };
  return fcm.send(_message).then(function(response) {
    return console.log("Successfully sent " + message.message + "with response: ", response);
  })["catch"](function(err) {
    console.log("Something has gone wrong!" + message.message);
    return console.error(err);
  });
});



require('./src/lib/db')().then((models) => {
  // setInterval(() => {
  models.MySchedule
    .find({})
    .populate('user')
    .exec((err, schedules) => {
      console.log(schedules);
      for (let schedule of schedules) {
        notify(schedule);
      }
    });
  // }, 60000);
});
