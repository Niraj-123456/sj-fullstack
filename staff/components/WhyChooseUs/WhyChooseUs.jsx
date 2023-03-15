import React from "react";
import Image from "next/image";
import styles from "./whychooseus.module.css";

import { useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

function WhyChooseUs() {
  const benefits = useSelector((state) =>
    state.persistedReducer.homePage?.homeData?.benefitsRow
      ? state.persistedReducer.homePage?.homeData?.benefitsRow?.benefits[0]
      : state.persistedReducer.homePage?.homeData?.benefits
  );

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Benefits</h1>
          <p>Why Choose Us?</p>
        </div>
        <div className={styles.benefits}>
          {benefits?.length > 0 &&
            benefits?.map((benefit, index) => {
              return (
                <div key={index} className={styles.benefit}>
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className={styles.icon__check}
                  />
                  <div className={styles.benefit__image}>
                    <Image
                      src={benefit.icon}
                      alt="benefit 1"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <h1 className={styles.benefit__title}>{benefit.heading}</h1>
                  <p className={styles.benefit__description}>
                    {benefit.paragraphText}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default WhyChooseUs;
