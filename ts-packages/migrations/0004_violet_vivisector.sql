ALTER TABLE "product_reviews" DROP CONSTRAINT "product_reviews_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;