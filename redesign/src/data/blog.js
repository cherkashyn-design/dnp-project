import { blogPosts as source } from "../../../src/data/blog.js";
import drumkit from "../assets/cases/drumkit.webp";

export const blogPosts = source.map((post) => ({
  ...post,
  cover: post.cover ?? drumkit,
}));

export function getBlogPost(slug) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}
