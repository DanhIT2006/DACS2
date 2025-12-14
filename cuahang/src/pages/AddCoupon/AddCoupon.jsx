import React, { useState, useEffect } from 'react'
import './AddCoupon.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const AddCoupon = ({ url }) => {

    const [data, setData] = useState({
        code: "",
        discountType: "percent",
        discountValue: "",
        minOrderValue: 0,
        expiryDate: "",
        usageLimit: 100
    });

    const [foodList, setFoodList] = useState([]); // Danh sách tất cả món của quán
    const [selectedFoods, setSelectedFoods] = useState([]); // Danh sách món ĐƯỢC CHỌN

    // 1. Lấy danh sách món ăn của quán khi vào trang
    useEffect(() => {
        const fetchList = async () => {
            // Gọi API lấy danh sách món (bạn dùng API listFood hiện tại)
            const response = await axios.get(`${url}/api/food/list`);
            if (response.data.success) {
                setFoodList(response.data.data);
            }
        }
        fetchList();
    }, [url]);

    // 2. Xử lý khi bấm vào checkbox chọn món
    const toggleFood = (foodId) => {
        setSelectedFoods(prev => {
            if (prev.includes(foodId)) {
                return prev.filter(id => id !== foodId); // Bỏ chọn
            } else {
                return [...prev, foodId]; // Chọn thêm
            }
        });
    };

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(data => ({ ...data, [name]: value }));
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        // Gộp dữ liệu form + danh sách món đã chọn
        const payload = {
            ...data,
            applicableFoods: selectedFoods
        };

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${url}/api/shop/coupon/add`, payload, {
                headers: { token }
            });

            if (response.data.success) {
                toast.success("Tạo mã giảm giá thành công!");
                setData({ ...data, code: "", discountValue: "" });
                setSelectedFoods([]); // Reset chọn món
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Lỗi kết nối server");
        }
    }

    return (
        <div className='add-coupon'>
            <h2>Tạo Mã Giảm Giá Mới</h2>
            <form onSubmit={onSubmitHandler} className='flex-col'>

                <div className="add-product-name flex-col">
                    <p>Mã giảm giá (Code)</p>
                    <input onChange={onChangeHandler} value={data.code} type="text" name='code' placeholder='VD: SALE50' required />
                </div>

                <div className="add-price flex-col">
                    <p>Loại giảm giá</p>
                    <select onChange={onChangeHandler} name="discountType" className='coupon-select'>
                        <option value="percent">Giảm theo Phần trăm (%)</option>
                        <option value="fixed">Giảm theo Tiền mặt (VNĐ)</option>
                    </select>
                </div>

                <div className="add-product-name flex-col">
                    <p>Giá trị giảm (Nhập số)</p>
                    <input onChange={onChangeHandler} value={data.discountValue} type="number" name='discountValue' placeholder='VD: 20 (là 20%)' required />
                </div>

                <div className="add-product-name flex-col">
                    <p>Hạn sử dụng</p>
                    <input onChange={onChangeHandler} value={data.expiryDate} type="date" name='expiryDate' required />
                </div>

                {/* --- PHẦN CHỌN MÓN ĂN --- */}
                <div className="food-selection flex-col">
                    <p>Áp dụng cho món ăn (Để trống = Áp dụng tất cả)</p>
                    <div className="food-list-container">
                        {foodList.map((item) => (
                            <div key={item._id} className={`food-checkbox-item ${selectedFoods.includes(item._id) ? 'active' : ''}`} onClick={() => toggleFood(item._id)}>
                                <input
                                    type="checkbox"
                                    checked={selectedFoods.includes(item._id)}
                                    readOnly
                                />
                                <img src={`${url}/images/${item.image}`} alt="" />
                                <span>{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <button type='submit' className='add-btn'>Tạo mã</button>
            </form>
        </div>
    )
}

export default AddCoupon