import { useState } from "react";
import classes from "./styles.module.scss";
import {
  Text,
  Center,
  Button,
  textSizes,
  Icon,
  iconTypes,
} from "tamurakeito-react-ui";
import { setToast, toastTypes } from "@organisms/toast";
import { useApiContext } from "@providers/api-provider";
import { HttpError } from "@domain/errors";

export const Home = () => {
  return (
    <Center className={classes.home}>
      <div className={classes.container}>
        <Text size={textSizes.h1}>hello world</Text>
      </div>
      <HelloWorldButton id={1} />
      <HelloWorldButton id={2} />
      <HelloWorldButton id={3} />
    </Center>
  );
};

const HelloWorldButton = ({ id }: { id: number }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { helloWorldHandler } = useApiContext();

  const handleHelloWorld = async (id: number) => {
    await setIsLoading(true);
    const result = await helloWorldHandler?.helloWorldDetail(id);
    if (result.isSuccess) {
      const data = result.data;
      setToast(`${data!.id}: ${data!.hello.name}`, toastTypes.success);
    } else {
      const err = result.error;
      setToast(
        err ? err?.message : HttpError.unknownError.message,
        toastTypes.error
      );
    }
    setIsLoading(false);
    return;
  };
  return (
    <Button
      className={classes.button}
      disabled={isLoading}
      onClick={() => handleHelloWorld(id)}
    >
      {!isLoading ? `id: ${id}` : <Icon size={16} type={iconTypes.loading} />}
    </Button>
  );
};
