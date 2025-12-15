import React from 'react'
import './ShopStats.css'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { assets } from '../../assets/assets';

const ShopStats = () => {

    // Dữ liệu giả lập
    const data = [
        { name: 'T2', doanhThu: 4000000, donHang: 24, khachMoi: 5 },
        { name: 'T3', doanhThu: 3000000, donHang: 18, khachMoi: 3 },
        { name: 'T4', doanhThu: 2500000, donHang: 15, khachMoi: 2 },
        { name: 'T5', doanhThu: 2780000, donHang: 20, khachMoi: 6 },
        { name: 'T6', doanhThu: 1890000, donHang: 12, khachMoi: 1 },
        { name: 'T7', doanhThu: 6390000, donHang: 40, khachMoi: 10 },
        { name: 'CN', doanhThu: 7490000, donHang: 45, khachMoi: 12 },
    ];

    return (
        <div className='shop-stats'>
            <div className="stats-header">
                <img src={assets.stats_icon} alt="" style={{width: '40px'}} />
                <h2 className='stats-title'>Thống Kê Kinh Doanh</h2>
            </div>

            <div className="stats-cards">
                <div className="card">
                    <div className="card-info">
                        <h3>27,550,000₫</h3>
                        <p>Tổng doanh thu tuần</p>
                    </div>
                </div>
            </div>

            <div className="stats-charts">
                {/* Biểu đồ Cột (BarChart) - Doanh thu */}
                <div className="chart-container">
                    <h3>Doanh thu tuần qua</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis width={60} tickFormatter={(value) => (value / 1000000) + 'tr'} />
                            <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)} />
                            <Legend />
                            <Bar dataKey="doanhThu" name="Doanh Thu" fill="#ff6347" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* 2. SỬ DỤNG LINECHART & LINE: Biểu đồ xu hướng đơn hàng */}
                <div className="chart-container" style={{marginTop: '20px'}}>
                    <h3>Xu hướng đơn hàng & Khách mới</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis width={40} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="donHang" name="Đơn hàng" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="khachMoi" name="Khách mới" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default ShopStats