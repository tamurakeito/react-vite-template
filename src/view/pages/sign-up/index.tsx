import classes from "./styles.module.scss";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Center,
  Icon,
  iconTypes,
  Input,
  Text,
  textSizes,
} from "tamurakeito-react-ui";
import { setToast, toastTypes } from "@/components/toast";
import {
  checkIsSignUpResponse,
  PostSignUp,
  postSignUpErrors,
} from "@/data/api/postSignup";
import { useAuthContext } from "@/providers/auth-provider";
import { checkIsErrorResponse } from "@/data/utils/typeGuards";
import { handleUnexpectedError } from "@/data/utils/handleErrors";

export const SignUp = () => {
  const idRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const { signIn } = useAuthContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    idRef.current?.focus();
  }, []);

  const validation = (user: string, name: string, password: string) => {
    if (!user.trim()) {
      setToast("ユーザーIDを入力してください。", toastTypes.error);
      return false;
    }
    if (!name.trim()) {
      setToast("アカウント表示名を入力してください。", toastTypes.error);
      return false;
    }
    if (!password.trim()) {
      setToast("パスワードを入力してください。", toastTypes.error);
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    await setIsLoading(true);

    if (!validation(id, name, pass)) {
      setIsLoading(false);
      return;
    }

    const result = await PostSignUp(id, pass, name);

    if (checkIsSignUpResponse(result)) {
      signIn(result.id, result.user_id, result.name, result.token);
      setId("");
      setName("");
      setPass("");
      setToast("アカウントが登録されました", toastTypes.success);
      navigate("/");
    } else if (checkIsErrorResponse(result)) {
      switch (result.error) {
        case postSignUpErrors.badRequest:
          setToast(
            "ユーザーIDまたはパスワードの形式が正しくありません",
            toastTypes.error
          );
          break;
        case postSignUpErrors.conflict:
          setToast(
            "既に登録されているIDのため使用できません",
            toastTypes.error
          );
          break;
        case postSignUpErrors.internalServerError:
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

  return (
    <Center className={classes.sign_up}>
      <div className={classes.container}>
        <Text size={textSizes.h2}>新規アカウント登録</Text>
      </div>
      <div className={classes.container}>
        <Input
          ref={idRef}
          value={id}
          placeholder={"ユーザーID"}
          onChange={(event) => setId(event.target.value)}
          onKeyDown={(event) => {
            event.key === "Enter" && nameRef.current?.focus();
          }}
        />
      </div>
      <div className={classes.container}>
        <Input
          ref={nameRef}
          value={name}
          placeholder={"アカウント表示名"}
          onChange={(event) => setName(event.target.value)}
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
            event.key === "Enter" && handleSignUp();
          }}
        />
      </div>
      <Button
        className={classes.button}
        onClick={handleSignUp}
        disabled={isLoading}
      >
        {!isLoading ? (
          "アカウント登録"
        ) : (
          <Icon size={16} type={iconTypes.loading} />
        )}
      </Button>
    </Center>
  );
};
