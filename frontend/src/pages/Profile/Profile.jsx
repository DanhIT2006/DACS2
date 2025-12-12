import React, { useContext, useEffect, useState } from 'react';
import './Profile.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { url, token } = useContext(StoreContext);
    const navigate = useNavigate();

    // State để lưu thông tin người dùng
    const [userData, setUserData] = useState({
        name: '',
        email: '',

        //thêm
    });

    // State để theo dõi các thay đổi trong form
    const [formData, setFormData] = useState({
        name: '',
        email: '',

        //thêm
    });

    // State để quản lý trạng thái tải dữ liệu
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. Lấy dữ liệu người dùng khi component được tải
    const fetchProfileData = async () => {
        if (!token) {
            navigate('/'); // Chuyển hướng nếu chưa đăng nhập
            return;
        }

        try {
            const response = await axios.get(url + "/api/user/profile", {
                headers: { token }
            });

            if (response.data.success) {
                const data = response.data.data;
                setUserData(data);
                // Đặt dữ liệu vào form để có thể chỉnh sửa
                setFormData({ name: data.name });
            } else {
                setError(response.data.message || "Không thể tải thông tin");
            }
        } catch (err) {
            console.error("Lỗi fetch profile:", err);
            setError("Lỗi kết nối hoặc Server không phản hồi.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, [token]);


    // 2. Xử lý sự kiện thay đổi Form
    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    // 3. Xử lý cập nhật thông tin
    const handleUpdate = async (event) => {
        event.preventDefault();

        if (!token) return;

        try {
            const response = await axios.put(url + "/api/user/profile", formData, {
                headers: { token }
            });

            if (response.data.success) {
                alert("Cập nhật thông tin thành công!");
                // Cập nhật lại userData để giao diện phản ánh thay đổi
                setUserData(response.data.data);
            } else {
                alert("Lỗi cập nhật: " + (response.data.message || "Không rõ"));
            }
        } catch (err) {
            console.error("Lỗi cập nhật:", err);
            alert("Lỗi kết nối hoặc Server.");
        }
    };

    if (loading) {
        return <div className='profile-page loading'>Đang tải thông tin...</div>;
    }

    if (error) {
        return <div className='profile-page error'>Lỗi: {error}</div>;
    }

    return (
        <div className='profile-page'>
            <h2>Thông tin cá nhân</h2>
            <form onSubmit={handleUpdate} className="profile-container">

                {/* Khu vực hiển thị thông tin không thể thay đổi */}
                <div className='profile-info-display'>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Vai trò:</strong> {userData.role === 'shop_owner' ? 'Chủ cửa hàng' : 'Khách hàng'}</p>
                </div>

                <hr/>

                {/* Khu vực chỉnh sửa thông tin */}
                <div className='profile-edit-section'>
                    <h3>Chỉnh sửa thông tin cơ bản</h3>

                    <label htmlFor="name">Tên của bạn</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={onChangeHandler}
                        placeholder='Nhập tên mới'
                        required
                    />

                    {/* Thêm các trường chỉnh sửa địa chỉ, SĐT... nếu cần */}

                    <button type='submit' className='update-button'>
                        Cập nhật
                    </button>

                    <button type='button' className='password-button'>
                        Đổi mật khẩu
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;