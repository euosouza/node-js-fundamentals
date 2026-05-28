import http from "node:http";
import { parseBody } from "./middleware/parseBody.js"
import { Database } from "./database.js"
import { routes } from "./routes.js";

const PORT = process.env.PORT || 3000;

// Query Parameters: Filtragem, paginação, não-obrigatórios => GET /users?name=Diego
// Route Parameters: Identificação, recurso único => GET /users/:id
// Request Body: Dados não-estruturados, internos => POST/PUT/PATCH /users {name: "John Doe", email: [EMAIL_ADDRESS]"

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await parseBody(req, res);

  const route = routes.find(route => route.method === method && route.path.test(url));

  if (route) {
    const routeParams = url.match(route.path);

    req.params = { ...routeParams.groups };

    // Query params: search, filters, orderBy, page, limit
    const { searchParams } = new URL(url, 'http://localhost');
    req.query = Object.fromEntries(searchParams);

    return route.handler(req, res);
  }

  return res.writeHead(404).end(JSON.stringify({
    statusCode: 404,
    error: "Route not found."
  }));
});

server.listen(PORT);