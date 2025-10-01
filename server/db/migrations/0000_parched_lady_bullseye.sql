CREATE TABLE "messages" (
	"message_id" bigserial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"text" text,
	"file_url" text,
	"created" timestamp DEFAULT now() NOT NULL,
	"updated" timestamp
);
