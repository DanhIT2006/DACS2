import React, { useEffect, useState } from 'react'
import './PlaceOrder.css'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import {toast} from "react-toastify";

const PlaceOrder = () => {

    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems } = useContext(StoreContext)
    const navigate = useNavigate();

    const location = useLocation();
    const discount = location.state.discount || 0;

    const subTotal = getTotalCartAmount();
    const deliveryFee = subTotal === 0 ? 0 : 20000;
    const finalTotal = subTotal + deliveryFee - discount > 0 ? subTotal + deliveryFee - discount : 0;

    const [data, setData] = useState({
        ho: "",
        ten: "",
        email: "",
        tinh: "",
        phuongXa: "",
        tenDuong: "",
        phone: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(prev => ({ ...prev, [name]: value }))
    }

    const placeOrder = async (event) => {
        event.preventDefault();

        let orderItems = [];
        food_list.forEach((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = { ...item };
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        });

        // Lấy userId từ JWT token
        let userId = null;
        if (token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split('')
                        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                        .join('')
                );
                const payload = JSON.parse(jsonPayload);
                userId = payload.id;
            } catch (e) {
                console.log("Lỗi decode token:", e);
            }
        }

        const fullAddress = `${data.tenDuong}, ${data.phuongXa}, ${data.tinh}`;

        let orderData = {
            userId: userId,
            address: {
                ...data,
                full_address: fullAddress
            },
            items: orderItems,
            amount: finalTotal,
            discount: discount,
        };

        try {
            const response = await axios.post(url + "/api/order/place", orderData, {
                headers: { token }
            });

            console.log("Response từ backend:", response.data);

            if (response.data.success) {
                setCartItems({}); // Xóa giỏ hàng ở khachhang
                toast.success("Đặt hàng thành công! Đang chuyển hướng...",{
                    autoClose: 2000
                });
                setTimeout(() => {
                navigate("/myorders");
            }, 2500);
            } else {
                toast.error("Lỗi đặt hàng: " + (response.data.message || "Không rõ"));
            }
        } catch (err) {
            console.error("Lỗi khi đặt hàng:", err);
            toast.error("Lỗi kết nối hoặc server");
        }
    }

    useEffect(() => {
        if (!token) {
            navigate('/cart');
        } else if (getTotalCartAmount() === 0) {
            navigate('/cart');
        }
    }, [token, getTotalCartAmount, navigate]);

    return (
        <form onSubmit={placeOrder} className="place-order">
            <div className="place-order-left">
                <p className="title">Thông tin giao hàng</p>
                <div className="multi-fields">
                    <input required name='ho' onChange={onChangeHandler} value={data.ho} type="text" placeholder='Họ' />
                    <input required name='ten' onChange={onChangeHandler} value={data.ten} type="text" placeholder='Tên' />
                </div>
                <div className="multi-fields">
                <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email' />
                <input required name='tinh' onChange={onChangeHandler} value={data.tinh} type="text" placeholder='Tỉnh' />
                </div>
                <div className="multi-fields">
                    <input required name='phuongXa' onChange={onChangeHandler} value={data.phuongXa} type="text" placeholder='Phường/Xã' />
                    <input required name='tenDuong' onChange={onChangeHandler} value={data.tenDuong} type="text" placeholder='Tên đường' />
                </div>
                <div className="multi-fields">
                <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='SĐT' />
                </div>
            </div>

            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Tổng chi phí của giỏ hàng</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Chưa phụ phí</p>
                            <p>{subTotal.toLocaleString('vi-VN')}₫</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Phí giao hàng</p>
                            <p>{deliveryFee.toLocaleString('vi-VN')}₫</p>
                        </div>
                        <hr />
                        {discount > 0 && (
                            <>
                                <div className="cart-total-details" style={{color: 'green'}}>
                                    <p>Giảm giá</p>
                                    <p>- {discount.toLocaleString('vi-VN')}₫</p>
                                </div>
                                <hr />
                            </>
                        )}
                        <div className="cart-total-details">
                            <b>Tổng tiền</b>
                            <b>{finalTotal.toLocaleString('vi-VN')}₫</b>
                        </div>
                    </div>
                    <button type='submit'>Thanh toán</button>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder