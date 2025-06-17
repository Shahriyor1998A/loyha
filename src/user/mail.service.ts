import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private otps = new Map<string, { otp: string; expires: number }>();

private transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});


  createOtp(email: string): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 40 * 60 * 10000; 
    this.otps.set(email, { otp, expires });
    return otp;
  }

  checkOtp(otp: string, email: string): boolean {
    const record = this.otps.get(email);
    if (!record || record.otp !== otp || Date.now() > record.expires) return false;
    this.otps.delete(email);
    return true;
  }

  async sendEmail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject,
      html,
    });
  }
}
