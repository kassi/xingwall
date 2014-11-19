var qrcode = new QRCode(document.getElementById("qr"), {
    text: window.location.href.replace('#', '') + '/connect',
    width: 128,
    height: 128,
    colorDark : "#006567",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.L
});
