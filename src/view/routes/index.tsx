import { Routes, Route } from "react-router-dom";
import { Home } from "@/view/pages/home";
import { SignIn } from "@/view/pages/sign-in";
import { SignUp } from "@/view/pages/sign-up";

export const RouteSelector = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  );
};
