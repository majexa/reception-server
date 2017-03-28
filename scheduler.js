const notify = require('./src/lib/utils/notify');

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
