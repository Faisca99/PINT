import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: false,
        auth: { user, pass },
      });
      this.logger.log('Email service configured with SMTP');
    } else {
      this.logger.warn('SMTP not configured — emails will be logged only');
    }
  }

  async send(to: string, subject: string, html: string) {
    if (!this.transporter) {
      // Sem SMTP: registar o email na consola (modo académico)
      this.logger.log(`📧 EMAIL [${subject}] → ${to}\n${html.replace(/<[^>]*>/g, ' ').trim()}`);
      return;
    }

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM ?? 'badges@softinsa.pt',
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent: ${subject} → ${to}`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}: ${err}`);
    }
  }

  // Templates

  applicationConfirmation(consultantName: string, badgeName: string, applicationId: number): string {
    return `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#6366f1">Softinsa Badges</h2>
        <p>Olá <strong>${consultantName}</strong>,</p>
        <p>A tua candidatura para o badge <strong>${badgeName}</strong> foi submetida com sucesso (Ref. #${applicationId}).</p>
        <p>O Talent Manager irá rever as tuas evidências em breve.</p>
        <p style="color:#64748b;font-size:12px">Plataforma de Badges Digitais — Softinsa</p>
      </div>`;
  }

  applicationApproved(consultantName: string, badgeName: string): string {
    return `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#6366f1">Softinsa Badges</h2>
        <p>Olá <strong>${consultantName}</strong>,</p>
        <p>Parabéns! O teu badge <strong>${badgeName}</strong> foi <strong style="color:#16a34a">aprovado e atribuído</strong>.</p>
        <p>Podes visualizá-lo na tua galeria de badges.</p>
        <p style="color:#64748b;font-size:12px">Plataforma de Badges Digitais — Softinsa</p>
      </div>`;
  }

  applicationRejected(consultantName: string, badgeName: string, comment: string): string {
    return `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#6366f1">Softinsa Badges</h2>
        <p>Olá <strong>${consultantName}</strong>,</p>
        <p>A tua candidatura para o badge <strong>${badgeName}</strong> foi <strong style="color:#dc2626">rejeitada</strong>.</p>
        <p>Motivo: ${comment}</p>
        <p style="color:#64748b;font-size:12px">Plataforma de Badges Digitais — Softinsa</p>
      </div>`;
  }

  applicationSentBack(consultantName: string, badgeName: string, comment: string): string {
    return `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#6366f1">Softinsa Badges</h2>
        <p>Olá <strong>${consultantName}</strong>,</p>
        <p>A tua candidatura para o badge <strong>${badgeName}</strong> foi devolvida para correção.</p>
        <p>Motivo: ${comment}</p>
        <p>Podes aceder à plataforma, corrigir as evidências e resubmeter.</p>
        <p style="color:#64748b;font-size:12px">Plataforma de Badges Digitais — Softinsa</p>
      </div>`;
  }

  newApplicationForValidator(validatorName: string, consultantName: string, badgeName: string): string {
    return `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#6366f1">Softinsa Badges</h2>
        <p>Olá <strong>${validatorName}</strong>,</p>
        <p>Uma nova candidatura de <strong>${consultantName}</strong> para o badge <strong>${badgeName}</strong> aguarda a tua revisão.</p>
        <p>Acede à plataforma para validar.</p>
        <p style="color:#64748b;font-size:12px">Plataforma de Badges Digitais — Softinsa</p>
      </div>`;
  }
}
