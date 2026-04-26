import axios from 'axios';

let shiprocketToken = null;
let tokenExpiry = null;

/**
 * Authenticates with Shiprocket and returns a valid token.
 * Reuses token if still valid (24h validity).
 */
export const getShiprocketToken = async () => {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    console.error('Shiprocket credentials missing from env variables');
    return null;
  }

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

/**
 * Creates an order in Shiprocket.
 * @param {Object} order - The Mongoose Order document.
 * @param {String} userEmail - Customer email for Shiprocket billing.
 */
export const createShiprocketOrder = async (order, userEmail) => {
  try {
    const token = await getShiprocketToken();
    if (!token) throw new Error('Shiprocket authentication failed');

    const shiprocketOrderData = {
      order_id: String(order._id),
      order_date: new Date(order.createdAt).toISOString().split('T')[0],
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || "Primary",
      billing_customer_name: order.shippingAddress.name.split(' ')[0],
      billing_last_name: order.shippingAddress.name.split(' ').slice(1).join(' ') || ' ',
      billing_address: order.shippingAddress.address,
      billing_city: order.shippingAddress.city,
      billing_pincode: order.shippingAddress.pincode,
      billing_state: order.shippingAddress.state,
      billing_country: "India",
      billing_email: userEmail || "moraajewels@gmail.com",
      billing_phone: order.shippingAddress.phone,
      shipping_is_billing: true,
      order_items: order.items.map(item => ({
        name: item.name,
        sku: String(item.product?._id || item.product?.id || item.product || 'sku-unknown'),
        units: item.quantity,
        selling_price: item.price
      })),
      payment_method: order.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
      sub_total: order.totalAmount,
      length: 10,
      width: 10,
      height: 10,
      weight: 0.5
    };

    console.log('Sending to Shiprocket:', JSON.stringify(shiprocketOrderData, null, 2));
    const res = await axios.post('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', shiprocketOrderData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return res.data;
  } catch (err) {
    console.error('Shiprocket Order Creation Error:', err.response?.data || err.message);
    throw err;
  }
};

/**
 * Fetches tracking information for a shipment.
 * @param {String} shipmentId - The Shiprocket shipment ID.
 */
export const trackShipment = async (shipmentId) => {
  try {
    const token = await getShiprocketToken();
    if (!token) throw new Error('Shiprocket authentication failed');

    const res = await axios.get(`https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${shipmentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return res.data;
  } catch (err) {
    console.error('Shiprocket Tracking Error:', err.response?.data || err.message);
    return null;
  }
};

/**
 * Cancels a Shiprocket order.
 * @param {String} srOrderId - The Shiprocket order ID (not Mongoose ID).
 */
export const cancelShiprocketOrder = async (srOrderId) => {
  try {
    const token = await getShiprocketToken();
    if (!token) throw new Error('Shiprocket authentication failed');

    const res = await axios.post('https://apiv2.shiprocket.in/v1/external/orders/cancel', {
      ids: [srOrderId]
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return res.data;
  } catch (err) {
    console.error('Shiprocket Cancellation Error:', err.response?.data || err.message);
    return null;
  }
};
