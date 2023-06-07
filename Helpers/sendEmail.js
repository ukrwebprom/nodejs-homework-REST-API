const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (data) => {
    const {to, subject, text, html} = data;

    const msg = {
        from: 'ukrwebprom@gmail.com',
        to, subject, text, html,
      }

      sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
}

module.exports = sendEmail;