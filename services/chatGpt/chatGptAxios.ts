import axios from 'axios';
import dotenv from "dotenv";

dotenv.config();

const chatGptAxios = axios.create({
  baseURL: `${process.env.CHATGPT_API_URL}`,
  headers: {
    'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export default chatGptAxios;
