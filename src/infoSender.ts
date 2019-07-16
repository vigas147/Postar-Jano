import fs from "fs";
import GoogleSpreadsheet from "google-spreadsheet";
import Mailgun from "mailgun-js";
import minimist from "minimist";
import mustache from "mustache";

import config from "./config/config.json";
import events from "./config/events.json";
import googleSecret from "./config/google_client_secret.json";

(async () => {
    const args = minimist(process.argv.slice(2));
    let event;

    if (!(args.eventId && args.template && args.columnName && args.subject)) {
        logArgs(args, true);
        console.error("Not enough arguments");
        process.exit(1);
    }

    logArgs(args, false);

    // Select event to process
    for (const evnt of events) {
        if (evnt.identifier === args.eventId) {
            event = evnt;
        }
    }
    // Mailgun setup
    const mailgun: Mailgun.Mailgun  = new Mailgun({ apiKey: config.secrets.MAILGUN_API_KEY, domain: event.mailgun.domain });

    // Load template
    const template = fs.readFileSync(`./templates/${args.template}`, "utf8");

    // Create a document object using the ID of the spreadsheet - obtained from its URL.
    const doc = new GoogleSpreadsheet(event.spreadsheetId);

    // Authenticate with the Google Spreadsheets API.
    await doc.useServiceAccountAuth(googleSecret, async (authErr) => {
        if (authErr) {
            console.error(authErr);
        }
        // Get all of the rows from the spreadsheet.
        await doc.getRows(1, async (err, rows) => {
            if (err) {
                console.error(err, rows, template, mailgun);
            }

            for (const row of rows) {
                const files = [];
                const filename = `${row.variabilnysymbol}.pdf`;
                const data = fs.readFileSync(`./potvrdenia/${filename}`);
                files.push(new mailgun.Attachment({
                    data,
                    filename,
                    contentType: "application/pdf",
                }));
                if (row.zaplatene.length > 0) {
                    sendEmail(row, args.columnName, event, template, args.subject, mailgun, files);
                }
            }
        });
    });

})();

function logArgs(args: any, withDescription: boolean) {
    if (withDescription) {
        console.log(`eventId: |${args.eventId}| - Event identifier from config/events.json`);
        console.log(`template: |${args.template}| - Name of template from templates/`);
        console.log(`columnName: |${args.columnName}| - Column name from spreadsheet for check`);
        console.log(`subject: |${args.subject}| - {event.mailgun.subject} {subject} {event.name}`);
    } else {
        console.log(`eventId: |${args.eventId}|`);
        console.log(`template: |${args.template}|`);
        console.log(`columnName: |${args.columnName}|`);
        console.log(`subject: |${args.subject}|`);
    }
}

function sendEmail(row: any, column: string, event: any, template: string, subject: string, mailgun: Mailgun.Mailgun, files: any[]): void {
    if (row[column] !== "poslane" ) {
        const html = mustache.render(template, getTemplateData(event, row));

        const data = {
            from: event.mailgun.from,
            to: `${row.menoapriezvisko} <${row.email}>`,
            subject: `${event.mailgun.subject} ${subject} ${event.name}`,
            html,
            attachment: files,
        };

        mailgun.messages().send(data, (error, _body) => {
            if (error) {
                console.error(error, row);
            } else {
                row[column] = "poslane";
                row.save();
            }
        });
    }
}

function getTemplateData(event, row) {
    const person = event.responsiblePerson;
    return {
        meno: row.meno,
        priezvisko: row.priezvisko,
        pohlavie: row.pohlavie,
        datumNaordenia: row.dátumnarodenia,
        adresaUlica: row.adresaulicaorientačnéčíslo,
        adresaMesto: row.adresamestoobecnieskratka,
        phone: row.telefónnečíslo.length > 0 ? row.telefónnečíslo : "Nevyplnené",
        fotkaUrl: person.foto,
        eventName: event.name,
        pohlavieSklonovane: row.pohlavie === "chlapec" ? "vášho syna" : "vašu dcéru",
        organizatorSklonovane: event.responsiblePerson.menoSklonovane,
        // tslint:disable-next-line: max-line-length
        organizatorText: `Za túto akciu je ${person.sex === "M" ? "zodpovedný" : "zodpovedná"} ${person.name}. V prípade otázok ma neváhajte kontaktovať.<br>${person.email}<br>${person.phone}`,
    };
}
