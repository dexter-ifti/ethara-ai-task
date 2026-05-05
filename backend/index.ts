import { app } from "./src/app.ts";
import { env } from "./src/config/env.ts";
import { connectDatabase } from "./src/config/database.ts";

async function startServer() {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
