import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import VerifyCode from "./pages/auth/VerifyCode";
import Home from "./pages/Home";
import AuthRoutes from "./routes/AuthRoutes";
import PrivateRoutes from "./routes/PrivateRoutes";
import ResetPassword from "./pages/auth/password/ResetPassword";
import VerifyMagicLink from "./pages/auth/VerifyMagicLink";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthRoutes />}>
          <Route path="/signin" element={<Auth />} />
          <Route path="/signin/verification" element={<VerifyCode />} />
          <Route
            path="/signin/reset-password/:token"
            element={<ResetPassword />}
          />
          <Route
            path="/signin/magic-link/:token"
            element={<VerifyMagicLink />}
          />
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
