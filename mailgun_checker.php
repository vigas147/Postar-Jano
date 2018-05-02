<?php 

require 'vendor/autoload.php';
use Mailgun\Mailgun;
require __DIR__ . '/secrets_loader.php';

#Load secrets
Secrets::load();

#Mustache templating form html generation
$m = new Mustache_Engine(array(
    'escape' => function($value) {
        return htmlspecialchars($value, ENT_COMPAT, 'UTF-8');
    },
));

#register new loader
$loader = new Mustache_Loader_FilesystemLoader(dirname(__FILE__).'/templates');

#loads tempate
$tpl_error = $loader->load('error');
$tpl_errors = $loader->load('errors');

# Instantiate the client.
$mgClient = new Mailgun($_ENV['secrets']['MAILGUN_API_KEY']);
$domain = "mailgun.sbb.sk";
$queryString = array('event' => 'rejected OR failed');

# Make the call to the client.
$results = $mgClient->get("$domain/events", $queryString);
// $results = json_decode(json_encode($results), true);

$html = '';

foreach ($results->http_response_body->items as $key) {
    $error_data = array(
        'subject' => $key->message->headers->subject, 
        'to' => $key->message->headers->to, 
        'message' => $key->{'delivery-status'}->message, 
    );
    $html = $html . $m->render($tpl_error, $error_data);
}

$mail_result = $mgClient->sendMessage("$domain",
    array('from'    => 'Salezko <robot@mailgun.sbb.sk>',
        'to'      => 'vigas147@gmail.com',
        'subject' => 'Salezko Mailgun Errors',
        'html'    => $m->render($tpl_errors, array('errors' => $html))
    ));