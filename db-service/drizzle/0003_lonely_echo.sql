CREATE INDEX "conversations_openai_conv_id_index" ON "conversations_table" USING btree ("openai_conv_id");--> statement-breakpoint
CREATE INDEX "conversations_user_id_index" ON "conversations_table" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "messages_conversation_id_index" ON "messages_table" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "pdf_documents_conversation_id_index" ON "pdf_documents_table" USING btree ("conversation_id");