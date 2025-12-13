import React, { useEffect } from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
    useEffect(() => {
        // Ensure the footer logo stays the same for both light and dark modes
        document.querySelector(".tomatologofooter").style.filter = "none";
    }, []);

    return (
        <div className="footer" id="footer">
            <div className="footer-content">
                <div className="footer-content-left">
                    <img
                        className="tomatologofooter"
                        src={assets.logo}
                        alt=""
                    />
                    <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt="" />
                        <img src={assets.twitter_icon} alt="" />
                        <a
                            href="https://www.linkedin.com/in/your-linkedin-profile"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img src={assets.linkedin_icon} alt="LinkedIn" />
                        </a>
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>Công ty</h2>
                    <ul>
                        <li>Trang chủ</li>
                        <li>Về chúng tôi</li>
                        <li>Vận chuyển</li>
                        <li>Chính sách bảo mật</li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>Liên hệ</h2>
                    <ul>
                        <li>+84865412596</li>
                        <li>danhvt.24it@vku.udn.vn</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className="footer-copyright">
                Copyright 2025 © VTD - All rights reserved.
            </p>
        </div>
    );
};

export default Footer;
