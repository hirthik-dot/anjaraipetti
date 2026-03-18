import { initializeApp, getApps } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

// Setup invisible recaptcha
export const setupRecaptcha = (elementId: string): RecaptchaVerifier => {
    const verifier = new RecaptchaVerifier(auth, elementId, {
        size: 'invisible',
        callback: () => {
            // reCAPTCHA solved
        },
    });
    return verifier;
};

// Send OTP
export const sendOTP = async (
    phoneNumber: string,
    recaptchaVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> => {
    const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
    return confirmationResult;
};

// Verify OTP and get token
export const verifyOTP = async (
    confirmationResult: ConfirmationResult,
    otp: string
): Promise<string> => {
    const result = await confirmationResult.confirm(otp);
    const idToken = await result.user.getIdToken();
    return idToken;
};
