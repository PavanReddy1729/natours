/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const url = 'http://127.0.0.1:3000/api/v1/users/login';
    const response = await axios.post(
      url,
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });
    if(res.data.status === 'success') location.reload(true);
  } catch (err) {
    showAlert('error', 'Error logging out! try again');
  }
};