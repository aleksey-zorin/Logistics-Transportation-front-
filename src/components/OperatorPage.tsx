import { useState, useEffect } from 'react';
import '../styles/global.css';

interface Order {
  id: number;
  from: string;
  to: string;
  volume: string;
  weight: number;
  description: string;
  status: 'new' | 'processing' | 'delivered';
  clientName: string;
  clientPhone: string;
  createdAt: string;
}

const OperatorPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userName, setUserName] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders) as Order[]);
    } else {
      const testOrders: Order[] = [
        {
          id: 1,
          from: 'Москва, ул. Тверская, д. 10',
          to: 'Санкт-Петербург, Невский пр., д. 25',
          volume: '5.5 м³',
          weight: 500,
          description: 'Мебель офисная: столы, стулья, шкафы. Требуется осторожная погрузка.',
          status: 'new',
          clientName: 'Иван Петров',
          clientPhone: '+7-(999)-123-45-67',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          from: 'Химки, ул. Ленинградская, д. 15',
          to: 'Одинцово, ул. Советская, д. 10',
          volume: '2 м³',
          weight: 150,
          description: 'Бытовая техника: холодильник, стиральная машина',
          status: 'processing',
          clientName: 'Мария Смирнова',
          clientPhone: '+7-(999)-234-56-78',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 3,
          from: 'Красногорск, ул. Речная, д. 5',
          to: 'Москва, ул. Арбат, д. 20',
          volume: '8 м³',
          weight: 800,
          description: 'Строительные материалы: кирпич, цемент',
          status: 'new',
          clientName: 'Алексей Иванов',
          clientPhone: '+7-(999)-345-67-89',
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      setOrders(testOrders);
      localStorage.setItem('orders', JSON.stringify(testOrders));
    }

    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsed = JSON.parse(user);
      setUserName(parsed.name);
    }
  }, []);

  const updateOrderStatus = (orderId: number, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    const statusMessages = {
      new: '📋 Новый заказ',
      processing: ' В обработке',
      delivered: ' Доставлен'
    };
    alert(`${statusMessages[newStatus]} - заказ #${orderId}`);
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'new': return 'Новый';
      case 'processing': return 'В обработке';
      case 'delivered': return 'Доставлен';
      default: return 'Новый';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    window.location.href = '/';
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const stats = {
    total: orders.length,
    new: orders.filter(o => o.status === 'new').length,
    processing: orders.filter(o => o.status === 'processing').length,
    delivered: orders.filter(o => o.status === 'delivered').length
  };

  return (
    <div className="operator-dashboard">
      <div className="header">
        <div className="logo">KABLUCH<span>KOFF</span></div>
        <div className="nav">
          <div className="user-info">
            <span>👤 Оператор: {userName}</span>
            <button className="logout-btn" onClick={handleLogout}>Выйти</button>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '30px', paddingBottom: '30px' }}>
        {/* Статистика */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-value">{stats.total}</div>
            <div className="stat-card-label">Всего заказов</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-value" style={{ color: '#f59e0b' }}>{stats.new}</div>
            <div className="stat-card-label">Новые</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-value" style={{ color: '#3b82f6' }}>{stats.processing}</div>
            <div className="stat-card-label">В обработке</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-value" style={{ color: '#10b981' }}>{stats.delivered}</div>
            <div className="stat-card-label">Доставлено</div>
          </div>
        </div>

        {/* Фильтр по статусу */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'flex-end' }}>
          <button 
            onClick={() => setFilterStatus('all')} 
            style={{ padding: '8px 16px', background: filterStatus === 'all' ? '#f59e0b' : '#e5e7eb', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >Все</button>
          <button 
            onClick={() => setFilterStatus('new')} 
            style={{ padding: '8px 16px', background: filterStatus === 'new' ? '#f59e0b' : '#e5e7eb', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >Новые</button>
          <button 
            onClick={() => setFilterStatus('processing')} 
            style={{ padding: '8px 16px', background: filterStatus === 'processing' ? '#f59e0b' : '#e5e7eb', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >В обработке</button>
          <button 
            onClick={() => setFilterStatus('delivered')} 
            style={{ padding: '8px 16px', background: filterStatus === 'delivered' ? '#f59e0b' : '#e5e7eb', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >Доставлено</button>
        </div>

        {/* Таблица заказов */}
        <div className="data-table">
          <div className="data-table-header">
            <h2> Список заказов</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f3f4f6' }}>
                  <th style={{ padding: '15px', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Клиент</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Откуда → Куда</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Объем/Вес</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Описание</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Статус</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '15px' }}>#{order.id}</td>
                    <td style={{ padding: '15px' }}>
                      <div><strong>{order.clientName}</strong></div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{order.clientPhone}</div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ fontSize: '14px' }}><strong>От:</strong> {order.from.substring(0, 35)}...</div>
                      <div style={{ fontSize: '14px', marginTop: '5px' }}><strong>До:</strong> {order.to.substring(0, 35)}...</div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div> {order.volume}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}> {order.weight} кг</div>
                    </td>
                    <td style={{ padding: '15px', maxWidth: '200px' }}>
                      <div style={{ fontSize: '13px' }}>{order.description.substring(0, 50)}...</div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <span className={`status-badge status-${order.status}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', cursor: 'pointer', background: 'white' }}
                      >
                        <option value="new"> Новый</option>
                        <option value="processing"> В обработке</option>
                        <option value="delivered"> Доставлен</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorPage;