import React, { useEffect, useState } from "react";
import { Header, Page } from "zmp-ui";
import { QRCodeSVG } from "qrcode.react";
import { useRecoilValue } from "recoil";
import { cardState } from "state";
import env from "config/app.config";
import { generatePath, useLocation } from "react-router-dom";
import { ROUTE_PATH } from "utils/constant";
const QRCodePage = () => {
  const card = useRecoilValue(cardState);
  const location = useLocation();
  const [link, setLink] = useState("");
  const handCreateLink = (cardId) => {
    // Bước 1: Tạo đường dẫn cơ sở với /card-info:cardId
    let baseUrl = `${env.VITE_ZALO_APP_URL}/card-info/${cardId}`;
    console.log(location);
    if (location.search) {
      const extraParams = location.search;
      // Thêm phần tham số vào sau baseUrl
      baseUrl += extraParams;
    }
    return baseUrl;
  };

  useEffect(() => {
    setLink(handCreateLink(card.documentId));
  }, []);
  useEffect(() => {
    console.log(link);
  }, [link]);

  return (
    <Page className="flex flex-col flex-1">
      <Header showBackIcon title="Mã của tôi" />
      <div className="content">
        {link && <QRCodeSVG height={"auto"} width={"85%"} value={link} />}
      </div>
    </Page>
  );
};

export default QRCodePage;
