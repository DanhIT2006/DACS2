import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {

    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        if (!token) return;
        try {
            const response = await axios.post(url + "/api/order/userorders", {}, {
                headers: {
                    token: token
                }
            });

            console.log("Kết quả API userorders:", response.data);

            // ← thêm kiểm tra response
            if (response.data.success) {
                setData(response.data.data || []);
            } else {
                setData([]);
            }
        } catch (error) {
            console.log("Lỗi lấy đơn hàng:", error);
            setData([]);
        }
    }

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    if (data.length === 0) {
        return (
            <div className='my-orders'>
                <h2 className='myordersp'>Đơn hàng của bạn</h2>
                <div className="container" style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
                    <p>Chưa có đơn hàng nào</p>
                </div>
            </div>
        )
    }

    return (
        <div className='my-orders'>
            <h2 className='myordersp'>My Orders</h2>
            <div className="container">
                {data.map((order, index) => (
                    <div key={index} className='my-orders-order'>
                        <img src={assets.parcel_icon} alt="" />
                        <p>
                            {order.items.map((item, idx) => {
                                if (idx === order.items.length - 1) {
                                    return item.name + " x " + item.quantity;
                                } else {
                                    return item.name + " x " + item.quantity + ", ";
                                }
                            })}
                        </p>
                        <p>${order.amount}.00</p>
                        <p>Items: {order.items.length}</p>
                        <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                        <button onClick={fetchOrders}>Track Order</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyOrders