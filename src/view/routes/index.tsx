import { Routes, Route } from "react-router-dom";
import { Home } from "@pages/home";
import { SignIn } from "@pages/sign-in";
import { SignUp } from "@pages/sign-up";

export const RouteSelector = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  );
};
