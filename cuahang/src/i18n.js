import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            //Shop order
            "shop_orders" : "Shop Orders",
            "sl_mon": "Quantity",
            "status_processing": "Processing",
            "status_cooking": "Cooking",
            "status_shipping": "Shipping",
            "status_delivered": "Delivered",
            "status_cancelled": "Cancelled",
            "no_order" : "No order",
        }
    },
    vi: {
        translation: {
            //Shop order
            "shop_orders" : "Đơn Hàng Của Quán",
            "sl_mon": "Số lượng:",
            "status_processing": "Đang xử lý",
            "status_cooking": "Đang chế biến",
            "status_shipping": "Đang giao hàng",
            "status_delivered": "Đã giao hàng",
            "status_cancelled": "Đã hủy",
            "no_order" : "Chưa có đơn hàng nào.",









        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "vi",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;