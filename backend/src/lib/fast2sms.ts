import axios from 'axios';
import { saveOTP } from './otpCache';

const generateOTP = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const sendOTP = async (
  phone: string
): Promise<{ success: boolean; otp: string }> => {
  const otp = generateOTP();
  try {
    const response = await axios.post(
      'https://www.fast2sms.com/dev/bulkV2',
      {
        route: 'otp',
        variables_values: otp,
        numbers: phone,
        flash: 0,
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY!,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.return === true) {
      saveOTP(phone, otp);
      return { success: true, otp };
    }

    console.error('Fast2SMS error response:', response.data);
    return { success: false, otp: '' };
  } catch (error) {
    console.error('Fast2SMS send error:', error);
    return { success: false, otp: '' };
  }
};
