import { Menu } from "../../App";

type MenuCardProps = {
    menu: Menu
}

const MenuCard: React.FC<MenuCardProps> = ({ menu }) => {


    return (
        <>
            <div className="menuCardContainer">
                <p>{menu.menu_name}</p>
            </div>
        </>
    )
}

export default MenuCard;