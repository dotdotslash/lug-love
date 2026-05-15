import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "filename",
    group: "Assets",
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  upload: {
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      // GLTF (JSON + binary)
      "model/gltf+json",
      "model/gltf-binary",
      // OBJ, BIN, and other binary model formats
      "application/octet-stream",
      "text/plain", // .obj files are plain text
      // HDRI environment scans
      "image/x-hdr",
      "application/octet-stream",
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
    },
    {
      name: "fileType",
      type: "select",
      options: [
        { label: "Image", value: "image" },
        { label: "3D Model", value: "3d-model" },
        { label: "Texture Scan", value: "texture-scan" },
        { label: "HDRI", value: "hdri" },
      ],
      admin: {
        description:
          "Categorizes this asset for use in the viewer. Select the appropriate type when uploading.",
      },
    },
  ],
};
