import { Injectable } from '@nestjs/common';
import * as nodemailer from "nodemailer"

@Injectable()
export class MailService {

  transporter: nodemailer.Transporter
  email: string
  mailToken: string
  info: string
  constructor() {
    this.email = process.env.GMAIL_EMAIL;
    this.mailToken = process.env.GMAIL_TOKEN;
    this.info = `Güvercinler Bilgilendirme <${this.email}>`;

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.email,
        pass: this.mailToken,
      },
    });
  }

  async sendHtml(to: string, subject: string, text: string) {
    const mailOptions = {
      from: this.info,
      to: to,
      subject: subject,
      html: text,
    };

    await this.transporter.sendMail(mailOptions);

    return true;
  }


}
