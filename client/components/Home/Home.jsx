import React, { useState, useEffect, useCallback } from "react";

import Header from "../Common/Header/Header";
import HeroSection from "../HeroSection/HeroSection";
import WhyChooseUs from "../WhyChooseUs/WhyChooseUs";
import DiscountOnRegister from "../DiscountOnRegister/DiscountOnRegister";
import InitialBooking from "../InitialBooking/InitialBooking";
import Testimonial from "../Testimonial/Testimonial";
import Footer from "../Common/Footer/Footer";
import SuccessModal from "../Common/SuccessModal/SuccessModal";
import { dummyData } from "../../utils/data";
import { getDeviceInfo, getHomePageData } from "../https/homePageService";

import { useDispatch, useSelector } from "react-redux";
import { storeVisitorInfo } from "../../redux/features/visitor/visitorSlice";
import { storeHomePageData } from "../../redux/features/homePage/homePageSlice";

function Home() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.persistedReducer.user?.user);

  const getDeviceData = async () => {
    try {
      const res = await getDeviceInfo();

      var sUsrAg = navigator.userAgent;
      var device = "Desktop PC";

      if (sUsrAg.includes("Android")) {
        device = "Android";
      }
      if (sUsrAg.includes("iPhone")) {
        device = "iPhone";
      }
      let infos = {
        ipAddress: res.data.IPv4,
        deviceInfo: device,
        browserInfo: sUsrAg,
        locationInfo: "",
        unfilteredSourceInfo: sUsrAg,
      };
      return infos;
    } catch (ex) {
      console.log(ex);
    }
  };

  const getLongAndLat = async () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }).catch((err) => {
      console.log(err.message);
    });
  };

  const saveVisitorInfo = useCallback(async () => {
    let gps = "";
    try {
      const position = await getLongAndLat();
      if (position) {
        const { coords } = position;
        gps = coords.latitude + ", " + coords.longitude;
      }

      const info = await getDeviceData();
      const infos = { deviceInfo: info, locationInfo: gps };
      dispatch(storeVisitorInfo(infos));
    } catch (ex) {
      console.log(ex);
    }
  }, [dispatch]);

  useEffect(() => {
    try {
      const initializeLocationPermission = async () => {
        if (navigator.geolocation) {
          navigator.permissions
            .query({ name: "geolocation" })
            .then(async (result) => {
              if (result.state === "granted") await saveVisitorInfo();
              else if (result.state === "prompt") {
                setTimeout(async () => {
                  await saveVisitorInfo();
                }, 5000);
              } else if (result.state === "denied") {
                await saveVisitorInfo();
                console.log("location denied");
              }

              result.onchange = async function () {
                console.log("State changed", result.state);
              };
            });
        } else navigator.permissions.revoke({ name: "geolocation" });
      };
      initializeLocationPermission();
    } catch (ex) {
      console.log(ex);
    }
  }, [saveVisitorInfo]);

  useEffect(() => {
    async function homePageData() {
      try {
        const { data } = await getHomePageData();
        if (data) {
          dispatch(storeHomePageData(data));
        }
      } catch (ex) {
        console.log(ex);
        dispatch(storeHomePageData(dummyData));
      }
    }
    homePageData();
  }, [dispatch]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Header currentUser={currentUser} />
      <HeroSection handleModalOpen={handleOpen} currentUser={currentUser} />
      <WhyChooseUs />
      <DiscountOnRegister currentUser={currentUser} />
      <InitialBooking handleModalOpen={handleOpen} currentUser={currentUser} />
      <Testimonial />
      <Footer />
      <SuccessModal
        handleModalClose={handleClose}
        open={open}
        message={`
          Our team will get in touch with you for confimation.
          Login to keep track of your booking.
        `}
        buttonLabel="Login"
      />
    </>
  );
}

export default Home;
