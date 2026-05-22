import type { CollectionConfig } from "payload";

export const People: CollectionConfig = {
  slug: "people",
  admin: {
    useAsTitle: "name",
    group: "Lug Archive",
    defaultColumns: ["name", "manufacturer"],
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
    },
    {
      name: "socialLink",
      type: "text",
      admin: {
        description: "Instagram handle (e.g. @username) or full URL",
      },
    },
    {
      name: "manufacturer",
      type: "relationship",
      relationTo: "manufacturers",
      admin: {
        description: "Manufacturer this person is associated with (if any)",
      },
    },
    {
      name: "workshop",
      type: "relationship",
      relationTo: "workshops",
      admin: {
        description:
          "Their workshop (if a 360 scan has been uploaded for them)",
      },
    },
  ],
};
