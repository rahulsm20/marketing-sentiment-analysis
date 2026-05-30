DROP INDEX "product_reviews_product_id_index2";--> statement-breakpoint
CREATE INDEX "product_reviews_product_id_index" ON "product_reviews" USING btree ("product_id");