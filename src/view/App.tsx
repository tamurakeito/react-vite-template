import "reflect-metadata";
import "@/injector/container";
import { BrowserRouter } from "react-router-dom";
import { RouteSelector } from "./routes";
import { Toast } from "./organisms/toast";
import { AuthContextProvider } from "@/view/providers/auth-provider";

const App = () => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Toast />
        <RouteSelector />
      </AuthContextProvider>
    </BrowserRouter>
  );
};

export default App;
