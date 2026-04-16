import { useEffect, useState } from 'react';
import LoginPage from './components/LoginPage';
import UserPage from './components/UserPage';
import OperatorPage from './components/OperatorPage';
import AdminPage from './components/AdminPage';
import api from './services/api';

function App() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/api/auth/me")
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const handleLoginSuccess = async () => {
        const res = await api.get("/api/auth/me");
        setUser(res.data);
    };

    const handleLogout = async () => {
        try {
            await api.post("/api/auth/logout");
        } catch {}

        setUser(null);
    };

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <LoginPage onLogin={handleLoginSuccess} />;
    }

    switch (user.role) {
        case "Admin":
            return <AdminPage onLogout={handleLogout} />;
        case "Operator":
            return <OperatorPage onLogout={handleLogout} />;
        default:
            return <UserPage onLogout={handleLogout} />;
    }
}

export default App;