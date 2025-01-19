import { useEffect, useRef, useState } from "react";
import classes from "./styles.module.scss";
import {
  checkIsSignInResponse,
  PostSignIn,
  postSignInErrors,
} from "@/data/api/postSignin";
import { checkIsErrorResponse } from "@/data/utils/typeGuards";
import { useAuthContext } from "@/providers/auth-provider";
import { handleUnexpectedError } from "@/data/utils/handleErrors";
import { setToast, toastTypes } from "@/components/toast";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Center,
  Icon,
  iconTypes,
  Input,
  Text,
  textColors,
  textSizes,
} from "tamurakeito-react-ui";

export const SignIn = () => {
  const idRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const { user, signIn, signOut } = useAuthContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    idRef.current?.focus();
  }, []);

  const validation = (user: string, password: string) => {
    if (!user.trim()) {
      setToast("ユーザーIDを入力してください。", toastTypes.error);
      return false;
    }
    if (!password.trim()) {
      setToast("パスワードを入力してください。", toastTypes.error);
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    await setIsLoading(true);

    if (!validation(id, pass)) {
      setIsLoading(false);
      return;
    }

    const result = await PostSignIn(id, pass);

    if (checkIsSignInResponse(result)) {
      signIn(result.id, result.user_id, result.name, result.token);
      setId("");
      setPass("");
      setToast("サインインしました", toastTypes.success);
      navigate("/");
    } else if (checkIsErrorResponse(result)) {
      switch (result.error) {
        case postSignInErrors.unauthorized:
          setToast("パスワードが間違っています", toastTypes.error);
          break;
        case postSignInErrors.notFound:
          setToast("ユーザーが見つかりませんでした", toastTypes.error);
          break;
        case postSignInErrors.internalServerError:
          setToast(
            "サーバーで問題が発生しました. 時間を置いて再度お試しください.",
            toastTypes.error
          );
          break;
        default:
          handleUnexpectedError();
      }
    } else {
      handleUnexpectedError();
    }
    setIsLoading(false);
    return;
  };
  const handleSignOut = () => {
    signOut();
    setId("");
    setPass("");
    setToast("サインアウトしました");
  };

  return (
    <Center className={classes.sign_in}>
      <div className={classes.container}>
        <Text size={textSizes.h2}>サインイン</Text>
      </div>
      <div className={classes.status}>
        {user ? (
          <Text size={textSizes.md}>
            {user.userId}: {user.name}
          </Text>
        ) : (
          <Text size={textSizes.sm} color={textColors.gray700}>
            未サインイン
          </Text>
        )}
      </div>
      {!!!user ? (
        <>
          <div className={classes.container}>
            <Input
              ref={idRef}
              value={id}
              placeholder={"ユーザーID"}
              onChange={(event) => setId(event.target.value)}
              onKeyDown={(event) => {
                event.key === "Enter" && passRef.current?.focus();
              }}
            />
          </div>
          <div className={classes.container}>
            <input
              ref={passRef}
              type={"password"}
              value={pass}
              placeholder={"パスワード"}
              onChange={(event) => setPass(event.target.value)}
              onKeyDown={(event) => {
                event.key === "Enter" && handleSignIn();
              }}
            />
          </div>
          <Button
            className={classes.button}
            onClick={handleSignIn}
            disabled={isLoading}
          >
            {!isLoading ? (
              "サインイン"
            ) : (
              <Icon size={16} type={iconTypes.loading} />
            )}
          </Button>
        </>
      ) : (
        <Button className={classes.button} onClick={handleSignOut}>
          サインアウト
        </Button>
      )}
    </Center>
  );
};
