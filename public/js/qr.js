var qrcode = new QRCode(document.getElementById("qr"), {
    text: window.location.href + '/connect',
    width: 128,
    height: 128,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.L
});
