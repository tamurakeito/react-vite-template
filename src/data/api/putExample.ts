import { client } from "@/data/axios";

export async function PutExample(obj: string): Promise<string | undefined> {
  try {
    const url = `/put-example`;
    const response = await client.put<string>(url, obj);
    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
