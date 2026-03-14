import api from './axios';

export const userApi = {
  getProfile: () => api.get('users/me/'),
  updateProfile: (data: any) => api.patch('users/me/', data),
  changePassword: (data: any) => api.post('users/change_password/', data),
};