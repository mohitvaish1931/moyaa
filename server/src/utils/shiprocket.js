import axios from 'axios';

let shiprocketToken = null;
let tokenExpiry = null;

export const getShiprocketToken = async () => {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    console.error('Shiprocket credentials missing from env variables');
    return null;
  }

  // Check if token is still valid (Shiprocket tokens usually last 24h)
  if (shiprocketToken && tokenExpiry && Date.now() < tokenExpiry) {
    return shiprocketToken;
  }

  try {
    const res = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
      email,
      password
    });

    if (res.data && res.data.token) {
      shiprocketToken = res.data.token;
      // Set expiry to 23 hours from now to be safe
      tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;
      return shiprocketToken;
    }
  } catch (err) {
    console.error('Shiprocket login error:', err.response?.data || err.message);
  }

  return null;
};
