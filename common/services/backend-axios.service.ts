import axios from 'axios';

import { BACKEND_URL } from '@/config/frontend-env.config';

export const backendAxiosService = axios.create({
  baseURL: BACKEND_URL,
});
