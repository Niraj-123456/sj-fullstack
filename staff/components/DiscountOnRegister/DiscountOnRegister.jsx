import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./discountonregister.module.css";

import { useSelector } from "react-redux";

import { basePath } from "../../utils/apiRoutes";

function DiscountOnRegister({ currentUser }) {
  const promotion = useSelector((state) =>
    state.persistedReducer.homePage?.homeData?.registrationPromotionRow
      ? state.persistedReducer.homePage?.homeData?.registrationPromotionRow
      : state.persistedReducer.homePage?.homeData?.registrationPromotion
  );
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.content__left}>
          <h1 className={styles.get__discount__header}>{promotion?.heading}</h1>
          <p className={styles.get__discount__description}>
            {promotion?.subText}
          </p>
          <ul className={styles.get__discount__list}>
            {promotion?.benefitsInGreen.map((benefits, index) => (
              <li key={index}>{benefits}</li>
            ))}
          </ul>

          {!currentUser ? (
            <div className={styles.registration}>
              <Link href={`${basePath}/login`}>
                <a
                  style={{
                    background: "var(--primary-color)",
                    color: "var(--color-white)",
                    width: "181px",
                    height: "51px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "5px",
                    fontWeight: "600",
                    letterSpacing: "0.02em",
                  }}
                >
                  Login
                </a>
              </Link>
              <Link href={`${basePath}/register`}>
                <a
                  style={{
                    border: "solid 1px var(--primary-color)",
                    background: "var(--color-white)",
                    color: "var(--primary-color)",
                    width: "181px",
                    height: "51px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "5px",
                    fontWeight: "600",
                    letterSpacing: "0.02em",
                  }}
                >
                  Register Now
                </a>
              </Link>
            </div>
          ) : (
            <div className={styles.discounted__book__now}>
              <Link href="/mybooking">
                <a>Book Now</a>
              </Link>
            </div>
          )}
        </div>
        <div className={styles.content__right}>
          <div className={styles.content__right__image}>
            <Image
              src="/images/women.png"
              alt="womam"
              layout="fill"
              objectFit="cover"
              objectPosition="80%"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscountOnRegister;
