import { userRoutes } from "./routes/users.routes.js";
import { userTasks } from "./routes/tasks.routes.js";

export const routes = [
  ...userRoutes,
  ...userTasks
];