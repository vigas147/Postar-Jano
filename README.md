# Poštár Jano
Je implementácia prihlasovacieho systému na akcie pre saleziánske dielo v Banskej Bystrici [sbb.sk](https://www.sbb.sk "Salziáni Banská Bystrica").

Poštár Jano je cron script, ktorý získava údaje z google tabuliek a prihláseným účastníkom posiela informačné emaily.

Poštár Jano používa [Mailgun 📧🔫](https://www.mailgun.com "Mailgun")  na posielanie tohto množstva emailov aby nevyzeral ako nejaký pochybný poštár.

## Cron 
```
*/2 * * * * cd /root/Postar-Jano/ && node dist/index.js --eventId test &>> test_log
```

## API
Poštár Jano poskytuje API s informáciami o percentuálnej obsadenosti akcií.

### Curl
```bash
curl -X GET https://{{host}}:5000/postarjano/api/availability/test -H 'cache-control: no-cache'
```

### Response
content-type: application/json;
```json
{
    "success":"true",
    "percentage":95
}
```

# Poštár Jožo
Poštár Jožo posiela dodatočné info maily.
```
node dist/infoSender.js --eventId "test" --template "payment.html" --columnName "infomail1" --subject "Infomail"
```