CREATE TABLE "qr-program-manager_keepAlive" (
	"id" integer PRIMARY KEY NOT NULL,
	"dummy" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "qr-program-manager_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"createdById" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "qr-program-manager_programShareInvite" (
	"programId" serial NOT NULL,
	"email" varchar(255) NOT NULL,
	"inviteToken" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "qr-program-manager_program" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(256) NOT NULL,
	"ownerId" varchar(255) NOT NULL,
	"name" varchar(256) DEFAULT '' NOT NULL,
	"fileUploadName" varchar(256) NOT NULL,
	"fileUploadId" varchar(256) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "qr-program-manager_programShare" (
	"programId" serial NOT NULL,
	"userId" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "qr-program-manager_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"image" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "qr-program-manager_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "qr-program-manager_post" ADD CONSTRAINT "qr-program-manager_post_createdById_qr-program-manager_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."qr-program-manager_user"("id") ON DELETE no action ON UPDATE no action;