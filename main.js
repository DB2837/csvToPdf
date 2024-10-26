import {
  convertDate,
  extractInvoiceNumber,
  createHtmlBoilerplate,
  generateButton,
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
          const data = results.data.filter((item) => item.length > 1);
          console.log(data);

          const invoiceData = [];

          for (let i = 0; i < data?.length; i++) {
            if ((data[i] && data[i][0] !== undefined) || data[i][0] != null) {
              const invoiceNumber = extractInvoiceNumber(data[i][5]);
              const invoiceDate = convertDate(data[i][7]);

              const { tableData, goodsOrigin } =
                convertToJsonWithoutTableHeaders(data, invoiceNumber);
              /*    console.log('CSV  Data as JSON:', {
                invoiceNumber,
                invoiceDate,
                tableData,
              }); */ // Log JSON to console

              invoiceData.push({
                goodsOrigin,
                invoiceNumber,
                invoiceDate,
                tableData,
              });
            }
          }

          const seenInvoiceNumber = new Set();
          const uniqueInvoiceData = invoiceData.filter((item) => {
            const duplicate = seenInvoiceNumber.has(item.invoiceNumber);
            seenInvoiceNumber.add(item.invoiceNumber);
            return !duplicate;
          });

          console.log('INVOICE DATA', uniqueInvoiceData);

          const buttonContainer = document.getElementById('buttonContainer');
          buttonContainer.innerHTML = '';

          uniqueInvoiceData.forEach((item) => {
            const button = generateButton(item.invoiceNumber, function () {
              generatePdf(
                item.invoiceNumber,
                item.invoiceDate,
                item.tableData,
                item.goodsOrigin
              );
            });
            buttonContainer.appendChild(button);
          });

          // generatePdf(invoiceNumber, invoiceDate, tableData); // Generate PDF

          /* console.table(jsonData[0][29]); */
        },
        error: function (err) {
          console.error('Error parsing CSV:', err);
        },
      });
    }
  });

// Function to convert the CSV data into JSON without headers
function convertToJsonWithoutTableHeaders(data, invoiceNumber) {
  const jsonData = [];
  /*   const goods = {
    italian: 'IT',
    mixed: 'MI',
    fullForeign: 'FO',
  }; */

  // Loop through each row in the data array
  data.forEach((row, rowIndex) => {
    const rowObject = {}; // Create an object for each row

    row.forEach((cell, colIndex) => {
      // Use "Column X" as key names (e.g., "Column 1", "Column 2", etc.)
      rowObject[`${colIndex + 1}`] = cell;
    });

    if (
      extractInvoiceNumber(rowObject[6]) &&
      extractInvoiceNumber(rowObject[6]) === invoiceNumber
    ) {
      jsonData.push(rowObject);
    }
  });

  /*  console.log('JSON DATA', jsonData); */

  const isFullItalian = jsonData.every((item) => item[23] === 'IT');

  const isMixed = jsonData.some((item) => item[23] !== 'IT');

  const isFullForeign = jsonData.every((item) => item[23] !== 'IT');

  /*   console.log('IS FULL ITALIAN', isFullItalian);
  console.log('IS MIXED', isMixed);
  console.log('IS FULL FOREIGN', isFullForeign); */

  const filteredData = jsonData
    .map((object) => {
      if (object[23] === 'IT') {
        return {
          invoiceNumber: object[6],
          skuCode: object[21],
          quantity: object[26],
          totalValue: object[29],
        };
      } else {
        /*  console.log('origin', object[23]); */
        return undefined;
      }
    })
    .filter((item) => item !== undefined);

  /* console.log('FILTERED DATA', filteredData); */

  return {
    tableData: filteredData,
    goodsOrigin: {
      isFullItalian,
      isMixed,
      isFullForeign,
    },
  }; // Return the JSON data array
}

function generatePdf(invoiceNumber, invoiceDate, tableData, goodsOrigin) {
  document.getElementById('contentContainer').innerHTML = createHtmlBoilerplate(
    invoiceNumber,
    invoiceDate,
    tableData,
    goodsOrigin
  );

  // Reference to the dynamically generated HTML content
  const content = document.getElementById('content');

  html2pdf()
    .from(content)
    .set({
      margin: [0.2, 0.4, 0.2, 0.4], // Set smaller margins (top, right, bottom, left)
      filename: `documento doganale - ${invoiceNumber}`,
      image: { type: 'jpeg', quality: 0.75 },
      html2canvas: { scale: 1.2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    })
    .save();
}
