const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

// new Email(user,url).sendWelcome();

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `GOLUGURI PAVAN REDDY<${process.env.EMAIL_FROM}>`;
  }
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //SendGrid
      return 1;
    }
    return (transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: '7e5e85a5c49835',
        pass: '7a70d8c3ccc8e0',
      },
    }));
  }

  //send the actual email
  async send(template, subject) {
    // Render html based on a pug template

    const html = pug.renderFile(`${dirname}/../views/emails/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    //Create a Transport and send email

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'welcome to the Natours Family');
  }

  async sendPassword(){
    await this.send('passwordReset','Your password reset token (valid for only 10 minutes)');
  }
};

const sendEmail = async (options) => {
  // 1) create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: '7e5e85a5c49835',
      pass: '7a70d8c3ccc8e0',
    },
    // Activate in gmail "less secure option"
  });
  //2)Define the email options
  const mailOptions = {
    from: 'GOLUGURI PAVAN REDDY<s190544@rguktsklm.ac.in>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html:
  };

  //3) send the mail

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
