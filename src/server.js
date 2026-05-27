import http from "node:http";

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    return res.end(`Servidor rodando em http://localhost:${PORT}`)
});

server.listen(PORT);