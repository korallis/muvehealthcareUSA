// import "dotenv/config";
// import { db } from "./index";

// import {
//   blogPosts,
//   categories,
//   tags,
//   postCategories,
//   postTags,
//   events,
// } from "./schema";

// import slugify from "slugify";

// // ---------------- Helpers ----------------
// function makeSlug(title: string) {
//   return slugify(title, { lower: true, strict: true });
// }

// // ---------------- Seed ----------------
// async function seed() {
//   // ---------- Categories ----------
//   const techCategory = await db
//     .insert(categories)
//     .values({ name: "Technology", slug: "technology" })
//     .returning()
//     .then((res) => res[0]);

//   const healthCategory = await db
//     .insert(categories)
//     .values({ name: "Health", slug: "health" })
//     .returning()
//     .then((res) => res[0]);

//   // ---------- Tags ----------
//   const drizzleTag = await db
//     .insert(tags)
//     .values({ name: "Drizzle", slug: "drizzle" })
//     .returning()
//     .then((res) => res[0]);

//   const nextjsTag = await db
//     .insert(tags)
//     .values({ name: "Next.js", slug: "nextjs" })
//     .returning()
//     .then((res) => res[0]);

//   // ---------- Blog Posts ----------
//   const blogPostsData = [
//     {
//       title: "Moving from Prisma to Drizzle",
//       status: "PUBLISHED",
//       content: { blocks: [] },
//     },
//     {
//       title: "Next.js 14 App Router Tips",
//       status: "PUBLISHED",
//       content: { blocks: [] },
//     },
//     {
//       title: "Why TypeScript is Awesome",
//       status: "DRAFT",
//       content: { blocks: [] },
//     },
//   ];

//   for (const postData of blogPostsData) {
//     const post = await db
//       .insert(blogPosts)
//       .values({ ...postData, slug: makeSlug(postData.title) })
//       .returning()
//       .then((res) => res[0]);

//     // Attach first category and tag for demo
//     await db.insert(postCategories).values({
//       postId: post.id,
//       categoryId: techCategory.id,
//     });

//     await db.insert(postTags).values({
//       postId: post.id,
//       tagId: drizzleTag.id,
//     });
//   }

//   // ---------- Events ----------
//   const sampleEvents = [
//     {
//       title: "Annual Health Conference",
//       description: "A conference discussing latest healthcare trends.",
//       location: "Johannesburg",
//       startDate: new Date("2025-12-20T09:00:00Z"),
//       endDate: new Date("2025-12-20T17:00:00Z"),
//       featuredImg: "https://example.com/event1.jpg",
//     },
//     {
//       title: "Community Wellness Workshop",
//       description: "Workshop on community health and wellness.",
//       location: "Cape Town",
//       startDate: new Date("2025-12-25T10:00:00Z"),
//       endDate: new Date("2025-12-25T13:00:00Z"),
//       featuredImg: "https://example.com/event2.jpg",
//     },
//     {
//       title: "Mental Health Awareness Day",
//       description: "Raising awareness about mental health issues.",
//       location: "Durban",
//       startDate: new Date("2026-01-10T08:00:00Z"),
//       endDate: new Date("2026-01-10T15:00:00Z"),
//       featuredImg: "https://example.com/event3.jpg",
//     },
//   ];

//   for (const e of sampleEvents) {
//     await db.insert(events).values({
//       ...e,
//       slug: makeSlug(e.title),
//     });
//   }

//   console.log("✅ Seed complete");
// }

// // ---------------- Run Seed ----------------
// seed()
//   .catch((err) => {
//     console.error("❌ Seed failed", err);
//     process.exit(1);
//   })
//   .finally(() => process.exit(0));
