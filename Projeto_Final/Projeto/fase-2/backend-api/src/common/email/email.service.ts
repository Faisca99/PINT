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

  private base(title: string, statusBar: string, body: string): string {
    return `<!DOCTYPE html>
<html lang="pt">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10)">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1b3d7a 0%,#0da2e7 100%);padding:32px 32px 28px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="display:inline-block;background:rgba(255,255,255,0.18);border-radius:8px;padding:4px 12px;font-size:11px;font-weight:700;letter-spacing:2px;color:rgba(255,255,255,0.85);text-transform:uppercase">Softinsa</span>
                  <div style="margin-top:10px;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.5px">&#11042; Badges Digitais</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Status bar -->
        <tr>
          <td style="background:${statusBar};padding:10px 32px;font-size:12px;font-weight:700;color:#ffffff;letter-spacing:1px;text-transform:uppercase">
            ${title}
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:32px">
            ${body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;text-align:center;font-size:11px;color:#94a3b8">
            Plataforma de Badges Digitais &mdash; Softinsa &bull; Este email foi gerado automaticamente.
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
  }

  applicationConfirmation(consultantName: string, badgeName: string, applicationId: number): string {
    return this.base(
      '&#10003; Candidatura submetida',
      '#0da2e7',
      `<p style="margin:0 0 16px;font-size:16px;color:#1e293b">Olá <strong>${consultantName}</strong>,</p>
       <p style="margin:0 0 20px;font-size:14px;color:#334155;line-height:1.6">
         A tua candidatura para o badge <strong style="color:#0da2e7">${badgeName}</strong>
         foi submetida com sucesso.
       </p>
       <div style="background:#f0f9ff;border-left:4px solid #0da2e7;border-radius:4px;padding:14px 18px;margin-bottom:20px">
         <span style="font-size:12px;color:#0369a1;font-weight:700;text-transform:uppercase;letter-spacing:1px">Referência</span>
         <div style="font-size:18px;font-weight:700;color:#1e293b;margin-top:2px">#${applicationId}</div>
       </div>
       <p style="margin:0;font-size:14px;color:#64748b;line-height:1.6">
         O Talent Manager irá rever as tuas evidências em breve. Receberás uma notificação com o resultado.
       </p>`,
    );
  }

  applicationApproved(consultantName: string, badgeName: string): string {
    return this.base(
      '&#127942; Badge aprovado e atribuído!',
      '#16a34a',
      `<p style="margin:0 0 16px;font-size:16px;color:#1e293b">Olá <strong>${consultantName}</strong>,</p>
       <p style="margin:0 0 20px;font-size:14px;color:#334155;line-height:1.6">
         Parabéns! O teu badge foi aprovado e já está disponível na tua galeria.
       </p>
       <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin-bottom:20px;text-align:center">
         <div style="font-size:13px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Badge atribuído</div>
         <div style="font-size:20px;font-weight:700;color:#166534">${badgeName}</div>
       </div>
       <p style="margin:0;font-size:14px;color:#64748b;line-height:1.6">
         Acede à plataforma para partilhar o teu badge e descarregar o certificado.
       </p>`,
    );
  }

  applicationRejected(consultantName: string, badgeName: string, comment: string): string {
    return this.base(
      '&#10007; Candidatura rejeitada',
      '#dc2626',
      `<p style="margin:0 0 16px;font-size:16px;color:#1e293b">Olá <strong>${consultantName}</strong>,</p>
       <p style="margin:0 0 20px;font-size:14px;color:#334155;line-height:1.6">
         A tua candidatura para o badge <strong>${badgeName}</strong> foi rejeitada.
       </p>
       <div style="background:#fef2f2;border-left:4px solid #dc2626;border-radius:4px;padding:14px 18px;margin-bottom:20px">
         <span style="font-size:12px;color:#b91c1c;font-weight:700;text-transform:uppercase;letter-spacing:1px">Motivo</span>
         <div style="font-size:14px;color:#1e293b;margin-top:4px;line-height:1.5">${comment}</div>
       </div>
       <p style="margin:0;font-size:14px;color:#64748b;line-height:1.6">
         Podes criar uma nova candidatura quando estiveres preparado.
       </p>`,
    );
  }

  applicationSentBack(consultantName: string, badgeName: string, comment: string): string {
    return this.base(
      '&#8617; Candidatura devolvida para correção',
      '#d97706',
      `<p style="margin:0 0 16px;font-size:16px;color:#1e293b">Olá <strong>${consultantName}</strong>,</p>
       <p style="margin:0 0 20px;font-size:14px;color:#334155;line-height:1.6">
         A tua candidatura para o badge <strong>${badgeName}</strong> foi devolvida para correção.
       </p>
       <div style="background:#fffbeb;border-left:4px solid #d97706;border-radius:4px;padding:14px 18px;margin-bottom:20px">
         <span style="font-size:12px;color:#b45309;font-weight:700;text-transform:uppercase;letter-spacing:1px">Motivo</span>
         <div style="font-size:14px;color:#1e293b;margin-top:4px;line-height:1.5">${comment}</div>
       </div>
       <p style="margin:0;font-size:14px;color:#64748b;line-height:1.6">
         Acede à plataforma, corrige as evidências e resubmete a candidatura.
       </p>`,
    );
  }

  newApplicationForValidator(validatorName: string, consultantName: string, badgeName: string): string {
    return this.base(
      '&#128203; Nova candidatura para validar',
      '#1b3d7a',
      `<p style="margin:0 0 16px;font-size:16px;color:#1e293b">Olá <strong>${validatorName}</strong>,</p>
       <p style="margin:0 0 20px;font-size:14px;color:#334155;line-height:1.6">
         Uma nova candidatura aguarda a tua revisão na plataforma.
       </p>
       <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:20px;margin-bottom:20px">
         <table width="100%" cellpadding="0" cellspacing="0">
           <tr>
             <td style="font-size:12px;color:#0369a1;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding-bottom:4px">Consultor</td>
             <td style="font-size:12px;color:#0369a1;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding-bottom:4px">Badge</td>
           </tr>
           <tr>
             <td style="font-size:15px;font-weight:700;color:#1e293b">${consultantName}</td>
             <td style="font-size:15px;font-weight:700;color:#0da2e7">${badgeName}</td>
           </tr>
         </table>
       </div>
       <p style="margin:0;font-size:14px;color:#64748b;line-height:1.6">
         Acede à plataforma para rever as evidências e tomar uma decisão.
       </p>`,
    );
  }
}
