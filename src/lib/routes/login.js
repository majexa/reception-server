const fs = require('fs');
const axios = require('axios');

const genCode = function() {
  let text = '';
  let possible = '0123456789';
  for (let i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

const onUser = function(phoneCode, user, reply) {
  if (parseInt(process.env.DEBUG)) {
    reply({
      success: 1,
      code: phoneCode.code
    });
  } else {
    sendSms(reply, phoneCode.phone, phoneCode.code);
  }
};

const smscSendCmd = function (reply, cmd, arg) {
  if (!process.env.SMSC_LOGIN) throw new Error('.env.SMSC_LOGIN it node defined');
  if (!process.env.SMSC_PASSWORD) throw new Error('.env.SMSC_PASSWORD it node defined');
  let url = 'http://smsc.ru/sys/' + cmd + '.php?' + //
    'login=' + process.env.SMSC_LOGIN + //
    '&psw=' + process.env.SMSC_PASSWORD + '&fmt=3&charset=utf-8&' + arg;
  axios.get(url).then(function (response) {
    if (!response.data) {
      reply({error: 'request problem'}).code(500);
      return;
    }
    if (response.data.error) {
      reply(response.data).code(500);
      return;
    }
    if (response.data.cnt) {
      reply({success: 1});
    }
  }).catch(function (error) {
    console.log(error);
  });
};

const sendSms = function (reply, phone, message) {
  message = process.env.TITLE + ' Code:\n' + message;
  smscSendCmd(reply, "send", "cost=3&phones=" + phone + "&mes=" + message + "&translit=0&id=0&sender=0&time=0");
};

module.exports = [
  /**
   * @api {get} /login Login
   * @apiDescription Token expiration time: 1 week
   * @apiName Login
   * @apiGroup Auth
   *
   * @apiParam {String} phone User phone
   * @apiParam {String} code SMS code
   *
   * @apiSuccess {String} token Token that you will use in Socket.IO connection
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *   {
   *     "token": "your-token",
   *     "_id": userId
   *    }
   *
   * @apiErrorExample Error-Response:
   *   HTTP/1.1 404 Not Found
   *   {"error": "no user"}
   */
  {
    method: 'GET',
    path: '/api/v1/login',
    handler: (request, reply) => {
      if (!request.query.phone) {
        reply({error: 'phone is required'}).code(500);
        return;
      }
      if (!request.query.code) {
        reply({error: 'SMS code is required'}).code(500);
        return;
      }
      request.db.SmsCode.findOne({
        code: request.query.code,
        phone: request.query.phone
      }, (err, code) => {
        if (!code) {
          reply({error: 'no user'});
          return;
        }
        request.db.User.findOne({
          phone: request.query.phone
        }, (err, profile) => {
          reply({
            token: profile.token,
            phone: profile.phone
          });
        });
      });
    }
  },
  /**
   * @api {get} /sendCode Send code
   * @apiDescription Sends code by SMS
   * @apiName SendCode
   * @apiGroup Auth
   *
   * @apiParam {String} phone User phone

   * @apiSuccess {String} result Result in JSON
   */
  {
    method: 'GET',
    path: '/api/v1/sendCode',
    handler: (request, reply) => {
      if (!request.query.phone) {
        reply({error: 'phone is required'}).code(500);
        return;
      }
      let code = genCode();
      request.db.SmsCode.find({phone: request.query.phone}).remove().exec((err) => {
        if (err) {
          console.error(err);
          reply({error: 'error'}).code(500);
        }
        const phoneCode = {
          phone: request.query.phone,
          code: code
        };
        request.db.SmsCode.create(phoneCode, (err, result) => {
          if (err) {
            console.error(err);
            reply({error: 'error'}).code(500);
          }
          request.db.User.findOne({
            phone: request.query.phone
          }, (err, user) => {
            if (!user) {
              let user = request.db.User.create({
                phone: request.query.phone
              });
              onUser(phoneCode, user, reply);
            } else {
              onUser(phoneCode, user, reply);
            }
          });
        });
      });
    }
  }
];

