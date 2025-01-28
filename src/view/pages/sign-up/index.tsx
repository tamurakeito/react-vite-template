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
import { setToast, toastTypes } from "@/view/organisms/toast";
import { useAuthContext } from "@/view/providers/auth-provider";
import { container } from "tsyringe";
import { AuthUsecase } from "@/usecase/auth";

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
  const authUsecase = container.resolve(AuthUsecase);

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

    const result = await authUsecase.signUp({
      userId: id,
      password: pass,
      name: name,
    });

    if (result.isSuccess) {
      const data = result.data;
      signIn(data!.id, data!.userId, data!.name, data!.token);
      setId("");
      setName("");
      setPass("");
      setToast("アカウントが登録されました", toastTypes.success);
      navigate("/");
    } else {
      setToast("アカウントが登録できませんでした", toastTypes.error);
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
