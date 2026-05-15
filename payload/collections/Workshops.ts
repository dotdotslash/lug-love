import type { CollectionConfig } from "payload";

export const Workshops: CollectionConfig = {
  slug: "workshops",
  admin: {
    useAsTitle: "name",
    group: "Lug Archive",
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
      name: "person",
      type: "relationship",
      relationTo: "people",
      required: true,
    },
    {
      name: "hdriScan",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          ".hdr file – 360° scan of the workshop interior used as the lug viewer background",
      },
    },
  ],
};
