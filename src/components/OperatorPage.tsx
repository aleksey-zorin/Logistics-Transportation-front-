import { useState, useEffect, useMemo, useCallback } from 'react';

import { fetchOrders, createOrder, updateOrder, deleteOrder } from "../services/order/orders";
import { fetchUsers, deleteUser } from "../services/user/user";
import { fetchTrips, createTrip, updateTrip, deleteTrip } from '../services/trip/trip';
import { fetchDrivers, createDriver, updateDriver, deleteDriver } from '../services/driver/driver';
import { fetchCars, createCar, updateCar, deleteCar } from '../services/car/car';
import { fetchTripLoaders, createTripLoader, updateTripLoader, deleteTripLoader } from '../services/triploader/triploader';
import { fetchLoaders, createLoader, updateLoader, deleteLoader } from '../services/loader/loader';
import { fetchLicenceCategories, createLicenceCategory, updateLicenceCategory, deleteLicenceCategory } from '../services/licenceCategory/licenceCategory';
import { logout } from "../services/auth/auth";

import { Order } from "../services/order/order.struct";
import { User } from "../services/user/user.struct";
import { Trip } from '../services/trip/trip.struct';
import { Car } from '../services/car/car.struct';
import { Driver } from '../services/driver/driver.struct';
import { Loader } from '../services/loader/loader.struct';
import { TripLoader } from '../services/triploader/triploader.struct';
import { licenceCategories as LicenceCategory } from '../services/licenceCategory/licenceCategory.struct';

type TabType = 'users' | 'orders' | 'trips' | 'drivers' | 'cars' | 'loaders' | 'triploaders' | 'licenceCategories';

const S = {
    page: { minHeight: '100vh', background: '#f0f2f5', fontFamily: "'DM Sans', sans-serif" } as React.CSSProperties,
    header: { background: '#0a1a2f', color: '#fff', padding: '0 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64, position: 'sticky' as const, top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.2)' },
    logo: { fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' },
    accent: { color: '#f59e0b' },
    logoutBtn: { background: 'transparent', border: '1px solid rgba(239,68,68,0.6)', color: '#f87171', padding: '6px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
    content: { padding: '24px 32px' },
    tabs: { display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' as const },
    tabBtn: (active: boolean) => ({ padding: '8px 18px', background: active ? '#f59e0b' : '#fff', color: active ? '#fff' : '#374151', border: active ? '1.5px solid #f59e0b' : '1.5px solid #e5e7eb', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600 }),
    card: { background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
    cardHeader: { padding: '16px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' },
    cardTitle: { fontSize: 18, fontWeight: 700, color: '#0a1a2f', margin: 0 },
    addBtn: { background: '#f59e0b', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 },
    applyBtn: { background: '#0a1a2f', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, alignSelf: 'flex-end' as const },
    resetBtn: { background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, alignSelf: 'flex-end' as const },
    filterRow: { display: 'flex', gap: 10, flexWrap: 'wrap' as const, padding: '14px 20px', background: '#f8f9fa', borderBottom: '1px solid #f0f0f0', alignItems: 'flex-end' },
    filterGroup: { display: 'flex', flexDirection: 'column' as const, gap: 4 },
    filterLabel: { fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' as const, letterSpacing: '0.4px' },
    filterInput: { padding: '7px 12px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 13, outline: 'none', width: 140, background: '#fff' },
    table: { width: '100%', borderCollapse: 'collapse' as const },
    th: { padding: '12px 16px', textAlign: 'left' as const, background: '#f8f9fa', fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.5px', borderBottom: '1px solid #f0f0f0' },
    td: { padding: '12px 16px', fontSize: 14, color: '#1f2937', borderBottom: '1px solid #f5f5f5', verticalAlign: 'middle' as const },
    editBtn: { background: '#eff6ff', color: '#2563eb', border: 'none', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, marginRight: 6 },
    deleteBtn: { background: '#fef2f2', color: '#dc2626', border: 'none', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 },
    overlay: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' },
    modal: { background: '#fff', borderRadius: 20, padding: 32, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' as const, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
    modalTitle: { fontSize: 20, fontWeight: 800, color: '#0a1a2f', marginBottom: 20 },
    label: { display: 'block', fontSize: 12, fontWeight: 700, color: '#6b7280', marginBottom: 5, textTransform: 'uppercase' as const, letterSpacing: '0.5px' },
    input: { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const, marginBottom: 14 },
    saveBtn: { background: '#f59e0b', color: '#fff', border: 'none', padding: '11px 0', borderRadius: 10, cursor: 'pointer', fontSize: 15, fontWeight: 700, width: '100%', marginTop: 8 },
    cancelBtn: { background: '#f3f4f6', color: '#374151', border: 'none', padding: '11px 0', borderRadius: 10, cursor: 'pointer', fontSize: 15, fontWeight: 600, width: '100%', marginTop: 8 },
    badge: (color: string) => ({ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: color + '22', color }),
    emptyRow: { padding: '40px', textAlign: 'center' as const, color: '#9ca3af', fontSize: 14 },
};

// Компоненты
const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
    <div style={S.overlay} onClick={onClose}>
        <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={S.modalTitle}>{title}</h2>
                <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#9ca3af' }}>×</button>
            </div>
            {children}
        </div>
    </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div><label style={S.label}>{label}</label>{children}</div>
);

// Компонент поля фильтра
const FI = ({ label, value, onChange, placeholder = '' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) => (
    <div style={S.filterGroup}>
        <span style={S.filterLabel}>{label}</span>
        <input style={S.filterInput} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
    </div>
);

const OperatorPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [cars, setCars] = useState<Car[]>([]);
    const [loaders, setLoaders] = useState<Loader[]>([]);
    const [triploaders, setTripLoaders] = useState<TripLoader[]>([]);
    const [licenceCategories, setLicenceCategories] = useState<LicenceCategory[]>([]);
    const [activeTab, setActiveTab] = useState<TabType>('users');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modal, setModal] = useState<{ type: string; item?: any } | null>(null);
    const [form, setForm] = useState<any>({});

    // Состояния фильтров
    const [uf, setUf] = useState({ email: '', phone: '' });
    const [of, setOf] = useState({ email: '', pickAppAdress: '', deliveryAdress: '', description: '', dateFrom: '', dateTo: '', minWeight: '', maxWeight: '', minVolume: '', maxVolume: '' });
    const [tf, setTf] = useState({ orderId: '', driverId: '', carId: '', minFinalePrice: '', maxFinalePrice: '', minFinaleTimeMinutes: '', maxFinaleTimeMinutes: '' });
    const [df, setDf] = useState({ name: '', passport: '', minAge: '', maxAge: '', minRate: '', maxRate: '', licenceCategory: '' });
    const [cf, setCf] = useState({ carMake: '', carModel: '', typeOfCar: '', carNumber: '', minCargoCapacityT: '', maxCargoCapacityT: '', minTrunkVolumeT: '', maxTrunkVolumeL: '', minFuelConsumption: '', maxFuelConsumption: '', licenceCategory: '' });
    const [lf, setLf] = useState({ name: '', passport: '', minAge: '', maxAge: '' });
    const [tlf, setTlf] = useState({ tripId: '', loaderId: '' });
    const [lcf, setLcf] = useState({ licenceName: '' });

    // Очищаем пустые параметры
    const clean = (obj: Record<string, string>) =>
        Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== ''));

    // Функции загрузки с фильтрами
    const loadUsers = useCallback(async (f = uf) => { setUsers((await fetchUsers(clean(f).email, clean(f).phone)) ?? []); }, []);
    const loadOrders = useCallback(async (f = of) => { setOrders((await fetchOrders(clean(f) as any)) ?? []); }, []);
    const loadTrips = useCallback(async (f = tf) => { setTrips((await fetchTrips(clean(f) as any)) ?? []); }, []);
    const loadDrivers = useCallback(async (f = df) => { setDrivers((await fetchDrivers(clean(f) as any)) ?? []); }, []);
    const loadCars = useCallback(async (f = cf) => { setCars((await fetchCars(clean(f) as any)) ?? []); }, []);
    const loadLoaders = useCallback(async (f = lf) => { setLoaders((await fetchLoaders(clean(f) as any)) ?? []); }, []);
    const loadTripLoaders = useCallback(async (f = tlf) => { setTripLoaders((await fetchTripLoaders(clean(f) as any)) ?? []); }, []);
    const loadLicenceCategories = useCallback(async (f = lcf) => { setLicenceCategories((await fetchLicenceCategories(clean(f).licenceName)) ?? []); }, []);

    const loadAll = useCallback(async () => {
        try {
            setLoading(true);
            await Promise.all([loadUsers(), loadOrders(), loadTrips(), loadDrivers(), loadCars(), loadLoaders(), loadTripLoaders(), loadLicenceCategories()]);
        } catch { setError('Ошибка загрузки данных'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { loadAll(); }, []);

    const usersMap = useMemo(() => new Map(users.map(u => [String(u.id), u])), [users]);

    const handleLogout = useCallback(async () => {
        try { await logout(); } catch {}
        localStorage.removeItem('userRole');
        window.location.href = '/';
    }, []);

    // Модалки
    const openCreate = (type: string) => { setForm({}); setModal({ type: `create-${type}` }); };
    const openEdit = (type: string, item: any) => { setForm({ ...item }); setModal({ type: `edit-${type}`, item }); };
    const closeModal = () => { setModal(null); setForm({}); };
    const fv = (key: string) => form[key] ?? '';
    const setF = (key: string, val: any) => setForm((p: any) => ({ ...p, [key]: val }));
    const inp = (key: string, label: string, type = 'text') => (
        <Field label={label}><input style={S.input} type={type} value={fv(key)} onChange={e => setF(key, e.target.value)} /></Field>
    );

    const handleDelete = async (id: number | string, fn: (id: any) => Promise<any>) => {
        if (!window.confirm('Удалить?')) return;
        try { await fn(id); await loadAll(); } catch { alert('Ошибка удаления'); }
    };

    const handleSave = async () => {
        try {
            const t = modal?.type ?? '';
            if (t === 'create-car') await createCar(form);
            else if (t === 'edit-car') await updateCar(modal!.item.id, form);
            else if (t === 'create-driver') await createDriver(form);
            else if (t === 'edit-driver') await updateDriver(modal!.item.id, form);
            else if (t === 'create-loader') await createLoader(form);
            else if (t === 'edit-loader') await updateLoader(modal!.item.id, form);
            else if (t === 'create-order') await createOrder(form);
            else if (t === 'edit-order') await updateOrder(modal!.item.id, form);
            else if (t === 'create-trip') await createTrip(form);
            else if (t === 'edit-trip') await updateTrip(modal!.item.id, form);
            else if (t === 'create-triploader') await createTripLoader(form);
            else if (t === 'edit-triploader') await updateTripLoader(modal!.item.id, form);
            else if (t === 'create-licence') await createLicenceCategory(form.name);
            else if (t === 'edit-licence') await updateLicenceCategory(modal!.item.id, form.name);
            await loadAll(); closeModal();
        } catch { alert('Ошибка сохранения'); }
    };

    const btns = <><button style={S.saveBtn} onClick={handleSave}>Сохранить</button><button style={S.cancelBtn} onClick={closeModal}>Отмена</button></>;

    const renderForm = () => {
        const t = modal?.type ?? '';
        const isEdit = t.startsWith('edit');
        const title = isEdit ? 'Редактировать' : 'Добавить';
        if (t.includes('car')) return <Modal title={`${title} машину`} onClose={closeModal}>{inp('carMake', 'Марка')}{inp('carModel', 'Модель')}{inp('typeOfCar', 'Тип')}{inp('carNumber', 'Госномер')}{inp('cargoCapacityT', 'Грузоподъёмность (т)', 'number')}{inp('trunkVolumeL', 'Объём (м³)', 'number')}{inp('fuelConsumption', 'Расход (л/100км)', 'number')}{inp('licenceCategories', 'Категория прав')}{btns}</Modal>;
        if (t.includes('driver')) return <Modal title={`${title} водителя`} onClose={closeModal}>{inp('name', 'Имя')}{inp('passport', 'Паспорт')}{inp('age', 'Возраст', 'number')}{inp('rate', 'Ставка (₽/ч)', 'number')}{inp('licenceCategories', 'Категория прав')}{btns}</Modal>;
        if (t.includes('loader') && !t.includes('trip')) return <Modal title={`${title} грузчика`} onClose={closeModal}>{inp('name', 'Имя')}{inp('passport', 'Паспорт')}{inp('age', 'Возраст', 'number')}{btns}</Modal>;
        if (t.includes('order')) return <Modal title={`${title} заказ`} onClose={closeModal}>{inp('pickAppAddress', 'Адрес отправки')}{inp('deliveryAddress', 'Адрес доставки')}{inp('description', 'Описание')}{inp('cargoWeight', 'Вес (кг)', 'number')}{inp('cargoVolume', 'Объём (м³)', 'number')}{btns}</Modal>;
        if (t.includes('trip') && !t.includes('loader')) return <Modal title={`${title} рейс`} onClose={closeModal}>{!isEdit && inp('orderId', 'ID заказа', 'number')}{inp('driverId', 'ID водителя', 'number')}{inp('carId', 'ID машины', 'number')}{inp('finalePrice', 'Цена (₽)', 'number')}{inp('finalTimeMinutes', 'Время (мин)', 'number')}{btns}</Modal>;
        if (t.includes('triploader')) return <Modal title={`${title} назначение`} onClose={closeModal}>{inp('tripId', 'ID рейса', 'number')}{inp('loaderId', 'ID грузчика', 'number')}{btns}</Modal>;
        if (t.includes('licence')) return <Modal title={`${title} категорию`} onClose={closeModal}>{inp('name', 'Название (B, C...)')}{btns}</Modal>;
        return null;
    };

    const TABS: { key: TabType; label: string; count: number }[] = [
        { key: 'users', label: 'Пользователи', count: users.length },
        { key: 'orders', label: 'Заказы', count: orders.length },
        { key: 'trips', label: 'Рейсы', count: trips.length },
        { key: 'drivers', label: 'Водители', count: drivers.length },
        { key: 'cars', label: 'Машины', count: cars.length },
        { key: 'loaders', label: 'Грузчики', count: loaders.length },
        { key: 'triploaders', label: 'Грузчики в рейсе', count: triploaders.length },
        { key: 'licenceCategories', label: 'Кат. прав', count: licenceCategories.length },
    ];

    if (loading) return <div style={{ padding: 60, textAlign: 'center', color: '#6b7280' }}>Загрузка...</div>;
    if (error) return <div style={{ padding: 60, textAlign: 'center', color: '#dc2626' }}>{error}</div>;

    return (
        <div style={S.page}>
            <div style={S.header}>
                <div style={S.logo}>KABLUCH<span style={S.accent}>KOFF</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: 13, opacity: 0.7 }}>Оператор</span>
                    <button style={S.logoutBtn} onClick={handleLogout}>Выйти</button>
                </div>
            </div>

            <div style={S.content}>
                <div style={S.tabs}>
                    {TABS.map(tab => (
                        <button key={tab.key} style={S.tabBtn(activeTab === tab.key)} onClick={() => setActiveTab(tab.key)}>
                            {tab.label} <span style={{ opacity: 0.7, fontWeight: 400 }}>({tab.count})</span>
                        </button>
                    ))}
                </div>

                {/* ===== USERS ===== */}
                {activeTab === 'users' && (
                    <div style={S.card}>
                        <div style={S.cardHeader}><h2 style={S.cardTitle}>Пользователи</h2></div>
                        <div style={S.filterRow}>
                            <FI label="Email" value={uf.email} onChange={v => setUf(p => ({ ...p, email: v }))} placeholder="user@mail.ru" />
                            <FI label="Телефон" value={uf.phone} onChange={v => setUf(p => ({ ...p, phone: v }))} placeholder="+7..." />
                            <button style={S.applyBtn} onClick={() => loadUsers(uf)}>Применить</button>
                            <button style={S.resetBtn} onClick={() => { const r = { email: '', phone: '' }; setUf(r); loadUsers(r); }}>Сбросить</button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={S.table}>
                                <thead><tr><th style={S.th}>ID</th><th style={S.th}>Имя</th><th style={S.th}>Email</th><th style={S.th}>Телефон</th></tr></thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id}>
                                            <td style={S.td}><span style={S.badge('#6b7280')}>#{String(u.id).substring(0, 8)}...</span></td>
                                            <td style={S.td}><strong>{u.userName ?? '—'}</strong></td>
                                            <td style={S.td}>{u.email ?? '—'}</td>
                                            <td style={S.td}>{u.phoneNumber ?? '—'}</td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && <tr><td colSpan={5} style={S.emptyRow}>Нет данных</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ===== ORDERS ===== */}
                {activeTab === 'orders' && (
                    <div style={S.card}>
                        <div style={S.cardHeader}><h2 style={S.cardTitle}>Заказы</h2><button style={S.addBtn} onClick={() => openCreate('order')}>+ Добавить</button></div>
                        <div style={S.filterRow}>
                            <FI label="Email клиента" value={of.email} onChange={v => setOf(p => ({ ...p, email: v }))} />
                            <FI label="Откуда" value={of.pickAppAdress} onChange={v => setOf(p => ({ ...p, pickAppAdress: v }))} />
                            <FI label="Куда" value={of.deliveryAdress} onChange={v => setOf(p => ({ ...p, deliveryAdress: v }))} />
                            <FI label="Описание" value={of.description} onChange={v => setOf(p => ({ ...p, description: v }))} />
                            <FI label="Дата от" value={of.dateFrom} onChange={v => setOf(p => ({ ...p, dateFrom: v }))} placeholder="2024-01-01" />
                            <FI label="Дата до" value={of.dateTo} onChange={v => setOf(p => ({ ...p, dateTo: v }))} placeholder="2024-12-31" />
                            <FI label="Вес мин (кг)" value={of.minWeight} onChange={v => setOf(p => ({ ...p, minWeight: v }))} placeholder="0" />
                            <FI label="Вес макс (кг)" value={of.maxWeight} onChange={v => setOf(p => ({ ...p, maxWeight: v }))} placeholder="9999" />
                            <FI label="Объём мин (м³)" value={of.minVolume} onChange={v => setOf(p => ({ ...p, minVolume: v }))} placeholder="0" />
                            <FI label="Объём макс (м³)" value={of.maxVolume} onChange={v => setOf(p => ({ ...p, maxVolume: v }))} placeholder="999" />
                            <button style={S.applyBtn} onClick={() => loadOrders(of)}>Применить</button>
                            <button style={S.resetBtn} onClick={() => { const r = { email: '', pickAppAdress: '', deliveryAdress: '', description: '', dateFrom: '', dateTo: '', minWeight: '', maxWeight: '', minVolume: '', maxVolume: '' }; setOf(r); loadOrders(r); }}>Сбросить</button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={S.table}>
                                <thead><tr><th style={S.th}>ID</th><th style={S.th}>Клиент</th><th style={S.th}>Маршрут</th><th style={S.th}>Груз</th><th style={S.th}>Описание</th><th style={S.th}>Дата</th><th style={S.th}>Действия</th></tr></thead>
                                <tbody>
                                    {orders.map(o => {
                                        const u = usersMap.get(String(o.userId));
                                        return (
                                            <tr key={o.id}>
                                                <td style={S.td}><span style={S.badge('#6b7280')}>#{o.id}</span></td>
                                                <td style={S.td}><div style={{ fontWeight: 600 }}>{u?.userName ?? 'Неизвестно'}</div><div style={{ fontSize: 12, color: '#9ca3af' }}>{u?.phoneNumber ?? ''}</div></td>
                                                <td style={S.td}><div style={{ fontSize: 13 }}>{String(o.pickAppAddress ?? '').substring(0, 25)}...</div><div style={{ fontSize: 13, color: '#6b7280' }}>→ {String(o.deliveryAddress ?? '').substring(0, 25)}...</div></td>
                                                <td style={S.td}><div>{o.cargoVolume} м³</div><div style={{ fontSize: 12, color: '#9ca3af' }}>{o.cargoWeight} кг</div></td>
                                                <td style={S.td}>{String(o.description ?? '').substring(0, 30)}</td>
                                                <td style={S.td}>{o.registrationDateOrder ? new Date(o.registrationDateOrder).toLocaleDateString() : '—'}</td>
                                                <td style={S.td}><button style={S.editBtn} onClick={() => openEdit('order', o)}>Ред.</button><button style={S.deleteBtn} onClick={() => handleDelete(o.id, deleteOrder)}>Удалить</button></td>
                                            </tr>
                                        );
                                    })}
                                    {orders.length === 0 && <tr><td colSpan={7} style={S.emptyRow}>Нет заказов</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ===== TRIPS ===== */}
                {activeTab === 'trips' && (
                    <div style={S.card}>
                        <div style={S.cardHeader}><h2 style={S.cardTitle}>Рейсы</h2><button style={S.addBtn} onClick={() => openCreate('trip')}>+ Добавить</button></div>
                        <div style={S.filterRow}>
                            <FI label="ID заказа" value={tf.orderId} onChange={v => setTf(p => ({ ...p, orderId: v }))} placeholder="1" />
                            <FI label="ID водителя" value={tf.driverId} onChange={v => setTf(p => ({ ...p, driverId: v }))} placeholder="1" />
                            <FI label="ID машины" value={tf.carId} onChange={v => setTf(p => ({ ...p, carId: v }))} placeholder="1" />
                            <FI label="Цена мин (₽)" value={tf.minFinalePrice} onChange={v => setTf(p => ({ ...p, minFinalePrice: v }))} placeholder="0" />
                            <FI label="Цена макс (₽)" value={tf.maxFinalePrice} onChange={v => setTf(p => ({ ...p, maxFinalePrice: v }))} placeholder="99999" />
                            <FI label="Время мин (мин)" value={tf.minFinaleTimeMinutes} onChange={v => setTf(p => ({ ...p, minFinaleTimeMinutes: v }))} placeholder="0" />
                            <FI label="Время макс (мин)" value={tf.maxFinaleTimeMinutes} onChange={v => setTf(p => ({ ...p, maxFinaleTimeMinutes: v }))} placeholder="9999" />
                            <button style={S.applyBtn} onClick={() => loadTrips(tf)}>Применить</button>
                            <button style={S.resetBtn} onClick={() => { const r = { orderId: '', driverId: '', carId: '', minFinalePrice: '', maxFinalePrice: '', minFinaleTimeMinutes: '', maxFinaleTimeMinutes: '' }; setTf(r); loadTrips(r); }}>Сбросить</button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={S.table}>
                                <thead><tr><th style={S.th}>ID</th><th style={S.th}>ID Заказа</th><th style={S.th}>Автор заказа</th><th style={S.th}>Маршрут</th><th style={S.th}>ID Водителя</th><th style={S.th}>Водитель</th><th style={S.th}>ID машины</th><th style={S.th}>Машина</th><th style={S.th}>Цена</th><th style={S.th}>Время</th><th style={S.th}>Действия</th></tr></thead>
                                <tbody>
                                    {trips.map(t => {
                                        const u = usersMap.get(String(t.order?.userId));
                                        return (
                                            <tr key={t.id}>
                                                <td style={S.td}><span style={S.badge('#6b7280')}>#{t.id}</span></td>

                                                <td style={S.td}><span style={S.badge('#6b7280')}>{t.order?.id ?? '-'}</span></td>
                                                <td style={S.td}><div style={{ fontWeight: 600 }}>{u?.email ?? '—'}</div><div style={{ fontSize: 12, color: '#9ca3af' }}>{u?.phoneNumber ?? ''}</div></td>
                                                <td style={S.td}><div style={{ fontSize: 12 }}>{String(t.order?.pickAppAddress ?? '').substring(0, 20)}...</div><div style={{ fontSize: 12, color: '#6b7280' }}>→ {String(t.order?.deliveryAddress ?? '').substring(0, 20)}...</div></td>

                                                <td style={S.td}><span style={S.badge('#6b7280')}>{t.driver?.id ?? '-'}</span></td>
                                                <td style={S.td}><div style={{ fontWeight: 600 }}>{t.driver?.name ?? '—'}</div><div style={{ fontSize: 12, color: '#9ca3af' }}>{t.driver?.passport ?? ''}</div></td>

                                                <td style={S.td}><span style={S.badge('#6b7280')}>{t.car?.id ?? '-'}</span></td>
                                                <td style={S.td}><div>{t.car?.carMake ?? '—'} {t.car?.carModel ?? ''}</div><div style={{ fontSize: 12, color: '#9ca3af' }}>{t.car?.typeOfCar ?? ''}</div></td>

                                                <td style={S.td}><span style={S.badge('#059669')}>{t.finalePrice ?? '—'} ₽</span></td>
                                                <td style={S.td}>{t.finaleTimeMinutes ?? '—'} мин</td>
                                                <td style={S.td}><button style={S.editBtn} onClick={() => openEdit('trip', t)}>Ред.</button><button style={S.deleteBtn} onClick={() => handleDelete(t.id, deleteTrip)}>Удалить</button></td>
                                            </tr>
                                        );
                                    })}
                                    {trips.length === 0 && <tr><td colSpan={8} style={S.emptyRow}>Нет рейсов</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ===== DRIVERS ===== */}
                {activeTab === 'drivers' && (
                    <div style={S.card}>
                        <div style={S.cardHeader}><h2 style={S.cardTitle}>Водители</h2></div>
                        <div style={S.filterRow}>
                            <FI label="Имя" value={df.name} onChange={v => setDf(p => ({ ...p, name: v }))} />
                            <FI label="Паспорт" value={df.passport} onChange={v => setDf(p => ({ ...p, passport: v }))} />
                            <FI label="Возраст мин" value={df.minAge} onChange={v => setDf(p => ({ ...p, minAge: v }))} placeholder="18" />
                            <FI label="Возраст макс" value={df.maxAge} onChange={v => setDf(p => ({ ...p, maxAge: v }))} placeholder="65" />
                            <FI label="Ставка мин (₽)" value={df.minRate} onChange={v => setDf(p => ({ ...p, minRate: v }))} placeholder="0" />
                            <FI label="Ставка макс (₽)" value={df.maxRate} onChange={v => setDf(p => ({ ...p, maxRate: v }))} placeholder="9999" />
                            <FI label="Категория прав" value={df.licenceCategory} onChange={v => setDf(p => ({ ...p, licenceCategory: v }))} placeholder="B, C..." />
                            <button style={S.applyBtn} onClick={() => loadDrivers(df)}>Применить</button>
                            <button style={S.resetBtn} onClick={() => { const r = { name: '', passport: '', minAge: '', maxAge: '', minRate: '', maxRate: '', licenceCategory: '' }; setDf(r); loadDrivers(r); }}>Сбросить</button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={S.table}>
                                <thead><tr><th style={S.th}>ID</th><th style={S.th}>Имя</th><th style={S.th}>Паспорт</th><th style={S.th}>Возраст</th><th style={S.th}>Ставка</th><th style={S.th}>Категория</th></tr></thead>
                                <tbody>
                                    {drivers.map(d => (
                                        <tr key={d.id}>
                                            <td style={S.td}><span style={S.badge('#6b7280')}>#{d.id}</span></td>
                                            <td style={S.td}><strong>{d.name ?? '—'}</strong></td>
                                            <td style={S.td}>{d.passport ?? '—'}</td>
                                            <td style={S.td}>{d.age ?? '—'}</td>
                                            <td style={S.td}><span style={S.badge('#d97706')}>{d.rate ?? '—'} ₽/ч</span></td>
                                            <td style={S.td}><span style={S.badge('#2563eb')}>{d.licenceCategories?.name ?? '—'}</span></td>
                                        </tr>
                                    ))}
                                    {drivers.length === 0 && <tr><td colSpan={7} style={S.emptyRow}>Нет водителей</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ===== CARS ===== */}
                {activeTab === 'cars' && (
                    <div style={S.card}>
                        <div style={S.cardHeader}><h2 style={S.cardTitle}>Машины</h2></div>
                        <div style={S.filterRow}>
                            <FI label="Марка" value={cf.carMake} onChange={v => setCf(p => ({ ...p, carMake: v }))} placeholder="Volvo" />
                            <FI label="Модель" value={cf.carModel} onChange={v => setCf(p => ({ ...p, carModel: v }))} placeholder="FH 460" />
                            <FI label="Тип" value={cf.typeOfCar} onChange={v => setCf(p => ({ ...p, typeOfCar: v }))} placeholder="Refrigerator" />
                            <FI label="Госномер" value={cf.carNumber} onChange={v => setCf(p => ({ ...p, carNumber: v }))} />
                            <FI label="Груз. мин (т)" value={cf.minCargoCapacityT} onChange={v => setCf(p => ({ ...p, minCargoCapacityT: v }))} placeholder="0" />
                            <FI label="Груз. макс (т)" value={cf.maxCargoCapacityT} onChange={v => setCf(p => ({ ...p, maxCargoCapacityT: v }))} placeholder="30" />
                            <FI label="Объём мин (м³)" value={cf.minTrunkVolumeT} onChange={v => setCf(p => ({ ...p, minTrunkVolumeT: v }))} placeholder="0" />
                            <FI label="Объём макс (м³)" value={cf.maxTrunkVolumeL} onChange={v => setCf(p => ({ ...p, maxTrunkVolumeL: v }))} placeholder="100" />
                            <FI label="Расход мин" value={cf.minFuelConsumption} onChange={v => setCf(p => ({ ...p, minFuelConsumption: v }))} placeholder="0" />
                            <FI label="Расход макс" value={cf.maxFuelConsumption} onChange={v => setCf(p => ({ ...p, maxFuelConsumption: v }))} placeholder="50" />
                            <FI label="Категория прав" value={cf.licenceCategory} onChange={v => setCf(p => ({ ...p, licenceCategory: v }))} placeholder="B, C..." />
                            <button style={S.applyBtn} onClick={() => loadCars(cf)}>Применить</button>
                            <button style={S.resetBtn} onClick={() => { const r = { carMake: '', carModel: '', typeOfCar: '', carNumber: '', minCargoCapacityT: '', maxCargoCapacityT: '', minTrunkVolumeT: '', maxTrunkVolumeL: '', minFuelConsumption: '', maxFuelConsumption: '', licenceCategory: '' }; setCf(r); loadCars(r); }}>Сбросить</button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={S.table}>
                                <thead><tr><th style={S.th}>ID</th><th style={S.th}>Марка / Модель</th><th style={S.th}>Тип</th><th style={S.th}>Госномер</th><th style={S.th}>Груз. (т)</th><th style={S.th}>Объём (м³)</th><th style={S.th}>Расход</th><th style={S.th}>Кат.</th></tr></thead>
                                <tbody>
                                    {cars.map(c => (
                                        <tr key={c.id}>
                                            <td style={S.td}><span style={S.badge('#6b7280')}>#{c.id}</span></td>
                                            <td style={S.td}><div style={{ fontWeight: 600 }}>{c.carMake ?? '—'}</div><div style={{ fontSize: 12, color: '#9ca3af' }}>{c.carModel ?? ''}</div></td>
                                            <td style={S.td}><span style={S.badge('#7c3aed')}>{c.typeOfCar ?? '—'}</span></td>
                                            <td style={S.td}>{c.carNumber ?? '—'}</td>
                                            <td style={S.td}>{c.cargoCapacityT ?? '—'}</td>
                                            <td style={S.td}>{c.trunkVolumeL ?? '—'}</td>
                                            <td style={S.td}>{c.fuelConsumption ?? '—'} л</td>
                                            <td style={S.td}><span style={S.badge('#2563eb')}>{c.licenceCategories?.name ?? '—'}</span></td>
                                        </tr>
                                    ))}
                                    {cars.length === 0 && <tr><td colSpan={9} style={S.emptyRow}>Нет машин</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ===== LOADERS ===== */}
                {activeTab === 'loaders' && (
                    <div style={S.card}>
                        <div style={S.cardHeader}><h2 style={S.cardTitle}>Грузчики</h2></div>
                        <div style={S.filterRow}>
                            <FI label="Имя" value={lf.name} onChange={v => setLf(p => ({ ...p, name: v }))} />
                            <FI label="Паспорт" value={lf.passport} onChange={v => setLf(p => ({ ...p, passport: v }))} />
                            <FI label="Возраст мин" value={lf.minAge} onChange={v => setLf(p => ({ ...p, minAge: v }))} placeholder="18" />
                            <FI label="Возраст макс" value={lf.maxAge} onChange={v => setLf(p => ({ ...p, maxAge: v }))} placeholder="65" />
                            <button style={S.applyBtn} onClick={() => loadLoaders(lf)}>Применить</button>
                            <button style={S.resetBtn} onClick={() => { const r = { name: '', passport: '', minAge: '', maxAge: '' }; setLf(r); loadLoaders(r); }}>Сбросить</button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={S.table}>
                                <thead><tr><th style={S.th}>ID</th><th style={S.th}>Имя</th><th style={S.th}>Паспорт</th><th style={S.th}>Возраст</th></tr></thead>
                                <tbody>
                                    {loaders.map(l => (
                                        <tr key={l.id}>
                                            <td style={S.td}><span style={S.badge('#6b7280')}>#{l.id}</span></td>
                                            <td style={S.td}><strong>{l.name ?? '—'}</strong></td>
                                            <td style={S.td}>{l.passport ?? '—'}</td>
                                            <td style={S.td}>{l.age ?? '—'}</td>
                                        </tr>
                                    ))}
                                    {loaders.length === 0 && <tr><td colSpan={5} style={S.emptyRow}>Нет грузчиков</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ===== TRIPLOADERS ===== */}
                {activeTab === 'triploaders' && (
                    <div style={S.card}>
                        <div style={S.cardHeader}><h2 style={S.cardTitle}>Грузчики в рейсах</h2><button style={S.addBtn} onClick={() => openCreate('triploader')}>+ Добавить</button></div>
                        <div style={S.filterRow}>
                            <FI label="ID рейса" value={tlf.tripId} onChange={v => setTlf(p => ({ ...p, tripId: v }))} placeholder="1" />
                            <FI label="ID грузчика" value={tlf.loaderId} onChange={v => setTlf(p => ({ ...p, loaderId: v }))} placeholder="1" />
                            <button style={S.applyBtn} onClick={() => loadTripLoaders(tlf)}>Применить</button>
                            <button style={S.resetBtn} onClick={() => { const r = { tripId: '', loaderId: '' }; setTlf(r); loadTripLoaders(r); }}>Сбросить</button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={S.table}>
                                <thead><tr><th style={S.th}>ID</th><th style={S.th}>Рейс</th><th style={S.th}>Маршрут</th><th style={S.th}>Грузчик</th><th style={S.th}>Действия</th></tr></thead>
                                <tbody>
                                    {triploaders.map(tl => (
                                        <tr key={tl.id}>
                                            <td style={S.td}><span style={S.badge('#6b7280')}>#{tl.id}</span></td>
                                            <td style={S.td}><div style={{ fontWeight: 600 }}>Рейс #{tl.trip?.id ?? '—'}</div><div style={{ fontSize: 12, color: '#9ca3af' }}>Заказ #{tl.trip?.order?.id ?? '—'}</div></td>
                                            <td style={S.td}><div style={{ fontSize: 12 }}>{String(tl.trip?.order?.pickAppAddress ?? '').substring(0, 20)}...</div><div style={{ fontSize: 12, color: '#6b7280' }}>→ {String(tl.trip?.order?.deliveryAddress ?? '').substring(0, 20)}...</div></td>
                                            <td style={S.td}><div style={{ fontWeight: 600 }}>{tl.loader?.name ?? '—'}</div><div style={{ fontSize: 12, color: '#9ca3af' }}>{tl.loader?.passport ?? ''}</div></td>
                                            <td style={S.td}><button style={S.editBtn} onClick={() => openEdit('triploader', { tripId: tl.trip?.id, loaderId: tl.loader?.id })}>Ред.</button><button style={S.deleteBtn} onClick={() => handleDelete(tl.id, deleteTripLoader)}>Удалить</button></td>
                                        </tr>
                                    ))}
                                    {triploaders.length === 0 && <tr><td colSpan={5} style={S.emptyRow}>Нет назначений</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ===== LICENCE CATEGORIES ===== */}
                {activeTab === 'licenceCategories' && (
                    <div style={S.card}>
                        <div style={S.cardHeader}><h2 style={S.cardTitle}>Категории прав</h2></div>
                        <div style={S.filterRow}>
                            <FI label="Название" value={lcf.licenceName} onChange={v => setLcf(p => ({ ...p, licenceName: v }))} placeholder="B, C..." />
                            <button style={S.applyBtn} onClick={() => loadLicenceCategories(lcf)}>Применить</button>
                            <button style={S.resetBtn} onClick={() => { const r = { licenceName: '' }; setLcf(r); loadLicenceCategories(r); }}>Сбросить</button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={S.table}>
                                <thead><tr><th style={S.th}>ID</th><th style={S.th}>Категория</th></tr></thead>
                                <tbody>
                                    {licenceCategories.map(lc => (
                                        <tr key={lc.id}>
                                            <td style={S.td}><span style={S.badge('#6b7280')}>#{lc.id}</span></td>
                                            <td style={S.td}><span style={S.badge('#2563eb')}>{lc.name ?? '—'}</span></td>
                                        </tr>
                                    ))}
                                    {licenceCategories.length === 0 && <tr><td colSpan={3} style={S.emptyRow}>Нет категорий</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {modal && renderForm()}
        </div>
    );
};

export default OperatorPage;