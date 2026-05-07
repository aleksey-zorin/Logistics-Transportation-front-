import { useState, useEffect, useCallback } from 'react';
import { fetchClientOrders, createOrder } from '../services/order/orders';
import { fetchClientTrips } from '../services/trip/trip';
import { fetchClientProfile } from '../services/user/user';
import { logout } from '../services/auth/auth';
import { Order } from '../services/order/order.struct';
import { Trip } from '../services/trip/trip.struct';
import { User } from '../services/user/user.struct';
import RouteMap from './RouteMap';

type Tab = 'calculator' | 'orders' | 'trips' | 'profile';

const S = {
    page: { minHeight: '100vh', background: '#f0f2f5', fontFamily: "'DM Sans', sans-serif" } as React.CSSProperties,
    header: { background: '#0a1a2f', color: '#fff', padding: '0 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64, position: 'sticky' as const, top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.2)' },
    logo: { fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' },
    accent: { color: '#f59e0b' },
    logoutBtn: { background: 'transparent', border: '1px solid rgba(239,68,68,0.6)', color: '#f87171', padding: '6px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
    content: { padding: '24px 32px', maxWidth: 1400, margin: '0 auto' },
    tabs: { display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' as const },
    tabBtn: (active: boolean) => ({
        padding: '10px 22px',
        background: active ? '#f59e0b' : '#fff',
        color: active ? '#fff' : '#374151',
        border: active ? '1.5px solid #f59e0b' : '1.5px solid #e5e7eb',
        borderRadius: 10,
        cursor: 'pointer',
        fontSize: 14,
        fontWeight: 600,
    }),
    card: { background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
    cardHeader: { padding: '20px 24px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' },
    cardTitle: { fontSize: 20, fontWeight: 700, color: '#0a1a2f', margin: 0 },
    cardBody: { padding: '24px' },
    label: { display: 'block', fontSize: 12, fontWeight: 700, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.5px' },
    input: { width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const, marginBottom: 16, fontFamily: 'inherit' },
    textarea: { width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const, marginBottom: 4, fontFamily: 'inherit', resize: 'vertical' as const, minHeight: 80 },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
    submitBtn: { background: '#f59e0b', color: '#fff', border: 'none', padding: '13px 0', borderRadius: 10, cursor: 'pointer', fontSize: 15, fontWeight: 700, width: '100%', marginTop: 8 },
    table: { width: '100%', borderCollapse: 'collapse' as const },
    th: { padding: '12px 16px', textAlign: 'left' as const, background: '#f8f9fa', fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.5px', borderBottom: '1px solid #f0f0f0' },
    td: { padding: '12px 16px', fontSize: 14, color: '#1f2937', borderBottom: '1px solid #f5f5f5', verticalAlign: 'middle' as const },
    badge: (color: string) => ({ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: color + '22', color }),
    emptyRow: { padding: '50px', textAlign: 'center' as const, color: '#9ca3af', fontSize: 14 },
    hint: { fontSize: 12, color: '#9ca3af', marginBottom: 14 },
    successBox: { background: '#d1fae5', color: '#065f46', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontSize: 14 },
    errorBox: { background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontSize: 14 },
    profileRow: { display: 'flex', gap: 12, alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f5f5f5' },
    profileLabel: { fontSize: 13, fontWeight: 700, color: '#9ca3af', minWidth: 140 },
    profileValue: { fontSize: 14, color: '#1f2937' },
};

const UserPage = ({ onLogout }: { onLogout?: () => void }) => {
    const [tab, setTab] = useState<Tab>('calculator');
    const [orders, setOrders] = useState<Order[]>([]);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [profile, setProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        pickAppAddress: '',
        deliveryAddress: '',
        description: '',
        cargoWeight: '',
        cargoVolume: '',
    });

    const setF = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

    const loadData = useCallback(async () => {
        try {
            const [o, t, p] = await Promise.all([
                fetchClientOrders(),
                fetchClientTrips(),
                fetchClientProfile()
            ]);
            setOrders(o ?? []);
            setTrips(t ?? []);
            setProfile(p);
        } catch (e) {
            console.error(e);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const handleLogout = async () => {
        try { await logout(); } catch {}
        localStorage.removeItem('userRole');
        onLogout?.();
        window.location.href = '/';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess('');
        setError('');

        if (!form.pickAppAddress || !form.deliveryAddress || !form.description || !form.cargoWeight || !form.cargoVolume) {
            setError('Заполните все поля');
            return;
        }

        try {
            setLoading(true);
            await createOrder({
                pickAppAddress: form.pickAppAddress,
                deliveryAddress: form.deliveryAddress,
                description: form.description,
                cargoWeight: Number(form.cargoWeight),
                cargoVolume: Number(form.cargoVolume),
            });
            setSuccess('Заказ создан! AI система подобрала транспорт и водителя.');
            setForm({ pickAppAddress: '', deliveryAddress: '', description: '', cargoWeight: '', cargoVolume: '' });
            await loadData();
        } catch {
            setError('Ошибка при создании заказа');
        } finally {
            setLoading(false);
        }
    };

    const TABS = [
        { key: 'calculator' as Tab, label: 'Новый заказ' },
        { key: 'orders' as Tab, label: `Мои заказы (${orders.length})` },
        { key: 'trips' as Tab, label: `Мои рейсы (${trips.length})` },
        { key: 'profile' as Tab, label: 'Профиль' },
    ];

    return (
        <div style={S.page}>
            {/* HEADER */}
            <div style={S.header}>
                <div style={S.logo}>KABLUCH<span style={S.accent}>KOFF</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: 13, opacity: 0.7 }}>{profile?.email ?? 'Клиент'}</span>
                    <button style={S.logoutBtn} onClick={handleLogout}>Выйти</button>
                </div>
            </div>

            <div style={S.content}>
                {/* TABS */}
                <div style={S.tabs}>
                    {TABS.map(t => (
                        <button key={t.key} style={S.tabBtn(tab === t.key)} onClick={() => setTab(t.key)}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ===== CALCULATOR ===== */}
                {tab === 'calculator' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 520px', gap: 20, alignItems: 'start' }}>
                        {/* LEFT */}
                        <div style={S.card}>
                            <div style={S.cardHeader}>
                                <h2 style={S.cardTitle}>Создать заказ</h2>
                            </div>
                            <div style={S.cardBody}>
                                <p style={{ color: '#6b7280', marginBottom: 20, fontSize: 14 }}>
                                    AI система автоматически подберёт транспорт и рассчитает стоимость.
                                </p>

                                {success && <div style={S.successBox}>{success}</div>}
                                {error && <div style={S.errorBox}>{error}</div>}

                                <form onSubmit={handleSubmit}>
                                    <div style={S.row}>
                                        <div>
                                            <label style={S.label}>Адрес отправки</label>
                                            <input style={S.input} placeholder="Россия, Москва, ул. Тверская, 1" value={form.pickAppAddress} onChange={e => setF('pickAppAddress', e.target.value)} />
                                        </div>
                                        <div>
                                            <label style={S.label}>Адрес доставки</label>
                                            <input style={S.input} placeholder="Россия, Санкт-Петербург, Невский пр., 1" value={form.deliveryAddress} onChange={e => setF('deliveryAddress', e.target.value)} />
                                        </div>
                                    </div>

                                    <label style={S.label}>Описание груза</label>
                                    <textarea style={S.textarea} placeholder="Мясо, диван, электроника..." value={form.description} onChange={e => setF('description', e.target.value)} />
                                    <p style={S.hint}>💡 Правильное описание повышает точность AI подбора транспорта</p>

                                    <div style={S.row}>
                                        <div>
                                            <label style={S.label}>Вес груза (кг)</label>
                                            <input style={S.input} type="number" placeholder="500" min="1" value={form.cargoWeight} onChange={e => setF('cargoWeight', e.target.value)} />
                                        </div>
                                        <div>
                                            <label style={S.label}>Объём груза (м³)</label>
                                            <input style={S.input} type="number" placeholder="5" min="0.1" step="0.1" value={form.cargoVolume} onChange={e => setF('cargoVolume', e.target.value)} />
                                        </div>
                                    </div>

                                    <button style={S.submitBtn} type="submit" disabled={loading}>
                                        {loading ? 'Создаём заказ...' : 'Создать заказ'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* RIGHT — MAP */}
                        <div style={{ position: 'sticky', top: 90 }}>
                            <div style={{ ...S.card, height: 600 }}>
                                <RouteMap from={form.pickAppAddress} to={form.deliveryAddress} />
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== MY ORDERS ===== */}
                {tab === 'orders' && (
                    <div style={S.card}>
                        <div style={S.cardHeader}><h2 style={S.cardTitle}>Мои заказы</h2></div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={S.table}>
                                <thead><tr>
                                    <th style={S.th}>ID</th>
                                    <th style={S.th}>Маршрут</th>
                                    <th style={S.th}>Описание</th>
                                    <th style={S.th}>Вес / Объём</th>
                                    <th style={S.th}>Дата</th>
                                </tr></thead>
                                <tbody>
                                    {orders.map(o => (
                                        <tr key={o.id}>
                                            <td style={S.td}><span style={S.badge('#6b7280')}>#{o.id}</span></td>
                                            <td style={S.td}>
                                                <div style={{ fontSize: 13 }}>{o.pickAppAddress}</div>
                                                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 3 }}>→ {o.deliveryAddress}</div>
                                            </td>
                                            <td style={S.td}>{o.description}</td>
                                            <td style={S.td}>
                                                <div>{o.cargoWeight} кг</div>
                                                <div style={{ fontSize: 12, color: '#9ca3af' }}>{o.cargoVolume} м³</div>
                                            </td>
                                            <td style={{ ...S.td, color: '#9ca3af', fontSize: 13 }}>
                                                {o.registrationDateOrder ? new Date(o.registrationDateOrder).toLocaleDateString('ru') : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && <tr><td colSpan={5} style={S.emptyRow}>Заказов пока нет. Создайте первый!</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ===== MY TRIPS ===== */}
                {tab === 'trips' && (
                    <div style={S.card}>
                        <div style={S.cardHeader}><h2 style={S.cardTitle}>Мои рейсы</h2></div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={S.table}>
                                <thead><tr>
                                    <th style={S.th}>ID</th>
                                    <th style={S.th}>Маршрут</th>
                                    <th style={S.th}>Водитель</th>
                                    <th style={S.th}>Транспорт</th>
                                    <th style={S.th}>Стоимость</th>
                                    <th style={S.th}>Время</th>
                                </tr></thead>
                                <tbody>
                                    {trips.map(t => (
                                        <tr key={t.id}>
                                            <td style={S.td}><span style={S.badge('#6b7280')}>#{t.id}</span></td>
                                            <td style={S.td}>
                                                <div style={{ fontSize: 13 }}>{t.order?.pickAppAddress ?? '—'}</div>
                                                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 3 }}>→ {t.order?.deliveryAddress ?? '—'}</div>
                                            </td>
                                            <td style={S.td}>
                                                <div style={{ fontWeight: 600 }}>{t.driver?.name ?? '—'}</div>
                                                <div style={{ fontSize: 12, color: '#9ca3af' }}>{t.driver?.passport ?? ''}</div>
                                            </td>
                                            <td style={S.td}>
                                                <div>{t.car?.carMake ?? '—'} {t.car?.carModel ?? ''}</div>
                                                <div style={{ fontSize: 12, color: '#9ca3af' }}>{t.car?.typeOfCar ?? ''}</div>
                                            </td>
                                            <td style={S.td}><span style={S.badge('#059669')}>{t.finalePrice ?? '—'} ₽</span></td>
                                            <td style={S.td}>{t.finaleTimeMinutes ?? '—'} мин</td>
                                        </tr>
                                    ))}
                                    {trips.length === 0 && <tr><td colSpan={6} style={S.emptyRow}>Рейсов пока нет. Создайте заказ!</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ===== PROFILE ===== */}
                {tab === 'profile' && (
                    <div style={S.card}>
                        <div style={S.cardHeader}><h2 style={S.cardTitle}>Мой профиль</h2></div>
                        <div style={S.cardBody}>
                            {profile ? (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid #f0f0f0' }}>
                                        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#fef3e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>👤</div>
                                        <div>
                                            <div style={{ fontSize: 22, fontWeight: 700, color: '#0a1a2f' }}>{profile.userName}</div>
                                            <div style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>Клиент KABLUCHKOFF</div>
                                        </div>
                                    </div>
                                    <div style={S.profileRow}>
                                        <span style={S.profileLabel}>Email</span>
                                        <span style={S.profileValue}>{profile.email ?? '—'}</span>
                                    </div>
                                    <div style={S.profileRow}>
                                        <span style={S.profileLabel}>Телефон</span>
                                        <span style={S.profileValue}>{profile.phoneNumber ?? '—'}</span>
                                    </div>
                                    <div style={S.profileRow}>
                                        <span style={S.profileLabel}>Всего заказов</span>
                                        <span style={S.profileValue}><span style={S.badge('#f59e0b')}>{orders.length}</span></span>
                                    </div>
                                    <div style={{ ...S.profileRow, borderBottom: 'none' }}>
                                        <span style={S.profileLabel}>Всего рейсов</span>
                                        <span style={S.profileValue}><span style={S.badge('#059669')}>{trips.length}</span></span>
                                    </div>
                                </>
                            ) : (
                                <div style={S.emptyRow}>Загрузка...</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserPage;