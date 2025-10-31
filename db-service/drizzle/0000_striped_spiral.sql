CREATE TABLE "conversations_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"query" text,
	"user_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer,
	"content" text,
	"role" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "users_table_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "conversations_table" ADD CONSTRAINT "conversations_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages_table" ADD CONSTRAINT "messages_table_conversation_id_conversations_table_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations_table"("id") ON DELETE no action ON UPDATE no action;