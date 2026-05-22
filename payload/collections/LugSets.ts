import type { CollectionConfig } from "payload";

export const LugSets: CollectionConfig = {
  slug: "lug-sets",
  admin: {
    useAsTitle: "name",
    group: "Lug Archive",
    defaultColumns: ["name", "manufacturer", "designer", "purchasable"],
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
        description: "URL-friendly identifier used in /lug/:slug",
      },
    },
    {
      name: "manufacturer",
      type: "relationship",
      relationTo: "manufacturers",
      required: true,
    },
    {
      name: "designer",
      type: "relationship",
      relationTo: "people",
      admin: {
        description: "The individual designer, if different from the manufacturer",
      },
    },
    {
      name: "description",
      type: "richText",
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Image shown in the archive grid card",
      },
    },
    {
      name: "purchasable",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Check if this lug set can be purchased",
      },
    },
    {
      name: "purchaseUrls",
      type: "array",
      admin: {
        description: "Links where this set can be purchased",
        condition: (data) => Boolean(data.purchasable),
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          admin: {
            description: 'Display name for the link, e.g. "Ceeway" or "Official Store"',
          },
        },
        {
          name: "url",
          type: "text",
          required: true,
        },
      ],
    },
  ],
};
