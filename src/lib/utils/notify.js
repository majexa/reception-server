module.exports = (schedule) => {
  //if (!schedule.user.deviceToken) return;
  const timeDiff = new Date(schedule.date).getTime() - new Date().getTime();
  if (timeDiff < 0) return;
  const hoursLeft = timeDiff / 1000 / 60 / 60;
  console.log('Hours Left: ' + hoursLeft);
};