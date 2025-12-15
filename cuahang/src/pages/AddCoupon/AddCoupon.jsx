import React, { useState, useEffect, useContext } from 'react'
import './AddCoupon.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { StoreContext } from '../../context/StoreContext'

const AddCoupon = ({ url }) => {

    // Lấy danh sách TẤT CẢ món từ Context
    const { token, food_list } = useContext(StoreContext);

    const [data, setData] = useState({
        code: "",
        discountType: "percent",
        discountValue: "",
        minOrderValue: 0,
        expiryDate: "",
        usageLimit: 100
    });

    const [selectedFoods, setSelectedFoods] = useState([]);


    const [myFoods, setMyFoods] = useState([]);

    useEffect(() => {
        const filterMyFoods = async () => {
            if (!token) return; // Chưa đăng nhập thì thôi

            try {
                const response = await axios.get(url + "/api/shop/profile", {
                    headers: { token }
                });

                if (response.data.success) {
                    const myShopId = response.data.data._id;

                    const filteredList = food_list.filter((food) => {
                        // Xử lý trường hợp shopId là object hay string
                        const foodShopId = typeof food.shopId === 'object' ? food.shopId._id : food.shopId;
                        return foodShopId === myShopId;
                    });

                    // 3. Lưu danh sách đã lọc vào state
                    setMyFoods(filteredList);
                }
            } catch (error) {
                console.error("Lỗi lọc món ăn:", error);
            }
        }


        if(food_list.length > 0) {
            filterMyFoods();
        }
    }, [token, food_list, url]);

    const toggleFood = (foodId) => {
        setSelectedFoods(prev => {
            if (prev.includes(foodId)) {
                return prev.filter(id => id !== foodId);
            } else {
                return [...prev, foodId];
            }
        });
    };

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(data => ({ ...data, [name]: value }));
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const payload = { ...data, applicableFoods: selectedFoods };

        try {
            const response = await axios.post(`${url}/api/shop/coupon/add`, payload, {
                headers: { token }
            });
            if (response.data.success) {
                toast.success("Tạo mã thành công!");
                setData({ ...data, code: "", discountValue: "" });
                setSelectedFoods([]);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Lỗi kết nối");
        }
    }

    return (
        <div className='add-coupon'>
            <h2>Tạo Mã Giảm Giá Mới</h2>
            <form onSubmit={onSubmitHandler} className='flex-col'>
                {/* ... Các ô input giữ nguyên ... */}
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
                    <p>Giá trị giảm</p>
                    <input onChange={onChangeHandler} value={data.discountValue} type="number" name='discountValue' placeholder='VD:20 (20%)' required />
                </div>
                <div className="add-product-name flex-col">
                    <p>Hạn sử dụng</p>
                    <input onChange={onChangeHandler} value={data.expiryDate} type="date" name='expiryDate' required />
                </div>

                {/* --- PHẦN HIỂN THỊ DANH SÁCH --- */}
                <div className="food-selection flex-col">
                    <p>Áp dụng cho món ăn (Đã lọc món của quán bạn)</p>
                    <div className="food-list-container">
                        {/* QUAN TRỌNG: Dùng myFoods thay vì food_list */}
                        {myFoods.length > 0 ? (
                            myFoods.map((item) => (
                                <div key={item._id} className={`food-checkbox-item ${selectedFoods.includes(item._id) ? 'active' : ''}`} onClick={() => toggleFood(item._id)}>
                                    <input type="checkbox" checked={selectedFoods.includes(item._id)} readOnly />
                                    <img src={`${url}/images/${item.image}`} alt="" />
                                    <span>{item.name}</span>
                                </div>
                            ))
                        ) : (
                            <p>Không tìm thấy món ăn nào của quán bạn.</p>
                        )}
                    </div>
                </div>

                <button type='submit' className='add-btn'>Tạo Mã</button>
            </form>
        </div>
    )
}

export default AddCoupon