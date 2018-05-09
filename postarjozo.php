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
$tpl = $loader->load('terminyplatby');

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
    
    #Posle email o prijati platby
    if ($values['postarjano'] ===  'poslané' AND $values['emailterminyplatby'] == '') {

        $pohlavie_text = ($values['pohlavie'] === 'chlapec') ? 'vášho syna(' . $values['meno'] . ')' : 'vašu dcéru(' . $values['meno'] . ')';

        $email_data = array(
            'pohlavie_text' => $pohlavie_text, 
        );

        try {
            $mail_result = $mgClient->sendMessage("$domain",
                array('from'    => 'Salezko <robot@mailgun.sbb.sk>',
                    'to'      => $values['menoapriezvisko'].' <'.$values['email'].'>',
                    'subject' => 'Salezko - Termíny zaplatenia za ' . $akcia['event_name'],
                    'html'    => $m->render($tpl, $email_data),
                ));
            $entry->update(['emailterminyplatby' => 'poslané']);
        } catch (Exception $e){
            $error = $e->getMessage().PHP_EOL;
            echo "Error in " . $akcia['event_name'] . " - " . $error;
            $entry->update(['emailterminyplatby' => $error]);
        }
	}
}