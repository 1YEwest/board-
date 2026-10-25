import { useState } from 'react';
import AdList from './components/AdList';
import AdForm from './components/AdForm';

type Tab = 'list' | 'new';

export default function App() {
  const [tab, setTab] = useState<Tab>('list');

  return (
    <div className="app">
      <h1 className="app-title">Доска объявлений</h1>

      <div className="tabs">
        <button
          className={`tab ${tab === 'list' ? 'active' : ''}`}
          onClick={() => setTab('list')}
        >
          Объявления
        </button>
        <button
          className={`tab ${tab === 'new' ? 'active' : ''}`}
          onClick={() => setTab('new')}
        >
          Новое объявление
        </button>
      </div>

      {tab === 'list' ? <AdList /> : <AdForm />}
    </div>
  );
}
