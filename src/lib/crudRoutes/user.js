const updateGeoPosition = require('../utils/updateGeoPosition');
const update = (request, reply, user) => {
  if (!user.address) {
    reply({success: 1});
    return;
  }
  updateGeoPosition(request.db.User, user._id, user.address, (result) => {
    reply(result);
  }, (err) => {
    reply(err);
  });
};
module.exports = require('hapi-ngn-grid-mongoose-crud')('user', {
  registerDate: 'Дата',
  token: 'undefined',
  phone: 'Телефон',
  address: 'Адрес',
  geoPosition: 'Координада',
  deviceToken: 'Device Token'
}, {
  onCreate: update,
  onUpdate: update
});
