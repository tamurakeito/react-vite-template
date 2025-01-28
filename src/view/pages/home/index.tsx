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
import { setToast, toastTypes } from "@/view/organisms/toast";
import { container } from "tsyringe";
import { HelloWorldUsecase } from "@/usecase/example";

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
  const handleHelloworld = async (id: number) => {
    await setIsLoading(true);
    const helloWorldUsecase = container.resolve(HelloWorldUsecase);
    const result = await helloWorldUsecase.fetchHelloWorldDetail(id);
    if (result.isSuccess) {
      const data = result.data;
      setToast(`${data!.id}: ${data!.hello.name}`, toastTypes.success);
    } else {
      setToast("データが見つかりません", toastTypes.error);
    }
    setIsLoading(false);
    return;
  };
  return (
    <Button
      className={classes.button}
      disabled={isLoading}
      onClick={() => handleHelloworld(id)}
    >
      {!isLoading ? `id: ${id}` : <Icon size={16} type={iconTypes.loading} />}
    </Button>
  );
};
