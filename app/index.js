const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const puppeteer = require('puppeteer');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Servir a página HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Evento de conexão do Socket.IO
io.on('connection', (socket) => {
    console.log('Novo cliente conectado');

    // Ouvir eventos do cliente
    socket.on('clientEvent', (data) => {
        console.log('Dados recebidos do cliente:', data);
    });

    // Iniciar Puppeteer quando um cliente se conecta
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        page.on('console', msg => {
            console.log('Console:', msg);
            // Enviar mensagens do console do Puppeteer para o cliente
            socket.emit('puppeteerConsole', msg);
        });

        await page.goto('https://twitter.com/i/flow/login');

        // Adicione sua lógica de automação aqui

        // Fechar o browser após um tempo ou condição
        setTimeout(async () => {
            await browser.close();
            console.log('Navegador fechado');
        }, 10000); // Fechar após 10 segundos
        
    })();
});

// Iniciar o servidor
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
