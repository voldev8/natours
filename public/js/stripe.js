import Axios from 'axios';

const stripe = Stripe('pk_test_z5bW0bOSPHbpmV4u2MU2qOt2005QNOLvfP');

export const bookTour = async tourId => {
  try {
    // 1) get the checkout session from API
    const session = await Axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // 2) create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
  }
};
