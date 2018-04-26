<?php 
require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/secrets_loader.php';

use Mailgun\Mailgun;
use Google\Spreadsheet\DefaultServiceRequest;
use Google\Spreadsheet\ServiceRequestFactory;

#Load secrets
Secrets::load();
putenv('GOOGLE_APPLICATION_CREDENTIALS=' . __DIR__ . '/secrets/google_client_secret.json');

$akcia = $_ENV['secrets']['akcie'][$argv[1]];

#Mustache templating form html generation
$m = new Mustache_Engine(array(
    'escape' => function($value) {
        return htmlspecialchars($value, ENT_COMPAT, 'UTF-8');
    },
));

#register new loader
$loader = new Mustache_Loader_FilesystemLoader(dirname(__FILE__).'/templates');

#loads tempate
$tpl_platba = $loader->load('potvrdenieplatby');
$tpl_prihlaska = $loader->load('potvrdenieudajov');

# MAILGUN
$mgClient = new Mailgun($_ENV['secrets']['MAILGUN_API_KEY']);
$domain = "mailgun.sbb.sk";

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

$cellFeed = $worksheet->getCellFeed();

$rows = $cellFeed->toArray();

$listFeed = $worksheet->getListFeed();

foreach ($listFeed->getEntries() as $entry){
    $values = $entry->getValues();

    #Posle email o zaregistrovani prihlasky
	if ($values['postarjano'] ===  '') {
        
        $email_data = array(
            'meno' => $values['meno'],
            'priezvisko' => $values['priezvisko'],
            'pohlavie' => $values['pohlavie'],
            'adresa1' => $values['adresaulicaorientačnéčíslo'],
            'adresa2' => $values['adresamestoobecnieskartka'],
            'datumnarodenia' => $values['dátumnarodenia'],
            'skola' => $values['škola'],
            'rocnik' => $values['triedaukončenýročník'],
            'lieky' => (strlen($values['prosímuveďteakéliekyužívavašedieťa']) > 1) ? $values['prosímuveďteakéliekyužívavašedieťa'] : 'žiadne',
            'obmedzenia' => (strlen($values['prosímuveďteakézdravotnéťažkostialeboobmedzeniamávašedieťa']) > 1) ? $values['prosímuveďteakézdravotnéťažkostialeboobmedzeniamávašedieťa'] : 'žiadne',
            'preukaz' => $values['mávášsyndcéraaktuálnyčlenskýpreukazsalezkanarok2018'],
            'telefon' => $values['telefónnečíslo'],
            'preukaz_platba' => ($values['mávášsyndcéraaktuálnyčlenskýpreukazsalezkanarok2018'] === 'Áno') ? 'a preukázali sa platným členským preukazom' : '',
            'cena' => ($values['mávášsyndcéraaktuálnyčlenskýpreukazsalezkanarok2018'] === 'Áno') ? $akcia['cena_preukaz'] : $akcia['cena'],
            'organizator_meno' => $akcia['organizator']['meno'],
            'organizator_email' => $akcia['organizator']['email'],
            'organizator_telefon' => $akcia['organizator']['telefon'],
            'organizator_meno_sklonovane' => $akcia['organizator']['meno_sklonovane'],
            'fotka_url' =>  $akcia['organizator']['foto'],
            'event' => $akcia['event_name'],
        );

        try {
            $mail_result = $mgClient->sendMessage("$domain",
                      array('from'    => 'Salezko <robot@mailgun.sbb.sk>',
                            'to'      => $values['menoapriezvisko'].' <'.$values['email'].'>',
                            'subject' => 'Salezko - Prijatie prihlášky na ' . $akcia['event_name'],
                            'html'    => $m->render($tpl_prihlaska, $email_data)
                        ));
            $entry->update(['postarjano' => 'poslané']);
        } catch (Exception $e){
            $error = $e->getMessage().PHP_EOL;
            $entry->update(['postarjano' => $error]);
        }
    }
    
    #Posle email o prijati platby
    if ($values['postarjano'] ===  'poslané' AND strlen($values['zaplatene']) >= 2) {
        
        $pohlavie_text = ($values['pohlavie'] === 'chlapec') ? 'vášho syna' : 'vašu dcéru';

        $email_data = array(
            'meno' => $values['meno'],
            'priezvisko' => $values['priezvisko'],
            'pohlavie' => $pohlavie_text,
            'datum' => date('d.m.Y'),
            'cas' => date('H:i:s'),
            'event' => $akcia['event_name'],
        );

        try {
            $mail_result = $mgClient->sendMessage("$domain",
                array('from'    => 'Salezko <robot@mailgun.sbb.sk>',
                    'to'      => $values['menoapriezvisko'].' <'.$values['email'].'>',
                    'subject' => 'Salezko - Prijatie platby za prihlášku',
                    'html'    => $m->render($tpl_platba, $email_data),
                ));
            $entry->update(['datumzaplatenia' => date('d.m. H:i:s')]);
        } catch (Exception $e){
            $error = $e->getMessage().PHP_EOL;
            $entry->update(['datumzaplatenia' => $error]);
        }
	}
}