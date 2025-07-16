import axios from 'axios'

// Creates a 'shared' instance so that it can be easily used and mocked where needed
export const pdcAxiosInstance = axios.create()
