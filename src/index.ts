import fs from "fs";
import GoogleSpreadsheet from "google-spreadsheet";
import Mailgun from "mailgun-js";
import minimist from "minimist";
import moment from "moment";
import mustache from "mustache";

import config from "./config/config.json";
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
    // Mailgun setup
    const mailgun: Mailgun.Mailgun  = new Mailgun({ apiKey: config.secrets.MAILGUN_API_KEY, domain: event.mailgun.domain });

    // Load templates
    const confirmTemplate = fs.readFileSync(`./templates/${event.mailgun.confirmTemplate}`, "utf8");
    const paymentTemplate = fs.readFileSync(`./templates/${event.mailgun.paymentTemplate}`, "utf8");

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
                console.error(err);
            }
            for (const row of rows) {
                sendConfirmation(row, event, confirmTemplate, mailgun);
                sendPayment(row, event, paymentTemplate, mailgun);
            }
        });
    });
})();

function getRandomSymbol(): number {
    return Math.floor(Math.random() * 90000) + 10000;
}

function sendConfirmation(row: any, event: any, infoConfirmTemplate: string, mailgun: Mailgun.Mailgun): void {
    if (row.postarjano !== "poslane") {
        const variableSymbol = `${event.prefix}${getRandomSymbol()}`;
        row.variabilnysymbol = variableSymbol;
        const html = mustache.render(infoConfirmTemplate, getTemplateData(event, row, variableSymbol));

        const data = {
            from: event.mailgun.from,
            to: `${row.menoapriezvisko} <${row.email}>`,
            subject: `${event.mailgun.subject} ${event.name}`,
            html,
        };

        mailgun.messages().send(data, (error, _body) => {
            if (error) {
                console.error(error, row);
            } else {
                row.postarjano = "poslane";
                row.save();
            }
        });
    }
}

function getTemplateData(event, row, variableSymbol: string) {
    const person = event.responsiblePerson;
    return {
        meno: row.meno,
        priezvisko: row.priezvisko,
        pohlavie: row.pohlavie,
        adresa1: row.adresaulicaorientačnéčíslo,
        adresa2: row.adresamestoobecnieskratka,
        datumNaordenia: row.dátumnarodenia,
        skola: row.škola,
        trieda: row.triedaukončenýročník,
        lieky: row.prosímuveďteakéliekyužívavašedieťa,
        obmedzenia: row.prosímuveďteakézdravotnéťažkostialeboobmedzeniamávašedieťa,
        preukaz: row.mávášsyndcéraaktuálnyčlenskýpreukazsalezkanaškolskýrok20182019,
        cena: row.mávášsyndcéraaktuálnyčlenskýpreukazsalezkanaškolskýrok20182019 === "Áno" ? event.priceDiscounted : event.price,
        accNumber: event.IBAN,
        variableSymbol,
        fotkaUrl: person.foto,
        eventName: event.name,
        pohlavieSklonovane: row.pohlavie === "chlapec" ? "vášho syna" : "vašu dcéru",
        // tslint:disable-next-line: max-line-length
        organizatorText: `Za túto akciu je ${person.sex === "M" ? "zodpovedný" : "zodpovedná"} ${person.name}. V prípade otázok ma neváhajte kontaktovať.<br>${person.email}<br>${person.phone}`,
    };
}

function sendPayment(row, event, template, mailgun: Mailgun.Mailgun) {
    if (row.postarjano === "poslane" && (row.zaplatene.length && !(row.zaplatenedatum.length))) {
        const html = mustache.render(template, getTemplateData(event, row, "0"));

        const data = {
            from: event.mailgun.from,
            to: `${row.menoapriezvisko} <${row.email}>`,
            subject: `${event.mailgun.subject} Potvrdenie platby ${event.name}`,
            html,
        };

        mailgun.messages().send(data, (error, _body) => {
            if (error) {
                console.error(error, row);
            } else {
                row.zaplateneDatum = moment().format("DD/MM/YYYY HH:mm:ss");
                row.save();
            }
        });
    }
}
