import React from "react";
import { App, ZMPRouter, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";
import { getConfig } from "utils/config";
import { Layout } from "./layout";
import { ConfigProvider } from "./config-provider";
import Oauth from "./oauth";
import DynamicModal from "./DynamicModal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Dữ liệu "tươi" trong 5 phút
      gcTime: 1000 * 60 * 5, // Xóa cache sau 10 phút (Thay cho cacheTime cũ)
      refetchOnWindowFocus: false, // Không gọi lại API khi chuyển tab
    },
  },
});
const MyApp = () => {
  return (
    <RecoilRoot>
      <ConfigProvider
        cssVariables={{
          "--zmp-primary-color": getConfig((c) => c.template.primaryColor),
          "--zmp-background-color": "#f4f5f6",
        }}
      >
        <App>
          <QueryClientProvider client={queryClient}>
            <SnackbarProvider>
              <ZMPRouter>
                <Oauth />
                <Layout />
              </ZMPRouter>
              <DynamicModal />
            </SnackbarProvider>
          </QueryClientProvider>
        </App>
      </ConfigProvider>
    </RecoilRoot>
  );
};
export default MyApp;
