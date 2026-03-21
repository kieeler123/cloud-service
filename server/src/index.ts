// src/index.ts
import "dotenv/config";
import app from "./app.js";
import { connectMongo } from "./app/config/mongodb.js";

const PORT = Number(process.env.PORT) || 4000;

async function bootstrap() {
  try {
    await connectMongo();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (error) {
    console.error("Server bootstrap failed:", error);
    process.exit(1);
  }
}

bootstrap();
