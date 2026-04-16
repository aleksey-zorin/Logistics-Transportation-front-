import { useState } from 'react';
import '../styles/global.css';
import avtopark from '../images/avtopark.jpg';
import sklad from '../images/sklad.jpg';
import konteyner from '../images/konteyner.jpg';
import upakovka from '../images/upakovka.jpg';
import perevozki from '../images/perevozki.jpg';
import pereezd from '../images/pereezd.jpg';
import office from '../images/office.jpg';
import gruzchiki from '../images/gruzchiki.jpg';
import dostavka from '../images/dostavka.jpg';
import express from '../images/express.jpg';
import garant from '../images/garant.jpg';
import price from '../images/price.jpg';
import driver from '../images/driver.jpg';
import map from '../images/map.jpg';
import support from '../images/support.jpg';

interface UserPageProps {
  onLogout?: () => void;
}

function UserPage({ onLogout }: UserPageProps) {
  const [calculatorData, setCalculatorData] = useState({
    from: 'Москва',
    to: 'Санкт-Петербург',
    fromAddress: '',
    toAddress: '',
    volume: '',
    weight: 500,
    description: ''
  });

  const currentUser = localStorage.getItem('currentUser');
  const userName = currentUser ? JSON.parse(currentUser).name : '';

  const handleCalculatorChange = (field: string, value: string | number) => {
    setCalculatorData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder = {
      id: Date.now(),
      from: calculatorData.from,
      to: calculatorData.to,
      fromAddress: calculatorData.fromAddress,
      toAddress: calculatorData.toAddress,
      volume: calculatorData.volume,
      weight: calculatorData.weight,
      description: calculatorData.description,
      status: 'new',
      clientName: userName || 'Гость',
      clientPhone: '',
      createdAt: new Date().toISOString()
    };
    
    const existingOrders = localStorage.getItem('orders');
    const orders = existingOrders ? JSON.parse(existingOrders) : [];
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    alert('Спасибо! Наш менеджер свяжется с вами для расчета стоимости.');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div className="logo" onClick={() => scrollToSection('hero')}>
          KABLUCH<span>KOFF</span>
        </div>
        <div className="nav">
          <a onClick={() => scrollToSection('hero')}>Главная</a>
          <a onClick={() => scrollToSection('services')}>Услуги</a>
          <a onClick={() => scrollToSection('calculator')}>Калькулятор</a>
          <a onClick={() => scrollToSection('advantages')}>Преимущества</a>
          <a onClick={() => scrollToSection('gallery')}>О нас</a>
          <a onClick={() => scrollToSection('footer')}>Контакты</a>
          <div className="user-info">
            <span>👤 {userName || 'Гость'}</span>
            <button className="logout-btn" onClick={onLogout}>Выйти</button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div id="hero" className="hero">
        <div className="container">
          <h1>Надежные грузоперевозки <span>по всей России</span></h1>
          <p>Доставим ваш груз в срок с гарантией сохранности. Собственный автопарк и профессиональные водители.</p>
          <div className="stats">
            <div>
              <div className="stat-number">100+</div>
              <div>Машин в парке</div>
            </div>
            <div>
              <div className="stat-number">24/7</div>
              <div>Поддержка</div>
            </div>
            <div>
              <div className="stat-number">100%</div>
              <div>Гарантия</div>
            </div>
          </div>
          <div>
            <button className="btn" onClick={() => scrollToSection('calculator')}>Рассчитать стоимость</button>
            <button className="btn btn-outline" onClick={() => scrollToSection('services')}>Наши услуги</button>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="services">
        <div className="container">
          <h2 className="section-title">Наши услуги</h2>
          <p className="section-subtitle">Предлагаем полный спектр услуг по грузоперевозкам и переездам</p>
          <div className="services-grid">
            <div className="service-card">
              <img src={perevozki} alt="Междугородние перевозки" className="service-image" />
              <div className="service-content">
                <h3>Междугородние перевозки</h3>
                <p>Доставка грузов по Москве, МО, СПБ и ЛО. Гарантия сроков и сохранности груза.</p>
                <div className="service-tags">
                  <span className="tag">До 20 тонн</span>
                  <span className="tag">Страховка</span>
                  <span className="tag">Профессиональные водители</span>
                </div>
              </div>
            </div>
            <div className="service-card">
              <img src={pereezd} alt="Квартирный переезд" className="service-image" />
              <div className="service-content">
                <h3>Квартирный переезд</h3>
                <p>Поможем с переездом квартиры или офиса. Упаковка, погрузка, разгрузка.</p>
                <div className="service-tags">
                  <span className="tag">Грузчики</span>
                  <span className="tag">Упаковка</span>
                  <span className="tag">Сборка мебели</span>
                </div>
              </div>
            </div>
            <div className="service-card">
              <img src={office} alt="Офисный переезд" className="service-image" />
              <div className="service-content">
                <h3>Офисный переезд</h3>
                <p>Профессиональный переезд офисов. Работаем в выходные и праздники.</p>
                <div className="service-tags">
                  <span className="tag">Быстро</span>
                  <span className="tag">Аккуратно</span>
                  <span className="tag">Недорого</span>
                </div>
              </div>
            </div>
            <div className="service-card">
              <img src={gruzchiki} alt="Грузчики" className="service-image" />
              <div className="service-content">
                <h3>Грузчики</h3>
                <p>Услуги грузчиков для погрузки и разгрузки. Опытные специалисты.</p>
                <div className="service-tags">
                  <span className="tag">От 2 человек</span>
                  <span className="tag">Любой объем</span>
                  <span className="tag">Почасовая оплата</span>
                </div>
              </div>
            </div>
            <div className="service-card">
              <img src={dostavka} alt="Доставка товаров" className="service-image" />
              <div className="service-content">
                <h3>Доставка товаров</h3>
                <p>Доставка интернет-заказов, мебели, бытовой техники.</p>
                <div className="service-tags">
                  <span className="tag">Подъем на этаж</span>
                  <span className="tag">Занос в квартиру</span>
                  <span className="tag">В день заказа</span>
                </div>
              </div>
            </div>
            <div className="service-card">
              <img src={express} alt="Экспресс-доставка" className="service-image" />
              <div className="service-content">
                <h3>Экспресс-доставка</h3>
                <p>Sрочная доставка документов и грузов. По городу за 2 часа.</p>
                <div className="service-tags">
                  <span className="tag">Срочно</span>
                  <span className="tag">Надежно</span>
                  <span className="tag">Круглосуточно</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calculator Section */}
      <div id="calculator" className="calculator">
        <div className="container">
          <h2 className="section-title">Калькулятор стоимости</h2>
          <p className="section-subtitle">Рассчитайте примерную стоимость доставки вашего груза</p>
          <div className="calculator-card">
            <h3>Расчет стоимости перевозки</h3>
            <p className="calculator-subtitle">Заполните данные для оценки</p>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Откуда *</label>
                  <select value={calculatorData.from} onChange={(e) => handleCalculatorChange('from', e.target.value)}>
                    <option>Москва</option>
                    <option>Московская Область</option>
                    <option>Санкт-Петербург</option>
                    <option>Ленинградская область</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Точный адрес отправления</label>
                  <input 
                    type="text" 
                    placeholder="Химки, ул. Ленинградская, д. 15" 
                    value={calculatorData.fromAddress}
                    onChange={(e) => handleCalculatorChange('fromAddress', e.target.value)}
                  />
                  <div className="address-hint">Укажите город, улицу, дом для точного расчета</div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Куда *</label>
                  <select value={calculatorData.to} onChange={(e) => handleCalculatorChange('to', e.target.value)}>
                    <option>Москва</option>
                    <option>Московская Область</option>
                    <option>Санкт-Петербург</option>
                    <option>Ленинградская область</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Точный адрес доставки</label>
                  <input 
                    type="text" 
                    placeholder="Одинцово, ул. Советская, д. 10" 
                    value={calculatorData.toAddress}
                    onChange={(e) => handleCalculatorChange('toAddress', e.target.value)}
                  />
                  <div className="address-hint">Укажите город, улицу, дом для точного расчета</div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Объем груза (м³) *</label>
                  <input 
                    type="text" 
                    placeholder="5.5 м³" 
                    value={calculatorData.volume}
                    onChange={(e) => handleCalculatorChange('volume', e.target.value)}
                  />
                  <div className="address-hint">Укажите примерный объем: 1-2 м³ (малый), 5-10 м³ (средний), 15+ м³ (большой)</div>
                </div>
                <div className="form-group">
                  <label>Вес груза (кг)</label>
                  <input 
                    type="number" 
                    placeholder="500" 
                    value={calculatorData.weight}
                    onChange={(e) => handleCalculatorChange('weight', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Опишите ваш груз</label>
                <textarea 
                  rows={3} 
                  placeholder="Например: мебель, техника, стройматериалы" 
                  value={calculatorData.description}
                  onChange={(e) => handleCalculatorChange('description', e.target.value)}
                />
              </div>

              <button type="submit" className="btn">Рассчитать стоимость</button>
            </form>
          </div>
        </div>
      </div>

      {/* Advantages Section */}
      <div id="advantages" className="advantages">
        <div className="container">
          <h2 className="section-title">Наши преимущества</h2>
          <p className="section-subtitle">Почему люди выбирают именно KABLUCHKOFF</p>
          <div className="advantages-grid">
            <div className="advantage-card">
              <img src={garant} alt="Гарантия" className="advantage-image" />
              <div className="advantage-content">
                <h3>Гарантия сохранности</h3>
                <p>Страхование груза, контроль на всех этапах доставки</p>
              </div>
            </div>
            <div className="advantage-card">
              <img src={price} alt="Цены" className="advantage-image" />
              <div className="advantage-content">
                <h3>Выгодные цены</h3>
                <p>Собственный автопарк позволяет держать оптимальные цены</p>
              </div>
            </div>
            <div className="advantage-card">
              <img src={driver} alt="Водители" className="advantage-image" />
              <div className="advantage-content">
                <h3>Опытные водители</h3>
                <p>Профессиональные водители со стажем от 5 лет</p>
              </div>
            </div>
            <div className="advantage-card">
              <img src={map} alt="Регионы" className="advantage-image" />
              <div className="advantage-content">
                <h3>Москва и МО, СПБ и ЛО</h3>
                <p>Доставляем по Москве и Московской области, Санкт-Петербургу и Ленинградской области</p>
              </div>
            </div>
            <div className="advantage-card">
              <img src={support} alt="Поддержка" className="advantage-image" />
              <div className="advantage-content">
                <h3>Поддержка 24/7</h3>
                <p>Круглосуточная диспетчерская служба и техподдержка</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div id="gallery" className="gallery">
        <div className="container">
          <h2 className="section-title">Наша работа</h2>
          <p className="section-subtitle">Современное оборудование и профессиональный подход</p>
          <div className="gallery-grid">
            <div className="gallery-item">
              <div className="gallery-image-wrapper">
                <img src={avtopark} alt="Автопарк" className="gallery-image" />
                <div className="gallery-overlay">
                  <h4>Собственный автопарк</h4>
                  <p>Современные грузовики и спецтехника</p>
                </div>
              </div>
            </div>
            <div className="gallery-item">
              <div className="gallery-image-wrapper">
                <img src={sklad} alt="Склады" className="gallery-image" />
                <div className="gallery-overlay">
                  <h4>Современные склады</h4>
                  <p>Склады с системой климат-контроля</p>
                </div>
              </div>
            </div>
            <div className="gallery-item">
              <div className="gallery-image-wrapper">
                <img src={konteyner} alt="Контейнеры" className="gallery-image" />
                <div className="gallery-overlay">
                  <h4>Контейнерные перевозки</h4>
                  <p>Надежные контейнерные перевозки</p>
                </div>
              </div>
            </div>
            <div className="gallery-item">
              <div className="gallery-image-wrapper">
                <img src={upakovka} alt="Упаковка" className="gallery-image" />
                <div className="gallery-overlay">
                  <h4>Упаковка грузов</h4>
                  <p>Профессиональная упаковка</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div id="footer" className="footer">
        <div className="footer-content">
          <div>
            <div className="footer-logo">🚚 KABLUCH<span>KOFF</span></div>
            <p>Работаем с 2026 года</p>
          </div>
          <div className="footer-column">
            <h4>Услуги</h4>
            <ul>
              <li onClick={() => scrollToSection('services')}>Междугородние перевозки</li>
              <li onClick={() => scrollToSection('services')}>Квартирный переезд</li>
              <li onClick={() => scrollToSection('services')}>Офисный переезд</li>
              <li onClick={() => scrollToSection('services')}>Услуги грузчиков</li>
              <li onClick={() => scrollToSection('services')}>Экспресс-доставка</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Информация</h4>
            <ul>
              <li onClick={() => scrollToSection('hero')}>О компании</li>
              <li onClick={() => scrollToSection('gallery')}>Наш автопарк</li>
              <li>Отзывы клиентов</li>
              <li>Вакансии</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Контакты</h4>
            <ul>
              <li>📞 +7-(777)-777-27-72</li>
              <li>📞 +7-(999)-999-97-79</li>
              <li>✉️ info@kabluchkoff.ru</li>
              <li>📍 г. Москва, ул. Сибуя, д. 67</li>
              <li>🕒 Круглосуточно, без выходных</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 KABLUCHKOFF. Все права защищены.</p>
        </div>
      </div>
    </div>
  );
}

export default UserPage;