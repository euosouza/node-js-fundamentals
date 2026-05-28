import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET", path: buildRoutePath("/users"), handler: (req, res) => {
      const { search, filters, orderBy, page, limit } = req.query;

      const users = database.select("users", { search, filters, orderBy, page, limit });

      return res.end(JSON.stringify({
        data: users
      }));
    }
  },
  {
    method: "POST", path: buildRoutePath("/users"), handler: (req, res) => {
      const { name, email } = req.body;

      const user = {
        id: randomUUID(),
        name,
        email
      };

      database.insert("users", user);

      return res.writeHead(201).end();
    }
  },
  {
    method: "DELETE", path: buildRoutePath("/users/:id"), handler: (req, res) => {
      const { id } = req.params;

      database.delete("users", id);

      return res.writeHead(204).end();
    }
  },
  {
    method: "PUT", path: buildRoutePath("/users/:id"), handler: (req, res) => {
      const { id } = req.params;
      const { name, email } = req.body;

      database.update("users", id, { name, email });

      return res.writeHead(204).end();
    }
  },
  {
    method: "GET", path: buildRoutePath("/users/:id"), handler: (req, res) => {
      const { id } = req.params;
      console.log("ID", id);

      const user = database.selectById("users", id);

      return res.end(JSON.stringify(user));
    }
  }
];