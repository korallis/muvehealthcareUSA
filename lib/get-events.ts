import { db } from "../db";

export async function getEventsData() {
  const data = await db.query.events.findMany();
  return data;
}
