import React, { FC, useState, useCallback } from 'react';
import { login } from '../../network';

export interface Props {
    onLogin: (token: string, userId: string) => any;
}

const LoginForm: FC<Props> = ({ onLogin }) => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const handleLogin = useCallback(() => {
        if(loginData.email && loginData.password) {
            return login(
                loginData.email, 
                loginData.password
            ).then(({ data }) => 
                onLogin(data.login.token, data.login.userId)
            );
        }
    }, [loginData, onLogin]);

    return <div className='login-form'>
        <h3>Sign In</h3>
        <input 
            type='email' 
            value={loginData.email}
            placeholder='Email'
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
            onChange={ev => {
                setLoginData({
                    ...loginData,
                    password: ev.target.value
                })
            }}
        />
        <button
            type='button'
            onClick={handleLogin}
        >
            Login
        </button>
    </div>
};

export default LoginForm;