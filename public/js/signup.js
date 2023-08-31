/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const url = '/api/v1/users/signup';
    const response = await axios.post(
      url,
      { name, email, password, passwordConfirm },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.status === 'success') {
      showAlert('success', 'Signup successful');
      window.setTimeout(() => {
        location.assign('/'); // Redirect to the home page after signup
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
