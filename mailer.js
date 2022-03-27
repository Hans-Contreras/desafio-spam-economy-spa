const nodemailer = require("nodemailer");
async function enviar(to, subject, html) {
    console.log('Envio de correo vía Nodemailer')
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "desafio.test.2022@gmail.com",
            pass: "desafio@test",
        },
    });
    let mailOptions = {
        from: "desafio.test.2022@gmail.com",
        to,
        subject,
        html, 
    };
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) console.log(err, 'Algo salió mal');
        if (data) console.log(data, 'Correo enviado exitosamente');
    });
}
module.exports = enviar;