export enum NepalProvinceEnum {
  ONE = 'Province No. 1',
  TWO = 'Province No. 2',
  THREE = 'Bagmati',
  FOUR = 'Gandaki',
  FIVE = 'Lumbini',
  SIX = 'Karnali',
  SEVEN = 'SudurPaschim',
}

export enum NepalDistrictEnum {
  Bhojpur = 'Bhojpur',
  Dhankuta = 'Dhankuta',
  Ilam = 'Ilam',
  Jhapa = 'Jhapa',
  Khotang = 'Khotang',
  Morang = 'Morang',
  Okhaldhunga = 'Okhaldhunga',
  Panchthar = 'Panchthar',
  Sankhuwasabha = 'Sankhuwasabha',
  Solukhumbu = 'Solukhumbu',
  Sunsari = 'Sunsari',
  Taplejung = 'Taplejung',
  Terhathum = 'Terhathum',
  Udayapur = 'Udayapur',
  Saptari = 'Saptari',
  Parsa = 'Parsa',
  Sarlahi = 'Sarlahi',
  Bara = 'Bara',
  Siraha = 'Siraha',
  Dhanusha = 'Dhanusha',
  Rautahat = 'Rautahat',
  Mahottari = 'Mahottari',
  Sindhuli = 'Sindhuli',
  Ramechhap = 'Ramechhap',
  Dolakha = 'Dolakha',
  Bhaktapur = 'Bhaktapur',
  Dhading = 'Dhading',
  Kathmandu = 'Kathmandu',
  Kavrepalanchok = 'Kavrepalanchok',
  Lalitpur = 'Lalitpur',
  Nuwakot = 'Nuwakot',
  Rasuwa = 'Rasuwa',
  Sindhupalchok = 'Sindhupalchok',
  Chitwan = 'Chitwan',
  Makwanpur = 'Makwanpur',
  Baglung = 'Baglung',
  Gorkha = 'Gorkha',
  Kaski = 'Kaski',
  Lamjung = 'Lamjung',
  Manang = 'Manang',
  Mustang = 'Mustang',
  Myagdi = 'Myagdi',
  Nawalpur = 'Nawalpur',
  Parbat = 'Parbat',
  Syangja = 'Syangja',
  Tanahun = 'Tanahun',
  Kapilvastu = 'Kapilvastu',
  Parasi = 'Parasi',
  Rupandehi = 'Rupandehi',
  Arghakhanchi = 'Arghakhanchi',
  Gulmi = 'Gulmi',
  Palpa = 'Palpa',
  Dang = 'Dang',
  Pyuthan = 'Pyuthan',
  Rolpa = 'Rolpa',
  EasternRukum = 'Eastern Rukum',
  Banke = 'Banke',
  Bardiya = 'Bardiya',
  WesternRukum = 'Western Rukum',
  Salyan = 'Salyan',
  Dolpa = 'Dolpa',
  Humla = 'Humla',
  Jumla = 'Jumla',
  Kalikot = 'Kalikot',
  Mugu = 'Mugu',
  Surkhet = 'Surkhet',
  Dailekh = 'Dailekh',
  Jajarkot = 'Jajarkot',
  Kailali = 'Kailali',
  Achham = 'Achham',
  Doti = 'Doti',
  Bajhang = 'Bajhang',
  Bajura = 'Bajura',
  Kanchanpur = 'Kanchanpur',
  Dadeldhura = 'Dadeldhura',
  Baitadi = 'Baitadi',
  Darchula = 'Darchula',
}

// ////////////////////// File /////////////////////////////////
export enum FileTypeEnum {
  EMPTY = '',
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
  MEDIA = 'media',
}

export const AllowedTypes = {
  image: ['jpg', 'jpeg', 'png'],
  video: ['mp4'],
  document: ['jpg', 'jpeg', 'png', 'pdf', 'docx'],
  media: ['jpg', 'jpeg', 'png', 'mp4'],
};

export const AllowedMimes = {
  image: ['image/jpg', 'image/jpeg', 'image/png'],
  video: ['video/mp4'],
  document: [
    'image/jpg',
    'image/jpeg',
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  media: ['image/jpg', 'image/jpeg', 'image/png', 'video/mp4'],
};

////////////////////// Role /////////////////////////////////
export enum RoleTypeEnum {
  // Default roles from company side
  // SUPERADMIN = 'SUPERADMIN',
  DEFAULTADMIN = 'DEFAULTADMIN',
  DEFAULTSTAFF = 'DEFAULTSTAFF',
  DEFAULTSERVICEPROVIDER = 'DEFAULTSERVICEPROVIDER',
  // Default role from consumer side
  DEFAULTCLIENT = 'DEFAULTCLIENT',

  // Varied RoleWithVeriedPermission
  CUSTOMIZEDADMIN = 'CUSTOMIZEDADMIN',
  CUSTOMIZEDSTAFF = 'CUSTOMIZEDSTAFF',
  CUSTOMIZEDSERVICEPROVIDER = 'CUSTOMIZEDSERVICEPROVIDER',
  // Varied role from consumer side
  CUSTOMIZEDCLIENT = 'CUSTOMIZEDCLIENT',
}

export enum SearchableRolesEnum {
  // These are used by client services while calling for user
  // These roles are simply umbrella term .. eg. STAFF will mean the consumer will get both DefaultClient and CustomizedClient
  STAFF = 'Staff',
  SERVICEPROVIDER = 'ServiceProvider',
  CLIENT = 'Client',
}

export enum AllPermissionsEnum {
  // Role Permissions
  CreateRole = 'CreateRole',
  ViewRole = 'ViewRole',
  UpdateRole = 'UpdateRole',
  DeleteRole = 'DeleteRole',

  //Permission Permissions
  CreatePermission = 'CreatePermission',
  ViewPermission = 'ViewPermission',
  UpdatePermission = 'UpdatePermission',
  DeletePermission = 'DeletePermission',

  //Booking Permissions
  CreateBooking = 'CreateBooking',
  ViewBooking = 'ViewBooking',
  UpdateBooking = 'UpdateBooking',
  DeleteBooking = 'DeleteBooking',

  //AllUsers = Customer,Client and Staff Permission
  CreateUser = 'CreateUser',
  ViewUser = 'ViewUser',
  UpdateUser = 'UpdateUser',
  DeleteUser = 'DeleteUser',

  //Staff Permission
  CreateStaff = 'CreateStaff',
  ViewStaff = 'ViewStaff',
  UpdateStaff = 'UpdateStaff',
  DeleteStaff = 'DeleteStaff',

  //ServiceProvider Permission
  CreateServiceProvider = 'CreateServiceProvider',
  ViewServiceProvider = 'ViewServiceProvider',
  UpdateServiceProvider = 'UpdateServiceProvider',
  DeleteServiceProvider = 'DeleteServiceProvider',

  //Customer Permissions
  CreateCustomer = 'CreateCustomer',
  ViewCustomer = 'ViewCustomer',
  UpdateCustomer = 'UpdateCustomer',
  DeleteCustomer = 'DeleteCustomer',

  //Discount Permission
  CreateDiscount = 'CreateDiscount',
  ViewDiscount = 'ViewDiscount',
  UpdateDiscount = 'UpdateDiscount',
  DeleteDiscount = 'DeleteDiscount',

  //CustomerInteraction Permission
  CreateCustomerInteraction = 'CreateCustomerInteraction',
  ViewCustomerInteraction = 'ViewCustomerInteraction',
  UpdateCustomerInteraction = 'UpdateCustomerInteraction',
  DeleteCustomerInteraction = 'DeleteCustomerInteraction',

  //Service Permission
  CreateService = 'CreateService',
  ViewService = 'ViewService',
  UpdateService = 'UpdateService',
  DeleteService = 'DeleteService',

  //SubService Permission
  CreateSubService = 'CreateSubService',
  ViewSubService = 'ViewSubService',
  UpdateSubService = 'UpdateSubService',
  DeleteSubService = 'DeleteSubService',

  //UserToken Permission
  CreateUserToken = 'CreateUserToken',
  ViewUserToken = 'ViewUserToken',
  UpdateUserToken = 'UpdateUserToken',
  DeleteUserToken = 'DeleteUserToken',

  //BookingReview Permission
  CreateBookingReview = 'CreateBookingReview',
  ViewBookingReview = 'ViewBookingReview',
  UpdateBookingReview = 'UpdateBookingReview',
  DeleteBookingReview = 'DeleteBookingReview',
}
export const DefaultStaffPermissions = [
  AllPermissionsEnum.CreateBooking,
  AllPermissionsEnum.ViewBooking,
  AllPermissionsEnum.UpdateBooking,

  // User
  AllPermissionsEnum.ViewUser,

  // Reviews and rating
  AllPermissionsEnum.CreateBookingReview,
  AllPermissionsEnum.ViewBookingReview,
];

export const DefaultServiceProviderPermissions = [
  AllPermissionsEnum.ViewBooking,
];

// ////////////////////// User /////////////////////////////////
export enum UserTypeEnum {
  UNREGISTERED = 'UNREGISTERED', //people whose phone number we have but they have not verified anything from their end
  REGISTERED = 'REGISTERED', // when they have submitted otp to verify their phone number
  // VERIFIED = 'VERIFIED', // when customer or business submitted their identification document
  // PREMIUM = 'PREMIUM', // when customer or business pay our system
}

export enum UserGenderTypeEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  NOTSET = 'NOTSET',
}

// ////////////////////// Search /////////////////////////////////
// export enum SearchTypeEnum {
//   ProductSearch = 'ProductSearch',
//   BusinessSearch = 'BusinessSearch',
//   ProductSearchByFilter = 'ProductSearchByFilter', // generally done from ProductFeed page
//   ProductSaleSearch = 'ProductSaleSearch', // generally done from Home page

//   // GeneralSearch = 'GeneralSearch',
// }

// export enum SearcherEntityEnum {
//   User = 'User',
//   // Business = 'Business',
//   Anonymous = 'Anonymous',
// }

export enum BookingFilterTypeCriteriaEnum {
  // While filtering via these criteria, it is also possible to sort by date
  // These criteria are applicable only from staff side

  ByName = 'ByName',
  ByPhoneNumber = 'ByPhoneNumber',
  ByDate = 'ByDate',
  ByStatus = 'ByStatus',
}

export enum BookingSortCriteriaEnum {
  ByDate = 'ByDate',
}

export enum SearchSortValueEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum ClientSideBookingsFilterTypeCriteriaEnum {
  // These criteria are applicable only from client side
  ByDate = 'ByDate',
  ByStatus = 'ByStatus',
}

export enum ClientSideBookingsDivisionEnum {
  // While filtering via these criteria, it is also possible to sort by date
  Upcoming = 'Upcoming',
  Past = 'Past',
}

export enum UserSearchCriteriaEnum {
  ByName = 'ByName',
  ByPhoneNumber = 'ByPhoneNumber',
}

export enum BookingReviewFilterTypeCriteriaEnum {
  // While filtering via these criteria, it is also possible to sort by date
  // These criteria are applicable only from staff side

  ByBookingId = 'ByBookingId',
  ByEmployeePhoneNumber = 'ByEmployeePhoneNumber',
  ByDate = 'ByDate',
}

export enum BookingReviewSortCriteriaEnum {
  ByDate = 'ByDate',
}

////////////////////// Discount /////////////////////////////////
export enum ClientDiscountSortCriteriaEnum {
  ByDate = 'ByDate',
}

////////////////////// View /////////////////////////////////
export enum FilteredClientSourceTypeEnum {
  ANDROID_BROWSER = 'ANDROID_BROWSER',
  IOS_BROWSER = 'IOS_BROWSER',
  PC_BROWSER = 'PC_BROWSER',
  ANDROID_APP = 'ANDROID_APP',
  IOS_APP = 'IOS_APP',
}
//same as above but in list form
export const FilteredClientSourceTypeEnumList = [
  'ANDROID_BROWSER',
  'IOS_BROWSER',
  'PC_BROWSER',
  'ANDROID_APP',
  'IOS_APP',
];

export enum FilteredSourceTypeWithAnonymityEnum {
  AnonymousWithoutSource = 'AnonymousWithoutSource',
  AnonymousFromPcBrowser = 'AnonymousFromPcBrowser',
  AnonymousFromAndroidBrowser = 'AnonymousFromAndroidBrowser',
  AnonymousFromAndroidApp = 'AnonymousFromAndroidApp',
  AnonymousFromIOSBrowser = 'AnonymousFromIOSBrowser',
  AnonymousFromIosApp = 'AnonymousFromIosApp',

  UserWithoutSource = 'UserWithoutSource',
  UserFromPcBrowser = 'UserFromPcBrowser',
  UserFromAndroidBrowser = 'UserFromAndroidBrowser',
  UserFromAndroidApp = 'UserFromAndroidApp',
  UserFromIosApp = 'UserFromIosApp',
  UserFromIOSBrowser = 'UserFromIOSBrowser',

  Undefined = 'Undefined',
}

// export enum TrackCheckingTypeEnum {
//   // ANONYMOUS_TO_BUSINESS = 'ANONYMOUS_TO_BUSINESS',// but we might want to restrict the location and phone number of the business
//   // REGISTERED_TO_BUSINESS = 'ANONYMOUS_TO_BUSINESS', // but we might want to restrict the location and phone number of the business

//   ANONYMOUS_TO_PRODUCT = 'ANONYMOUS_TO_PRODUCT',
//   REGISTERED_TO_PRODUCT = 'REGISTERED_TO_PRODUCT',
// }

// ////////////////////// BookingSourceFormEnum /////////////////////////////////

export enum BookingSourceFormEnum {
  WebAppPhoneNumberOnlyUserForm = 'WebAppPhoneNumberOnlyUserForm',
  WebAppInitialUserForm = 'WebAppInitialUserForm',
  WebAppLoggedInUserForm = 'WebAppLoggedInUserForm',
  WebAppLoggedInStaffForm = 'WebAppLoggedInStaffForm',

  Undefined = 'Undefined',
}

export enum BookingStatusEnum {
  //the staff should be able to move it by clicking next like in carousel
  Submitted = 'Submitted',
  InReview = 'InReview',
  Confirmed = 'Confirmed',
  InProgress = 'InProgress',
  Declined = 'Declined',
  Completed = 'Completed',
  ReOpened = 'ReOpened',
}

export enum BookingStatusEnumWhileSearching {
  //the staff should be able to move it by clicking next like in carousel
  All = 'All',
  Submitted = 'Submitted',
  InReview = 'InReview',
  Confirmed = 'Confirmed',
  InProgress = 'InProgress',
  Declined = 'Declined',
  Completed = 'Completed',
  ReOpened = 'ReOpened',
}

export enum BookingStatusColorEnumWhileSearching {
  Submitted = '2599F9', //blue
  InReview = 'F58634', //orange
  Confirmed = 'D1FAE5', // light green
  InProgress = 'FACC15', //yellow
  Declined = '333333', //black
  Completed = '34D399', //green
  ReOpened = '64748B', // grey
}

export enum BookingTypeByInitiatorEnum {
  BookedByCustomerForSelf = 'BookedByCustomerForSelf',
  BookedByCustomerForOthers = 'BookedByCustomerForOthers',
  BookedByStaffForCustomer = 'BookedByStaffForCustomer',
  BookedByAnonymous = 'BookedByAnonymous',
}

// ////////////////////// Booking Discount Enum /////////////////////////////////
export enum DiscountTypeEnum {
  //the staff should be able to move it by clicking next like in carousel
  DiscountAfterReferringOthers = 'DiscountAfterReferringOthers',
  DiscountAfterBeingReferredByOther = 'DiscountAfterBeingReferredByOther',
  DiscountAfterVoucherCode = 'DiscountAfterVoucherCode',
  DiscountAfterAffiliateFunnel = 'DiscountAfterAffiliateFunnel',
  NoDiscount = 'NoDiscount',
}

// ////////////////////// Service Enum /////////////////////////////////
export enum ServiceEnum {
  //Total options will be limited initially
  // If you add or remove other Service please make sure the services are added or removed from  ServiceWithImage as Seeding is based on it

  // ElectricWork = 'ElectricWork',
  // Plumbing = 'Plumbing',
  // Cleaning = 'Cleaning',
  // Cooking = 'Cooking',
  // BabyCare = 'BabyCare',
  // DirectDelivery = 'DirectDelivery',
  // Grooming = 'Grooming',
  // PestControl = 'PestControl',
  // PackersAndMovers = 'PackersAndMovers',

  ElectricWork = 'ElectricWork',
  Plumbing = 'Plumbing',
  Cleaning = 'Cleaning',
  Cooking = 'Cooking',
  BabyCare = 'BabyCare',
}

export var ServiceWithNameLabelImageUrl = [
  {
    name: 'ElectricWork',
    label: 'ElectricWork',
    imageUrl:
      'https://sahaj-nepal.s3.us-east-2.amazonaws.com/public/dev/images/service-images/2022-7-10-13-41-Screenshot+from+2022-07-01+10-49-22.png',
  },
  {
    name: 'Plumbing',
    label: 'Plumbing',
    imageUrl:
      'https://sahaj-nepal.s3.us-east-2.amazonaws.com/public/dev/images/service-images/2022-7-10-13-41-Screenshot+from+2022-07-01+10-49-22.png',
  },
  {
    name: 'Cleaning',
    label: 'Cleaning',
    imageUrl:
      'https://sahaj-nepal.s3.us-east-2.amazonaws.com/public/dev/images/service-images/2022-7-10-13-41-Screenshot+from+2022-07-01+10-49-22.png',
  },
  {
    name: 'Cooking',
    label: 'Cooking',
    imageUrl:
      'https://sahaj-nepal.s3.us-east-2.amazonaws.com/public/dev/images/service-images/2022-7-10-13-41-Screenshot+from+2022-07-01+10-49-22.png',
  },
  {
    name: 'BabyCare',
    label: 'BabyCare',
    imageUrl:
      'https://sahaj-nepal.s3.us-east-2.amazonaws.com/public/dev/images/service-images/2022-7-10-13-41-Screenshot+from+2022-07-01+10-49-22.png',
  },
];

export enum SubServiceEnum {
  //the staff should be able to move it by clicking next like in carousel

  FanRelated = 'FanRelated',
  LigthsRelated = 'LigthsRelated',
  PowerSupply = 'PowerSupply',
  NewEquipmentInstallation = 'NewEquipmentInstallation',
  MinorElectricWorks = 'MinorElectricWorks',
  OthersInElectricWork = 'Others',

  WaterSupply = 'WaterSupply',
  BasinRelated = 'BasinRelated',
  ToiletRelated = 'ToiletRelated',
  WashingMachineRelated = 'WashingMachineRelated',
  NewEquipmentAddition = 'NewEquipmentAddition',
  WaterDrainage = 'WaterDrainage',
  OthersInPlumbing = 'OthersInPlumbing',

  HouseCleaning = 'HouseCleaning',
  DishWashing = 'DishWashing',
  WashingClothes = 'WashingClothes',
  OthersInCleaning = 'OthersInCleaning',

  MorningNasta = 'MorningNasta',
  MorningKhana = 'MorningKhana',
  Khaja = 'Khaja',
  Dinner = 'Dinner',
  OccasionalEvents = 'OccasionalEvents',
  OccasionalGuests = 'OccasionalGuests',
  OthersInCooking = 'OthersInCooking',

  HairCuts = 'HairCuts',
  FaceTreatments = 'FaceTreatments',
  MakeupLooks = 'MakeupLooks',
  SkinCareAndMaintenance = 'SkinCareAndMaintenance',
  OthersInGrooming = 'OthersInGrooming',

  BabyOilMassage = 'BabyOilMassage',
  BabyBathing = 'BabyBathing',
  BabySitting = 'BabySitting',
  OthersInBabySitting = 'OthersInBabySitting',
}

// ////////////////////// Discount Enum /////////////////////////////////
export enum DiscountReceivedNatureEnum {
  Referrer = 'Referrer', // discount type registered for a referrer
  Referee = 'Referee', // discount type registered for a referree
  Coupon = 'Coupon', // discount type registered when a public coupon is used
}

export enum DiscountOfferingTypeEnum {
  Flat = 'Flat', // when discount is a fixed amount, eg Rs 100
  Percentage = 'Percentage', // when discount amount is the percentage of the service , eg 10% of the service order
}

export enum DiscountExpirationTypeEnum {
  TimePeriod = 'TimePeriod', // for these discount types, we will only consider the starting and expiry time period before providing the discount
  ResuableCount = 'ResuableCount', // for these discount types, we will check if the reusuableCountLeft has exhausted or not before providing the discount
  BothTimeAndCount = 'BothTimeAndCount', // for these discounts, we will check for both the time period and used count remaining, if one fails then the discount is not provided
}

export enum DiscountUserAssociationTypeEnum {
  SingleUserAssociation = 'SingleUserAssociation', // these discount only belong to only one user // eg for one successful referal, there are two SingleUserAssociations one on referal side and another in referee side
  MultipleUsersAssociation = 'MultipleUsersAssociation', // these discount belong to many users ... thus is not any associated user id column // eg one coupon discount can be associated with multiple users
}

export enum DiscountStatusEnum {
  CREATED = 'CREATED',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  STOPPED = 'STOPPED',
  DELETED = 'DELETED',
}

////////////////////// CustomerInteractionTypeEnum /////////////////////////////////
export enum CustomerInteractionTypeEnum {
  RequestNewServiceWhileBooking = 'RequestNewServiceWhileBooking',
  Suggestion = 'Suggestion',
  Complaint = 'Complaint',
}

export enum CustomerInteractionStatusEnum {
  Submitted = 'Submitted',
  Viewed = 'Viewed',
  InProgress = 'InProgress',
  Declined = 'Declined',
  Accepted = 'Accepted',
  ModificationAccepted = 'ModificationAccepted',
  ReOpened = 'ReOpened',
}
