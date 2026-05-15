import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    group: "Admin",
  },
  access: {
    // Only authenticated admins can create or delete users
    create: ({ req }) => !!req.user,
    read: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: "role",
      type: "select",
      options: [{ label: "Admin", value: "admin" }],
      defaultValue: "admin",
      required: true,
    },
  ],
};
