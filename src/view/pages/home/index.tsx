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
    // const result = await GetHelloworld(id);
    // if (checkIsHelloworldResponse(result)) {
    //   setToast(`${result.id}: ${result.hello.name}`);
    // } else if (checkIsErrorResponse(result)) {
    //   switch (result.error) {
    //     case getHelloworldErrors.notFound:
    //       setToast("データが見つかりません", toastTypes.error);
    //       break;
    //     default:
    //       handleUnexpectedError();
    //   }
    // } else {
    //   handleUnexpectedError();
    // }
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
