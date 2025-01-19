import { client } from "@/data/axios";
import { ErrorResponse } from "@/data/utils/typeGuards";

export type HelloworldResponse = {
  id: number;
  hello: {
    id: number;
    name: string;
    tag: boolean;
  };
};
export const checkIsHelloworldResponse = (
  obj: any
): obj is HelloworldResponse => {
  return (
    typeof obj.id === "number" &&
    typeof obj.hello.id === "number" &&
    typeof obj.hello.name === "string" &&
    typeof obj.hello.tag === "boolean"
  );
};

export async function GetHelloworld(
  id: number
): Promise<HelloworldResponse | ErrorResponse | undefined> {
  try {
    const url = `/hello-world/${id}`;
    const response = await client.get(url, {
      headers: {
        "Add-Authorization": "true", // トークンを付与するリクエストにのみ設定
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      return undefined;
    }
  }
}

export const getHelloworldErrors = {
  notFound: "no results found",
} as const;
export type GetHelloworldErrors =
  (typeof getHelloworldErrors)[keyof typeof getHelloworldErrors];
