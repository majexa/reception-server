module.exports = (userModel, userId, address, onSuccess, onFail) => {
  require('axios').get('https://geocode-maps.yandex.ru/1.x/?geocode=' + //
    encodeURIComponent('Нижний Новгород, ' + address))
    .then(function(response) {
      const parseString = require('xml2js').parseString;
      parseString(response.data, function(err, result) {
        if (err) throw new Error(err);
        const geoPosition = result.ymaps.GeoObjectCollection[0].//
          featureMember[0].GeoObject[0].Point[0].pos;
        // update
        userModel.update({
          _id: userId
        }, {
          geoPosition: geoPosition
        }, (err, r) => {
          onSuccess(geoPosition);
        });
      });
    })
    .catch(function(error) {
      onFail(error);
    });
};