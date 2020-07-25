# Fila de Envio de E-mails com NodeJS

Essa aplicação tem como objetivo realizar o envio de campanhas de e-mail marketing em servidores que possuem quantidades limitadas de envios por hora.

  

### Utilização:

1. Renomear o arquivo **.env.example** para apenas **.env**;


2. Alterar os dados do arquivo **.env** com as informações do seu servidor SMTP e com o limite de envios a serem realizados por hora;

```

HOST=seu dominio
PORT=(normalmente 465 ou 587)
MAIL=email que irá realizar o envio
PASS=senha da conta de email
MAILS_PER_HOUR=quantidade máxima de envios por hora

```


3. Criar uma pasta chamada "list", dentro desta deverá conter arquivos(com extensão .txt) contendo os e-mails separados por ponto e vírgula;


4. Executar o comando para início dos envios:

```

npm run send --subject="assunto do email" --layout="layout.html"

```