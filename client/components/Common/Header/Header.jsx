import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./header.module.css";

import { logout } from "../../https/loginServices";
import { userLogout } from "../../../redux/features/user/userSlice";
import { storePhoneNumber } from "../../../redux/features/phoneNumber/phoneNumberSlice";
import { clientBasePath } from "../../../utils/apiRoutes";

import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

function Header({ currentUser }) {
  const router = useRouter();
  const dispatch = useDispatch();

  // logout the current user
  const handleSignOut = async () => {
    try {
      const { data } = await logout(currentUser?.phoneNumber);
      if (data.success) {
        localStorage.removeItem("bearer-token");
        dispatch(userLogout());
        dispatch(storePhoneNumber(null));
        router.push(`${clientBasePath}`);
      }
    } catch (ex) {
      toast.error("Something went wrong. Please refresh the page.");
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <Image
            src="/images/header-images/sahaj-logo-white.svg"
            alt="Logo"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className={styles.register__login}>
          <ul>
            {!currentUser ? (
              <>
                <li>
                  <Link href={`${clientBasePath}/register`}>
                    <a>Register</a>
                  </Link>
                </li>
                <li>
                  <Link href={`${clientBasePath}/login`}>
                    <a>Sign In</a>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href={`${clientBasePath}/mybooking`}>
                    <a>Dashboard</a>
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <a onClick={handleSignOut}>LogOut</a>
                  </Link>
                  <FontAwesomeIcon
                    icon={faArrowRightFromBracket}
                    style={{ fontSize: "1.5rem" }}
                  />
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
