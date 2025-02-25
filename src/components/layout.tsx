import React, { FC } from "react";
import { Route, Routes } from "react-router";
import { Box } from "zmp-ui";
import { Navigation } from "./navigation";
import HomePage from "pages/index";
import CategoryPage from "pages/category";
import CartPage from "pages/cart";
import NotificationPage from "pages/notification";
import SearchPage from "pages/search";
import CheckoutResultPage from "pages/result";
import { getSystemInfo } from "zmp-sdk";
import { ScrollRestoration } from "./scroll-restoration";
import { useHandlePayment } from "hooks";
import Profile from "pages/Profile";
import EditProfile from "pages/EditProfile";
import CardInformation from "pages/CardInformation";
import { ROUTE_PATH } from "utils/constant";
import QRCodePage from "pages/QRCodePage";

if (import.meta.env.DEV) {
  document.body.style.setProperty("--zaui-safe-area-inset-top", "24px");
} else if (getSystemInfo().platform === "android") {
  const statusBarHeight =
    window.ZaloJavaScriptInterface?.getStatusBarHeight() ?? 0;
  const androidSafeTop = Math.round(statusBarHeight / window.devicePixelRatio);
  document.body.style.setProperty(
    "--zaui-safe-area-inset-top",
    `${androidSafeTop}px`
  );
}

export const Layout: FC = () => {
  useHandlePayment();

  return (
    <Box flex flexDirection="column" className="h-screen">
      <ScrollRestoration />
      <Box className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          <Route path={ROUTE_PATH.HOME.path} element={<HomePage />}></Route>
          <Route path="/search" element={<SearchPage />}></Route>
          <Route path="/category" element={<CategoryPage />}></Route>
          <Route
            path={ROUTE_PATH.ADD_CONTACT.path}
            element={<NotificationPage />}
          ></Route>
          <Route
            path={ROUTE_PATH.EDIT_PROFILE.path}
            element={<EditProfile />}
          ></Route>
          <Route
            path={ROUTE_PATH.CARD_INFO.path}
            element={<CardInformation />}
          ></Route>
          <Route path={ROUTE_PATH.PROFILE.path} element={<Profile />}></Route>
          <Route path="/result" element={<CheckoutResultPage />}></Route>
          <Route
            path={ROUTE_PATH.QR_CODE.path}
            element={<QRCodePage />}
          ></Route>
        </Routes>
      </Box>
      <Navigation />
    </Box>
  );
};
