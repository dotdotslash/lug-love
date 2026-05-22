import type { CollectionConfig } from "payload";

export const Manufacturers: CollectionConfig = {
  slug: "manufacturers",
  admin: {
    useAsTitle: "name",
    group: "Lug Archive",
    defaultColumns: ["name", "city", "country", "yearsActiveStart"],
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description: "URL-friendly identifier, e.g. henry-james-bicycles",
      },
    },
    {
      name: "city",
      type: "text",
    },
    {
      name: "state",
      type: "text",
    },
    {
      name: "country",
      type: "text",
    },
    {
      name: "website",
      type: "text",
      admin: {
        description: "Full URL including https://",
      },
    },
    {
      name: "description",
      type: "richText",
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "yearsActiveStart",
      type: "number",
      admin: {
        description: "Year the manufacturer was founded or began making lugs",
      },
    },
    {
      name: "yearsActiveEnd",
      type: "number",
      admin: {
        description: "Year activity ended – leave blank if still active",
      },
    },
  ],
};
