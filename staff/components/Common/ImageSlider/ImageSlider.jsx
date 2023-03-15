import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./imageslider.module.css";

function ImageSlider() {
  const sliderImages = [
    { imageLink: "/images/booking-image.png", index: 0 },
    { imageLink: "/images/hero-image.png", index: 1 },
    { imageLink: "/images/women.png", index: 2 },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSliderImageChange = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < sliderImages.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (currentIndex === sliderImages.length - 1) {
        setCurrentIndex(0);
        return;
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, sliderImages.length]);

  return (
    <div className={styles.container}>
      <div className={styles.slider__images}>
        {sliderImages.map(
          (sliderImage) =>
            currentIndex === sliderImage.index && (
              <Image
                key={sliderImage.index}
                src={sliderImage.imageLink}
                alt="booking"
                layout="fill"
                objectFit="cover"
              />
            )
        )}
      </div>

      <div className={styles.slider__bullets}>
        {sliderImages.map((sliderImage) => (
          <span
            key={sliderImage.index}
            className={currentIndex === sliderImage.index ? styles.active : ""}
            onClick={() => handleSliderImageChange(sliderImage.index)}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default ImageSlider;
