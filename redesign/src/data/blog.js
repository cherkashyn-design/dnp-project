import { blogPosts as source } from "../../../src/data/blog.js";
import { blogCovers } from "../../../src/data/blogMedia.js";

export const blogPosts = source.map((post) => ({
  ...post,
  cover: post.cover ?? blogCovers[post.slug] ?? null,
}));

export function getBlogPost(slug) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}
