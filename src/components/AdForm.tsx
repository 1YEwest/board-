import { useState, useRef } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { API } from '../api';

export default function AdForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !price.trim()) {
      setMessage({ type: 'error', text: 'Заполните все обязательные поля' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('price', parseFloat(price).toString());
    if (image) {
      formData.append('image', image);
    }

    try {
      const res = await fetch(API.ADS, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
      setMessage({ type: 'success', text: 'Объявление опубликовано!' });
      setTitle('');
      setDescription('');
      setPrice('');
      setImage(null);
      setImagePreview(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (e) {
      setMessage({
        type: 'error',
        text: e instanceof Error ? e.message : 'Не удалось отправить объявление',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="form-group">
        <label className="form-label">Название</label>
        <input
          className="form-input"
          type="text"
          placeholder="Например: Ноутбук"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Описание</label>
        <textarea
          className="form-textarea"
          placeholder="Опишите товар…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Цена (₸)</label>
        <input
          className="form-input"
          type="number"
          step="0.01"
          min="0"
          placeholder="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Фото</label>
        <label className="form-file-label">
          📎 Выбрать файл
          <input
            ref={fileRef}
            className="form-file-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
        {image && <span className="form-file-name">{image.name}</span>}
        {imagePreview && <img className="image-preview" src={imagePreview} alt="Preview" />}
      </div>

      <button className="form-submit" type="submit" disabled={submitting}>
        {submitting ? 'Отправка…' : 'Опубликовать'}
      </button>
    </form>
  );
}
