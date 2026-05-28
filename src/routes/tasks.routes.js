import { Database } from "../database.js";
import { buildRoutePath } from "../utils/build-route-path.js";
import { randomUUID } from "node:crypto";
import { parse } from "csv-parse";

const database = new Database();

export const userTasks = [
  {
    method: "GET", path: buildRoutePath("/tasks"), handler: (req, res) => {
      const { search, filters, orderBy, page, limit } = req.query;

      const tasks = database.select("tasks", { search, filters, orderBy, page, limit });

      return res.end(JSON.stringify({
        data: tasks
      }));
    }
  },
  {
    method: "POST", path: buildRoutePath("/tasks"), handler: (req, res) => {
      const { title, description } = req.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date()
      };

      database.insert("tasks", task);

      return res.writeHead(201).end();
    }
  },
  {
    method: "DELETE", path: buildRoutePath("/tasks/:id"), handler: (req, res) => {
      const { id } = req.params;

      database.delete("tasks", id);

      return res.writeHead(204).end();
    }
  },
  {
    method: "PUT", path: buildRoutePath("/tasks/:id"), handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      const data = database.selectById("tasks", id);
      if (!data) {
        return res.writeHead(404).end();
      }

      database.update("tasks", id, { title, description, completed_at: data.completed_at, updated_at: new Date() });

      return res.writeHead(204).end();
    }
  },
  {
    method: "GET", path: buildRoutePath("/tasks/:id"), handler: (req, res) => {
      const { id } = req.params;
      const user = database.selectById("tasks", id);

      return res.end(JSON.stringify(user));
    }
  },
  {
    method: "PATCH", path: buildRoutePath("/tasks/:id/complete"), handler: (req, res) => {
      const { id } = req.params;

      const data = database.selectById("tasks", id);
      if (!data) {
        return res.writeHead(404).end();
      }

      database.update("tasks", id, { ...data, completed_at: new Date(), updated_at: new Date() });
      return res.writeHead(204).end();
    }
  },
  {
    method: "POST", path: buildRoutePath("/tasks/import"), handler: async (req, res) => {
      const parser = req.pipe(
        parse({ columns: true, trim: true, skip_empty_lines: true })
      );

      for await (const row of parser) {
        database.insert("tasks", {
          id: randomUUID(),
          title: row.title,
          description: row.description,
          completed_at: null,
          created_at: new Date(),
        });
      }

      return res.writeHead(201).end();
    }
  }
];