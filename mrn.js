const zip = new JSZip();
const input = document.getElementById('upload-pdf-mrn');

input.addEventListener('change', async (event) => {
  const files = Array.from(event.target.files);

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);
    const textContent = await page.getTextContent();
    const text = textContent.items.map((item) => item.str).join(' ');

    // Estrai data e sigla completa
    const dataMatch = extractField(
      text,
      /spedizione\s+del\s+(\d{2}\/\d{2}\/\d{4})/i
    );
    const dataPulita = dataMatch
      ? dataMatch.replace(/\//g, '-')
      : 'datanon_trovata';

    const siglaRegex = /\b((FVD|FD|DSC|DSX)(\d{1,4}))\b/i;
    const siglaMatch = text.match(siglaRegex);

    let siglaFormattata;
    if (siglaMatch) {
      const tipo = siglaMatch[2]; // es. FVD
      const codice = siglaMatch[3]; // es. 770
      siglaFormattata = `${tipo}_${codice}`;
    } else {
      siglaFormattata = 'sigla_non_trovata';
    }

    // Costruisci nuovo nome file
    const originalName = file.name;
    const nuovoNome = `${siglaFormattata}_${dataPulita}_${originalName}`;

    // Crea blob identico all'originale
    const blob = file.slice(0, file.size, 'application/pdf');
    zip.file(nuovoNome, blob);
    //triggerDownload(blob, nuovoNome);
  }

  zip.generateAsync({ type: 'blob' }).then(function (content) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = 'mrn_rinominati.zip';
    a.click();
  });
});

function extractField(text, regex) {
  const match = text.match(regex);
  return match ? match[1] : null;
}

/* function triggerDownload(blob, filename) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  }, 100);
} */
