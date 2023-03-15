import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./footer.module.css";

import Button from "../Button";
import InputField from "../InputField";
import { subscribeToNewsLetter } from "../../https/homePageService";

import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebook,
  faTwitter,
  faViber,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

import { useSelector } from "react-redux";

function Footer() {
  const footerData = useSelector(
    (state) => state.persistedReducer.homePage?.homeData?.footer
  );
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const { data } = await subscribeToNewsLetter(email);
      if (data.success) toast.success(data.message);
      setEmail("");
    } catch (ex) {
      console.log(ex);
    }
  };

  const featuredServices = () => {
    return (
      <>
        <h1>Featured Services</h1>
        <ul className={styles.service__links}>
          <li>
            <Link href="/">
              <a>Use Sahaj</a>
            </Link>
          </li>
        </ul>
      </>
    );
  };

  const customerServices = () => {
    return (
      <>
        <h1>Customer Services</h1>
        <ul className={styles.service__links}>
          <li>
            <Link href="/">
              <a>Help</a>
            </Link>
          </li>
          <li>
            <Link href="/">
              <a>Trading Guide</a>
            </Link>
          </li>
          <li>
            <Link href="/">
              <a>About Us</a>
            </Link>
          </li>
        </ul>
      </>
    );
  };

  const contactUs = () => {
    return (
      <>
        <h1>Contact Us</h1>
        <ul className={styles.service__links}>
          <li>{footerData.contactUsNumber}</li>
          <li>{footerData.contactUsEmail}</li>

          <div className={styles.service__contact__icons}>
            <Link href={footerData.viberRedirectLink}>
              <a>
                <FontAwesomeIcon
                  icon={faViber}
                  style={{
                    padding: "7px",
                    height: "30px",
                    width: "30px",
                    background: "#59267C",
                    color: "white",
                    borderRadius: "50%",
                  }}
                />
              </a>
            </Link>
            <Link href={footerData.whatsAppRedirectLink}>
              <a>
                <FontAwesomeIcon
                  icon={faWhatsapp}
                  style={{
                    padding: "5px",
                    height: "30px",
                    width: "30px",
                    background: "#00E676",
                    color: "white",
                    borderRadius: "50%",
                  }}
                />
              </a>
            </Link>
          </div>
        </ul>
      </>
    );
  };

  const followUs = () => {
    return (
      <div className={styles.follow__links}>
        <h1>Follow Us</h1>
        <div className={styles.follow__link__icons}>
          <Link href={footerData.instagramRedirectLink}>
            <a>
              <FontAwesomeIcon
                icon={faInstagram}
                style={{
                  padding: "7px",
                  background: "white",
                  borderRadius: "50%",
                  color: "#FB3958",
                }}
              />
            </a>
          </Link>
          <Link href={footerData.facebookRedirectLink}>
            <a>
              <FontAwesomeIcon
                icon={faFacebook}
                style={{
                  padding: "7px",
                  background: "white",
                  borderRadius: "50%",
                  color: "#4267B2",
                }}
              />
            </a>
          </Link>
          <Link href={footerData.twitterRedirectLink}>
            <a>
              <FontAwesomeIcon
                icon={faTwitter}
                style={{
                  padding: "7px",
                  background: "white",
                  borderRadius: "50%",
                  color: "#1DA1F2",
                }}
              />
            </a>
          </Link>
        </div>
      </div>
    );
  };

  const emailSubscription = () => {
    return (
      <div className={styles.email__subscription}>
        <form onSubmit={handleSubscribe}>
          <InputField
            type="text"
            id="email"
            name="email"
            value={email}
            placeholder="Enter email address"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" label="I am in" />
        </form>
      </div>
    );
  };

  const policiesAndTerms = () => {
    return (
      <>
        <p>All rights reserved &copy; 2022 | Sajilo Jiwan</p>
        <div className={styles.policy__and__terms}>
          <Link href="/privacy-policies">
            <a>Privacy Policy</a>
          </Link>{" "}
          | {""}
          <Link href="/terms-and-conditions">
            <a>Terms & Conditions</a>
          </Link>
        </div>
      </>
    );
  };

  const footerLogo = () => {
    return (
      <Image
        src="/images/footer-images/footer-logo-white.svg"
        alt="Sahaj Nepal"
        layout="fill"
        objectFit="contain"
      />
    );
  };

  const downloadApp = () => {
    return (
      <>
        <div className={styles.footer__logo}>{footerLogo()}</div>
        <div className={styles.responsive__emailSubscription}>
          <h1>Join us in our journey</h1>
          {emailSubscription()}
        </div>
        {footerData.androidAppRedirectLink !== "" ||
          (footerData.iosAppRedirectLink !== "" && (
            <div className={styles.footer__header__and__app}>
              <h1>Get our app:</h1>
              <div className={styles.footer__download__app}>
                <div className={styles.download__from__playstore}>
                  <Link href={footerData.androidAppRedirectLink}>
                    <a>
                      <Image
                        src="/images/footer-images/playstore.png"
                        alt="PlayStore App"
                        layout="fill"
                        objectFit="contain"
                      />
                    </a>
                  </Link>
                </div>
                <div className={styles.download__from__appstore}>
                  <Link href={footerData.iosAppRedirectLink}>
                    <a>
                      <Image
                        src="/images/footer-images/appstore.png"
                        alt="PlayStore App"
                        layout="fill"
                        objectFit="contain"
                      />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </>
    );
  };

  return (
    footerData?.isShown && (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.links__and__subscription}>
            <div className={styles.footer__links}>
              <div className={styles.link__header}>
                <div>{featuredServices()}</div>
                <div>{customerServices()}</div>
                <div>{contactUs()}</div>
              </div>
            </div>
            <div className={styles.follow__links__container}>
              {followUs()}
              {emailSubscription()}
            </div>
            <div className={styles.rights__reserved__and__policies__terms}>
              {policiesAndTerms()}
            </div>
          </div>
          <div className={styles.download__app}>{downloadApp()}</div>
          <hr className={styles.responsive__underline} />
        </div>
      </div>
    )
  );
}

export default Footer;
