import React, { useEffect, useState } from 'react'
import './PlaceOrder.css'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {

  const {getTotalCartAmount,token,food_list,cartItems,url} = useContext(StoreContext)

  const [data,setData] = useState({
    ho:"",
    ten:"",
    email:"",
    tinh:"",
    phuongXa:"",
    tenDuong:"",
    phone:""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))
  }


  const [loading, setLoading] = useState(false);

  const placeOrder = async (event) => {
    event.preventDefault();
    setLoading(true);

    // build items
    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { _id: item._id, name: item.name, price: item.price, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });


    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + (getTotalCartAmount() === 0 ? 0 : 20000)
    };

    console.log("Gửi orderData:", orderData);
    console.log("Header token:", token);

    try {
      const response = await axios.post(url + "/api/order/place", orderData, {
        headers: {
          token: token
        }
      });
      console.log("Network response:", response);
      console.log("Response.data:", response.data);

      if (response && response.data && response.data.success) {
        alert("Đặt hàng thành công!");
        navigate("/myorders");
      } else {
        const msg = response && response.data && response.data.message ? response.data.message : 'Unknown error';
        alert("Lỗi: " + msg);
        console.error("Server báo lỗi:", response && response.data);
      }
    } catch (err) {
      console.error("Axios error:", err);
      // nếu server trả response body kèm message, show nó
      if (err.response) {
        console.error("Err response data:", err.response.data);
        alert("Lỗi mạng / server: " + (err.response.data?.message || err.response.statusText || err.message));
      } else {
        alert("Lỗi khi gửi yêu cầu: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  }


  const navigate = useNavigate();


  useEffect(()=>{
    if (!token){
      navigate('/cart')
    }
    else if(getTotalCartAmount()===0)
    {
      navigate('/cart')
    }
  },[token])


  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
      <p className="title">Thông tin giao hàng</p>
      <div className="multi-fields">
        <input required name='ho' onChange={onChangeHandler} value={data.ho} type="text" placeholder='Họ' />
        <input required name='ten'onChange={onChangeHandler} value={data.ten} type="text" placeholder='Tên' />
        </div>
        <input className='emaill' required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email' />
        <div className="multi-fields">
          <input required name='tinh' onChange={onChangeHandler} value={data.tinh} type="text" placeholder='Tỉnh' />
        <input required name='phuongXa' onChange={onChangeHandler} value={data.phuongXa} type="text" placeholder='Phường/Xã' />
        </div>
        <input className='streett' required name='tenDuong' onChange={onChangeHandler} value={data.tenDuong} type="text" placeholder='Tên đường' />
        <div className="multi-fields">
        </div>
        <input className='phonee' required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Số điện thoại' />
      </div>
      <div className="place-order-right">
      <div className="cart-total">
          <h2>Tổng chi phí của giỏ hàng</h2>
          <div>
          <div className="cart-total-details">
                <p>Chưa phụ phí</p>
            <p>{getTotalCartAmount().toLocaleString('vi-VN')}₫</p>
            </div>
            <hr/>
            <div className="cart-total-details">
                <p>Phí giao hàng</p>
              <p>{(getTotalCartAmount() === 0 ? 0 : 20000).toLocaleString('vi-VN')}₫</p>
            </div>
            <hr/>
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