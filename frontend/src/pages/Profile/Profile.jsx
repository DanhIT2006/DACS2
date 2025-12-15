import React, { useContext, useEffect, useState } from 'react';
import './Profile.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = () => {
    const { url, token } = useContext(StoreContext);
    const navigate = useNavigate();

    // State lưu thông tin hiển thị
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        role: ''
    });

    // State form chỉnh sửa thông tin
    const [formData, setFormData] = useState({
        name: '',
    });

    //  State cho đổi mật khẩu
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(true);

    // 1. Lấy dữ liệu profile
    const fetchProfileData = async () => {
        if (!token) {
            navigate('/');
            return;
        }
        try {
            const response = await axios.get(url + "/api/user/profile", { headers: { token } });
            if (response.data.success) {
                setUserData(response.data.data);
                setFormData({ name: response.data.data.name });
            }
        } catch (err) {
            console.error(err);
            toast.error("Lỗi tải thông tin");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, [token]);

    // Xử lý thay đổi input thông tin
    const onChangeHandler = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Xử lý thay đổi input mật khẩu
    const onPasswordChangeHandler = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    }

    // Cập nhật thông tin cơ bản
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(url + "/api/user/profile", formData, { headers: { token } });
            if (response.data.success) {
                toast.success("Cập nhật thông tin thành công!");
                setUserData(prev => ({ ...prev, name: formData.name }));
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            toast.error("Lỗi kết nối server");
        }
    };

    // Xử lý đổi mật khẩu
    const handleChangePasswordSubmit = async (e) => {
        e.preventDefault(); // Ngăn reload trang

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp!");
            return;
        }

        if (passwordData.newPassword.length < 8) {
            toast.error("Mật khẩu mới phải có ít nhất 8 ký tự");
            return;
        }

        try {
            // Gọi API đổi mật khẩu
            const response = await axios.post(url + "/api/user/change-password", {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            }, { headers: { token } });

            if (response.data.success) {
                toast.success("Đổi mật khẩu thành công!");
                setShowPasswordChange(false);
                setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Lỗi đổi mật khẩu");
        }
    }

    if (loading) return <div className='profile-page loading'>Đang tải...</div>;

    return (
        <div className='profile-page'>
            <h2>Thông tin cá nhân</h2>

            {/* Form cập nhật thông tin cơ bản */}
            <form onSubmit={handleUpdate} className="profile-container">
                <div className='profile-info-display'>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Vai trò:</strong> {userData.role === 'shop_owner' ? 'Chủ cửa hàng' : 'Khách hàng'}</p>
                </div>
                <hr/>
                <div className='profile-edit-section'>
                    <h3>Chỉnh sửa thông tin cơ bản</h3>
                    <label htmlFor="name">Tên của bạn</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={onChangeHandler}
                        required
                    />
                    <button type='submit' className='update-button'>Cập nhật thông tin</button>
                </div>
            </form>

            {/*Khu vực đổi mật khẩu tách riêng */}
            <div className="profile-edit-section" style={{marginTop: '30px'}}>
                <button
                    type='button'
                    className='password-button'
                    onClick={() => setShowPasswordChange(!showPasswordChange)}
                >
                    {showPasswordChange ? "Hủy đổi mật khẩu" : "Đổi mật khẩu"}
                </button>

                {showPasswordChange && (
                    <form onSubmit={handleChangePasswordSubmit} className="password-form" style={{marginTop: '20px', padding: '20px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px'}}>
                        <h4 style={{marginBottom: '15px'}}>Thiết lập mật khẩu mới</h4>

                        <label>Mật khẩu cũ</label>
                        <input
                            type="password"
                            name="oldPassword"
                            value={passwordData.oldPassword}
                            onChange={onPasswordChangeHandler}
                            required
                            placeholder="Nhập mật khẩu hiện tại"
                        />

                        <label>Mật khẩu mới</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={onPasswordChangeHandler}
                            required
                            placeholder="Nhập mật khẩu mới"
                        />

                        <label>Xác nhận mật khẩu mới</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={onPasswordChangeHandler}
                            required
                            placeholder="Nhập lại mật khẩu mới"
                        />

                        <button type="submit" className="update-button" style={{backgroundColor: '#ff6347'}}>
                            Lưu mật khẩu mới
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;