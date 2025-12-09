import React from 'react'
import './Cart.css'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { formatPrice } from '../../utils/formatPrice'

const Cart = () => {

  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext)

  const navigate = useNavigate();

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
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div>
                <div className='cart-items-title cart-items-item'>
                  <img src={url+"/images/"+item.image} alt="" />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>${item.price * cartItems[item._id]}</p>
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
            <div className="cart-total-details">
                <b>Tổng tiền</b>
                <b>{formatPrice(getTotalCartAmount() + (getTotalCartAmount() === 0 ? 0 : 20000))}</b>
            </div>
          </div>
          <button onClick={()=>navigate('/order')}>Thanh toán</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p className='promocodep'>Nếu bạn có mã giảm giá. Hãy nhập ở đây</p>
            <div className='cart-promocode-input'>
                <input type="text" placeholder='Mã giảm giá' />
                <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart