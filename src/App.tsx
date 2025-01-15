import { BrowserRouter } from "react-router-dom";
import { RouteSelector } from "./routes";

const App = () => {
  return (
    <BrowserRouter>
      <RouteSelector />
    </BrowserRouter>
  );
};

export default App;
