const nodemailer = require("nodemailer");
const config = require("../config/nodemailer.json");

exports.send = ({ name, email, message }) =>
  new Promise(async (resolve, reject) => {
    try {
      if (!name || !email || !message) {
        reject({
          status: 500,
          message: "All fields are required",
          error: err
        });
        return;
      }

      const transporter = nodemailer.createTransport(config.mail.smtp);
      const mailOptions = {
        from: `"${name}" <${email}>`,
        to: config.mail.smtp.auth.user,
        subject: config.mail.subject,
        text: message.trim().slice(0, 500) + `\n Отправлено с: <${email}>`
      };
      // отправляем почту
      transporter.sendMail(mailOptions, function(error, info) {
        // если есть ошибки при отправке - сообщаем об этом
        if (error) {
          reject({
            status: 500,
            message: "При отправке письма произошла ошибка!",
            error: error
          });
        }
        resolve(true);
      });

      // resolve(true);
    } catch (err) {
      reject(err);
    }
  });
