import { pdcAxiosInstance } from '../../api/axiosInstance'
import MockAdapter from 'axios-mock-adapter'

const axiosMockAdapter = new MockAdapter(pdcAxiosInstance)

export default axiosMockAdapter
