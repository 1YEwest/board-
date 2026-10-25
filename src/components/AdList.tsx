import { useEffect, useState } from 'react';
import type { Ad, AdsResponse } from '../types';
import { API } from '../api';

export default function AdList() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAds = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API.ADS);
      if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
      const data: AdsResponse = await res.json();
      setAds(data.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось загрузить объявления');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  if (loading) return <div className="loading">Загрузка…</div>;
  if (error) return <div className="message error">{error}</div>;
  if (ads.length === 0) return <div className="empty">Пока нет объявлений</div>;

  return (
    <div className="ad-list">
      {ads.map((ad) => (
        <div key={ad.id} className="ad-card">
          {ad.image_url ? (
            <img
              className="ad-image"
              src={API.imageUrl(ad.image_url)}
              alt={ad.title}
            />
          ) : (
            <div className="ad-image-placeholder">📷</div>
          )}
          <div className="ad-info">
            <div className="ad-title">{ad.title}</div>
            <div className="ad-description">{ad.description}</div>
            <div className="ad-price">{ad.price.toLocaleString('ru-RU')} ₸</div>
          </div>
        </div>
      ))}
    </div>
  );
}
