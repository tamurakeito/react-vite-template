import { BrowserRouter } from "react-router-dom";
import { RouteSelector } from "./routes";
import { Toast } from "./organisms/toast";
import { AuthContextProvider } from "@/view/providers/auth-provider";
import { ApiContextProvider } from "./providers/api-provider";

const App = () => {
  return (
    <BrowserRouter>
      <ApiContextProvider>
        <AuthContextProvider>
          <Toast />
          <RouteSelector />
        </AuthContextProvider>
      </ApiContextProvider>
    </BrowserRouter>
  );
};

export default App;
