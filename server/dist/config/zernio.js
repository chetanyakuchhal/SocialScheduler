import { Zernio } from '@zernio/node';
import { env } from './env.js';
const zernio = new Zernio({
    apiKey: env.zernioApiKey,
    baseURL: "https://zernio.com/api"
});
export default zernio;
