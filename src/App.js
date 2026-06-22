import React, { createContext, useReducer, useState, useContext, useEffect } from 'react';

/* ─── Fonte ─────────────────────────────────────────────────────────────── */

function GoogleFont() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
  return null;
}

/* ─── Paleta ─────────────────────────────────────────────────────────────── */

const C = {
  bg: '#F0F2F5',
  card: 'rgb(255, 255, 255)',
  primary: '#6C63FF',
  primaryLight: '#EEF0FF',
  text: '#1C1C2E',
  muted: '#9CA3AF',
  border: '#E5E7EB',
  done: '#B0B7C3',
  danger: '#F3F4F6',
};

/* ─── Context + Reducer ──────────────────────────────────────────────────── */

export const TarefasContext = createContext();

function tarefasReducer(state, action) {
  switch (action.type) {
    case 'ADICIONAR_TAREFA':
      return [
        ...state,
        { id: Date.now(), texto: action.texto, concluida: false },
      ];
    case 'TOGGLE_TAREFA':
      return state.map((t) =>
        t.id === action.id ? { ...t, concluida: !t.concluida } : t
      );
    default:
      return state;
  }
}

export function TarefasProvider({ children }) {
  const [tarefas, dispatch] = useReducer(tarefasReducer, []);
  const [filtro, setFiltro] = useState('todas');
  return (
    <TarefasContext.Provider value={{ tarefas, dispatch, filtro, setFiltro }}>
      {children}
    </TarefasContext.Provider>
  );
}

/* ─── Checkbox customizado ───────────────────────────────────────────────── */

function Checkbox({ checked, onChange }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: 22,
        height: 22,
        borderRadius: 7,
        border: `2px solid ${checked ? C.primary : C.border}`,
        background: checked ? C.primary : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'background 0.15s, border-color 0.15s',
      }}
    >
      {checked && (
        <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
          <path
            d="M1 4L4 7L10 1"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

/* ─── Tarefa ─────────────────────────────────────────────────────────────── */

function Tarefa({ tarefa, onToggle }) {
  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 16px',
        marginBottom: 10,
        background: C.card,
        borderRadius: 12,
        border: `1px solid ${C.border}`,
        transition: 'opacity 0.2s',
        opacity: tarefa.concluida ? 0.65 : 1,
      }}
    >
      <Checkbox
        checked={tarefa.concluida}
        onChange={() => onToggle(tarefa.id)}
      />
      <span
        style={{
          fontSize: 15,
          fontWeight: 500,
          color: tarefa.concluida ? C.done : C.text,
          textDecoration: tarefa.concluida ? 'line-through' : 'none',
          letterSpacing: '0.01em',
          flex: 1,
        }}
      >
        {tarefa.texto}
      </span>
    </li>
  );
}

/* ─── Lista ──────────────────────────────────────────────────────────────── */

function ListaDeTarefas() {
  const { tarefas, dispatch, filtro } = useContext(TarefasContext);

  const filtradas = tarefas.filter((t) => {
    if (filtro === 'concluidas') return t.concluida === true;
    if (filtro === 'pendentes') return t.concluida === false;
    return true;
  });

  if (filtradas.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '32px 0',
          color: C.muted,
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: '0.02em',
        }}
      >
        Nenhuma tarefa encontrada.
      </div>
    );
  }

  return (
    <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
      {filtradas.map((t) => (
        <Tarefa
          key={t.id}
          tarefa={t}
          onToggle={(id) => dispatch({ type: 'TOGGLE_TAREFA', id })}
        />
      ))}
    </ul>
  );
}

/* ─── Filtros ────────────────────────────────────────────────────────────── */

const FILTROS = [
  { label: 'Todas',      valor: 'todas',      cor: C.primary  },
  { label: 'Concluídas', valor: 'concluidas', cor: '#22C55E'  },
  { label: 'Pendentes',  valor: 'pendentes',  cor: '#F97316'  },
];

/* ─── App ────────────────────────────────────────────────────────────────── */

function App() {
  const { tarefas, dispatch, filtro, setFiltro } = useContext(TarefasContext);
  const [inputValor, setInputValor] = useState('');

  const totalConcluidas = tarefas.filter((t) => t.concluida).length;
  const total = tarefas.length;

  function handleAdicionar() {
    if (!inputValor.trim()) return;
    dispatch({ type: 'ADICIONAR_TAREFA', texto: inputValor.trim() });
    setInputValor('');
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: C.bg,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '48px 16px',
        fontFamily: "'Montserrat', sans-serif",
        boxSizing: 'border-box',
      }}
    >
      <div style={{ width: '100%', maxWidth: 480 }}>

        {/* Cabeçalho */}
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 700,
              color: C.text,
              letterSpacing: '-0.5px',
            }}
          >
            Gerenciador de Tarefas
          </h1>
          {total > 0 && (
            <p
              style={{
                margin: '6px 0 0',
                fontSize: 13,
                color: C.muted,
                fontWeight: 500,
              }}
            >
              {totalConcluidas} de {total}{' '}
              {total === 1 ? 'tarefa concluída' : 'tarefas concluídas'}
            </p>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleAdicionar(); }}
          style={{ display: 'flex', gap: 10, marginBottom: 20 }}
        >
          <input
            type="text"
            placeholder="Nova tarefa..."
            value={inputValor}
            onChange={(e) => setInputValor(e.target.value)}
            autoComplete="off"
            style={{
              flex: 1,
              padding: '13px 16px',
              borderRadius: 12,
              border: `1.5px solid ${C.border}`,
              fontSize: 14,
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 500,
              color: C.text,
              background: C.card,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="submit"
            style={{
              background: C.primary,
              color: '#fff',
              border: 'none',
              padding: '13px 22px',
              borderRadius: 12,
              cursor: 'pointer',
              fontSize: 14,
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            + Adicionar
          </button>
        </form>

        {/* Filtros */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginBottom: 20,
            background: C.card,
            padding: 6,
            borderRadius: 12,
            border: `1px solid ${C.border}`,
          }}
        >
          {FILTROS.map(({ label, valor, cor }) => {
            const ativo = filtro === valor;
            return (
              <button
                key={valor}
                onClick={() => setFiltro(valor)}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: ativo ? 600 : 500,
                  border: 'none',
                  background: ativo ? cor : 'transparent',
                  color: ativo ? '#fff' : C.muted,
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Lista */}
        <ListaDeTarefas />
      </div>
    </div>
  );
}

/* ─── Root ───────────────────────────────────────────────────────────────── */

export default function Root() {
  return (
    <TarefasProvider>
      <GoogleFont />
      <App />
    </TarefasProvider>
  );
}
