function onDefaultHomePageOpen() {
  
}

function onGmailInsertIntoEmail(e) {
  var invoice = JSON.parse(e.parameters.invoice);
  var sats = JSON.parse(e.parameters.sats);

  var maxAttempts = 10;
  var attempt = 0;

  var lastStatus = null;

  while(attempt < maxAttempts)
  {
    var statusResponse = UrlFetchApp.fetch('https://api.lightning.gifts/status/' + invoice.chargeId);

    Logger.log(statusResponse);

    var status = JSON.parse(statusResponse.getContentText())

    lastStatus = status;
  
    if(status.status.toLowerCase() == "paid")
    {
      break;
    }

    Utilities.sleep(1000);

    ++attempt;
  }

  if(lastStatus == null || lastStatus.status.toLowerCase() != "paid")
  {
    return null;
  }

  // Now determine USD value...
  var toCurrency = "usd";
  var usdResponse = UrlFetchApp.fetch('https://api.bitfinex.com/v1/pubticker/btc' + toCurrency);

  Logger.log(usdResponse);

  var usd = JSON.parse(usdResponse.getContentText())

  var usdPerSat = parseFloat(usd.last_price) / 100000000;

  var usdValue = usdPerSat * sats;

  Logger.log(invoice);

  var orderId = invoice.orderId;
  var lnurl = invoice.lnurl;

  var giftUrl = "https://lightning.gifts/redeem/" + orderId + "?lightning=" + lnurl;

  var imageUrl = Utilities.formatString('https://api.qrserver.com/v1/create-qr-code/?margin=10&size=150x150&data=%s', encodeURIComponent(giftUrl));
  
  var htmlContent = "<table style='margin-top: 20px; background-color: #F7931A; border-radius: 6px;'>";

  htmlContent+= "<tbody>";

  htmlContent+= "<tr>";

  htmlContent+= "<td>"

  htmlContent+= '<a href="' + giftUrl + '"><img style="display: block; max-width: 150px; max-height: 150px; border-radius: 6px;" src="'
      + imageUrl + '"/></a>'

  htmlContent+= "</td>"

  htmlContent+= "<td style='padding: 10px;'>"

  htmlContent+= "<p style='margin: 0px; margin-bottom: 10px; color: #000000;'>Here are <strong>" + sats + " &#8383; satoshis</strong>.</p>"
  htmlContent+= "<p style='margin: 0px; margin-bottom: 10px; color: #000000;'>Scan the QR code with a Bitcoin wallet to receive them.</p>"
  htmlContent+= "<p style='margin: 0px; color: #000000;'>Estimated value at the time sent: <strong>$" + usdValue.toFixed(2) + "</strong></p>"

  htmlContent+= "</td>"

  htmlContent+= "</tr>";

  htmlContent+= "</tbody>";

  htmlContent+= "</table>";
  
  var response = CardService.newUpdateDraftActionResponseBuilder()
      .setUpdateDraftBodyAction(CardService.newUpdateDraftBodyAction()
      .addUpdateContent(htmlContent, CardService.ContentType.MUTABLE_HTML)
      .setUpdateType(CardService.UpdateDraftBodyType.INSERT_AT_END));
  return response.build();
}

function onGmailCreateGift(e) {
  console.log(e);

  var sats = parseInt(e.formInputs.satsInput[0])

  Logger.log(sats)

  var dataToPost = {
    amount: sats
  };

  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(dataToPost)
  };

  var createResponse = UrlFetchApp.fetch('https://api.lightning.gifts/create', options);

  Logger.log(createResponse);

  var invoice = JSON.parse(createResponse.getContentText())

  var header = CardService.newCardHeader()
      .setTitle('Send ' + sats + ' satoshis to here using wallet');
  
  var lnbc = invoice.lightningInvoice.payreq;
  var qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?margin=50&size=300x300&data=" + lnbc;

  var image = CardService.newImage().setAltText("QR Code").setImageUrl(qrCodeUrl);
  
  // Create a button that inserts a QR code into the email
  var action = CardService.newAction()
      .setFunctionName('onGmailInsertIntoEmail')
      .setParameters({
        'invoice': JSON.stringify(invoice),
        'sats': JSON.stringify(sats)
      });
  var button = CardService.newTextButton()
      .setText('I\'ve done that')
      .setOnClickAction(action)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
  var buttonSet = CardService.newButtonSet()
      .addButton(button);

  // Assemble the widgets and return the card.
  var section = CardService.newCardSection()
      .addWidget(image)
      .addWidget(buttonSet);
  var card = CardService.newCardBuilder()
      .setHeader(header)
      .addSection(section);
  return card.build();
}

function onGmailCompose(e) {
  console.log(e);

  var header = CardService.newCardHeader()
      .setTitle('Enter how many satoshis to send');
  // Create text input for entering amount (in sats)
  var input = CardService.newTextInput()
      .setFieldName('satsInput')
      .setTitle('Amount (sats)');
  // Create a button that creates a gift
  var action = CardService.newAction()
      .setFunctionName('onGmailCreateGift');
  var button = CardService.newTextButton()
      .setText('Transfer')
      .setOnClickAction(action)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
  var buttonSet = CardService.newButtonSet()
      .addButton(button);
  // Assemble the widgets and return the card.
  var section = CardService.newCardSection()
      .addWidget(input)
      .addWidget(buttonSet);
  var card = CardService.newCardBuilder()
      .setHeader(header)
      .addSection(section);
  return card.build();
}
