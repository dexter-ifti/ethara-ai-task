import { User } from "../models/user.model.ts";

export async function listUsers(search = "") {
  const query = search.trim();
  const filter = query
    ? {
        $or: [
          { name: { $regex: escapeRegex(query), $options: "i" } },
          { email: { $regex: escapeRegex(query), $options: "i" } },
        ],
      }
    : {};

  return User.find(filter).select("_id name email role").sort({ name: 1, email: 1 }).limit(50);
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
