import env from "config/app.config";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { cardState } from "state";
import { Header, Icon, Page } from "zmp-ui";
import { GoMail } from "react-icons/go";
import { FaFacebook, FaTelegram, FaTiktok } from "react-icons/fa";
import { FaEarthAsia } from "react-icons/fa6";
import { BsBuildings } from "react-icons/bs";
import { useLocation, useParams } from "react-router-dom";
import { TCard } from "types/user";

const CardInformation = () => {
  const card = useRecoilValue(cardState);
  const [cardInfo, setCardInfo] = useState<TCard>({} as TCard);
  const { id } = useParams();
  const location = useLocation();
  const [showAction, setShowAction] = useState(true);

  useEffect(() => {
    if (id && id !== card.documentId) {
      setCardInfo(card);
    } else {
      if (id && id === card.documentId) {
        setCardInfo(card);
      }
    }
  }, [id]);
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
        className="content relative w-full h-full bg-white"
        onClick={() => setShowAction((prev) => !prev)}
      >
        {cardInfo && (
          <div className="w-full h-full max-h-[700px] p-8 flex flex-col items-center">
            <div className="mb-4 ">
              {cardInfo.avatar?.url ? (
                <img
                  src={`${env.VITE_WEB_URL_API}${cardInfo?.avatar?.url}` || ""}
                  alt={cardInfo.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-4xl text-gray-400">
                    {cardInfo.name}
                  </span>
                </div>
              )}
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {cardInfo.name}
              </h2>
              <p className="text-gray-600 font-medium mb-1 text-xl">
                {handReturnValue(cardInfo.position)}
              </p>
              <div className="infoCardWrap  items-center justify-center text-gray-500 text-base">
                <BsBuildings size={22} />
                <span>{handReturnValue(cardInfo.company)}</span>
              </div>
            </div>
            {/* Slogan */}
            {cardInfo.slogan && (
              <div className="text-center mb-6">
                <p className="text-gray-600 italic text-base">
                  "{cardInfo.slogan}"
                </p>
              </div>
            )}
            {/* Contact Information */}
            <div className="w-full space-y-3 mb-6">
              <a
                className="infoCardWrap text-gray-700 text-base"
                href={`tel:+${cardInfo.phone}`}
              >
                <Icon icon="zi-call" size={28} />
                <span>{handReturnValue(cardInfo.phone)}</span>
              </a>
              <div className="infoCardWrap  text-gray-700 text-base">
                <GoMail className="font-light" size={24} />
                <span className="break-all">
                  {handReturnValue(cardInfo.email)}
                </span>
              </div>
            </div>
            {/* Social Media */}
            <div className="flex space-x-4 mt-auto">
              {cardInfo.socialMedia.map((social, index) => (
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
          <div className="action absolute top-2 right-2">
            <div className=" flex flex-col gap-2">
              <div>
                <Icon icon="zi-share" size={30} className="text-blue-500" />
              </div>
              <div>
                <Icon icon="zi-qrline" size={30} className="text-blue-500" />
              </div>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
};

export default CardInformation;
