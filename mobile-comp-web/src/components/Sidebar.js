import { slide as Menu } from 'react-burger-menu';
import '../styles/Sidebar.css';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function logout(removeCookie, navigate) {
    removeCookie('token')
    navigate('/')
}

export function Sidebar() {
    const [cookie, removeCookie] = useCookies(['token'])
    const navigate = useNavigate()
    return (
        <Menu>
            <a className="menu-item" href="/main">
                Home
            </a>
            <a className="menu-item" href="/credit">
                รายชื่อสมาชิก
            </a>
            <a className="menu-item" href="#" onClick={() => logout(removeCookie, navigate)}>
                Logout
            </a>
        </Menu>
    );
}