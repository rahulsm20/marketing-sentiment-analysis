CREATE TABLE "pdf_documents_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid,
	"file_name" text,
	"file_path" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pdf_documents_table" ADD CONSTRAINT "pdf_documents_table_conversation_id_conversations_table_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations_table"("id") ON DELETE no action ON UPDATE no action;