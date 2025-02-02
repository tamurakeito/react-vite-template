import { Routes, Route } from "react-router-dom";
import { Home } from "@pages/home";
import { SignIn } from "@pages/sign-in";
import { SignUp } from "@pages/sign-up";
import ProtectedRoute from "@routes/auth";
import { VideoChat } from "@view/pages/video-chat";

export const RouteSelector = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/video-chat" element={<VideoChat />} />
      </Route>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  );
};
