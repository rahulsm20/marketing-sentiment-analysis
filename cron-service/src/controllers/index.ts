//-----------------------------------------------------------------

import { runPipeline } from "@/lib";

//-----------------------------------------------------------------

export async function cacheController() {
  try {
    await runPipeline()
    return true;
  } catch (err: any) {
    console.error("GraphQL Error:", JSON.stringify(err, null, 2));
    return false;
  }
}

//-----------------------------------------------------------------
