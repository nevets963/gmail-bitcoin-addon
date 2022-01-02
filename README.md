
# Gmail Bitcoin Addon

## A simple Gmail Addon to email Bitcoin using the Lightning Network

###  This addon relies on lightning.gifts (powered by lnpay.co) to create a gift which gets sent in an email to a receipient in the form of a QR code or link to redeem the Bitcoin

## Only 3 APIs are used

- [lightning.gifts](https://lightning.gifts) - to create a gift
- [goqr.me](https://goqr.me) - to generate a QR code that gets embedded into the email
- [bitfinex.com](https://bitfinex.com) - to get the current price per satoshi at the time the gift gets sent

## ToDo
- [ ] Remove QR Code generation using API (use lib. instead)

## Walkthrough/Demo

### 1. Write email

<img src="https://github.com/nevets963/gmail-bitcoin-addon/raw/main/demo/1.png" style="max-width: 300px;">

### 2. Enter amount of sats.

<img src="https://github.com/nevets963/gmail-bitcoin-addon/raw/main/demo/2.png" style="max-width: 300px;">

### 3. Sent sats. from wallet

<img src="https://github.com/nevets963/gmail-bitcoin-addon/raw/main/demo/3.png" style="max-width: 300px;">

### 3. Send email with embedded redeemable QR code

<img src="https://github.com/nevets963/gmail-bitcoin-addon/raw/main/demo/4.png" style="max-width: 300px;">

## Security Vulnerabilities

If you discover a security vulnerability, please send an email to Steven Briscoe at [stevebriscoe123@gmail.com](mailto:stevebriscoe123@gmail.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://github.com/nevets963/gmail-bitcoin-addon/blob/main/LICENSE).
