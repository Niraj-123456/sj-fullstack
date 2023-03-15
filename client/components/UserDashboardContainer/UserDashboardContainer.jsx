import React, { useEffect } from "react";
import { useRouter } from "next/router";

import UserDashboard from "../UserDashboard/UserDashboard";
import CircularLoading from "../Common/CircularLoading";
import Footer from "../Common/Footer/Footer";

import { useSelector } from "react-redux";

import { clientBasePath } from "../../utils/apiRoutes";

function UserDashboardContainer() {
  const router = useRouter();
  const currentUser = useSelector(
    (state) => state.persistedReducer?.user?.user
  );

  const isPageLoading = useSelector((state) => state.isLoading?.isPageLoading);

  useEffect(() => {
    if (!currentUser) router.push(`${clientBasePath}`);
  }, [currentUser, router]);

  if (isPageLoading) {
    return (
      <CircularLoading
        boxStyles={{ height: "100vh" }}
        progressStyles={{ color: "var(--color-blue)" }}
        size={50}
        thickness={5}
      />
    );
  }

  return (
    currentUser && (
      <>
        <UserDashboard loggedInUser={currentUser} />
        <Footer />
      </>
    )
  );
}

export default UserDashboardContainer;
