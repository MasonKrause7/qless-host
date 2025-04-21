import { useState, useRef, useEffect } from 'react';
import { useUser } from '../../hooks/UserContext';
import '../../styles/global.css';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Header() {

    const { user, logout } = useUser();
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const navigate = useNavigate();

    const isManager = user?.is_manager;
    const isOnManage = location.pathname.startsWith("/manage");
    const isOnCook = location.pathname.startsWith("/cook");
    const isOnCustomer = location.pathname.startsWith("/customer");
    const isOnLanding = location.pathname === "/";

    const handleDashboardSwitch = () => {
        if (isOnManage) navigate("/cook");
        else if (isOnCook) navigate("/manage");
    }

    //detect click outside menu and close menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    //close menu on route
    useEffect(() => { setMenuOpen(false) }, [location.pathname]);

    return (
        <div className="queuelessBrandBar">
            <div className="logoContainer">
                <img src="./src/assets/qlessLogo.png" alt="Queuless Logo" />
                <p className="moto">Scan, Skip, Bam!</p>
            </div>
            <h3 className="queueless">Queueless</h3>
            {<div className="userMenu" ref={menuRef}>
                <button
                    onClick={() => { setMenuOpen(!menuOpen) }}
                    className={menuOpen ? "toggleMenu open" : "toggleMenu"}
                >
                    ☰
                </button>
                {menuOpen && user &&
                    <ul className='userMenuDropdown'>
                        <li><h3>Hello, {user.first_name}!</h3></li>
                        {isManager && (isOnManage || isOnCook) && (
                            <li>
                                <button onClick={handleDashboardSwitch}>
                                    {isOnManage ? "Cook View" : "Manager View"}
                                </button>
                            </li>
                        )}
                        <li><button>Settings</button></li>
                        <li><button onClick={logout}>Log Out</button></li>
                    </ul>
                }
                {menuOpen && !user && isOnCustomer &&
                    <ul className='userMenuDropdown'>
                        <li><button onClick={() => window.location.reload()}>Restart Order</button></li>
                        <li><button onClick={() => navigate('/')}>Login</button></li>
                    </ul>
                }
                {menuOpen && isOnLanding &&
                    <p className='userMenuDropdown'>Please Login to Continue</p>
                }
            </div>}
        </div>
    )
}