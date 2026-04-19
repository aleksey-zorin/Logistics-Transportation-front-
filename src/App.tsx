import { AuthProvider, useAuth } from './Context/AuthProvider';
import LoginPage from './components/LoginPage';
import AdminPage from './components/AdminPage';
import OperatorPage from './components/OperatorPage';
import UserPage from './components/UserPage';

function AppInner() {
    const { user, loading } = useAuth();

    if (loading) return <div>Загрузка...</div>;

    if (!user) return <LoginPage onLogin={() => {}} />;

    switch (user.role) {
        case 'Admin': return <AdminPage />;
        case 'Operator': return <OperatorPage />;
        default: return <UserPage onLogout={() => {}} />;
    }
}

function App() {
    return (
        <AuthProvider>
            <AppInner />
        </AuthProvider>
    );
}

export default App;