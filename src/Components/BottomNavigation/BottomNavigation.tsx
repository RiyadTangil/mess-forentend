import React, { useEffect, useState } from "react";
import "./BottomNavigation.css";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
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
import { getMessInfoFromLocalHost } from "../../helperFunctions";

const BottomNavigation = ({ component }: { component: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [tmConOpener, setTmConOpener] = useState(false);
  const [userRole, setUserRole] = useState("");
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
  useEffect(() => {
    const val = getMessInfoFromLocalHost();
    setUserRole(val.role);
  }, []);
  const navigationData = [
    {
      label: "Add Meals",
      route: "/add-meals",
      icon: homeIcon,
      for: true,
      activeIcon: homeIconActive,
      content: <Users />,
    },
    {
      label: "Manage Meals",
      icon: prayerIcon,
      route: "/manage-meals",
      for: userRole === "admin" ? true : false,
      activeIcon: prayerIconActive,
      content: <Users />,
    },
    {
      label: "Manage Users",
      route: "/users",
      for: userRole === "admin" ? true : false,
      activeIcon: specialPrayerIconActive,
      icon: specialPrayerIcon,
      content: <Users />,
    },
    {
      label: "Meal Dashboard",
      route: "/meals-dashboard",
      for: true,
      activeIcon: eventIconActive,
      icon: eventIcon,
      content: <Users />,
    },
    {
      label: "Profile",
      route: "/profile",
      for: true,
      activeIcon: profileIcon,
      icon: profileIcon,
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
        {navigationData.map(
          (item, index) =>
            // <SwiperSlide key={index}>
            item.for ? (
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
            ) : null
          // </SwiperSlide>
        )}
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
