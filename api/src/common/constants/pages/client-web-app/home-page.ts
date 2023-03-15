import { ServiceEnum } from 'common/constants/enum-constant';

export const homePageData = {
  navBarRow: {
    isShown: true,
  },
  mainRow: {
    isShown: true,
    mainTitle: 'Get your daily tasks done by professionals. Just a tap away',
    subText: 'Book whatever service you need here.',
    mainImage:
      'https://sahaj-nepal.s3.us-east-2.amazonaws.com/public/common/website-asset/mainRow/4hero-image.png',
  },

  benefitsRow: {
    isShown: true,
    benefits: [
      [
        {
          icon: 'https://sahaj-nepal.s3.us-east-2.amazonaws.com/public/common/website-asset/benefits/shop.svg',
          heading: 'One stop solution',
          paragraphText:
            'Any household problem you have, we probably have a solution for you. Get in touch with us and make your life truely "Sahaj"',
        },
        {
          icon: 'https://sahaj-nepal.s3.us-east-2.amazonaws.com/public/common/website-asset/benefits/customer service.svg',
          heading: 'Expert solution',
          paragraphText:
            'No one is expert in every field. It is always a good idea to consult the professional in the field. Luckily, we provide you with them.',
        },
        {
          icon: 'https://sahaj-nepal.s3.us-east-2.amazonaws.com/public/common/website-asset/benefits/basket.svg',
          heading: 'Standarized payment',
          paragraphText: `No need to bargain for cheaper price. We have fix rate for the services so that you don't need to worry about prices fluctuation.`,
        },
        {
          icon: 'https://sahaj-nepal.s3.us-east-2.amazonaws.com/public/common/website-asset/benefits/online shop.svg',
          heading: 'Customized service',
          paragraphText:
            'Only pay for the service that you needed. No more, no less.',
        },
      ],
    ],
  },

  registrationPromotionRow: {
    isShown: true,
    heading:
      'Get upto 100% Discount on your first registration or referral !!!',
    subText:
      'Create your account or have someone you know to use our service and get discounts on your first bookings. ',
    benefitsInGreen: [
      'House problem solved',
      'Both you and the referred friend can enjoy discount.',
    ],
  },

  // detailedBookingRow: {
  //   isShown: true,
  //   heading: 'Detailed Booking',
  //   serviceList: [
  //     {
  //       label: 'Electric Work',
  //       value: ServiceEnum.ElectricWork,
  //     },
  //     {
  //       label: 'Plumbing',
  //       value: ServiceEnum.Plumbing,
  //     },
  //     {
  //       label: 'Cooking',
  //       value: ServiceEnum.Cooking,
  //     },
  //     {
  //       label: 'Cleaning',
  //       value: ServiceEnum.Cleaning,
  //     },
  //     {
  //       label: 'BabyCare',
  //       value: ServiceEnum.BabyCare,
  //     },
  //   ],
  // },
  clientTestimonialsRow: {
    isShown: true,
    heading: 'What our clients say',
    testimonials: [
      {
        testimonialTexT:
          'I booked a plumbing service. They arrived and solved the issue. No complaints!',
        personName: 'Sina Gurung',
        personImage:
          'https://sahaj-nepal.s3.us-east-2.amazonaws.com/public/common/website-asset/testimonials/3.png',
        role: 'BBA student',
        company: '',
      },
      {
        testimonialTexT: 'Service chitta bujhyo mailai chai',
        personName: 'Santa Magar',
        personImage:
          'https://sahaj-nepal.s3.us-east-2.amazonaws.com/public/common/website-asset/testimonials/2.png',
        role: 'Software Developer',
        company: 'Connect Bazaar',
      },
      {
        testimonialTexT:
          'was a pleasant experience. They fixed a small electric issues in my house.',
        personName: 'Ram Krishna',
        personImage:
          'https://sahaj-nepal.s3.us-east-2.amazonaws.com/public/common/website-asset/testimonials/1.png',
        role: 'Business Development Manager',
        company: 'ZTA Education Consultants',
      },
    ],
  },

  footer: {
    isShown: true,
    contactUsNumber: '+977 9745315017',
    contactUsEmail: 'sahaj.official.contact@gmail.com',

    // contactUsEmail: 'contact@sahajnepal.com',
    whatsAppRedirectLink: 'https://api.whatsapp.com/send?phone=9779745315017',
    viberRedirectLink: 'viber://chat?number=9779745315017',
    instagramRedirectLink: 'https://www.instagram.com/@sahaj.nepal',
    facebookRedirectLink: 'https://www.facebook.com/YoUnGGeNeRaTioNRoCkS',
    twitterRedirectLink: 'https://twitter.com/@sahajnepal',
    androidAppRedirectLink: '',
    iosAppRedirectLink: '',

    // androidAppRedirectLink: 'https://play.google.com/store/apps',
    // iosAppRedirectLink: 'https://apps.apple.com/us/app/',
    // androidAppRedirectLink:
    //   'https://play.google.com/store/apps/details?id=com.kiloo.subwaysurf&hl=en',
    // iosAppRedirectLink:
    //   'https://apps.apple.com/us/app/subway-surfers/id512939461',
  },
};
