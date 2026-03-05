import { VNPay, ProductCode, VnpLocale, VnpCurrCode } from 'vnpay';
import dotenv from 'dotenv';

dotenv.config();

const vnpay = new VNPay({
    tmnCode: process.env.VNP_TMN_CODE || '',
    secureSecret: process.env.VNP_HASH_SECRET || '',
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true,
});

export const createPaymentUrl = async (params: {
    amount: number;
    orderId: string;
    orderInfo: string;
    ipAddr: string;
}) => {
    const url = vnpay.buildPaymentUrl({
        vnp_Amount: params.amount,
        vnp_IpAddr: params.ipAddr,
        vnp_TxnRef: params.orderId,
        vnp_OrderInfo: params.orderInfo,
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: process.env.VNP_RETURN_URL || '',
        vnp_Locale: VnpLocale.VN,
        vnp_CurrCode: VnpCurrCode.VND,
        vnp_CreateDate: Number(new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '')),
    });

    return url;
};

export const verifyReturnUrl = (query: any) => {
    return vnpay.verifyReturnUrl(query);
};

export const verifyIpnCall = (query: any) => {
    return vnpay.verifyIpnCall(query);
};

export default vnpay;
