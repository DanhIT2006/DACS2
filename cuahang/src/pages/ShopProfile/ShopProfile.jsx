import React, { useContext, useEffect, useState } from 'react';
import './ShopProfile.css';
import { StoreContext } from '../../../../frontend/src/context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ShopProfile = () => {
    const { url, token, decodeJWT } = useContext(StoreContext);
    const navigate = useNavigate();

    // State để lưu thông tin cửa hàng
    const [shopData, setShopData] = useState({
        shopName: '',
        address: '',
        phone: '',
        description: ''
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Kiểm tra vai trò và chuyển hướng nếu không phải shop_owner
    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }
        const payload = decodeJWT(token);
        if (!payload || payload.role !== 'shop_owner') {
            alert("Bạn không có quyền quản trị cửa hàng!");
            navigate('/');
        }
    }, [token, navigate]);


    // 1. Lấy dữ liệu cửa hàng
    const fetchShopProfile = async () => {
        if (!token) return;

        try {
            // Gọi API shop profile
            const response = await axios.get(url + "/api/shop/profile", {
                headers: { token }
            });

            if (response.data.success) {
                setShopData(response.data.data);
            } else {
                setError(response.data.message || "Không thể tải hồ sơ cửa hàng");
            }
        } catch (err) {
            console.error("Lỗi fetch shop profile:", err);
            setError("Lỗi kết nối hoặc Server không phản hồi.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShopProfile();
    }, [token]);


    // 2. Xử lý sự kiện thay đổi Form
    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setShopData(prev => ({ ...prev, [name]: value }));
    };


    // 3. Xử lý cập nhật thông tin
    const handleUpdate = async (event) => {
        event.preventDefault();
        if (!token) return;

        try {
            const response = await axios.put(url + "/api/shop/profile", shopData, {
                headers: { token }
            });

            if (response.data.success) {
                alert("Cập nhật thông tin cửa hàng thành công!");
                setShopData(response.data.data);
            } else {
                alert("Lỗi cập nhật: " + (response.data.message || "Không rõ"));
            }
        } catch (err) {
            console.error("Lỗi cập nhật:", err);
            alert("Lỗi kết nối hoặc Server.");
        }
    };

    if (loading) return <div className='shop-profile-page loading'>Đang tải hồ sơ cửa hàng...</div>;
    if (error) return <div className='shop-profile-page error'>Lỗi: {error}</div>;

    return (
        <div className='shop-profile-page'>
            <h2>Quản lý Thông tin Cửa hàng</h2>
            <form onSubmit={handleUpdate} className="shop-profile-container">

                <label htmlFor="shopName">Tên Cửa hàng</label>
                <input
                    id="shopName"
                    name="shopName"
                    type="text"
                    value={shopData.shopName}
                    onChange={onChangeHandler}
                    placeholder='Nhập tên cửa hàng'
                    required
                />

                <label htmlFor="address">Địa chỉ Cửa hàng</label>
                <input
                    id="address"
                    name="address"
                    type="text"
                    value={shopData.address}
                    onChange={onChangeHandler}
                    placeholder='Nhập địa chỉ'
                    required
                />

                <label htmlFor="phone">Số điện thoại liên hệ</label>
                <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={shopData.phone}
                    onChange={onChangeHandler}
                    placeholder='Nhập số điện thoại'
                />

                <label htmlFor="description">Mô tả về Cửa hàng</label>
                <textarea
                    id="description"
                    name="description"
                    value={shopData.description}
                    onChange={onChangeHandler}
                    placeholder='Mô tả ngắn về cửa hàng của bạn...'
                />

                <button type='submit' className='update-button'>
                    Cập nhật Thông tin Cửa hàng
                </button>
            </form>
        </div>
    );
};

export default ShopProfile;