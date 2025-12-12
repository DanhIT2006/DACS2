
import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { useState } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { formatPrice } from '../../utils/formatPrice'
import { useNavigate } from 'react-router-dom';

function FoodItem ({id,name,price,description,image}) {
    const {cartItems = {},addToCart,removeFromCart,url} = useContext(StoreContext);
    const navigate = useNavigate();

    const handleItemClick = (e) => {
        // Ngăn chặn sự kiện click lan truyền lên khi bấm nút Add/Remove
        if (e.target.closest('.food-item-counter') || e.target.closest('.add')) {
            return;
        }
        // Chuyển hướng đến trang chi tiết món ăn
        navigate(`/food/${id}`);
    };

    return (
        <div className='food-item' onClick={handleItemClick}>
            <div className="food-item-img-container">
                <img className='food-item-image' src={url+"/images/"+image} alt="" />
                {!cartItems[id]
                    ?<img className='add' onClick={()=>addToCart(id)} src={assets.add_icon_white} alt="" />
                    :<div className='food-item-counter'>
                        <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt='' />
                        <p className='cartitemsp'>{cartItems[id]}</p>
                        <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt='' />
                    </div>
                }
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p className='namewe'>{name}</p>
                    <img className='ratingstars' src={assets.rating_starts} alt="" />
                </div>
                <p className="food-item-desc">{description}</p>
                <p className="food-item-price">{formatPrice(price)}</p>
            </div>
        </div>
    )
}

export default FoodItem