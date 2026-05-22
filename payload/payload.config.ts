import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { fileURLToPath } from "url";
import { Users } from "./collections/Users.js";
import { Media } from "./collections/Media.js";
import { Manufacturers } from "./collections/Manufacturers.js";
import { People } from "./collections/People.js";
import { Workshops } from "./collections/Workshops.js";
import { LugSets } from "./collections/LugSets.js";
import { LugPieces } from "./collections/LugPieces.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [
    Users,
    Media,
    Manufacturers,
    People,
    Workshops,
    LugSets,
    LugPieces,
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL ?? "",
    },
  }),
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  upload: {
    staticDir: path.resolve(__dirname, "../media"),
    staticURL: "/media",
    limits: {
      fileSize: 100_000_000, // 100 MB – 3D models can be large
    },
  },
});
