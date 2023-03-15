import React, { useState, useEffect } from "react";
import styles from "./testimonial.module.css";

import { useSelector } from "react-redux";

import TestimonialCard from "../Common/TestimonialCard/TestimonialCard";

function Testimonial() {
  const testimonials = useSelector((state) =>
    state.persistedReducer.homePage?.homeData?.clientTestimonialsRow
      ? state.persistedReducer.homePage?.homeData?.clientTestimonialsRow
          ?.testimonials
      : state.persistedReducer.homePage?.homeData?.testimonials
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleTestimonialChange = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < testimonials?.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (currentIndex === testimonials?.length - 1) {
        setCurrentIndex(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, testimonials?.length]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.testimonial__container}>
          <div className={styles.testimonial__header}>
            <h1>What our clients say</h1>
          </div>
          <div className={styles.testimonials}>
            {testimonials && testimonials?.length > 0
              ? testimonials?.map(
                  (testimonial, index) =>
                    currentIndex === index && (
                      <TestimonialCard key={index} testimonial={testimonial} />
                    )
                )
              : ""}
          </div>
        </div>
        <div className={styles.testimonial__bullets}>
          {testimonials?.map((testimonial, index) => (
            <span
              key={index}
              className={currentIndex === index ? styles.active : ""}
              onClick={() => handleTestimonialChange(index)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Testimonial;
