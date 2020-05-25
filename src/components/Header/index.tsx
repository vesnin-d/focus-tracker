import React, { FC } from 'react';
import './index.scss';

export interface Props {
    triggerLogout?: () => void;
    triggerLogin?: () => void;
    user: any;
}

const Header: FC<Props> = ({ triggerLogout, triggerLogin, user }) => {
    return <div className='header'>
        <div className='header-content'>
            <div className='logo'>
                <img className='logo-image' src='logo.png' alt="Focus Tracker Logo" height={42} />
                <span className='logo-name' >Focus Tracker</span>
            </div>
            <div className='actions'>
                {
                    user ? <div className='logged-in-actions'>
                        <div className='user-data'>
                            <i 
                                className='material-icons icon'
                                title={user.email}
                            >
                                account_circle
                            </i>
                        </div>
                        <span 
                            className='link'
                            onClick={triggerLogout}
                        >
                            Logout
                        </span>
                    </div> : <span 
                        onClick={triggerLogin}
                        className='link'>
                        Sign In
                    </span>
                }
                
            </div>
        </div>
    </div>;
};

export default Header;