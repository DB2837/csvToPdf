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

export function getCurrentDateWithTimezone() {
  const today = new Date();

  // Adjust for UTC+1 (add 1 hour to UTC time)
  today.setHours(today.getUTCHours() + 1);

  // Get the day, month, and year in UTC+1
  let day = today.getUTCDate();
  let month = today.getUTCMonth() + 1; // Months are 0-indexed in JavaScript (0 = January, 11 = December)
  const year = today.getUTCFullYear();

  // Add a leading zero to day and month if they are less than 10
  day = day < 10 ? '0' + day : day;
  month = month < 10 ? '0' + month : month;

  // Return the date in gg/mm/yyyy format for UTC+1
  return `${day}/${month}/${year}`;
}

export function extractInvoiceNumber(str) {
  const match = str.match(invoiceNumberRegex);

  return match
    ? match[0].replace(/\s+/g, '')
    : console.log('No invoice number found.');
}

export function createHtmlBoilerplate(invoiceNumber, invoiceDate, tableData) {
  const currentDate = getCurrentDateWithTimezone();

  const tableObject = tableData
    .map((item) => {
      return `
      <div  class="product">
        <p>
            codice SKU: <span class="bold">${item.skuCode}</span> <br />
            nr. pezzi: <span class="bold">${item.quantity}</span> <br />
            valore totale: <span class="bold">${item.totalValue} EUR</span>
        </p>
      </div>
    `;
    })
    .join('');

  return `
 <div id="content">
 

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

            <div class="invoiceNumber-date">
              <span>fattura nr. <span class="margin-left bold">${invoiceNumber}</span> </span>
              <span class="date-container"
                >data: <span class="margin-left bold">${invoiceDate}</span></span
              >
            </div>
            <p>
              non è vincolato a licenze di esportazione e che la merce riferita
              alla documentazione in oggetto:
            </p>

            <div class="checkbox-container">
              <input type="checkbox" id="preferenziale-UE" name="UE" checked />
              <label for="preferenziale-UE">
                <h3>MERCE DI ORIGINE PREFERENZIALE U.E.</h3>
              </label>
            </div>

            <div class="checkbox-content">
              <p>
                (barrare la casella con una X in caso di merce di origine
                preferenziale. Valido solo per richiedere l’emissione del
                certificato EUR1/EUR MED) <br />
                Dichiarazione da compilare
                <span class="underlined">esclusivamente in caso</span> sia stata
                barrata la scelta dell’origine preferenziale.
              </p>

              <div class="dichiarazoine-merci">
                <h3>dichiarazione</h3>
                <p>Il sottoscritto dichiara che le merci con</p>
                     ${tableObject}

                <div>
                  <p>
                    elencate nel presente documento sono originarie di
                    <span class="italia"> ITALIA</span> e rispettano le norme di origine che
                    disciplinano gli scambi preferenziali con ________________
                    <br />
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
                      >Cumulo non applicato (origine preferenziale della merce
                      dovuta ad un unico Paese)</label
                    ><br />
                    Si impegna a presentare alle autorità doganali tutta la
                    necessaria documentazione giustificativa dell’origine
                    preferenziale (esempi documenti: fatture, documenti di
                    importazione, certificati di circolazione, dichiarazioni su
                    fattura, dichiarazioni fabbricante/fornitore, estratti di
                    documenti contabili, estratti di documenti tecnici di
                    lavorazione, ecc.):
                  </p>
                </div>
              </div>
            </div>

            <div class="checkbox-container">
              <input type="checkbox" id="opzione1" name="opzione1" />
              <label for="opzione1"><h3>MERCE CON DESTINO TURCHIA</h3></label>
            </div>

            <div class="checkbox-content">
              <p>
                (barrare la casella con una X in caso di merce destinata in
                Turchia, al fine di poter richiedere l’emissione del certificato
                ATR) Dichiaro che la merce rispetta i requisiti previsti per
                l’applicazione dell’Accordo UE/Turchia (Decisione n. 1/95 del
                Consiglio di associazione CE- Turchia, del 22/12/1995 e
                2006/646/CE: Decisione n. 1/2006 del Comitato di cooperazione
                doganale CE-Turchia, del 26/09/2006).
              </p>
            </div>

            <div class="section-paragraph">
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

            <div class="section-paragraph">
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

            <div class="section-paragraph">
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



    <div class="page">

      <header>
          <h1>SONNECT</h1>
        </header>
       <div class="section-paragraph">
              <p>
                <span class="section-tile"
                  >DICHIARAZIONE PER PELLICCE DI CANI E GATTI (certificato Y922)</span
                >
                <br />
               non consiste in pellicce di cane e di gatto e di prodotti che le contengono, come previsto dal Reg. (CE) n. 1523/07 e successive
               modifiche che ne vieta la commercializzazione, l'importazione e l'esportazione.
              </p>
            </div>

             <div class="section-paragraph">
              <p>
                <span class="section-tile"
                  >DICHIARAZIONE PER L’OZONO (certificato Y784 - Y792)</span
                >
                <br />
               non rientra nell’elenco dei beni ritenuti dannosi per l'ozono elencati nel Reg. (CE) n. 590/2024 e successive modifiche.
              </p>
            </div>

             <div class="section-paragraph">
              <p>
                <span class="section-tile"
                  >DICHIARAZIONE PER BENI CULTURALI (certificato Y903)</span
                >
                <br />
               non rientra nell’elenco dei beni previsti dal Reg. (CE) n. 116/09 del Consiglio del 18 dicembre 2008 e successive modifiche
               relativo all’esportazione di beni culturali.
              </p>
            </div>

             <div class="section-paragraph">
              <p>
                <span class="section-tile"
                  >DICHIARAZIONE PER SOSTANZE CHIMICHE PERICOLOSE (certificati Y916 - Y917)</span
                >
                <br />
                non rientra tra quelle elencate negli allegati I e V del Reg. (UE) 649/2012 e successive modifiche recante disposizioni in
                materia di esportazioni e importazioni di sostanze chimiche pericolose.
              </p>
            </div>

             <div class="section-paragraph">
              <p>
                <span class="section-tile"
                  >DICHIARAZIONE PER MERCE CHE POTREBBE ESSERE UTILIZZATA PER LA PENA DI MORTE, LA TORTURA O PER
                  ALTRI TRATTAMENTI O PENE CRUDELI, INUMANE O DEGRADANTI (certificati Y904 - Y906 – Y907- Y908)</span
                >
                <br />
               non rientra nell’elenco dei beni previsti da Reg. (CE) 125/2019 e successive modifiche relativo al commercio di determinate
               merci che potrebbero essere utilizzate per la pena di morte, la tortura o per altri trattamenti o pene crudeli, inumane o
               degradanti.
              </p>
            </div>

                <div class="section-paragraph regulation">
              <p>
                <span class="section-tile"
                  >DICHIARAZIONE PER MERCE DESTINATA IN UNO DEI PAESI SOTTO INDICATI (certificati Y920 - Y921- Y949 - Y966 – Y967)</span
                >
                <p>
                  la merce non rientra nell’ elenco dei beni previsti dal: <br />
                </p>
                <p>
                <span class="underlined">Reg. (CE) 314/04 </span>e successive
                modifiche, concernente misure restrittive nei confronti dello
                Zimbabwe;
              </p>
              <p>
                <span class="underlined"> Reg. (UE) 2017/1509</span> e successive modifiche, concernente misure
                restrittive nei confronti della Repubblica popolare democratica
                di Corea;
              </p>
              <p>
                 <span class="underlined">Reg. (UE) 401/2013</span> e successive modifiche, concernente misure
                restrittive nei confronti del Myanmar;
              </p>
              <p>
                 <span class="underlined">Reg. (UE) 44/2016</span> e successive modifiche, concernente misure
                restrittive nei confronti della Libia;
              </p>
              <p>
                 <span class="underlined">Reg. (UE) 36/12</span> e successive modifiche, concernente misure
                restrittive nei confronti della Siria;
              </p>
              <p>
                 <span class="underlined">Reg. (UE) 267/12</span> e successive modifiche e attuazioni,
                concernente misure restrittive nei confronti dell’Iran;
              </p>
              <p>
                <span class="underlined"> Reg. (UE) 747/14</span> e successive modifiche, concernente misure
                restrittive nei confronti del Sudan.
              </p>
              </p>
            </div>

              <div class="section-paragraph">
              <p>
                <span class="section-tile"
                  >DICHIARAZIONE Y935 (certificato Y935)</span
                >
                <br />
               non rientra nell’elenco dei beni previsti dal Reg. (UE) 1332/13 e successive modifiche, concernente misure restrittive in
considerazione della situazione in Siria.
              </p>
            </div>

              <div class="section-paragraph">
              <p>
                <span class="section-tile"
                  >DICHIARAZIONE PER RUSSIA (certificati Y939 – Y920 – Y995)</span
                >
                <br />
                non rientra tra quelle elencate nell’allegato II del Reg. (UE) 833/14 e della Dec. 0512/14, e successive modifiche concernente
misure restrittive in considerazione delle azioni della Russia che destabilizzano la situazione in Ucraina.
              </p>
            </div>

              <div class="section-paragraph">
              <p>
                <span class="section-tile"
                  >DICHIARAZIONE PER SPEDIZIONI DI RIFIUTI (certificato Y923)</span
                >
                <br />
               non rientra nei prodotti soggetti alle disposizioni del Regolamento (CE) n. 1013/2006 (GUCE L190) e successive modifiche.
              </p>
            </div>

              <div class="section-paragraph">
              <p>
                <span class="section-tile"
                  >DICHIARAZIONE PER SPEDIZIONI DI MERCURIO (certificato Y924)</span
                >
                <br />
               Non rientra nei prodotti soggetti alle disposizioni del Regolamento (UE) n. 852/2017 e successive modifiche relativo a misure
restrittive per spedizioni contenenti mercurio.
              </p>
            </div>

              <div class="section-paragraph">
              <p>
                <span class="section-tile"
                  >DICHIARAZIONE PER UCRAINA – REGIONI DONETSK, KHERSON, LUHANSK E ZAPORIZHZHIA (certificato Y984)</span
                >
                <br />
                Non rientra nei prodotti soggetti alle disposizioni del Regolamento del Consiglio (UE) 263/2022 del 23 febbraio 2022 e
successive modifiche in risposta al riconoscimento come aree non più controllate dal governo ucraino di Donetsk e del Luhansk
e in conseguenza all’ordine di intervento armato russo in quelle aree.
              </p>
            </div>

              <div class="section-paragraph">
              <p>
                <span class="section-tile"
                  >DICHIARAZIONE PER UCRAINA – TERRITORI DI CRIMEA E SEBASTOPOLI (certificati Y997-Y998))</span
                >
                <br />
               Merci non destinate nei territori di Crimea e Sebastopoli (Regolamento (UE) N. 692/2014) o merci per le quali non vi siano
fondati motivi che saranno utilizzate in Crimea e a Sebastopoli (Articolo 2ter paragrafo 3 del Regolamento (UE) N. 692/2014).
              </p>
            </div>

         

         <footer>
          <div class="place-date">
            <p>Luogo e data</p>
            <p>Marsciano,  ${currentDate}</p>
          </div>

          <div class="sonncet-info">
            <p class="company-name">Sonnect S.r.l</p>
            <p>
              Via A. Ferranti, 5 - Zona ind. Torre Sapienza snc - 06055 -
              Marsciano(PG) - Italy
            </p>
            <p>
              Tel. 349 0081699 - www.sonnectaudio.com - hello@sonnectaudio.com -
              sonnect@pec.it
            </p>
            <p>
              Partita iva/Cod.Fisc./CCIAA:IT03825400546 - REA:355068 - Capitale
              sociale: 10.000,00€ i.v
            </p>
          </div>

          <div class="signature">
            <p>Firma incaricato</p>
            <img
              src="images/firma.jpg"
              alt="Company Logo"
              width="185"
              class="firma-timbro"
            />
          </div>
        </footer>
    </div>
      
      
    </div>



    
`;
}
