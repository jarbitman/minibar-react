export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const SET_DELIVERY_DATE = 'SET_DELIVERY_DATE';
export const GET_DELIVERY_DATE = 'GET_DELIVERY_DATE';
export const SET_LOGIN_OBJECT = 'SET_LOGIN_OBJECT';
export const SET_LOCATIONS = 'SET_LOCATIONS';

export const addToCart = (item) => {
  return { type: ADD_TO_CART, item };
};

export const removeFromCart = (id) => {
  return { type: REMOVE_FROM_CART, id };
};

export const setDeliveryDate = (info) => {
  return { type: SET_DELIVERY_DATE, info };
};

export const getDeliveryDate = (delivery) => {
  return { type: GET_DELIVERY_DATE, delivery };
};

export const setLoginObject = (loggedIn) => {
  return { type: SET_LOGIN_OBJECT, loggedIn };
};

export const setLocations = (locations) => {
  return { type: SET_LOCATIONS, locations };
};
