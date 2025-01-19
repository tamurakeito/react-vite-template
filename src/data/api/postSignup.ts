import { client } from "@/data/axios";
import { ErrorResponse } from "@/data/utils/typeGuards";

export type SignUpResponse = {
  id: number;
  user_id: string;
  name: string;
  token: string;
};
export const checkIsSignUpResponse = (obj: any): obj is SignUpResponse => {
  return (
    typeof obj.id === "number" &&
    typeof obj.user_id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.token === "string"
  );
};

export async function PostSignUp(
  userId: string,
  password: string,
  name: string
): Promise<SignUpResponse | ErrorResponse | undefined> {
  const data = { user_id: userId, password: password, name: name };
  try {
    const url = "/sign-up";
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

export const postSignUpErrors = {
  badRequest: "invalid input format",
  conflict: "user is already resisered",
  internalServerError: "internal server error",
} as const;
export type PostSignUpErrors =
  (typeof postSignUpErrors)[keyof typeof postSignUpErrors];
