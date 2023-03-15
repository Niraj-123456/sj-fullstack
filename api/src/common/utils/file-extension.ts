import { AllowedTypes } from 'common/constants/enum-constant';
import * as path from 'path';

export function getLocalUTCNow() {
  var now = new Date();
  var time = now.getTime();
  var offset = now.getTimezoneOffset();
  offset = offset * 60000;
  return time - offset;
}

export function getLocalFormatedDate(date) {
  var datestring =
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1) +
    '-' +
    date.getDate() +
    '-' +
    date.getHours() +
    '-' +
    date.getMinutes();
  return datestring;
}

export function getUniqueFileName(fileName: string): string {
  // let currentTimeUTC = new Date();
  // var tzoffset = currentTimeUTC.getTimezoneOffset(); //offset in milliseconds
  // var tzoffsetInMilli = currentTimeUTC.getTimezoneOffset() * 60000; //offset in milliseconds
  // var localISOTime = new Date(Date.now() - tzoffsetInMilli);
  // console.debug('GMT time', new Date());

  return `${getLocalFormatedDate(new Date())}-${fileName}`;
  // return fileName;
}

export function getExtension(fileName: string): string {
  return path.extname(fileName);
  // return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
}

// export const imageTypeFilter = (req, file, callback) => {
//   let ext = path.extname(file.originalname);

//   console.debug('ext', ext);
//   // console.debug("3",ext.substring(3))
//   // console.debug("4",ext.substring(4))

//   //   let isValid = false;
//   //   allowedExtensions.map((eachAllowedExtension) => {
//   //     if (
//   //       //for three word case eg. jpg
//   //       eachAllowedExtension == ext.substring(3) ||
//   //       //for four word case eg. jpeg
//   //       eachAllowedExtension == ext.substring(4)
//   //     ) {
//   //       isValid = true;
//   //     }
//   //   });

//   //   if (!isValid) {
//   if (allowedExtensions.includes(ext)) {
//     req.fileValidationError = 'Invalid file type';
//     return callback(new Error('Invalid file type'), false);
//   }
// };

export const docsFileFilter = (req, file, callback) => {
  let ext = path.extname(file.originalname);

  if (AllowedTypes.document.includes(ext)) {
    req.fileValidationError = 'Invalid file type for docs';
    return callback(new Error('Invalid file type for docs'), false);
  }
  return callback(null, true);
};

export const imageFileFilter = (req, file, callback) => {
  let ext = path.extname(file.originalname);

  if (AllowedTypes.image.includes(ext)) {
    req.fileValidationError = 'Invalid file type for docs';
    return callback(new Error('Invalid file type for docs'), false);
  }
  return callback(null, true);
};

//combination of image and video (for scenarios like story where both media types are required)
export const mediaFileFilter = (req, file, callback) => {
  let ext = path.extname(file.originalname);

  if (AllowedTypes.media.includes(ext)) {
    req.fileValidationError = 'Invalid file type for media';
    return callback(new Error('Invalid file type for media'), false);
  }
  return callback(null, true);
};
