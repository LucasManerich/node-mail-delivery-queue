const nodemailer = require('nodemailer');
const dotEnv = require('dotenv');
const fs = require('promise-fs');
const validator = require('email-validator');
const yargs = require('yargs');

// busca as configurações do .env
dotEnv.config();

// configura o servidor de envio de emails
const transporter = nodemailer.createTransport({
    pool: true,
    host: process.env.HOST,
    port: process.env.PORT,
    secure: true,
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS
    }
});

/**
 * Retorna a lista de arquivos
 */
const getFiles = async () => {
    try {
        return await fs.readdir('./list');
    } catch(err) {
        console.log('O diretório "list" não existe.');
        process.exit();
    }
}

/**
 * Retorna a lista de emails para o envio
 */
const getMailList = async () => {
    // lista de emails
    let mails = [];
    
    // busca a lista de arquivos
    const files = await getFiles();
    
    for(let file of files) {
        // carrega o conteúdo do arquivo
        let content = await fs.readFile(`./list/${file}`, 'utf-8');
        // remover quebras de linhas
        content = content.replace(/(\r\n|\n|\r)/gm, "");
        
        // adiciona a lista de emails
        const fileMails = content.split(';');
        if(fileMails.length > 0) {
            // filtra os emails validos
            const validMails = fileMails.filter(mail => validator.validate(mail));
            mails = [ ...mails, ...validMails ];
        }
    }

    return mails;
}

/**
 * Adiciona um delay na execução de uma operação
 * @param {*} seconds 
 */
const delay = (seconds) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), seconds * 1000);
    });
}

/**
 * Realiza o envio de um email
 * @param {*} mail 
 */
const sendMail = async (to, subject, html) => {
    try {
        const response = await transporter.sendMail({
            from: process.env.MAIL,
            to,
            subject,
            html
        });
        if(response) {
            console.log(`Email enviado com sucesso: ${to}`);
        }
    } catch(err) {
        console.log(err);
        console.log(`Falha ao enviar email: ${to}`);
    }
}

(async() => {
    const mails = await getMailList();

    const mailsPerHour = process.env.MAILS_PER_HOUR;
    const mailsPerMinute = 60 / mailsPerHour;
    const seconds = mailsPerMinute * 60;

    try {
        const { subject, layout } = yargs.argv;
        const html = await fs.readFile(layout, 'utf-8');

        for(let mail of mails) {
            await sendMail(mail, subject, html);
            await delay(seconds);
        }
    } catch(err) {
        console.log('Argumentos não informados.')
        process.exit();
    }
})();
