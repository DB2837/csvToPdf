import { dateRegex, invoiceNumberRegex } from './constants.js';

export function convertDate(str) {
  const match = str.match(dateRegex);

  if (match) {
    const extractedDate = match[0]; // e.g., "September 23, 2024"

    // Create a Date object from the extracted date string
    const date = new Date(extractedDate);

    // Format the date to "dd/mm/yyyy"
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
    const year = date.getFullYear(); // Get the full year

    const formattedDate = `${day}/${month}/${year}`; // Combine into "dd/mm/yyyy"

    return formattedDate; // Output: "23/09/2024"
  } else {
    console.log('No date found.');
  }
}

export function extractInvoiceNumber(str) {
  const match = str.match(invoiceNumberRegex);

  return match
    ? match[0].replace(/\s+/g, '')
    : console.log('No invoice number found.');
}

export function createHtmlBoilerplate(invoiceNumber, invoiceDate, tableData) {
  const tableObject = tableData.map((item) => {
    return `
      <div>
        <p>
            codice SKU: <span>${item.skuCode}</span> <br />
            nr. pezzi: <span>${item.quantity}</span> <br />
            valore totale: <span>${item.totalValue} EUR</span>
        </p>
      </div>
    `;
  });

  return `
 <div id="content">
    <div class="boilerplate">
   
   <div class="dichiarazione-doganale">
      <div class="page">
        <header>
          <h1>SONNECT</h1>
        </header>

        <main>
          <h4>Spett.le Agenzia delle Dogane</h4>

          <div class="auto-dichiarazione">
            <p>
              Io sottoscritto DAVID SCORTECCIA in qualità di LEGALE
              RAPPRESENTANTE della ditta Sonnect Srl, P. IVA IT 03825400546
              dichiaro sotto la mia personale responsabilità che la merce
              contenuta nella spedizione nr ………………..
            </p>

            <div>
              <span>fattura nr. <span class="margin-left">${invoiceNumber}</span> </span>
              <span class="date-container"
                >data: <span class="margin-left">${invoiceDate}</span></span
              >
            </div>
            <p>
              non è vincolato a licenze di esportazione e che la merce riferita
              alla documentazione in oggetto:
            </p>

            <div class="checkboxes-container">
              <input type="checkbox" id="preferenziale-UE" name="UE" />

              <label for="preferenziale-UE">
                <div>
                  <h3>MERCE DI ORIGINE PREFERENZIALE U.E.</h3>
                  <p>
                    (barrare la casella con una X in caso di merce di origine
                    preferenziale. Valido solo per richiedere l’emissione del
                    certificato EUR1/EUR MED)
                  </p>
                  <p>
                    Dichiarazione da compilare
                    <span class="underlined">esclusivamente in caso</span> sia
                    stata barrata la scelta dell’origine preferenziale.
                  </p>
                  <div class="dichiarazoine-merci">
                    <h3>dichiarazione</h3>
                    <p>Il sottoscritto dichiara che le merci con</p>

                    <div>
                      ${tableObject}
                      </div>

                    <div>
                      <p>
                        elencate nel presente documento sono originarie di
                        ...ITALIA........ e rispettano le norme di origine che
                        disciplinano gli scambi preferenziali con
                        ________________
                        <br />
                        Dichiara: <br />
                        <input type="checkbox" id="opzione1" name="opzione1" />
                        <label for="opzione1"
                          >Cumulo applicato con ............... (origine
                          preferenziale acquisita con merce del Paese/dei
                          Paesi)</label
                        ><br />
                        <input type="checkbox" id="opzione2" name="opzione2" />
                        <label for="opzione2"
                          >Cumulo non applicato (origine preferenziale della
                          merce dovuta ad un unico Paese)</label
                        ><br />
                        Si impegna a presentare alle autorità doganali tutta la
                        necessaria documentazione giustificativa dell’origine
                        preferenziale (esempi documenti: fatture, documenti di
                        importazione, certificati di circolazione, dichiarazioni
                        su fattura, dichiarazioni fabbricante/fornitore,
                        estratti di documenti contabili, estratti di documenti
                        tecnici di lavorazione, ecc.):
                      </p>
                    </div>
                  </div>
                </div>
              </label>
            </div>

            <input type="checkbox" id="opzione1" name="opzione1" />
            <label for="opzione1"><h3>MERCE CON DESTINO TURCHIA</h3></label>

            <p>
              (barrare la casella con una X in caso di merce destinata in
              Turchia, al fine di poter richiedere l’emissione del certificato
              ATR) Dichiaro che la merce rispetta i requisiti previsti per
              l’applicazione dell’Accordo UE/Turchia (Decisione n. 1/95 del
              Consiglio di associazione CE- Turchia, del 22/12/1995 e
              2006/646/CE: Decisione n. 1/2006 del Comitato di cooperazione
              doganale CE-Turchia, del 26/09/2006).
            </p>

            <div>
              <p>
                <span class="section-tile"
                  >MANDATO PER EMISSIONE CERTIFICATO EUR1/EUR-MED/ATR</span
                >
                <br />
                Si conferisce a DHL Express (Italy) S.r.l. mandato al compimento
                delle operazioni doganali e all’emissione e alla firma per
                nostro ordine e conto del modello EUR1/EUR-MED/ATR, e
                contestuale manleva da qualsiasi responsabilità legata
                direttamente o indirettamente all’espletamento della procedura
                oggetto del presente mandato.
              </p>
            </div>

            <div>
              <p>
                <span class="section-tile"
                  >DICHIARAZIONE PER DUPLICE USO (certificato Y901)</span
                >
                <br />
                non rientra nell’elenco dei beni previsti dal Reg. (UE) n.
                821/2021 e successive modifiche che istituisce un regime
                comunitario di controllo delle esportazioni di prodotti e
                tecnologie a duplice uso (Dual Use) e pertanto destinata ad uso
                civile.
              </p>
            </div>

            <div>
              <p>
                <span class="section-tile"
                  >DICHIARAZIONE DI WASHINGTON (certificato Y900)</span
                >
                <br />
                non rientra tra quelle protette dalla Convenzione di Washington,
                come da Reg. (CE) n. 338/97 e successive modifiche, relativo
                alla protezione di specie della flora e fauna selvatiche.
              </p>

              <img
                src="images/firma.jpg"
                alt="Company Logo"
                width="190"
                class="firma-timbro"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
</div>
      </div>
    </div>



    
`;
}
