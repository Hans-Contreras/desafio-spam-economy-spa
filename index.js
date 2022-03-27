//Desafío Spam Economy SPA - Hans Contreras

//Creación modulos npm
const enviar = require("./mailer")
const http = require('http')
const url = require("url")
const fs = require('fs')
const axios = require('axios')
const { v4: uuidv4 } = require('uuid')
const port = 3000

//Creación Servidor
http
    .createServer((req, res) => {
        let { correos, asunto, contenido } = url.parse(req.url, true).query
        if (req.url == '/') {
            res.setHeader('content-type', 'text/html');
            fs.readFile('index.html', 'utf8', (err, data) => {
                res.end(data)
            });
        }
        //Creación funcion asincrona para traer data de la api.
        async function infoIndicadores() {
            const { data } = await axios.get('https://mindicador.cl/api')
            const dolar = data.dolar.valor;
            const euro = data.euro.valor;
            const uf = data.uf.valor;
            const utm = data.utm.valor
            let valores = [dolar, euro, uf, utm]
            //console.log(valores)
            return valores
        }
        //console.log(infoIndicadores())

        //Creación ruta para el envio de los correos
        if (req.url.startsWith("/mailing")) {
            //enviar(correos, asunto, contenido)
            infoIndicadores().then((r) => {
                //Creación del template con la informacion de la funcion asincrona de la Api.
                const template_1 = `
                
                 Hola. Los indicadores económicos de hoy son los siguientes:
                 <p>*El valor del dólar al día de hoy es $ ${r[0]} pesos</p>
                 <p>*El valor del euro al día de hoy es $ ${r[1]} pesos</p>
                 <p>*El valor de la uf al día de hoy es $ ${r[2]} pesos</p>
                 <p>*El valor de la utm al día de hoy $ ${r[3]} pesos</p>
                 `

                // Definir estructura para el envío del correo
                enviar(correos, asunto, contenido + template_1).then((err, data) => {
                    if (err) {
                        res.write(`<p class="alert alert-info w-25 m-auto text-center"> 
                            Algo salió mal</p>`)
                        res.end()
                    } else {
                        res.write(`<p class="alert alert-info w-25 m-auto text-center"> 
                            Correos enviados exitosamente!</p>`)
                        res.end()

                        //Creación correo de respaldo 
                        const template_2 = `Correos: ${correos.split(",")}
                            Asunto: ${asunto}
                            Mensaje: ${contenido}
                            ${template_1}`

                        //Creación de carpeta de guardado para los correos de respaldo
                        fs.mkdir('./correos', () => {
                            fs.writeFile(`./correos/${shortid}.txt`,
                                template_2, "utf-8", (err, data) => {
                                    if (err) {
                                        console.log('No se pudo crear el respaldo')
                                    } else {
                                        console.log('Respaldo creado exitosamente')
                                    }
                                })
                        })
                    }
                })
            })
        }

        //Aplica módulo uuid para respaldo de los correos
        let id = uuidv4()
        let shortid = id.slice(id.length - 10)

    })
    .listen(`${port}`, () => console.log(`Servidor funcionando en el puerto ${port}`))



