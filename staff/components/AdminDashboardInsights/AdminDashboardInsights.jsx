import React from "react";
import Image from "next/image";
import styles from "./admindashboardinsights.module.css";

import { useSelector } from "react-redux";

function AdminDashboardInsights() {
  const dashboardData =
    useSelector((state) => state.adminReducer?.dashboard?.dataBar) || "";

  return (
    <div className={styles.content__insights}>
      <div className={styles.booking__record}>
        <div className={styles.icon}>
          <Image
            src="/images/admin/bi_calendar-date.png"
            alt="calender"
            layout="fill"
            objectFit="content"
          />
        </div>
        <div className={styles.number}>{dashboardData?.bookingCount}</div>
        <div className={styles.title}>New Bookings</div>
      </div>

      <div className={styles.reviews}>
        <div className={styles.icon}>
          <Image
            src="/images/admin/baseline-rate-review.png"
            alt="calender"
            layout="fill"
            objectFit="content"
          />
        </div>
        <div className={styles.number}>{dashboardData?.reviewsCount}</div>
        <div className={styles.title}>Reviews</div>
      </div>
    </div>
  );
}

export default React.memo(AdminDashboardInsights);
