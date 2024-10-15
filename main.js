import {
  convertDate,
  extractInvoiceNumber,
  createHtmlBoilerplate,
} from './utils.js';

// Wait for file input
document
  .getElementById('upload-csv')
  .addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (file) {
      // Use PapaParse to parse the CSV file without headers
      Papa.parse(file, {
        header: false, // CSV has no headers
        dynamicTyping: true, // Automatically typecast numbers and booleans
        complete: function (results) {
          const data = results.data;
          console.log(data);

          // Log CSV data to console
          // Call the function to render table
          const invoiceNumber = extractInvoiceNumber(data[0][5]);
          const invoiceDate = convertDate(data[0][7]);

          const tableData = convertToJsonWithoutTableHeaders(data); // Convert CSV to JSON
          console.log('CSV  Data as JSON:', {
            invoiceNumber,
            invoiceDate,
            tableData,
          }); // Log JSON to console

          generatePdf(invoiceNumber, invoiceDate, tableData); // Generate PDF

          /* console.table(jsonData[0][29]); */
        },
        error: function (err) {
          console.error('Error parsing CSV:', err);
        },
      });
    }
  });

// Function to convert the CSV data into JSON without headers
function convertToJsonWithoutTableHeaders(data) {
  const jsonData = [];

  // Loop through each row in the data array
  data.forEach((row, rowIndex) => {
    const rowObject = {}; // Create an object for each row

    row.forEach((cell, colIndex) => {
      // Use "Column X" as key names (e.g., "Column 1", "Column 2", etc.)
      rowObject[`${colIndex + 1}`] = cell;
    });

    jsonData.push(rowObject); // Add the row object to the JSON data array
  });

  const filteredData = jsonData
    .map((object) => {
      if (object[23] === 'IT') {
        return {
          skuCode: object[21],
          quantity: object[26],
          totalValue: object[29],
        };
      } else {
        return undefined;
      }
    })
    .filter((item) => item !== undefined);

  return filteredData; // Return the JSON data array
}

function generatePdf(invoiceNumber, invoiceDate, tableData) {
  document.getElementById('contentContainer').innerHTML = createHtmlBoilerplate(
    invoiceNumber,
    invoiceDate,
    tableData
  );

  const { jsPDF } = window.jspdf;

  // Reference to the dynamically generated HTML content
  const content = document.getElementById('content');

  // Convert HTML to canvas
  html2canvas(content).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');

    // Initialize jsPDF
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Add the canvas image to the PDF
    const imgWidth = 210; // PDF width in mm
    const pageHeight = 295; // PDF height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add the first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add extra pages if necessary
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    pdf.save(`documento doganale - ${invoiceNumber}`);
  });
}
