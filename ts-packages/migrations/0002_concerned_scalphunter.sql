DROP INDEX "product_reviews_product_id_index";--> statement-breakpoint
CREATE INDEX "product_reviews_product_id_index2" ON "product_reviews" USING btree ("product_id");