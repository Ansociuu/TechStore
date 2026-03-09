"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyMomoSignature = exports.createMomoPaymentUrl = void 0;
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MOMO_API_URL = process.env.MOMO_API_URL || 'https://test-payment.momo.vn/v2/gateway/api/create';
const PARTNER_CODE = process.env.MOMO_PARTNER_CODE || '';
const ACCESS_KEY = process.env.MOMO_ACCESS_KEY || '';
const SECRET_KEY = process.env.MOMO_SECRET_KEY || '';
const REDIRECT_URL = process.env.MOMO_REDIRECT_URL || 'http://localhost:5173/payment-result';
const IPN_URL = process.env.MOMO_IPN_URL || 'http://localhost:5000/api/orders/momo-ipn';
const createMomoPaymentUrl = async (params) => {
    const { amount, orderId, orderInfo, requestId, extraData = '' } = params;
    const orderType = 'momo_wallet';
    const requestType = 'captureWallet';
    const rawSignature = `accessKey=${ACCESS_KEY}&amount=${amount}&extraData=${extraData}&ipnUrl=${IPN_URL}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${PARTNER_CODE}&redirectUrl=${REDIRECT_URL}&requestId=${requestId}&requestType=${requestType}`;
    console.log('MoMo Raw Signature:', rawSignature);
    const signature = crypto_1.default
        .createHmac('sha256', SECRET_KEY)
        .update(rawSignature)
        .digest('hex');
    const requestBody = {
        partnerCode: PARTNER_CODE,
        partnerName: 'TechStore',
        storeId: 'TechStore',
        requestId,
        amount: Number(amount),
        orderId,
        orderInfo,
        redirectUrl: REDIRECT_URL,
        ipnUrl: IPN_URL,
        lang: 'vi',
        requestType,
        autoCapture: true,
        extraData,
        orderType,
        signature,
    };
    console.log('MoMo Request Body:', JSON.stringify(requestBody, null, 2));
    try {
        const response = await axios_1.default.post(MOMO_API_URL, requestBody);
        return response.data;
    }
    catch (error) {
        console.error('MoMo Payment Error Response:', error.response?.data);
        console.error('MoMo Payment Error Message:', error.message);
        throw new Error(error.response?.data?.message || 'Không thể tạo liên kết thanh toán MoMo');
    }
};
exports.createMomoPaymentUrl = createMomoPaymentUrl;
const verifyMomoSignature = (params) => {
    const { partnerCode, orderId, requestId, amount, orderInfo, orderType, transId, resultCode, message, payType, responseTime, extraData, signature } = params;
    const rawSignature = `accessKey=${ACCESS_KEY}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
    const checkSignature = crypto_1.default
        .createHmac('sha256', SECRET_KEY)
        .update(rawSignature)
        .digest('hex');
    return checkSignature === signature;
};
exports.verifyMomoSignature = verifyMomoSignature;
