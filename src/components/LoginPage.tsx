import { useState } from 'react';
import { login, register } from '../services/auth/auth';

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegister, setIsRegister] = useState(false);

    const [registerData, setRegisterData] = useState({
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await login(email, password);

            // cookie уже установлена backend'ом
            onLogin();
        } catch (e: any) {
            setError("Неверный логин или пароль");
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (registerData.password !== registerData.confirmPassword) {
            setError("Пароли не совпадают");
            return;
        }

        try {
            await register(
                registerData.email,
                registerData.password,
                registerData.phone
            );

            alert("Регистрация успешна");
            setIsRegister(false);
        } catch {
            setError("Ошибка регистрации");
        }
    };

    return (
        <div style={{ padding: 50 }}>
            <h2>{isRegister ? "Регистрация" : "Вход"}</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {!isRegister ? (
                <form onSubmit={handleLogin}>
                    <input
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />

                    <button type="submit">Войти</button>

                    <p onClick={() => setIsRegister(true)}>
                        Нет аккаунта? Регистрация
                    </p>
                </form>
            ) : (
                <form onSubmit={handleRegister}>
                    <input
                        placeholder="Email"
                        value={registerData.email}
                        onChange={e =>
                            setRegisterData({ ...registerData, email: e.target.value })
                        }
                    />

                    <input
                        placeholder="Phone"
                        value={registerData.phone}
                        onChange={e =>
                            setRegisterData({ ...registerData, phone: e.target.value })
                        }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={registerData.password}
                        onChange={e =>
                            setRegisterData({ ...registerData, password: e.target.value })
                        }
                    />

                    <input
                        type="password"
                        placeholder="Confirm"
                        value={registerData.confirmPassword}
                        onChange={e =>
                            setRegisterData({ ...registerData, confirmPassword: e.target.value })
                        }
                    />

                    <button type="submit">Зарегистрироваться</button>

                    <p onClick={() => setIsRegister(false)}>
                        Уже есть аккаунт
                    </p>
                </form>
            )}
        </div>
    );
};

export default LoginPage;