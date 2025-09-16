-- Migration for web version with SQLite
CREATE TABLE IF NOT EXISTS "prompts" (
	"id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"content" text NOT NULL,
	"created_at" integer NOT NULL DEFAULT (unixepoch()),
	"updated_at" integer NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS "apps" (
	"id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	"name" text NOT NULL,
	"path" text NOT NULL,
	"created_at" integer NOT NULL DEFAULT (unixepoch()),
	"updated_at" integer NOT NULL DEFAULT (unixepoch()),
	"github_org" text,
	"github_repo" text,
	"github_branch" text,
	"supabase_project_id" text,
	"neon_project_id" text,
	"neon_development_branch_id" text,
	"neon_preview_branch_id" text,
	"vercel_project_id" text,
	"vercel_project_name" text,
	"vercel_team_id" text,
	"vercel_deployment_url" text,
	"install_command" text,
	"start_command" text,
	"chat_context" text,
	"files" text,
	"is_running" integer DEFAULT 0,
	"build_status" text DEFAULT 'idle',
	"last_build_at" integer
);

CREATE TABLE IF NOT EXISTS "chats" (
	"id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	"app_id" integer NOT NULL,
	"summary" text,
	"created_at" integer NOT NULL DEFAULT (unixepoch()),
	"updated_at" integer NOT NULL DEFAULT (unixepoch()),
	FOREIGN KEY ("app_id") REFERENCES "apps"("id")
);

CREATE TABLE IF NOT EXISTS "messages" (
	"id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	"chat_id" integer NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"created_at" integer NOT NULL DEFAULT (unixepoch()),
	FOREIGN KEY ("chat_id") REFERENCES "chats"("id")
);

CREATE TABLE IF NOT EXISTS "versions" (
	"id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	"app_id" integer NOT NULL,
	"message_id" integer,
	"timestamp" integer NOT NULL DEFAULT (unixepoch()),
	"description" text,
	FOREIGN KEY ("app_id") REFERENCES "apps"("id"),
	FOREIGN KEY ("message_id") REFERENCES "messages"("id")
);
