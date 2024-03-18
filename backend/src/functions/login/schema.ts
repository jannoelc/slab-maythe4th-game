export default {
  type: "object",
  properties: {
    id: { type: "string" },
    password: { type: "string" },
  },
  required: ["id", "password"],
} as const;
