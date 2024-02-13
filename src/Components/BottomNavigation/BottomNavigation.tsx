import React, { useEffect, useState } from "react";
import "./BottomNavigation.css";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import homeIcon from "../../photos/Newuiphotos/nav bar/navicons/home.svg";
import prayerIcon from "../../photos/Newuiphotos/nav bar/navicons/prayerT.svg";
import specialPrayerIcon from "../../photos/Newuiphotos/nav bar/navicons/otherprayer.svg";
import eventIcon from "../../photos/Newuiphotos/nav bar/navicons/events.svg";
import profileIcon from "../../photos/Newuiphotos/nav bar/navicons/profile.svg";
import AnnouncementIcon from "../../photos/Newuiphotos/nav bar/navicons/announcement.svg";
import homeIconActive from "../../photos/Newuiphotos/nav bar/navicons/navactiveicons/homeactive.svg";
import prayerIconActive from "../../photos/Newuiphotos/nav bar/navicons/navactiveicons/prayertactive.svg";
import specialPrayerIconActive from "../../photos/Newuiphotos/nav bar/navicons/navactiveicons/otherpactive.svg";
import eventIconActive from "../../photos/Newuiphotos/nav bar/navicons/navactiveicons/eventsactive.svg";
import AnnouncementIconActive from "../../photos/Newuiphotos/nav bar/navicons/navactiveicons/Announcementactive.svg";
import Users from "../../Pages/Users/Users";

const BottomNavigation = ({ component }: { component: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [tmConOpener, setTmConOpener] = useState(false);
  const { tab } = useParams();
  useEffect(() => {
    if (tab) setActiveTab(+tab);
  }, [tab]);
  // const navigation = navigation();
  const navigation = useNavigate();
  const handleTabChange = (link, index) => {
    navigation(link);
    setActiveTab(index);
  };

  const navigationData = [
    {
      label: "Home",
      route: "/users",
      icon: homeIcon,
      activeIcon: homeIconActive,
      content: <Users />,
    },
    {
      label: "Meals",
      icon: prayerIcon,
      route: "/meal-and-date",
      activeIcon: prayerIconActive,
      content: <Users />,
    },
    {
      label: "Add Meal",
      route: "/add-meals",
      activeIcon: specialPrayerIconActive,
      icon: specialPrayerIcon,
      content: <Users />,
    },
    {
      label: "Meal Dashboard",
      route: "/meals",
      activeIcon: specialPrayerIconActive,
      icon: specialPrayerIcon,
      content: <Users />,
    },

   
  ];

  const conditionalImg = (idx: number, item: (typeof navigationData)[0]) => {
    const isActive = activeTab === idx ? true : false;
    return (
      <div>
        <img
          src={isActive ? item.activeIcon : item.icon}
          className={isActive ? "nav-icon-active" : "nav-icon"}
          alt={item.label}
        />
      </div>
    );
  };

  return (
    <div className="bottom-nav-container">
      {/* <TermAndConditions
        tmConOpener={tmConOpener}
        setTmConOpener={setTmConOpener}
      /> */}
      <div className="bottom-nav-component">{component}</div>
      <div className="bottom-navigation">
        {/* <Swiper spaceBetween={0} slidesPerView={3.5} style={{ padding: "" }}> */}
          {navigationData.map((item, index) => (
            // <SwiperSlide key={index}>
              <div
                key={index}
                className={`nav-item ${activeTab === index ? "active" : ""}`}
                onClick={() => handleTabChange(item.route, index)}
              >
                {conditionalImg(index, item)}
                <span
                  className={
                    activeTab === index ? "nav-label-active" : "nav-label"
                  }
                >
                  {item.label}
                </span>
              </div>
            // </SwiperSlide>
          ))}
        {/* </Swiper> */}
      </div>
      {/* {activeTab === 0 ? (
        <h1 className="term-condition-tx" onClick={() => setTmConOpener(true)}>
          Term and Conditions
        </h1>
      ) : null} */}
    </div>
  );
};

export default BottomNavigation;
