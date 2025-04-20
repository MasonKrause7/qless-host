import React from 'react';
import { Menu } from "../../App";
import '../../styles/manager/managerDashboard.css';
import menuIcon from '../../assets/menu-icon.jpg';

type MenuCardProps = {
    menu: Menu;
    onEditClick: (menuId: number) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ menu, onEditClick }) => {
    return (
        <div className="menuCard">
            <div className="menuIconContainer">
                <div className="menuIcon">
                    <img 
                        src={menuIcon} 
                        alt={`${menu.menu_name} icon`} 
                        onError={(e) => {
                            // If image fails to load, replace with a placeholder or default styling
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.style.backgroundColor = '#f2f2f2';
                        }}
                    />
                </div>
            </div>
            <h3 className="menuName">{menu.menu_name}</h3>
            <div className="menuButtonContainer">
                <button 
                    className="primaryButton"
                    onClick={() => onEditClick(menu.menu_id)}
                >
                    Edit Menu
                </button>
            </div>
        </div>
    );
};

export default MenuCard;