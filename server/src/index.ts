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

import { supabaseAdmin } from "./lib/supabaseAdmin.js";

async function testSupabase() {
  const { data, error } = await supabaseAdmin.storage.listBuckets();

  if (error) {
    console.error("❌ 연결 실패:", error);
  } else {
    console.log("✅ 연결 성공:", data);
  }
}

testSupabase();
