import apicache from "apicache";
import express from "express";
import GoogleSpreadsheet from "google-spreadsheet";

import events from "../config/events.json";
import googleSecret from "../config/google_client_secret.json";

const app: express.Application = express();
const cache = apicache.middleware;

const PORT = 5000;

app.get("/postarjano/api/availability/:eventName", cache("2 hours"), (req, res) => {
    let event;

    // Select event to process
    for (const evnt of events) {
        if (evnt.identifier === req.params.eventName) {
            event = evnt;
        }
    }

    // Create a document object using the ID of the spreadsheet - obtained from its URL.
    const doc = new GoogleSpreadsheet(event.spreadsheetId);
    // Authenticate with the Google Spreadsheets API.
    doc.useServiceAccountAuth(googleSecret, async (authErr) => {
        if (authErr) {
            console.error(authErr);
        }
        // Get all of the rows from the spreadsheet.
        await doc.getRows(1, async (err, rows) => {
            if (err) {
                console.error(err);
            }

            const registrationCount = rows.filter((row) => row.postarjano === "poslane").length;

            res.json({
                success: "true",
                percentage: (registrationCount / event.capacity) * 100,
            });
        });
    });
});

app.get("/postarjano", (_req, res) => {
    res.redirect("https://github.com/MarekVigas/Postar-Jano");
});

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
