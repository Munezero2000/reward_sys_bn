CREATE TABLE IF NOT EXISTS "Rewards" (
	"Id" text PRIMARY KEY NOT NULL,
	"Name" text NOT NULL,
	"Description" text NOT NULL,
	"RequiredPoints" integer NOT NULL,
	"Images" text NOT NULL,
	"Quantity" integer,
	"CreatedOn" timestamp DEFAULT now(),
	"UpdatedOn" timestamp DEFAULT now()
);
