import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export interface TablePdfOptions {
  /** Título principal do documento (ex.: "Relatório de Candidaturas"). */
  title: string;
  /** Subtítulo opcional (ex.: service line / período). */
  subtitle?: string;
  /** Cabeçalhos das colunas. */
  head: string[];
  /** Linhas da tabela (cada linha é um array de células já em texto). */
  body: (string | number)[][];
  /** Linhas de resumo opcionais mostradas antes da tabela. */
  summary?: { label: string; value: string | number }[];
  /** Nome do ficheiro sem extensão. */
  fileName?: string;
}

/**
 * Gera e descarrega um PDF com cabeçalho institucional Softinsa + tabela.
 * Reutilizável para relatórios, pedidos, badges, consultores, etc.
 */
export function exportTablePdf(opts: TablePdfOptions) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = 297;
  const marginX = 14;

  // Cabeçalho institucional
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(99, 102, 241); // indigo
  doc.text("SOFTINSA", marginX, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text("Plataforma de Badges Digitais", marginX, 21);

  // Título do relatório
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.text(opts.title, marginX, 32);

  let cursorY = 38;
  if (opts.subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(110, 110, 110);
    doc.text(opts.subtitle, marginX, cursorY);
    cursorY += 5;
  }

  // Data de geração (canto superior direito)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Gerado em ${new Date().toLocaleString("pt-PT")}`,
    W - marginX,
    16,
    { align: "right" },
  );

  // Resumo (chips em texto)
  if (opts.summary?.length) {
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    const summaryStr = opts.summary
      .map((s) => `${s.label}: ${s.value}`)
      .join("    |    ");
    doc.text(summaryStr, marginX, cursorY + 2);
    cursorY += 8;
  }

  // Tabela
  autoTable(doc, {
    startY: cursorY + 2,
    head: [opts.head],
    body: opts.body.map((r) => r.map((c) => (c === null || c === undefined ? "" : String(c)))),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 246, 250] },
    margin: { left: marginX, right: marginX },
  });

  const fileName = (opts.fileName ?? "relatorio") + `_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}
