import React, { useEffect, useState } from 'react'
import './PlaceOrder.css'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {

    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems } = useContext(StoreContext)
    const navigate = useNavigate();

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

        let orderData = {
            userId: userId,
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + (getTotalCartAmount() === 0 ? 0 : 20000)
        };

        try {
            const response = await axios.post(url + "/api/order/place", orderData, {
                headers: { token }
            });

            console.log("Response từ backend:", response.data);

            if (response.data.success) {
                setCartItems({}); // Xóa giỏ hàng ở frontend
                alert("Đặt hàng thành công!");
                navigate("/myorders");
                window.location.reload();
            } else {
                alert("Lỗi đặt hàng: " + (response.data.message || "Không rõ"));
            }
        } catch (err) {
            console.error("Lỗi khi đặt hàng:", err);
            alert("Lỗi kết nối hoặc server");
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
                            <p>{getTotalCartAmount().toLocaleString('vi-VN')}₫</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Phí giao hàng</p>
                            <p>{(getTotalCartAmount() === 0 ? 0 : 20000).toLocaleString('vi-VN')}₫</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Tổng tiền</b>
                            <b>{(getTotalCartAmount() + (getTotalCartAmount() === 0 ? 0 : 20000)).toLocaleString('vi-VN')}₫</b>
                        </div>
                    </div>
                    <button type='submit'>Thanh toán</button>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder