import { v4 as uuid } from 'uuid';

export const generateUUID = () => {
  try {
    return uuid();
  } catch (error) {
    throw error;
  }
};
