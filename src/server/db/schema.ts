import {
  boolean,
  index,
  integer,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "../auth/db-schema";

import { createTable } from "./utils";

export const posts = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("createdById", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  t => [
    {
      createdByIdIdx: index("createdById_idx").on(t.createdById),
      nameIndex: index("name_idx").on(t.name),
    },
  ],
);

export const programs = createTable(
  "program",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 256 }).notNull(),
    ownerId: varchar("ownerId", { length: 255 }).notNull(),
    name: varchar("name", { length: 256 }).notNull().default(""),
    fileUploadName: varchar("fileUploadName", { length: 256 }).notNull(),
    fileUploadId: varchar("fileUploadId", { length: 256 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  t => [
    {
      ownerIdIdx: index("program_ownerId_idx").on(t.ownerId),
    },
  ],
);

export const programShareInvites = createTable(
  "programShareInvite",
  {
    programId: serial("programId").notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    inviteToken: varchar("inviteToken", { length: 255 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  t => [
    {
      pk: primaryKey({ columns: [t.programId, t.email] }),
      programIdIdx: index("programShareInvite_programId_idx").on(t.programId),
    },
  ],
);

export const programsShares = createTable(
  "programShare",
  {
    programId: serial("programId").notNull(),
    userId: varchar("userId", { length: 255 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  t => [
    {
      pk: primaryKey({ columns: [t.programId, t.userId] }),
      programIdIdx: index("programShare_programId_idx").on(t.programId),
      userIdIdx: index("programShare_userId_idx").on(t.userId),
    },
  ],
);

export const keepAlive = createTable(
  "keepAlive",
  {
    id: integer("id").primaryKey(),
    dummy: integer("dummy").notNull(),
  },
  t => [
    {
      idIdx: index("id_idx").on(t.id),
    },
  ],
);

export { users };
