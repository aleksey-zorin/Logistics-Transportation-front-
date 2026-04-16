import { useState, useEffect, useMemo, useCallback } from 'react';
import '../styles/global.css';

import { fetchOrders } from "../services/order/orders";
import { fetchUsers, fetchById } from "../services/user/user";
import { fetchTrips } from '../services/trip/trip';
import { fetchDrivers } from '../services/driver/driver';
import { fetchCars } from '../services/car/car';
import { fetchTripLoaders } from '../services/triploader/triploader';
import { fetchLoaders } from '../services/loader/loader';
import { fetchLicenceCategories } from '../services/licenceCategory/licenceCategory';

import { logout } from "../services/auth/auth";

import { Order } from "../services/order/order.struct";
import { User } from "../services/user/user.struct";
import { Trip } from '../services/trip/trip.struct';
import { Car } from '../services/car/car.struct';
import { Driver } from '../services/driver/driver.struct';
import { Loader } from '../services/loader/loader.struct';
import { TripLoader } from '../services/triploader/triploader.struct';
import { licenceCategories } from '../services/licenceCategory/licenceCategory.struct';

const AdminPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [cars, setCars] = useState<Car[]>([]);
    const [loaders, setLoaders] = useState<Loader[]>([]);
    const [triploaders, setTripLoaders] = useState<TripLoader[]>([]);
    const [licenceCategories, setLicenceCategories] = useState<licenceCategories[]>([]);
    const [activeTab, setActiveTab] = useState<'users' | 'orders' | 'trips' | 'drivers' | 'cars' | 'loaders' | 'triploaders' | 'licenceCategories'>('users');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [adminName, setAdminName] = useState('');

    const loadUsers = useCallback(async () => {
        const data = await fetchUsers();
        setUsers(data ?? []);
    }, []);

    const loadOrders = useCallback(async () => {
        const data = await fetchOrders();
        setOrders(data ?? []);
    }, []);

    const loadTrips = useCallback(async () => {
        const data = await fetchTrips();
        setTrips(data ?? []);
    }, []);

    const loadDrivers = useCallback(async () => {
        const data = await fetchDrivers();
        setDrivers(data ?? []);
    }, []);

    const loadCars = useCallback(async () => {
        const data = await fetchCars();
        setCars(data ?? []);
    }, []);

    const loadLoaders = useCallback(async () => {
        const data = await fetchLoaders();
        setLoaders(data ?? []);
    }, []);

    const loadTripLoaders = useCallback(async () => {
        const data = await fetchTripLoaders();
        setTripLoaders(data ?? []);
    }, []);

    const loadLicenceCategories = useCallback(async () => {
        const data = await fetchLicenceCategories();
        setLicenceCategories(data ?? []);
    }, []);

    // =====================
    // LOAD DATA
    // =====================
    useEffect(() => {
        const loadAll = async () => {
        try {
            setLoading(true);

            const [
                usersData,
                ordersData,
                tripsData,
                driversData,
                carsData,
                loadersData,
                tripLoadersData,
                licenceCategoriesData
            ] = await Promise.all([
                fetchUsers(),
                fetchOrders(),
                fetchTrips(),
                fetchDrivers(),
                fetchCars(),
                fetchLoaders(),
                fetchTripLoaders(),
                fetchLicenceCategories()
            ]);

            setUsers(usersData ?? []);
            setOrders(ordersData ?? []);
            setTrips(tripsData ?? []);
            setDrivers(driversData ?? []);
            setCars(carsData ?? []);
            setLoaders(loadersData ?? []);
            setTripLoaders(tripLoadersData ?? []);
            setLicenceCategories(licenceCategoriesData ?? []);

        } catch (err) {
            console.error(err);
            setError("Ошибка загрузки данных");
        } finally {
            setLoading(false);
        }
    };

    loadAll();

    }, []);

    // =====================
    // ADMIN NAME
    // =====================
    useEffect(() => {
        const stored = localStorage.getItem('currentUser');

        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setAdminName(parsed?.userName ?? '');
            } catch {
                setAdminName('');
            }
        }
    }, []);

    // =====================
    // MAP USERS (FAST LOOKUP)
    // =====================
    const usersMap = useMemo(() => {
        return new Map(
            users.map(u => [String(u.id), u])
        );
    }, [users]);

    // =====================
    // LOGOUT
    // =====================
    const handleLogout = useCallback(async () => {
        try {
            await logout();
        } catch (e) {
            console.error(e);
        }

        localStorage.removeItem('userRole');
        localStorage.removeItem('currentUser');
        window.location.href = '/';
    }, []);

        const handleDelete = async (
            id: number,
            deleteFunc: (id:number)=>Promise<void>,
            reload: ()=>Promise<void>
        ) => {
            if (!window.confirm("Удалить запись?")) return;

            await deleteFunc(id);
            await reload();
        };

    // =====================
    // LOADING STATE
    // =====================
    if (loading) {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                Загрузка...
            </div>
        );
    }

    // =====================
    // ERROR STATE
    // =====================
    if (error) {
        return (
            <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>
                {error}
            </div>
        );
    }

    return (
        <div className="admin-dashboard">

            {/* HEADER */}
            <div className="header">
                <div className="logo">
                    KABLUCH<span>KOFF</span>
                </div>

                <div className="nav">
                    <div className="user-info">
                        <span>Администратор: {adminName}</span>
                        <button className="logout-btn" onClick={handleLogout}>
                            Выйти
                        </button>
                    </div>
                </div>
            </div>

            {/* TABS */}
            <div className="tabs">
                <button
                    className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    Пользователи ({users.length})
                </button>

                <button
                    className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    Заказы ({orders.length})
                </button>

                <button
                    className={`tab-btn ${activeTab === 'trips' ? 'active' : ''}`}
                    onClick={() => setActiveTab('trips')}
                >
                    Рейсы ({trips.length})
                </button>

                <button
                    className={`tab-btn ${activeTab === 'drivers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('drivers')}
                >
                    Водители ({drivers.length})
                </button>

                <button
                    className={`tab-btn ${activeTab === 'cars' ? 'active' : ''}`}
                    onClick={() => setActiveTab('cars')}
                >
                    Машины ({cars.length})
                </button>

                <button
                    className={`tab-btn ${activeTab === 'loaders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('loaders')}
                >
                    Грузчики ({loaders.length})
                </button>

                <button
                    className={`tab-btn ${activeTab === 'triploaders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('triploaders')}
                >
                    Рейсы грузчиков ({triploaders.length})
                </button>

                <button
                    className={`tab-btn ${activeTab === 'licenceCategories' ? 'active' : ''}`}
                    onClick={() => setActiveTab('licenceCategories')}
                >
                    Категория прав ({licenceCategories.length})
                </button>
            </div>

            {/* ================= USERS ================= */}
            {activeTab === 'users' && (
                <div className="data-table">
                    <div className="data-table-header">
                        <h2>Управление пользователями</h2>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f3f4f6' }}>
                                    <th style={{ padding: '15px' }}>ID</th>
                                    <th style={{ padding: '15px' }}>Имя</th>
                                    <th style={{ padding: '15px' }}>Email</th>
                                    <th style={{ padding: '15px' }}>Телефон</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '15px' }}>
                                            #{user.id}
                                        </td>

                                        <td style={{ padding: '15px' }}>
                                            <strong>{user.userName ?? '-'}</strong>
                                        </td>

                                        <td style={{ padding: '15px' }}>
                                            {user.email ?? '—'}
                                        </td>

                                        <td style={{ padding: '15px' }}>
                                            {user.phoneNumber ?? '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ================= ORDERS ================= */}
            {activeTab === 'orders' && (
                <div className="data-table">
                    <div className="data-table-header">
                        <h2>Управление заказами</h2>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f3f4f6' }}>
                                    <th style={{ padding: '15px' }}>ID</th>
                                    <th style={{ padding: '15px' }}>Клиент</th>
                                    <th style={{ padding: '15px' }}>Маршрут</th>
                                    <th style={{ padding: '15px' }}>Габариты</th>
                                    <th style={{ padding: '15px' }}>Описание</th>
                                    <th style={{ padding: '15px' }}>Дата</th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.map(order => {
                                    const user = usersMap.get(String(order.userId));

                                    return (
                                        <tr key={order.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            <td style={{ padding: '15px' }}>
                                                #{order.id}
                                            </td>

                                            {/* USER */}
                                            <td style={{ padding: '15px' }}>
                                                <div>
                                                    <strong>{user?.userName ?? 'Неизвестно'}</strong>
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                                    {user?.email ?? ''}
                                                </div>
                                            </td>

                                            {/* ROUTE */}
                                            <td style={{ padding: '15px' }}>
                                                <div style={{ fontSize: '13px' }}>
                                                    {String(order.pickAppAddress ?? '').substring(0, 30)}...
                                                </div>

                                                <div style={{ fontSize: '13px', marginTop: '5px' }}>
                                                    → {String(order.deliveryAddress ?? '').substring(0, 30)}...
                                                </div>
                                            </td>

                                            {/* SIZE */}
                                            <td style={{ padding: '15px' }}>
                                                <div>{order.cargoVolume ?? 0} м³</div>
                                                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                                    {order.cargoWeight ?? 0} кг
                                                </div>
                                            </td>

                                            {/* DESCRIPTION */}
                                            <td style={{ padding: '15px' }}>
                                                {order.description ?? '—'}
                                            </td>

                                            {/* DATE */}
                                            <td style={{ padding: '15px', fontSize: '14px', color: '#6b7280' }}>
                                                {order.registrationDateOrder
                                                    ? new Date(order.registrationDateOrder).toLocaleDateString()
                                                    : '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {/* ================= TRIPS ================= */}
            {activeTab === 'trips' && (
                <div className="data-table">
                    <div className="data-table-header">
                        <h2>Управление рейсами</h2>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f3f4f6' }}>
                                    <th style={{ padding: '15px' }}>ID</th>
                                    <th style={{ padding: '15px' }}>Заказчик</th>
                                    <th style={{ padding: '15px' }}>Водитель</th>
                                    <th style={{ padding: '15px' }}>Машина</th>
                                    <th style={{ padding: '15px' }}>Цена</th>
                                    <th style={{ padding: '15px' }}>Время (мин)</th>
                                </tr>
                            </thead>

                            <tbody>
                                {trips.map(trip => {
                                    const order = trip.order;
                                    const user = usersMap.get(String(order?.userId));

                                    return (
                                        <tr key={trip.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            
                                            {/* ID */}
                                            <td style={{ padding: '15px' }}>
                                                #{trip.id}
                                            </td>

                                            {/* ORDER / CLIENT */}
                                            <td style={{ padding: '15px' }}>
                                                <div>
                                                    <strong>
                                                        {trip.order?.id ?? 'Неизвестно'}
                                                    </strong>
                                                </div>

                                                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                                    {user?.email ?? ''}
                                                </div>

                                                <div style={{ fontSize: '13px' }}>
                                                    {String(trip.order.pickAppAddress ?? '').substring(0, 30)}...
                                                </div>

                                                <div style={{ fontSize: '13px', marginTop: '5px' }}>
                                                    → {String(trip.order.deliveryAddress ?? '').substring(0, 30)}...
                                                </div>
                                            </td> 

                                            {/* DRIVER */}
                                            <td style={{ padding: '15px' }}>
                                                <div>{trip.driver?.name ?? '—'}</div>

                                                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                                    {trip.driver?.passport ?? ''}
                                                </div>
                                            </td>

                                            {/* CAR */}
                                            <td style={{ padding: '15px' }}>
                                                <div>{trip.car?.carMake ?? '—'}</div>

                                                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                                    {trip.car?.typeOfCar ?? ''}
                                                </div>
                                            </td>

                                            {/* PRICE */}
                                            <td style={{ padding: '15px' }}>
                                                {trip.finalePrice ?? '—'} ₽
                                            </td>

                                            {/* TIME */}
                                            <td style={{ padding: '15px' }}>
                                                {trip.finaleTimeMinutes ?? '—'}
                                            </td>

                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {/* ================= DRIVER ================= */}
            {activeTab === 'drivers' && (
                <div className="data-table">
                    <div className="data-table-header">
                        <h2>Управление водителями</h2>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f3f4f6' }}>
                                    <th style={{ padding: '15px' }}>ID</th>
                                    <th style={{ padding: '15px' }}>Имя</th>
                                    <th style={{ padding: '15px' }}>Пасспорт</th>
                                    <th style={{ padding: '15px' }}>Возраст</th>
                                    <th style={{ padding: '15px' }}>Ставка в час</th>
                                    <th style={{ padding: '15px' }}>Категория прав</th>
                                </tr>
                            </thead>

                            <tbody>
                                {drivers.map(driver => {
                  
                                    return (
                                        <tr key={driver.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            <td style={{ padding: '15px' }}>
                                                #{driver.id}
                                            </td>

                                            {/* NAME */}
                                            <td style={{ padding: '15px' }}>
                                                {driver.name ?? '—'}
                                            </td>

                                            {/* PASSPORT */}
                                            <td style={{ padding: '15px' }}>
                                                {driver.passport ?? '—'}
                                            </td>

                                            {/* AGE */}
                                            <td style={{ padding: '15px' }}>
                                                {driver.age ?? '—'}
                                            </td>

                                            {/* DESCRIPTION */}
                                            <td style={{ padding: '15px' }}>
                                                {driver.rate ?? '—'} ₽
                                            </td>

                                            {/* DATE */}
                                            <td style={{ padding: '15px' }}>
                                                {driver.licenceCategories?.name ?? '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {/* ================= CARS ================= */}
            {activeTab === 'cars' && (
                <div className="data-table">
                    <div className="data-table-header">
                        <h2>Управление машинами</h2>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f3f4f6' }}>
                                    <th style={{ padding: '15px' }}>ID</th>
                                    <th style={{ padding: '15px' }}>Марка машины</th>
                                    <th style={{ padding: '15px' }}>Модель машины</th>
                                    <th style={{ padding: '15px' }}>Тип машины</th>
                                    <th style={{ padding: '15px' }}>Госномер</th>
                                    <th style={{ padding: '15px' }}>Грузоподьемность</th>
                                    <th style={{ padding: '15px' }}>Вместимость</th>
                                    <th style={{ padding: '15px' }}>Расход топлива (1 л / 100 км)</th>
                                    <th style={{ padding: '15px' }}>Категория прав</th>
                                </tr>
                            </thead>

                            <tbody>
                                {cars.map(car => {
                  
                                    return (
                                        <tr key={car.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            <td style={{ padding: '15px' }}>
                                                #{car.id}
                                            </td>

                                            {/* CarMake */}
                                            <td style={{ padding: '15px' }}>
                                                {car.carMake ?? '—'}
                                            </td>

                                            {/* CarModel */}
                                            <td style={{ padding: '15px' }}>
                                                {car.carModel ?? '—'}
                                            </td>

                                            {/* typeofcar */}
                                            <td style={{ padding: '15px' }}>
                                                {car.typeOfCar ?? '—'}
                                            </td>

                                            {/* carnumber */}
                                            <td style={{ padding: '15px' }}>
                                                {car.carNumber ?? '—'} 
                                            </td>

                                            {/* cargocapacity */}
                                            <td style={{ padding: '15px' }}>
                                                {car.cargoCapacityT ?? '—'} т
                                            </td>

                                            {/* trunkvolume */}
                                            <td style={{ padding: '15px' }}>
                                                {car.trunkVolumeL ?? '—'} м³
                                            </td>

                                            {/* fuel */}
                                            <td style={{ padding: '15px' }}>
                                                {car.fuelConsumption ?? '—'}
                                            </td>

                                            {/* DATE */}
                                            <td style={{ padding: '15px' }}>
                                                {car.licenceCategories?.name ?? '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {/* ================= LOADERS ================= */}
            {activeTab === 'loaders' && (
                <div className="data-table">
                    <div className="data-table-header">
                        <h2>Управление грузчиками</h2>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f3f4f6' }}>
                                    <th style={{ padding: '15px' }}>ID</th>
                                    <th style={{ padding: '15px' }}>Имя</th>
                                    <th style={{ padding: '15px' }}>Пасспорт</th>
                                    <th style={{ padding: '15px' }}>Возраст</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loaders.map(loader => {
                  
                                    return (
                                        <tr key={loader.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            <td style={{ padding: '15px' }}>
                                                #{loader.id}
                                            </td>

                                            {/* Name */}
                                            <td style={{ padding: '15px' }}>
                                                {loader.name ?? '—'}
                                            </td>

                                            {/* passport */}
                                            <td style={{ padding: '15px' }}>
                                                {loader.passport ?? '—'}
                                            </td>

                                            {/* age */}
                                            <td style={{ padding: '15px' }}>
                                                {loader.age ?? '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {/* ================= TRIPLOADERS ================= */}
            {activeTab === 'triploaders' && (
                <div className="data-table">
                    <div className="data-table-header">
                        <h2>Управление рейсами грузчиков</h2>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f3f4f6' }}>
                                    <th style={{ padding: '15px' }}>ID</th>
                                    <th style={{ padding: '15px' }}>Рейс</th>
                                    <th style={{ padding: '15px' }}>Грузчик</th>
                                </tr>
                            </thead>

                            <tbody>
                                {triploaders.map(triploader => {
                  
                                    return (
                                        <tr key={triploader.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            <td style={{ padding: '15px' }}>
                                                #{triploader.id}
                                            </td>

                                            {/* trip */}
                                            <td style={{ padding: '15px' }}>
                                                <div>
                                                    <strong>
                                                        Id рейса: {triploader.trip?.id ?? 'Неизвестно'}
                                                    </strong>
                                                </div>

                                                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                                    Id заказа: {triploader?.trip.order.id ?? ''}
                                                </div>

                                                <div style={{ fontSize: '13px' }}>
                                                    {String(triploader.trip.order.pickAppAddress ?? '').substring(0, 30)}...
                                                </div>

                                                <div style={{ fontSize: '13px', marginTop: '5px' }}>
                                                    → {String(triploader.trip.order.deliveryAddress ?? '').substring(0, 30)}...
                                                </div>
                                            </td>

                                            {/* loader */}
                                            <td style={{ padding: '15px' }}>
                                                <div>
                                                    <strong>
                                                      Id грузчика: {triploader.loader?.id ?? '—'}
                                                    </strong>
                                                </div>
                                                
                                                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                                      Имя грузчика: {triploader?.loader.name ?? ''}
                                                </div>
                                                <div style={{ fontSize: '13px' }}>
                                                      Пасспорт: {triploader?.loader.passport ?? ''}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {/* ================= LicenceCategory ================= */}
            {activeTab === 'licenceCategories' && (
                <div className="data-table">
                    <div className="data-table-header">
                        <h2>Управление лицензиями прав</h2>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f3f4f6' }}>
                                    <th style={{ padding: '15px' }}>ID</th>
                                    <th style={{ padding: '15px' }}>Категория прав</th>
                                </tr>
                            </thead>

                            <tbody>
                                {licenceCategories.map(licenceCategories => {
                  
                                    return (
                                        <tr key={licenceCategories.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            <td style={{ padding: '15px' }}>
                                                #{licenceCategories.id}
                                            </td>

                                            {/* Name */}
                                            <td style={{ padding: '15px' }}>
                                                {licenceCategories.name ?? '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;