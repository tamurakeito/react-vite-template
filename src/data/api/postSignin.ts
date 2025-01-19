import { client } from "@/data/axios";
import { ErrorResponse } from "@/data/utils/typeGuards";
import internal from "stream";

export type SignInResponse = {
  id: number;
  user_id: string;
  name: string;
  token: string;
};
export const checkIsSignInResponse = (obj: any): obj is SignInResponse => {
  return (
    typeof obj.id === "number" &&
    typeof obj.user_id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.token === "string"
  );
};

export async function PostSignIn(
  userId: string,
  password: string
): Promise<SignInResponse | ErrorResponse | undefined> {
  const data = { user_id: userId, password: password };
  try {
    const url = "/sign-in";
    const response = await client.post(url, data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      return undefined;
    }
  }
}

export const postSignInErrors = {
  notFound: "user not found",
  unauthorized: "invalid password",
  internalServerError: "internal server error",
} as const;
export type PostSignInErrors =
  (typeof postSignInErrors)[keyof typeof postSignInErrors];
