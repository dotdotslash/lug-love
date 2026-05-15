import type { CollectionConfig } from "payload";

export const LugPieces: CollectionConfig = {
  slug: "lug-pieces",
  admin: {
    useAsTitle: "pieceType",
    group: "Lug Archive",
    defaultColumns: ["lugSet", "pieceType", "model3d"],
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: "lugSet",
      type: "relationship",
      relationTo: "lug-sets",
      required: true,
      index: true,
    },
    {
      name: "pieceType",
      type: "select",
      required: true,
      options: [
        { label: "Top Headtube", value: "headtube_top" },
        { label: "Bottom Headtube", value: "headtube_bottom" },
        { label: "Seat Tube", value: "seat_tube" },
        { label: "Bottom Bracket Shell", value: "bb_shell" },
        { label: "Front Dropout", value: "dropout_front" },
        { label: "Rear Dropout", value: "dropout_rear" },
        { label: "Braze-on", value: "braze_on" },
      ],
    },
    {
      name: "model3d",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: {
        description: "OBJ or GLTF/GLB 3D model file",
      },
    },
    {
      name: "textureScan",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Photo texture scan image (.jpg or .png) – used for the Photo Scan material",
      },
    },
    {
      name: "dimensions",
      type: "json",
      admin: {
        description:
          "Dimension values in mm. Structure varies by piece type – see lib/types.ts for each type's shape.",
      },
    },
    {
      name: "angles",
      type: "group",
      fields: [
        {
          name: "lugAngle",
          type: "number",
          admin: { description: "Primary lug angle in degrees" },
        },
        {
          name: "seatingAngle",
          type: "number",
          admin: { description: "Tube seating angle in degrees" },
        },
        {
          name: "notes",
          type: "text",
        },
      ],
    },
  ],
};
