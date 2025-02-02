document.getElementById('upload-pdf').addEventListener('change', async () => {
  const fileInput = document.getElementById('upload-pdf');
  if (fileInput.files.length === 0) {
    alert('Seleziona almeno un file PDF');
    return;
  }

  const files = Array.from(fileInput.files);
  for (const file of files) {
    const pdfBytes = await file.arrayBuffer();
    const modifiedPDFBytes = await addRedRectangleToPDF(pdfBytes);
    downloadPDF(
      modifiedPDFBytes,
      file.name.replace('.pdf', '_red-rectangle.pdf')
    );
  }
});

async function addRedRectangleToPDF(pdfBytes) {
  const { PDFDocument, rgb } = PDFLib;
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();
    const rectX = width - 130; // Sposta il rettangolo verso destra
    const rectY = 110; // Posizionato vicino al fondo
    const rectWidth = 110; // Larghezza del rettangolo
    const rectHeight = 50; // Altezza del rettangolo

    // Disegna un rettangolo con solo il bordo
    page.drawRectangle({
      x: rectX,
      y: rectY,
      width: rectWidth,
      height: rectHeight,
      borderColor: rgb(1, 0, 0), // Rosso
      borderWidth: 2, // Spessore del bordo
    });
  }

  return await pdfDoc.save();
}

function downloadPDF(pdfBytes, fileName) {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
