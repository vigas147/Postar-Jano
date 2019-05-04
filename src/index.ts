import GoogleSpreadsheet from "google-spreadsheet";
import minimist from "minimist";

import events from "./config/events.json";
import googleSecret from "./config/google_client_secret.json";

(async () => {
    const args = minimist(process.argv.slice(2));
    let event;

    // Select event to process
    for (const evnt of events) {
        if (evnt.identifier === args.eventId) {
            event = evnt;
        }
    }

    // Create a document object using the ID of the spreadsheet - obtained from its URL.
    const doc = new GoogleSpreadsheet(event.spreadsheetId);

    // Authenticate with the Google Spreadsheets API.
    await doc.useServiceAccountAuth(googleSecret, async (_authErr) => {

      // Get all of the rows from the spreadsheet.
      doc.getRows(1, async (_err, rows) => {
        for (const row of rows) {
            console.log(row);
            row.postarJano = "test";
            row.save();
        }
      });
    });
})();
