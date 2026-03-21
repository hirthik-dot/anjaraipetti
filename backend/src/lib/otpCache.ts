import NodeCache from 'node-cache';

const otpCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

export const saveOTP = (phone: string, otp: string): void => {
  otpCache.set(phone, otp);
};

export const getOTP = (phone: string): string | undefined => {
  return otpCache.get<string>(phone);
};

export const deleteOTP = (phone: string): void => {
  otpCache.del(phone);
};

export const hasOTP = (phone: string): boolean => {
  return otpCache.has(phone);
};
