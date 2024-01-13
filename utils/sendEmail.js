const nodemailer = require("nodemailer");

exports.sendEmail = async ({ to, subject, html }) => {
  const { META_PASS } = process.env;

  const nodemailerConfig = {
    host: "smtp.meta.ua",
    port: 465,
    secure: true,
    auth: {
      user: "konyaga@meta.ua",
      pass: META_PASS,
    },
  };

  const transport = nodemailer.createTransport(nodemailerConfig);

  const email = {
    to,
    from: "konyaga@meta.ua",
    subject,
    html,
  };

  await transport
    .sendMail(email)
    .then(() => console.log("Success"))
    .catch((error) => console.log(error));

  return true;
};
