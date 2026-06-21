import { jsPDF } from "jspdf";

interface CertificateData {
  consultantName: string;
  badgeName: string;
  levelCode: string | null;
  levelName: string | null;
  areaName: string | null;
  serviceLineName: string | null;
  awardedAt: string;
  verifyUrl?: string;
  pointsAwarded?: number;
}

export function downloadCertificate(data: CertificateData) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = 297;
  const H = 210;

  // Fundo gradiente simulado (retângulos sobrepostos)
  doc.setFillColor(15, 23, 42);        // slate-900
  doc.rect(0, 0, W, H, "F");

  doc.setFillColor(30, 41, 59);        // slate-800
  doc.rect(10, 10, W - 20, H - 20, "F");

  // Borda decorativa
  doc.setDrawColor(99, 102, 241);      // indigo
  doc.setLineWidth(0.8);
  doc.rect(14, 14, W - 28, H - 28, "S");
  doc.setDrawColor(148, 163, 184);     // slate-400
  doc.setLineWidth(0.3);
  doc.rect(16, 16, W - 32, H - 32, "S");

  // Logo / Nome empresa
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(99, 102, 241);      // indigo
  doc.text("SOFTINSA", W / 2, 35, { align: "center" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text("Plataforma de Badges Digitais", W / 2, 41, { align: "center" });

  // Separador
  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(0.5);
  doc.line(40, 46, W - 40, 46);

  // Título
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(203, 213, 225);     // slate-300
  doc.text("CERTIFICADO DE COMPETÊNCIA", W / 2, 57, { align: "center" });

  // Texto "Certifica-se que"
  doc.setFontSize(11);
  doc.setTextColor(148, 163, 184);
  doc.text("Certifica-se que", W / 2, 70, { align: "center" });

  // Nome do consultor
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text(data.consultantName, W / 2, 84, { align: "center" });

  // Badge info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(148, 163, 184);
  doc.text("obteve o badge", W / 2, 95, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(99, 102, 241);
  doc.text(data.badgeName, W / 2, 107, { align: "center" });

  // Nível e área
  const levelStr = [
    data.levelCode ? `Nível ${data.levelCode} — ${data.levelName ?? ""}` : null,
    data.areaName,
    data.serviceLineName,
  ].filter(Boolean).join("  ·  ");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text(levelStr, W / 2, 116, { align: "center" });

  // Data
  const dateStr = `Atribuído em ${new Date(data.awardedAt).toLocaleDateString("pt-PT", { day: "2-digit", month: "long", year: "numeric" })}`;
  doc.setFontSize(10);
  doc.text(dateStr, W / 2, 128, { align: "center" });

  // Pontos
  if (data.pointsAwarded && data.pointsAwarded > 0) {
    doc.setFontSize(9);
    doc.setTextColor(234, 179, 8);     // yellow
    doc.text(`+${data.pointsAwarded} pontos atribuídos`, W / 2, 136, { align: "center" });
  }

  // Separador inferior
  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(0.5);
  doc.line(40, 150, W - 40, 150);

  // Assinatura / Validação
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text("Softinsa — Direção de Recursos Humanos", 60, 160);
  doc.text("Plataforma de Badges Digitais", W - 60, 160, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Documento gerado automaticamente pela Plataforma de Badges da Softinsa.", W / 2, 167, { align: "center" });

  if (data.verifyUrl) {
    doc.setTextColor(99, 102, 241);
    doc.text(`Verificar em: ${data.verifyUrl}`, W / 2, 173, { align: "center" });
  }

  // Download
  const filename = `certificado_${data.badgeName.replace(/[^a-zA-Z0-9]/g, "_")}_${data.consultantName.split(" ")[0]}.pdf`;
  doc.save(filename);
}
