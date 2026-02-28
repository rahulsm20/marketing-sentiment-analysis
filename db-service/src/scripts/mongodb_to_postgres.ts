import { productsTable } from "@/lib/db/schema";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

const DATABASE_URL = process.env.DATABASE_URL;
const sql = neon(DATABASE_URL!);
export const db = drizzle({ client: sql });

async function migrate() {
  // const data = fs.readFileSync(path.join(__dirname, "products.json"), "utf-8");
  // const records = JSON.parse(data);
  try {
    // records.products.forEach(async (record: any) => {
    //   const price = parseFloat(record.price?.split(",").join(""));
    //   const product = await db
    //     .insert(productsTable)
    //     .values({
    //       name: record.productName,
    //       url: record.cardURL,
    //       price,
    //       query: record.query,
    //     })
    //     .returning({ id: productsTable.id });

    //   record.reviews.forEach(async (review: string) => {
    //     if (review.trim().length === 0) return;
    //     await db.insert(productReviewsTable).values({
    //       productId: product?.[0].id,
    //       reviewText: review,
    //     });
    //   });
    // });
    const queryMap = new Map<string, { company: string; category: string }>();
    const products = await db
      .select({ id: productsTable.id, query: productsTable.query })
      .from(productsTable);

    products.forEach((product) => {
      if (!product.query) return;
      const queryParts = product?.query.split("+");
      const company = queryParts[0] || "Unknown";
      const category = queryParts[1] || "General";
      queryMap.set(product.id, { company, category });
    });
    for (const [id, { company, category }] of queryMap.entries()) {
      await db
        .update(productsTable)
        .set({ company, category })
        .where(eq(productsTable.id, id));
    }
  } catch (error) {
    console.error("Error inserting records:", error);
  }
}

migrate();
