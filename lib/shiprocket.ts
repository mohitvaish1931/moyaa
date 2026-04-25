import axios from 'axios';

let shiprocketToken: string | null = null;
let tokenExpiry: number | null = null;

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
      tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;
      return shiprocketToken;
    }
  } catch (err: any) {
    console.error('Shiprocket login error:', err.response?.data || err.message);
  }

  return null;
};

export const createShiprocketOrder = async (order: any, userEmail?: string) => {
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
      order_items: order.items.map((item: any) => ({
        name: item.name,
        sku: String(item.product?._id || item.product?.id || 'sku-unknown'),
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

    const res = await axios.post('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', shiprocketOrderData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return res.data;
  } catch (err: any) {
    console.error('Shiprocket Order Creation Error:', err.response?.data || err.message);
    throw err;
  }
};

export const trackShipment = async (shipmentId: string) => {
  try {
    const token = await getShiprocketToken();
    if (!token) throw new Error('Shiprocket authentication failed');

    const res = await axios.get(`https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${shipmentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return res.data;
  } catch (err: any) {
    console.error('Shiprocket Tracking Error:', err.response?.data || err.message);
    return null;
  }
};
