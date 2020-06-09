import React, { FC, useState, useCallback } from 'react';
import classNames from 'classnames';
import { login } from '../../network';

export interface Props {
    onLogin: (token: string, userId: string) => any;
}

const LoginForm: FC<Props> = ({ onLogin }) => {
    const [isDisabled, setIsDisabled] = useState(false);
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const handleLogin = useCallback(() => {
        if(loginData.email && loginData.password) {
            setIsDisabled(true);
            return login(
                loginData.email, 
                loginData.password
            ).then(({ token, userId }) => 
                onLogin(token, userId)
            ).finally(
                () => setIsDisabled(false)
            );
        }
    }, [loginData, onLogin, setIsDisabled]);

    return <div className={
        classNames(
            'login-form',
            {
                disabled: isDisabled
            }
        )
    }>
        <h3>Sign In</h3>
        <input 
            type='email' 
            value={loginData.email}
            placeholder='Email'
            disabled={isDisabled}
            onChange={ev => {
                setLoginData({
                    ...loginData,
                    email: ev.target.value
                })
            }}
        />
        <input 
            type='password' 
            value={loginData.password}
            placeholder='Password'
            disabled={isDisabled}
            onChange={ev => {
                setLoginData({
                    ...loginData,
                    password: ev.target.value
                })
            }}
        />
        <button
            type='button'
            className='outline'
            disabled={isDisabled}
            onClick={handleLogin}
        >
            Sign In
        </button>
    </div>
};

export default LoginForm;