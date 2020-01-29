import Axios from 'axios';

const stripe = Stripe('pk_test_z5bW0bOSPHbpmV4u2MU2qOt2005QNOLvfP');

export const bookTour = async tourId => {
  try {
    // 1) get the checkout session from API
    const session = await Axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);
    // 2) create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
  }
};
