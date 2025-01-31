import { BrowserRouter } from "react-router-dom";
import { Toast } from "@organisms/toast";
import { AuthContextProvider } from "@providers/auth-provider";
import { ApiContextProvider } from "@providers/api-provider";
import { RouteSelector } from "@view/routes";

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
