const FCM = require('fcm-push');
const fcm = new FCM(process.env.FCM_SERVER_KEY);

console.log('Using FCM_SERVER_KEY: ' + process.env.FCM_SERVER_KEY);

/**
 * @param deviceToken
 * @param notification {title, body}
 */
module.exports = (deviceToken, notification) => {
  const message = {
    to: deviceToken,
    // data: message,
    notification: notification
  };
  return fcm.send(message).then(function(response) {
    return console.log("Successfully sent " + notification.body + " with response: ", response);
  })["catch"](function(err) {
    console.log("Something has gone wrong! deviceToken: '" + deviceToken + "'");
    return console.error(err);
  });
};
