import React from "react";
import Image from "next/image";
import styles from "./testimonialcard.module.css";

function TestimonialCard({ testimonial }) {
  return (
    <div className={styles.testimonial__card}>
      <div className={styles.testimonial__icon}>
        <div className={styles.quote}>
          <Image
            src="/images/quote.svg"
            alt="quote"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
      <div className={styles.testimonial__content}>
        {testimonial.testimonialTexT}
      </div>
      <div className={styles.customer__testimonial}>
        <div className={styles.customer__image}>
          <Image
            src={testimonial.personImage}
            alt="testimonial-1"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className={styles.customer__detail}>
          <p className={styles.customer__name}>{testimonial.personName}</p>
          <p className={styles.customer__position}>
            {testimonial.role}
            <br />
            {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;
