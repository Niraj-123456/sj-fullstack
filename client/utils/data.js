const heroRow = {
  mainImage: "/images/hero-image.png",
  mainTitle: "Get your daily tasks done by professionals. Just a tap away",
  subText: "Book whatever service you need here.",
};

const benefits = [
  {
    icon: "/images/benefits/shop.svg",
    heading: "One stop solution",
    paragraphText:
      'Any household problem you have, we probably have a solution for you. Get in touch with us and make your life truely "Sahaj"',
  },
  {
    icon: "/images/benefits/customer-service.svg",
    heading: "Expert solution",
    paragraphText:
      "No one is expert in every field. It is always a good idea to consult the professional in the field. Luckily, we provide you with them.",
  },
  {
    icon: "/images/benefits/basket.svg",
    heading: "Standarized payment",
    paragraphText: `No need to bargain for cheaper price. We have fix rate for the services so that you don't need to worry about prices fluctuation.`,
  },
  {
    icon: "/images/benefits/online-shop.svg",
    heading: "Customized service",
    paragraphText:
      "Only pay for the service that you needed. No more, no less.",
  },
];

const testimonials = [
  {
    _id: 1,
    personName: "Sina Gurung",
    role: "BBA student",
    company: "",
    personImage: "/images/testimonials/client_3.png",
    testimonialTexT:
      "I booked a plumbing service. They arrived and solved the issue. No complaints!",
  },
  {
    _id: 2,
    personName: "Santa Magar",
    role: "Software Developer",
    company: "Connect Bazaar",
    personImage: "/images/testimonials/client_2.png",
    testimonialTexT: "Service chitta bujhyo mailai chai",
  },
  {
    _id: 3,
    personName: "Ram Krishna",
    role: "Business Development Manager",
    company: "ZTA Education Consultants",
    personImage: "/images/testimonials/client_1.png",
    testimonialTexT:
      "was a pleasant experience. They fixed a small electric issues in my house.",
  },
];

const registrationPromotion = {
  benefitsInGreen: [
    "House problem solved",
    "Both you and the referred friend can enjoy discount.",
  ],
  heading: "Get upto 100% Discount on your first registration or referral !!!",
  subText:
    "Create your account or have someone you know to use our service and get discounts on your first bookings.",
};

const detailedBooking = {
  heading: "Detailed Booking",
  serviceList: [
    { id: "1", label: "Electric Work", name: "ElectricWork" },
    { id: "2", label: "Plumbing", name: "Plumbing" },
    { id: "3", label: "Cleaning", name: "Cleaning" },
    { id: "4", label: "BabyCare", name: "BabyCare" },
  ],
};

const footer = {
  isShown: true,
  androidAppRedirectLink: "",
  contactUsEmail: "sahaj.official.contact@gmail.com",
  contactUsNumber: "+977 9745315017",
  facebookRedirectLink: "https://www.facebook.com/YoUnGGeNeRaTioNRoCkS",
  instagramRedirectLink: "https://www.instagram.com/@sahaj.nepal",
  iosAppRedirectLink: "",
  twitterRedirectLink: "https://twitter.com/#",
  viberRedirectLink: "viber://chat?number=9779745315017",
  whatsAppRedirectLink: "https://api.whatsapp.com/send?phone=9779745315017",
};

export const dummyData = {
  heroRow,
  benefits,
  registrationPromotion,
  detailedBooking,
  testimonials,
  footer,
};
