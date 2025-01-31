import { useEffect, useRef, useState } from "react";
import classes from "./styles.module.scss";
import { setToast, toastTypes } from "@organisms/toast";
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
import { useAuthContext } from "@providers/auth-provider";
import { useApiContext } from "@providers/api-provider";

export const SignIn = () => {
  const idRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const { user, signIn, signOut } = useAuthContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { authHandler } = useApiContext();

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

    const result = await authHandler.signIn({
      userId: id,
      password: pass,
    });

    if (result.isSuccess) {
      const data = result.data;
      signIn(data!.id, data!.userId, data!.name, data!.token);
      setId("");
      setPass("");
      setToast("ログインしました", toastTypes.success);
      navigate("/");
    } else {
      setToast("ログインできません", toastTypes.error);
    }
    setIsLoading(false);
    return;
  };
  const handleSignOut = () => {
    signOut();
    setId("");
    setPass("");
    setToast("ログアウトしました");
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
      {!user ? (
        <>
          <div className={classes.container}>
            <Input
              ref={idRef}
              value={id}
              placeholder={"ユーザーID"}
              onChange={(event) => setId(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  passRef.current?.focus();
                }
              }}
            />
          </div>
          <div className={classes.container}>
            <input
              ref={passRef}
              type="password"
              value={pass}
              placeholder="パスワード"
              onChange={(event) => setPass(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSignIn();
                }
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
