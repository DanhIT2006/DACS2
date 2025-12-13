import React, { useContext, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { formatPrice } from '../../utils/formatPrice'
import axios from 'axios'
import {toast} from 'react-toastify'

const Cart = () => {

    // 1. Thêm addToCart vào để dùng cho nút tăng số lượng
    const { cartItems, food_list, removeFromCart, addToCart, getTotalCartAmount, url } = useContext(StoreContext)

    const navigate = useNavigate();

    const [promoCode, setPromoCode] = useState("");
    const [discount, setDiscount] = useState(0);

    const handleApplyPromo = async () => {
        let currentShopId = null;
        for (const item of food_list) {
            if (cartItems[item._id] > 0) {
                console.log("Món ăn:", item.name);
                console.log("Dữ liệu Shop của món:", item.shopId);

                if (item.shopId) {
                    // Logic an toàn: Nếu shopId là object thì lấy ._id, nếu là chuỗi thì lấy luôn
                    currentShopId = typeof item.shopId === 'object' ? item.shopId._id : item.shopId;
                }
                break; // Chỉ cần lấy 1 cái vì giỏ hàng chung 1 quán
            }
        }
        console.log("ID Quán gửi đi check:", currentShopId);
        if (!promoCode) return;
        try {
            // Gửi mã và tổng tiền hiện tại lên server check
            const response = await axios.post(url + "/api/coupon/verify", {
                code: promoCode,
                cartAmount: getTotalCartAmount(),
                shopIdOfCart: currentShopId
            });

            if (response.data.success) {
                setDiscount(response.data.discountAmount);
                toast.success(response.data.message);
            } else {
                setDiscount(0); // Reset nếu mã sai
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi kiểm tra mã");
        }
    }

    // Tính tổng cuối cùng
    const subTotal = getTotalCartAmount();
    const deliveryFee = subTotal === 0 ? 0 : 20000;
    const finalTotal = subTotal + deliveryFee - discount;

    return (
        <div className='cart'>
            <div className="cart-items">
                <div className="cart-items-title">
                    <p>Ảnh</p>
                    <p>Tên món</p>
                    <p>Giá</p>
                    <p>Số lượng</p>
                    <p>Tổng tiền</p>
                    <p>Xóa món</p>
                </div>
                <br />
                <hr />
                {food_list.map((item) => {
                    if (cartItems[item._id] > 0) {
                        return (
                            <div key={item._id}>
                                <div className='cart-items-title cart-items-item'>
                                    <img src={url+"/images/"+item.image} alt="" />
                                    <p>{item.name}</p>

                                    {/* Sửa lại: Hiển thị giá của TỪNG món, không phải tổng giỏ hàng */}
                                    <p>{formatPrice(item.price)}</p>

                                    {/* 2. Thay đổi phần hiển thị số lượng thành bộ điều khiển */}
                                    <div className='quantity-control'>
                                        <button onClick={()=>removeFromCart(item._id)}  style={{color: "red", cursor: "pointer"}}>-</button>
                                        <p>{cartItems[item._id]}</p>
                                        <button onClick={()=>addToCart(item._id)}  style={{color: "green", cursor: "pointer"}} >+</button>
                                    </div>

                                    <p>{formatPrice(getTotalCartAmount() + (getTotalCartAmount() === 0 ? 0 : 20000))}</p>

                                    <p onClick={()=>removeFromCart(item._id)} className='cross' style={{color: "red", cursor: "pointer"}}>X</p>
                                </div>
                                <hr />
                            </div>
                        )
                    }
                })}
            </div>
            <div className="cart-bottom">
                <div className="cart-total">
                    <h2>Tổng chi phí của giỏ hàng</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Chưa phụ phí</p>
                            <p>{formatPrice(getTotalCartAmount())}</p>
                        </div>
                        <hr/>
                        <div className="cart-total-details">
                            <p>Phí giao hàng</p>
                            <p>{formatPrice(getTotalCartAmount() === 0 ? 0 : 20000)}</p>
                        </div>
                        <hr/>
                        {/* HIỂN THỊ GIẢM GIÁ NẾU CÓ */}
                        {discount > 0 && (
                            <>
                                <div className="cart-total-details" style={{color: 'green'}}>
                                    <p>Giảm giá</p>
                                    <p>- {formatPrice(discount)}</p>
                                </div>
                                <hr/>
                            </>
                        )}
                        <div className="cart-total-details">
                            <b>Tổng tiền</b>
                            <b>{formatPrice(finalTotal)}</b>
                        </div>
                    </div>
                    <button onClick={()=>navigate('/order', { state: { discount: discount } })}>Thanh toán</button>
                </div>
                <div className="cart-promocode">
                    <div>
                        <p className='promocodep'>Nếu bạn có mã giảm giá. Hãy nhập ở đây</p>
                        <div className='cart-promocode-input'>
                            <input
                                type="text"
                                placeholder='Mã giảm giá'
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                            />
                            <button onClick={handleApplyPromo}>Áp dụng</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart