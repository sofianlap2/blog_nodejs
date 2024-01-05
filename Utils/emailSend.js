const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "e4fb6d269ae064",
    pass: "831f09bc5d226f",
  },
});

async function main(emailTo, htmlText) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Digital school 👻" <sofianesprit@gmail.com>', // sender address
    to: emailTo, // list of receivers
    subject: "Hello ✔", // Subject line
    //text: "Hello world?", // plain text body
    html: htmlText, // html body
  });

  console.log("Message sent: %s", info.messageId);
}

module.exports = main;
