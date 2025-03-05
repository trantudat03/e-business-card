import env from "config/app.config";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { cardState, userState } from "state";
import { Box, Button, Header, Icon, Page, Select, Sheet, Text } from "zmp-ui";
import { GoMail } from "react-icons/go";
import { FaFacebook, FaTelegram, FaTiktok } from "react-icons/fa";
import { FaEarthAsia } from "react-icons/fa6";
import { BsBuildings } from "react-icons/bs";
import { useLocation, useParams } from "react-router-dom";
import { TCard } from "types/user";
import { useQuery } from "@tanstack/react-query";
import { cmsAxios } from "utils/axios";
import { CheckAction } from "service/card";
import request from "utils/request";
import QRCodeItem from "components/QRCodeItem";
import { openShareSheet } from "zmp-sdk";
import { handCreateLinkCardInfo } from "utils/link";

const CardInformation = () => {
  // kiểm tra và gọi api lấy card của cardId luôn
  const card = useRecoilValue(cardState);
  const user = useRecoilValue(userState);
  console.log("user: ", user);
  const [cardInfo, setCardInfo] = useState<TCard>({} as TCard);
  const { id } = useParams();
  const location = useLocation();
  const [showAction, setShowAction] = useState(true);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isMyCard = location?.state?.from === "profile";

  const { data, isPending } = useQuery({
    queryKey: ["getCardById", id],
    queryFn: async () => {
      try {
        const res = await request.post(
          `${
            import.meta.env.VITE_WEB_URL_API
          }/api/func-customer/get-action-card`,
          {
            // method: "POST",
            data: id,
          }
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: !!id && !isMyCard && !!user?.userTokens?.cmsAccessToken,
  });

  useEffect(() => {
    if (data) {
      setCardInfo(data);
    } else {
      if (isMyCard) {
        setCardInfo(card);
      }
    }
  }, [data, isMyCard]);

  const handReturnValue = (text: string) => {
    if (text) {
      text.charAt(0).toUpperCase();
      return text;
    }
    return "Chưa cập nhật!";
  };

  const getSocialIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "facebook":
        return <FaFacebook color="#1773ea" size={32} />;
      case "telegram":
        return <FaTelegram color="#229bd5" size={32} />;
      case "website":
        return <FaEarthAsia color="#61afee" size={30} />;
      case "tiktok":
        return <FaTiktok size={30} />;
      default:
        return null;
    }
  };

  return (
    <Page className="flex flex-col flex-1 ">
      <Header showBackIcon title="Danh thiếp" />
      <div
        className="content relative w-full h-full bg-white overflow-y-scroll"
        onClick={() => {
          if (showMenu) {
            setShowMenu((prev) => !prev);
          }
          setShowAction((prev) => !prev);
        }}
      >
        {cardInfo?.documentId && (
          <div className="w-full h-full max-h-[700px] p-8 flex flex-col items-center">
            <div className="mb-4 ">
              {cardInfo?.avatar?.url || user?.avatar !== "" ? (
                <img
                  src={
                    cardInfo?.avatar?.url
                      ? ` ${env.VITE_WEB_URL_API}${cardInfo?.avatar?.url}`
                      : ""
                  }
                  alt={cardInfo?.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-4xl text-gray-400">
                    {cardInfo?.name}
                  </span>
                </div>
              )}
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {cardInfo?.name}
              </h2>
              <p className="text-gray-600 font-medium mb-1 text-xl">
                {handReturnValue(cardInfo?.position)}
              </p>
              <div className="infoCardWrap  items-center justify-center text-gray-500 text-base">
                <BsBuildings size={22} />
                <span>{handReturnValue(cardInfo?.company)}</span>
              </div>
            </div>
            {/* Slogan */}
            {cardInfo?.slogan && (
              <div className="text-center mb-6">
                <p className="text-gray-600 italic text-base">
                  "{cardInfo?.slogan}"
                </p>
              </div>
            )}
            {/* Contact Information */}
            <div className="w-full space-y-3 mb-6">
              <a
                className="infoCardWrap text-gray-700 text-base"
                href={`tel:+${cardInfo?.phone}`}
              >
                <Icon icon="zi-call" size={28} />
                <span>{handReturnValue(cardInfo?.phone)}</span>
              </a>
              <div className="infoCardWrap  text-gray-700 text-base">
                <GoMail className="font-light" size={24} />
                <span className="break-all">
                  {handReturnValue(cardInfo?.email)}
                </span>
              </div>
            </div>
            {/* Social Media */}
            <div className="flex space-x-4 mt-auto">
              {cardInfo?.socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {getSocialIcon(social.name)}
                </a>
              ))}
            </div>
          </div>
        )}
        {showAction && (
          <div className="action absolute top-4 right-2">
            <div className=" flex flex-col gap-2">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  const link = handCreateLinkCardInfo(cardInfo?.documentId);
                  try {
                    openShareSheet({
                      type: "link",
                      data: {
                        link: link,
                        chatOnly: false,
                      },
                      success: (data) => {},
                      fail: (err) => {},
                    });
                  } catch (error) {}
                }}
              >
                <Icon icon="zi-share" size={30} className="text-blue-500" />
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setSheetVisible(true);
                }}
              >
                <Icon icon="zi-qrline" size={30} className="text-blue-500" />
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu((prev) => !prev);
                }}
                className="relative"
              >
                {showMenu && (
                  <Box className="absolute right-full -right-full z-50 bg-white shadow-md p-2 flex flex-col rounded-md min-w-32">
                    <div className="text-sm font-medium">
                      {cardInfo?.action === "none" ? (
                        <div>Thêm danh thiếp</div>
                      ) : cardInfo?.action === "own" ? (
                        <div>Chỉnh sửa</div>
                      ) : (
                        <div>Xóa danh thiếp</div>
                      )}
                    </div>
                  </Box>
                )}

                <Icon icon="zi-list-2" size={32} className="text-blue-500" />
              </div>
            </div>
          </div>
        )}
      </div>
      <Sheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        autoHeight
        mask
        handler
        swipeToClose
        title="Qr Code"
      >
        <Box
          p={4}
          className="custom-bottom-sheet flex flex-col items-center p-6"
          flex
          flexDirection="column"
        >
          <img
            src={
              cardInfo?.avatar?.url
                ? ` ${env.VITE_WEB_URL_API}${cardInfo?.avatar?.url}`
                : ""
            }
            alt="Avatar"
            className="w-16 h-16 rounded-full border object-cover"
          />
          <h2 className=" text-lg font-semibold">{cardInfo?.name}</h2>
          {/* <p className="text-gray-500">@dat.trantu</p> */}

          <QRCodeItem cardId={cardInfo.documentId} />
          {/* <Box flex flexDirection="row" mt={1}>
            <Box style={{ flex: 1 }} pr={1}>
              <Button
                fullWidth
                variant="secondary"
                onClick={() => {
                  setSheetVisible(false);
                }}
              >
                Để sau
              </Button>
            </Box>
            <Box style={{ flex: 1 }} pl={1}>
              <Button
                fullWidth
                onClick={() => {
                  setSheetVisible(false);
                }}
              >
                Cho phép
              </Button>
            </Box>
          </Box> */}
        </Box>
      </Sheet>
    </Page>
  );
};

export default CardInformation;
