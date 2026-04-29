import { useState } from 'react';
import { login, register } from '../services/auth/auth';
import { useAuth } from '../Context/AuthProvider';
import '../styles/global.css';

const S = {
    page: { minHeight: '100vh', background: 'linear-gradient(135deg, #0a1a2f, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" } as React.CSSProperties,
    card: { background: '#fff', borderRadius: 24, padding: '48px 40px', width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
    logo: { fontSize: 28, fontWeight: 800, textAlign: 'center' as const, marginBottom: 8, color: '#0a1a2f' },
    accent: { color: '#f59e0b' },
    subtitle: { textAlign: 'center' as const, color: '#6b7280', fontSize: 14, marginBottom: 32 },
    label: { display: 'block', fontSize: 12, fontWeight: 700, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.5px' },
    input: { width: '100%', padding: '12px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 15, outline: 'none', boxSizing: 'border-box' as const, marginBottom: 16, fontFamily: 'inherit', transition: 'border-color 0.2s' },
    btn: { width: '100%', background: '#f59e0b', color: '#fff', border: 'none', padding: '13px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 4 },
    toggle: { textAlign: 'center' as const, marginTop: 20, fontSize: 14, color: '#6b7280' },
    link: { color: '#f59e0b', cursor: 'pointer', fontWeight: 600 },
    error: { background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 10, fontSize: 14, marginBottom: 16, textAlign: 'center' as const },
};

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const { refreshUser } = useAuth();

    const [registerData, setRegisterData] = useState({
        email: '', phone: '', password: '', confirmPassword: ''
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            await refreshUser();
            onLogin();
        } catch (e: any) {
            if (e.response?.status === 401) setError('Неверный логин или пароль');
            else if (e.response?.status === 429) setError('Слишком много попыток. Подождите.');
            else setError('Ошибка сервера');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (registerData.password !== registerData.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }
        setLoading(true);
        try {
            await register(registerData.email, registerData.password, registerData.phone);
            alert('Регистрация успешна! Войдите.');
            setIsRegister(false);
            setRegisterData({ email: '', phone: '', password: '', confirmPassword: '' });
        } catch (e: any) {
            if (e.response?.status === 429) setError('Превышен лимит регистраций. Попробуйте через час.');
            else setError('Ошибка регистрации');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={S.page}>
            <div style={S.card}>
                <div style={S.logo}>KABLUCH<span style={S.accent}>KOFF</span></div>
                <p style={S.subtitle}>{isRegister ? 'Создайте аккаунт' : 'Войдите в аккаунт'}</p>

                {error && <div style={S.error}>{error}</div>}

                {!isRegister ? (
                    <form onSubmit={handleLogin}>
                        <label style={S.label}>Email</label>
                        <input style={S.input} type="email" placeholder="example@mail.ru" value={email} onChange={e => setEmail(e.target.value)} required />

                        <label style={S.label}>Пароль</label>
                        <input style={S.input} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />

                        <button style={S.btn} type="submit" disabled={loading}>
                            {loading ? 'Входим...' : 'Войти'}
                        </button>

                        <div style={S.toggle}>
                            Нет аккаунта?{' '}
                            <span style={S.link} onClick={() => { setIsRegister(true); setError(''); }}>
                                Зарегистрироваться
                            </span>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleRegister}>
                        <label style={S.label}>Email</label>
                        <input style={S.input} type="email" placeholder="example@mail.ru" value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })} required />

                        <label style={S.label}>Телефон</label>
                        <input style={S.input} type="tel" placeholder="+7 999 000 00 00" value={registerData.phone} onChange={e => setRegisterData({ ...registerData, phone: e.target.value })} required />

                        <label style={S.label}>Пароль</label>
                        <input style={S.input} type="password" placeholder="••••••••" value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })} required />

                        <label style={S.label}>Подтвердите пароль</label>
                        <input style={S.input} type="password" placeholder="••••••••" value={registerData.confirmPassword} onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })} required />

                        <button style={S.btn} type="submit" disabled={loading}>
                            {loading ? 'Регистрируем...' : 'Зарегистрироваться'}
                        </button>

                        <div style={S.toggle}>
                            Уже есть аккаунт?{' '}
                            <span style={S.link} onClick={() => { setIsRegister(false); setError(''); }}>
                                Войти
                            </span>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginPage;