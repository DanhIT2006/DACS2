import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <div className='header'>
        <div className="header-contents">
            <h2>Đặt món ăn yêu thích của bạn tại đây</h2>
            <p>Chọn từ thực đơn đa dạng bao gồm một loạt các món ăn ngon được chế biến từ những nguyên liệu tốt nhất,
                thỏa mãn cơn thèm ăn và nâng cao trải nghiệm ăn uống của bạn, mỗi lần một bữa ăn ngon.</p>
            <a href="#explore-menu"><button className='buttonwl'>Xem Menu</button></a>
        </div>
    </div>
  )
}

export default Header