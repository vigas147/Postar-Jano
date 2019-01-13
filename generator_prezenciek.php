<?php
require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/secrets_loader.php';

use setasign\Fpdi;
use Google\Spreadsheet\DefaultServiceRequest;
use Google\Spreadsheet\ServiceRequestFactory;

#Load secrets
Secrets::load();
putenv('GOOGLE_APPLICATION_CREDENTIALS=' . __DIR__ . '/secrets/google_client_secret.json');

$akcia = $_ENV['secrets']['akcie']['primestak'];

$client = new Google_Client;
$client->useApplicationDefaultCredentials();

$client->setApplicationName("Posielam emaily ludom ktori sa prihlasili na Salezko akciu.");
$client->setScopes(['https://www.googleapis.com/auth/drive','https://spreadsheets.google.com/feeds']);

if ($client->isAccessTokenExpired()) {
    $client->refreshTokenWithAssertion();
}

$accessToken = $client->fetchAccessTokenWithAssertion()["access_token"];
ServiceRequestFactory::setInstance(
    new DefaultServiceRequest($accessToken)
);

// Get our spreadsheet
$spreadsheet = (new Google\Spreadsheet\SpreadsheetService)
   ->getSpreadsheetFeed()
   ->getByTitle($akcia['spreadsheet_name']);
 
// Get the first worksheet (tab)
$worksheets = $spreadsheet->getWorksheetFeed()->getEntries();
$worksheet = $worksheets[0];

$listFeed = $worksheet->getListFeed();

$ucastnici = array();
foreach ($listFeed->getEntries() as $entry) {
    $values = $entry->getValues();
    array_push($ucastnici, $values);
}

array_multisort(array_column($ucastnici, 'priezvisko'), SORT_ASC,
                array_column($ucastnici, 'meno'),      SORT_ASC,
                $ucastnici);

$cellFeed = $worksheet->getCellFeed();

$rows = $cellFeed->toArray();

class Pdf extends Fpdi\TcpdfFpdi
{
    /**
     * "Remembers" the template id of the imported page
     */
    protected $tplId;

    function Header()
    {
        if (is_null($this->tplId)) {
            $this->setSourceFile('prezencka_denny_tabor_2018.pdf');
            $this->tplId = $this->importPage(1);
        }
        $size = $this->useImportedPage($this->tplId);
    }

    function Footer()
    {
        // emtpy method body
    }
}

// initiate PDF
$pdf = new Pdf();
// $pdf->SetMargins(PDF_MARGIN_LEFT, 40, PDF_MARGIN_RIGHT);
// $pdf->SetAutoPageBreak(true, 40);
$pdf->SetFont('freeserif', '', 10);

$pocet_ucastnikov = count($rows) - 1;
$pocet_stran = ceil($pocet_ucastnikov / 10);

$counter = 0;
$pageNumber = 1;

// print_r($ucastnici);
// add a page
$pdf->AddPage('L', 'A4');

foreach ($ucastnici as $values){
    $counter++;
    $pdf->SetFont('freeserif', '', 12);
    $datum_narodenia = DateTime::createFromFormat('d.m.Y', $values['dátumnarodenia']);
    $pdf->Text(21, (53 + 8.2*$counter), $values['meno'] . ' ' . $values['priezvisko']);
    $pdf->Text(86, (53 + 8.2*$counter), $values['adresamestoobecnieskratka']);
    $pdf->Text(118, (53 + 8.2*$counter), $datum_narodenia->format('Y'));
    if ($counter == 10) {
        $counter = 0;
        // add a page
        $pdf->AddPage('L', 'A4');
    }
}

$pdf->Output('test.pdf','F');