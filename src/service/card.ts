import env from "config/app.config";
import { TCard } from "types/user";
import request from "utils/request";

export const CardUpdate = (params: TCard) =>
  request(`${env.VITE_WEB_URL_API}/api/func-customer/update-card`, {
    method: "POST",
    data: params,
    headers: {
      authApi: true,
    },
  });
