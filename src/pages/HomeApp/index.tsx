import { Welcome } from "pages/index/welcome";
import React, { useEffect, useState } from "react"; // Assuming Tailwind is configured here
import { useRecoilState, useRecoilValue } from "recoil";
import { contactState, userState } from "state";
import { Icon, Input, Page } from "zmp-ui";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { cmsAxios } from "utils/axios";
import axios from "axios";
import request from "utils/request";
import { TContact } from "types/user";
import env from "config/app.config";
import { generatePath, useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "utils/constant";
import { openChat } from "zmp-sdk";
import { useModalStore } from "store/modal";
import NoData from "components/NoData";
const HomeApp = () => {
  const user = useRecoilValue(userState);
  //   const [calls] = useState([
  //     {
  //       id: 1,
  //       number: "024 8884 1368",
  //       location: "Vietnam",
  //       time: "Sat 4:31 PM",
  //       isSpam: true,
  //     },
  //     {
  //       id: 1,
  //       number: "024 8884 1368",
  //       location: "Vietnam",
  //       time: "Sat 4:31 PM",
  //       isSpam: true,
  //     },
  //     {
  //       id: 1,
  //       number: "024 8884 1368",
  //       location: "Vietnam",
  //       time: "Sat 4:31 PM",
  //       isSpam: true,
  //     },
  //     {
  //       id: 1,
  //       number: "024 8884 1368",
  //       location: "Vietnam",
  //       time: "Sat 4:31 PM",
  //       isSpam: true,
  //     },
  //     {
  //       id: 2,
  //       number: "0937 005 538",
  //       location: "Vietnam",
  //       time: "Sat 1:22 AM",
  //       isSpam: false,
  //     },
  //     {
  //       id: 3,
  //       number: "0909 620 497",
  //       location: "Vietnam",
  //       time: "Sat 10:45 AM",
  //       isSpam: false,
  //     },
  //     {
  //       id: 4,
  //       number: "0236 6883 853",
  //       location: "Vietnam",
  //       time: "Fri 3:48 PM",
  //       isSpam: true,
  //     },
  //     {
  //       id: 5,
  //       number: "093 159 74 58",
  //       location: "Vietnam",
  //       time: "Fri 10:56 AM",
  //       isSpam: false,
  //     },
  //     {
  //       id: 6,
  //       number: "024 8883 1106",
  //       location: "Vietnam",
  //       time: "Thu 3:00 PM",
  //       isSpam: true,
  //     },
  //     {
  //       id: 7,
  //       number: "093 159 47 38",
  //       location: "Vietnam",
  //       time: "Thu 10:21 AM",
  //       isSpam: false,
  //     },
  //   ]);
  const [contacts, setContacts] = useState<TContact[]>([]);
  const navigate = useNavigate();
  const { data, refetch } = useQuery({
    queryKey: ["getContacts"],
    queryFn: async () => {
      const res = await request(
        `${import.meta.env.VITE_WEB_URL_API}/api/func-customer/get-contacts`
      );
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // Giữ dữ liệu "tươi" trong 5 phút
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setContacts(data);
    }
  }, [data]);

  return (
    <Page className="flex flex-col flex-1 bg-white">
      <Welcome />
      <div className="p-4 h-full overflow-y-scroll">
        {/* Search Bar */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Tìm kiếm..."
            className="border-none rounded-full bg-slate-100"
          />
        </div>

        {/* Call Log List */}
        <div>
          <div className="flex justify-between items-center ">
            <p className="text-base font-medium">Danh sách liên hệ</p>
            <div
              onClick={() => {
                refetch();
              }}
            >
              <Icon icon="zi-retry" className="text-blue-500" />
            </div>
          </div>
          <div className="w-full h-0.5 bg-slate-200 mx-auto mt-1"></div>
        </div>

        {contacts?.length > 0 ? (
          <div className="flex flex-col gap-6 mt-6">
            {contacts.map((item, index) => {
              return (
                <div
                  key={item?.documentId}
                  className="w-full bg-white flex gap-2 items-center"
                  onClick={() => {
                    navigate(
                      generatePath(ROUTE_PATH.CARD_INFO.path, {
                        id: item?.card.documentId,
                      }),
                      {
                        replace: ROUTE_PATH.CARD_INFO.replace,
                        state: { from: "appHome" },
                      }
                    );
                  }}
                >
                  <div>
                    <div className="w-14 h-14 rounded-full overflow-hidden">
                      <img
                        src={
                          `${env.VITE_WEB_URL_API}${item?.card.avatar?.url}` ||
                          ""
                        }
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-medium">
                      {item?.card?.name}
                    </div>
                    <div className="text-sm ">
                      <p>{item?.card?.position}</p>
                      <p>{item?.card?.company}</p>
                    </div>
                  </div>
                  <div className="flex flex-1 justify-end pr-4 ">
                    <div
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          await openChat({
                            type: "user",
                            id:
                              item?.card?.user?.ZaloIdByApp ||
                              "khkf2384kjfshk89347",
                            message: "",
                          });
                        } catch (error) {
                          useModalStore.setState({
                            modal: {
                              title: "Lỗi hệ thống",
                              description: "Xảy ra lỗi vui lòng thử lại sau",
                              confirmButton: {
                                text: "Xác nhận",
                                onClick: () => {},
                              },
                              closeOnConfirm: true,
                              //   cancelButton: {
                              //     text: "Trở lại",
                              //     onClick: () => {
                              //       navigate(ROUTE_PATH.PG);
                              //     },
                              //   },
                              closeOnCancel: true,
                              dismissible: true,
                            },
                          });
                        }
                      }}
                    >
                      <Icon
                        icon="zi-chat"
                        size={30}
                        className="font-medium text-blue-500"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <NoData text={"Chưa có liên hệ nào!"} className="mt-14" />
        )}

        <div className="bg-white rounded-lg shadow-md"></div>
      </div>
    </Page>
  );
};

export default HomeApp;
