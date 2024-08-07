import { Routes, Route, Navigate } from "react-router-dom";

import { HomePage } from "../Pages/Home";
import AboutPage from "../Pages/About";
import NotFoundPage from "../Pages/NotFound";
import { SignInPage } from "../Pages/SignIn";
import { SignUpPage } from "../Pages/SignUp";
import { AdPage } from "../Pages/Ad";
import { isLogged } from "../helpers/AuthHandler";
import { AddAdPage } from "../Pages/AddAd";
import { AdsPage } from "../Pages/Ads";
import { MyAccountPage } from "../Pages/MyAccount";
import { AdEditPage } from "../Pages/AdEditPage";
// import RouteHandler from "../components/RouteHandler";

export default () => {
  const privated = isLogged();

  return (
    <Routes>
      <Route path="/*" element={<NotFoundPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/ad/:id" element={<AdPage />} />
      <Route path="/ads" element={<AdsPage />} />
      <Route
        path="/ad/edit/:id"
        element={privated ? <AdEditPage /> : <Navigate to="/signin" />}
      />
      <Route
        path="/post-an-ad"
        element={privated ? <AddAdPage /> : <Navigate to="/signin" />}
      />
      <Route
        path="/my-account"
        element={privated ? <MyAccountPage /> : <Navigate to="/signin" />}
      />
    </Routes>
  );
};
