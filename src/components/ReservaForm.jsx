"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import Logo from '../../public/casa97.png';
import { useToast } from "@/components/ui/use-toast";
import { database, ref, push, set, onValue, get, storage, storageRef, getDownloadURL } from '@/lib/firebase';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { ptBR } from 'date-fns/locale';
import { sendMessage } from '@/lib/utils';
import { Dialog, DialogContent } from './ui/dialog';
import {
  Users, Calendar, Phone, User, ShoppingBag,
  Check, ChevronLeft, Plus, Minus, MessageCircle, X, Search,
} from 'lucide-react';

/* ─── Phone mask helper ──────────────────────────────────────── */
const maskPhone = (value) => {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
};

/* ─── Design tokens ──────────────────────────────────────────── */
const T = {
  bg:       '#0C0906',
  card:     '#151210',
  surface:  '#1E1915',
  surfaceHover: '#252018',
  gold:     '#C8A86B',
  goldDim:  'rgba(200,168,107,0.18)',
  goldBorder:'rgba(200,168,107,0.28)',
  cream:    '#F0EAE0',
  muted:    '#8C7B6A',
  dim:      '#3A3028',
  success:  '#5B9B72',
  error:    '#D45A4A',
};

/* ─── Shared styles ──────────────────────────────────────────── */
const S = {
  label: {
    display: 'block',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: T.gold,
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${T.goldBorder}`,
    color: T.cream,
    fontSize: '15px',
    padding: '8px 0 10px',
    outline: 'none',
    transition: 'border-color 0.25s',
    fontFamily: 'inherit',
    borderRadius: 0,
  },
  btnPrimary: {
    display: 'block',
    width: '100%',
    background: `linear-gradient(135deg, ${T.gold} 0%, #A8852E 100%)`,
    color: '#0C0906',
    border: 'none',
    borderRadius: '2px',
    padding: '15px 24px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'opacity 0.2s',
  },
  btnGhost: {
    background: 'transparent',
    border: `1px solid ${T.goldBorder}`,
    borderRadius: '2px',
    padding: '14px 20px',
    color: T.muted,
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  },
};

/* ─── Step indicator ─────────────────────────────────────────── */
const StepDots = ({ step }) => {
  const steps = ['Seus Dados', 'Ambiente & Mesa', 'Confirmar'];
  const idx = step === 'done' ? 3 : step - 1;
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '0 40px', gap: 0 }}>
      {steps.map((name, i) => (
        <React.Fragment key={i}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%', margin: '0 auto 6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: i < idx ? T.gold : i === idx ? T.gold : 'transparent',
              border: `1px solid ${i <= idx ? T.gold : T.goldBorder}`,
              color: i <= idx ? '#0C0906' : T.dim,
              fontSize: '11px', fontWeight: '700',
              transition: 'all 0.35s',
            }}>
              {i < idx ? <Check size={12} /> : i + 1}
            </div>
            <span style={{
              fontSize: '9px', fontWeight: '700', letterSpacing: '0.1em',
              textTransform: 'uppercase', whiteSpace: 'nowrap',
              color: i === idx ? T.gold : i < idx ? 'rgba(200,168,107,0.5)' : T.dim,
              transition: 'color 0.35s',
            }}>{name}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              flex: 1, height: '1px', margin: '0 8px 18px',
              background: i < idx ? T.gold : T.goldBorder,
              transition: 'background 0.35s',
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

/* ─── Space Photo Card ───────────────────────────────────────── */
const SpaceCard = ({ local, selected, onClick }) => {
  const [zoomOpen, setZoomOpen] = useState(false);
  return (
    <>
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4/3',
          borderRadius: '4px',
          overflow: 'hidden',
          border: `2px solid ${selected ? T.gold : 'rgba(200,168,107,0.15)'}`,
          transition: 'border-color 0.25s',
          background: T.surface,
          cursor: 'pointer',
        }}
        onClick={onClick}
        onMouseEnter={(e) => { if (!selected) e.currentTarget.style.borderColor = T.goldBorder; }}
        onMouseLeave={(e) => { if (!selected) e.currentTarget.style.borderColor = selected ? T.gold : 'rgba(200,168,107,0.15)'; }}
      >
        {local._photoUrl ? (
          <img
            src={local._photoUrl}
            alt={local.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: T.muted, fontSize: '12px' }}>Sem foto</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(12,9,6,0.88) 0%, rgba(12,9,6,0.1) 55%)',
        }} />

        {/* Selected checkmark — top right */}
        {selected && (
          <div style={{
            position: 'absolute', top: '8px', right: '8px',
            width: '22px', height: '22px', borderRadius: '50%',
            background: T.gold, pointerEvents: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Check size={12} color="#0C0906" />
          </div>
        )}

        {/* Zoom button — top left, stops propagation so it doesn't select */}
        {local._photoUrl && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setZoomOpen(true); }}
            style={{
              position: 'absolute', top: '8px', left: '8px',
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'rgba(0,0,0,0.55)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'zoom-in', color: 'rgba(255,255,255,0.8)',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(200,168,107,0.7)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.55)')}
            title="Ver foto em tamanho real"
          >
            <Search size={13} />
          </button>
        )}

        {/* Space name */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 12px', pointerEvents: 'none' }}>
          <p style={{
            margin: 0, fontSize: '13px', fontWeight: '700',
            color: selected ? T.gold : T.cream,
            fontFamily: 'var(--font-display), Georgia, serif',
            letterSpacing: '0.02em', transition: 'color 0.25s',
          }}>
            {local.name}
          </p>
        </div>
      </div>

      {/* Zoom dialog — properly constrained */}
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent style={{
          background: '#0C0906',
          border: `1px solid ${T.goldBorder}`,
          padding: '8px',
          width: 'min(680px, 92vw)',
          maxWidth: '92vw',
          maxHeight: '88vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <img
            src={local._photoUrl}
            alt={local.name}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: 'calc(88vh - 40px)',
              objectFit: 'contain',
              borderRadius: '2px',
              display: 'block',
            }}
          />
          <p style={{
            margin: '8px 4px 2px',
            fontSize: '11px', fontWeight: '700',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: T.gold,
          }}>
            {local.name}
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};

/* ─── Table Button ───────────────────────────────────────────── */
const MesaBtn = ({ mesa, selected, reserved, overCapacity, inactive, onClick }) => {
  const disabled = reserved || overCapacity || inactive;
  let tag = null;
  if (reserved) tag = { label: 'Ocupada', color: T.error };
  else if (inactive) tag = { label: 'Indisponível', color: T.dim };
  else if (overCapacity) tag = { label: `Máx ${mesa.numeroPessoas}p`, color: T.dim };

  return (
    <button
      type="button"
      onClick={() => !disabled && onClick(mesa)}
      disabled={disabled}
      style={{
        position: 'relative',
        padding: '14px 10px',
        borderRadius: '4px',
        border: `1px solid ${selected ? T.gold : disabled ? 'rgba(58,48,40,0.5)' : T.goldBorder}`,
        background: selected ? T.goldDim : disabled ? 'rgba(30,25,21,0.4)' : T.surface,
        cursor: disabled ? 'not-allowed' : 'pointer',
        textAlign: 'center',
        opacity: disabled && !selected ? 0.4 : 1,
        transition: 'all 0.2s',
        fontFamily: 'inherit',
      }}
      onMouseEnter={(e) => { if (!disabled && !selected) e.currentTarget.style.borderColor = T.gold; }}
      onMouseLeave={(e) => { if (!disabled && !selected) e.currentTarget.style.borderColor = T.goldBorder; }}
    >
      {selected && (
        <span style={{
          position: 'absolute', top: '5px', right: '5px',
          width: '14px', height: '14px', borderRadius: '50%',
          background: T.gold,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Check size={8} color="#0C0906" />
        </span>
      )}
      <p style={{
        margin: '0 0 4px', fontSize: '16px', fontWeight: '700',
        fontFamily: 'var(--font-display), Georgia, serif',
        color: selected ? T.gold : disabled ? T.dim : T.cream,
      }}>
        {mesa.numero}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
        <Users size={9} color={selected ? T.gold : T.muted} />
        <span style={{ fontSize: '10px', color: selected ? T.gold : T.muted }}>{mesa.numeroPessoas}</span>
      </div>
      {tag && (
        <p style={{ margin: '4px 0 0', fontSize: '9px', color: tag.color, fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {tag.label}
        </p>
      )}
    </button>
  );
};


/* ─── Item Card ──────────────────────────────────────────────── */
const ItemCard = ({ item, qty, max, atMax, onAdd, onRemove }) => {
  const [zoomOpen, setZoomOpen] = useState(false);
  return (
    <>
      <div style={{
        background: T.surface,
        border: `1px solid ${qty > 0 ? T.goldBorder : 'rgba(200,168,107,0.1)'}`,
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        transition: 'border-color 0.2s',
      }}>
        {/* Photo with zoom button */}
        <div style={{ height: '120px', overflow: 'hidden', position: 'relative', background: '#0C0906' }}>
          {item.photo ? (
            <img src={item.photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: T.muted, fontSize: '11px' }}>Sem foto</span>
            </div>
          )}
          {/* Qty badge */}
          {qty > 0 && (
            <div style={{
              position: 'absolute', top: '7px', right: '7px',
              background: T.gold, color: '#0C0906',
              borderRadius: '50%', width: '22px', height: '22px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: '700',
            }}>
              {qty}
            </div>
          )}
          {/* Zoom button */}
          {item.photo && (
            <button
              type="button"
              onClick={() => setZoomOpen(true)}
              style={{
                position: 'absolute', top: '7px', left: '7px',
                width: '26px', height: '26px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.55)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'zoom-in', color: 'rgba(255,255,255,0.8)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(200,168,107,0.7)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.55)')}
            >
              <Search size={11} />
            </button>
          )}
        </div>

        <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <p style={{ margin: '0 0 3px', fontSize: '14px', fontWeight: '700', color: T.cream, fontFamily: 'var(--font-display), serif' }}>
              {item.name}
            </p>
            <p style={{ margin: '0 0 8px', fontSize: '11px', color: T.muted, lineHeight: '1.5' }}>
              {item.description}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ color: T.gold, fontWeight: '700', fontSize: '14px' }}>
                {item.itemValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
              {max > 1 && (
                <p style={{ margin: '1px 0 0', fontSize: '9px', color: T.muted, letterSpacing: '0.06em' }}>
                  MÁX {max} UN.
                </p>
              )}
            </div>

            {/* Stepper or Add button */}
            {qty === 0 ? (
              <button
                type="button"
                onClick={onAdd}
                style={{
                  background: T.goldDim, border: `1px solid ${T.goldBorder}`,
                  color: T.gold, padding: '6px 11px',
                  fontSize: '11px', fontWeight: '700',
                  cursor: 'pointer', letterSpacing: '0.06em', fontFamily: 'inherit',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(200,168,107,0.28)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = T.goldDim)}
              >
                + Adicionar
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button type="button" onClick={onRemove} style={{
                  width: '26px', height: '26px', background: 'none',
                  border: `1px solid ${T.goldBorder}`, color: T.gold,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,90,74,0.15)'; e.currentTarget.style.borderColor = T.error; e.currentTarget.style.color = T.error; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = T.goldBorder; e.currentTarget.style.color = T.gold; }}
                >
                  <Minus size={11} />
                </button>
                <span style={{ fontSize: '14px', fontWeight: '700', color: T.cream, minWidth: '16px', textAlign: 'center' }}>{qty}</span>
                <button type="button" onClick={onAdd} disabled={atMax} style={{
                  width: '26px', height: '26px', background: atMax ? 'none' : T.goldDim,
                  border: `1px solid ${atMax ? T.dim : T.goldBorder}`, color: atMax ? T.dim : T.gold,
                  cursor: atMax ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}
                  onMouseEnter={(e) => { if (!atMax) { e.currentTarget.style.background = 'rgba(200,168,107,0.28)'; }}}
                  onMouseLeave={(e) => { if (!atMax) { e.currentTarget.style.background = T.goldDim; }}}
                >
                  <Plus size={11} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Zoom dialog */}
      {item.photo && (
        <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
          <DialogContent style={{
            background: '#0C0906', border: `1px solid ${T.goldBorder}`,
            padding: '8px', width: 'min(560px, 92vw)',
            maxWidth: '92vw', maxHeight: '88vh',
            overflow: 'hidden', display: 'flex', flexDirection: 'column',
          }}>
            <img
              src={item.photo} alt={item.name}
              style={{ width: '100%', height: 'auto', maxHeight: 'calc(88vh - 56px)', objectFit: 'contain', display: 'block' }}
            />
            <div style={{ padding: '8px 4px 2px' }}>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: T.gold }}>
                {item.name}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: T.muted }}>{item.description}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const ReservaForm = ({ type = 'user' }) => {
  const { toast } = useToast();

  // Hydration guard — renders dynamic content only on client
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Step machine
  const [step, setStep] = useState(1);

  // Form data
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [dataReserva, setData] = useState('');
  const [numeroPessoas, setNumeroPessoas] = useState(2);

  // Space & table
  const [localId, setLocalId] = useState('');
  const [localNome, setLocalNome] = useState('');
  const [mesaId, setMesaId] = useState('');
  const [mesaNome, setMesaNome] = useState('');

  // Firebase data
  const [locais, setLocais] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [itensAdicionais, setItensAdicionais] = useState([]);
  const [desativacaoIntervals, setDesativacaoIntervals] = useState([]);

  // Cart — each entry: { id, nome, preco, quantidade }
  const [itensCarrinho, setItensCarrinho] = useState([]);
  const [showAllItems, setShowAllItems] = useState(false);

  // UI
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ── Firebase: deactivation intervals ── */
  useEffect(() => {
    get(ref(database, 'intervalosDesativacao')).then((snap) => {
      const data = snap.val();
      setDesativacaoIntervals(data ? Object.values(data) : []);
    });
  }, []);

  /* ── Firebase: spaces + load photo URLs ── */
  useEffect(() => {
    const unsub = onValue(ref(database, 'spaces'), async (snap) => {
      const data = snap.val();
      if (!data) { setLocais([]); return; }
      const list = await Promise.all(
        Object.keys(data).map(async (key) => {
          const local = {
            id: key,
            name: data[key].name,
            photo: data[key].photo,
            mesas: data[key].mesas
              ? Object.keys(data[key].mesas).map((mk) => ({ id: mk, ...data[key].mesas[mk] }))
              : [],
            _photoUrl: null,
          };
          if (local.photo) {
            try {
              local._photoUrl = await getDownloadURL(storageRef(storage, local.photo));
            } catch { /* no photo */ }
          }
          return local;
        })
      );
      setLocais(list);
    });
    return () => unsub();
  }, []);

  /* ── Firebase: items ── */
  useEffect(() => {
    const unsub = onValue(ref(database, 'items'), (snap) => {
      const data = snap.val();
      setItensAdicionais(data ? Object.keys(data).map((k) => ({ id: k, ...data[k] })) : []);
    });
    return () => unsub();
  }, []);

  /* ── Firebase: reservations for date/space ── */
  useEffect(() => {
    if (!dataReserva || !localId) return;
    const unsub = onValue(ref(database, 'reservas'), (snap) => {
      const data = snap.val();
      if (data) {
        setReservas(Object.keys(data).map((k) => ({ id: k, ...data[k] })).filter((r) => r.dataReserva === dataReserva));
      } else {
        setReservas([]);
      }
    });
    return () => unsub();
  }, [dataReserva, localId]);

  /* ── Date helpers ── */
  const formatDateToYMD = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const isDateDisabled = (date) => {
    if (!mounted) return false;
    const normalized = formatDateToYMD(date);
    const intervals = [...desativacaoIntervals];
    // Disable today if past 17:30 (Sao Paulo = UTC-3, no DST since 2019)
    const nowUtcMs = Date.now();
    const spOffsetMs = -3 * 60 * 60 * 1000;
    const spNow = new Date(nowUtcMs + spOffsetMs);
    const spTotalMinutes = spNow.getUTCHours() * 60 + spNow.getUTCMinutes();
    if (spTotalMinutes >= 17 * 60 + 30) {
      const y = spNow.getUTCFullYear();
      const m = String(spNow.getUTCMonth() + 1).padStart(2, '0');
      const d = String(spNow.getUTCDate()).padStart(2, '0');
      const todayStr = `${y}-${m}-${d}`;
      intervals.push({ dataInicio: todayStr, dataFim: todayStr });
    }
    return intervals.some((r) => normalized >= r.dataInicio && normalized <= r.dataFim);
  };

  /* ── Validation ── */
  const validarWhatsapp = (n) => /^\d{11}$/.test(n.replace(/\D/g, ''));
  const validarNome = (n) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(n.trim());

  const minDate = new Date();
  const maxDate = (() => { const d = new Date(); d.setDate(d.getDate() + 7); return d; })();

  /* ── Navigation ── */
  const handleStep1Next = () => {
    if (!nome || !whatsapp || !dataReserva) { setFormError('Preencha todos os campos obrigatórios.'); return; }
    if (!validarWhatsapp(whatsapp)) { setFormError('WhatsApp inválido. Formato: (XX) XXXXX-XXXX'); return; }
    if (!validarNome(nome)) { setFormError('Nome inválido. Use apenas letras.'); return; }
    if (numeroPessoas > 4) { handleContact(); return; }
    setFormError('');
    setStep(2);
  };

  const handleStep2Next = () => {
    if (!localId || !mesaId) { setFormError('Selecione um ambiente e uma mesa.'); return; }
    setFormError('');
    setStep(3);
  };

  /* ── Space selection ── */
  const handleLocalSelect = (local) => {
    setLocalId(local.id);
    setLocalNome(local.name);
    setMesaId('');
    setMesaNome('');
    setMesas((local.mesas || []).sort((a, b) => a.numero - b.numero));
  };

  /* ── Table selection ── */
  const handleMesaSelect = (mesa) => {
    const reserved = reservas.some((r) => r.mesaId === mesa.id && r.dataReserva === dataReserva);
    if (reserved) {
      toast({ title: 'Mesa indisponível', description: 'Já reservada para esta data.', variant: 'destructive', duration: 3000 });
      return;
    }
    setMesaId(mesa.id);
    setMesaNome(mesa.numero);
    toast({ title: `Mesa ${mesa.numero} selecionada`, description: `Capacidade: ${mesa.numeroPessoas} pessoas.`, duration: 2500 });
  };

  /* ── Cart ── */
  const handleAdicionarItem = (item) => {
    const max = item.maxQuantidade || 1;
    setItensCarrinho((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        if (existing.quantidade >= max) return prev; // at limit, do nothing
        return prev.map((i) => i.id === item.id ? { ...i, quantidade: i.quantidade + 1 } : i);
      }
      return [...prev, { id: item.id, nome: item.nome, preco: item.preco, quantidade: 1, max }];
    });
    toast({ title: 'Item adicionado', description: item.nome, duration: 2000 });
  };

  const handleRemoverItem = (id) => {
    setItensCarrinho((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (!existing) return prev;
      if (existing.quantidade <= 1) return prev.filter((i) => i.id !== id);
      return prev.map((i) => i.id === id ? { ...i, quantidade: i.quantidade - 1 } : i);
    });
  };

  const cartTotalQty = itensCarrinho.reduce((acc, i) => acc + i.quantidade, 0);
  const cartTotal = itensCarrinho.reduce((acc, i) => acc + i.preco * i.quantidade, 0);

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!nome || !whatsapp || !dataReserva || !mesaId || !localId) return;
    setIsSubmitting(true);
    const formattedDate = dataReserva.split('-').reverse().join('/');
    const reservaRef = push(ref(database, 'reservas'));
    const reservaData = {
      nome, numeroPessoas, whatsapp, dataReserva, mesaId, localId,
      pago: itensCarrinho.length > 0 ? 'N' : 'Y',
      itensAdicionais: itensCarrinho.flatMap((i) => Array(i.quantidade).fill(i.id)),
      timestamp: new Date().toISOString(),
    };
    try {
      await sendMessage({ formattedDate, nome, whatsapp, itensCarrinho: itensCarrinho.length > 0 ? itensCarrinho : 0, mesaNome, localNome, numeroPessoas });
      await set(reservaRef, reservaData);
      const mesaAtual = mesas.find((m) => m.id === mesaId);
      await set(ref(database, `spaces/${localId}/mesas/${mesaId}`), { ...mesaAtual, reservado: 'Y', ultimaReserva: dataReserva });
      setStep('done');
    } catch (err) {
      console.error(err);
      toast({ title: 'Erro ao realizar reserva', description: 'Tente novamente.', variant: 'destructive', duration: 4000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContact = () => {
    const msg = encodeURIComponent(`Olá, gostaria de uma mesa para ${numeroPessoas} pessoas`);
    window.open(`https://wa.me/554732279537?text=${msg}`, '_blank');
  };

  const resetForm = () => {
    setStep(1); setNome(''); setWhatsapp(''); setData('');
    setNumeroPessoas(2); setLocalId(''); setLocalNome('');
    setMesaId(''); setMesaNome(''); setItensCarrinho([]); setFormError('');
  };

  const selectedLocal = locais.find((l) => l.id === localId);
  const isMesaAtiva = (m) => m.ativo !== false;

  /* ─────────────────────────────────────────────────────────── */
  return (
    <div style={{ width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
      <div className={type === 'user' ? 'booking-card' : ''} style={{
        width: '100%',
        maxWidth: type === 'user' ? '560px' : '1000px',
        background: T.card,
        boxShadow: `0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(200,168,107,0.08)`,
      }}>

        {/* ── Top bar with logo ── */}
        <div style={{
          padding: '32px 40px 28px',
          borderBottom: `1px solid rgba(200,168,107,0.1)`,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{
              fontSize: '10px', fontWeight: '700', letterSpacing: '0.2em',
              textTransform: 'uppercase', color: T.gold, marginBottom: '6px',
            }}>
              Casa 97 · Restaurante
            </p>
            <h1 style={{
              fontFamily: 'var(--font-display), Georgia, serif',
              fontSize: step === 'done' ? '26px' : '24px',
              fontWeight: '400', color: T.cream,
              letterSpacing: '0.01em', margin: 0,
              fontStyle: 'italic',
            }}>
              {step === 1 && 'Reserve sua mesa'}
              {step === 2 && 'Escolha seu ambiente'}
              {step === 3 && 'Finalize sua reserva'}
              {step === 'done' && 'Reserva confirmada'}
            </h1>
          </div>
          <Image
            src={Logo}
            width={42}
            height={42}
            style={{ filter: 'brightness(0) invert(0.8)', opacity: 0.7, marginTop: '4px', flexShrink: 0 }}
            alt="Casa 97"
          />
        </div>

        {/* ── Step progress ── */}
        {step !== 'done' && (
          <div style={{ padding: '24px 0 0' }}>
            <StepDots step={step} />
          </div>
        )}

        {/* ── Thin gold divider ── */}
        <div style={{ height: '1px', background: 'rgba(200,168,107,0.08)', margin: '24px 0 0' }} />

        {/* ─────── STEP 1: Dados pessoais ─────── */}
        {step === 1 && (
          <div style={{ padding: '36px 40px 40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

              {/* Nome */}
              <div>
                <label style={S.label}><User size={10} style={{ display:'inline', marginRight:'5px' }} />Nome completo</label>
                <input
                  style={S.input}
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Como prefere ser chamado?"
                  suppressHydrationWarning
                  onFocus={(e) => (e.target.style.borderBottomColor = T.gold)}
                  onBlur={(e) => (e.target.style.borderBottomColor = T.goldBorder)}
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label style={S.label}><Phone size={10} style={{ display:'inline', marginRight:'5px' }} />WhatsApp</label>
                <input
                  style={S.input}
                  type="text"
                  inputMode="numeric"
                  value={maskPhone(whatsapp)}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
                    setWhatsapp(digits);
                  }}
                  onFocus={(e) => (e.target.style.borderBottomColor = T.gold)}
                  onBlur={(e) => (e.target.style.borderBottomColor = T.goldBorder)}
                  placeholder="(XX) XXXXX-XXXX"
                />
              </div>

              {/* Data */}
              <div>
                <label style={S.label}><Calendar size={10} style={{ display:'inline', marginRight:'5px' }} />Data da reserva</label>
                {mounted ? (
                  <DatePicker
                    selected={dataReserva ? parseISO(dataReserva) : null}
                    onChange={(d) => setData(format(d, 'yyyy-MM-dd'))}
                    locale={ptBR}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Selecione uma data"
                    minDate={type === 'user' ? minDate : undefined}
                    maxDate={type === 'user' ? maxDate : undefined}
                    filterDate={type === 'user' ? (d) => !isDateDisabled(d) : undefined}
                    customInput={
                      <input
                        style={{ ...S.input, cursor: 'pointer' }}
                        suppressHydrationWarning
                        onFocus={(e) => (e.target.style.borderBottomColor = T.gold)}
                        onBlur={(e) => (e.target.style.borderBottomColor = T.goldBorder)}
                      />
                    }
                  />
                ) : (
                  <input style={{ ...S.input, cursor: 'pointer' }} placeholder="Selecione uma data" readOnly />
                )}
              </div>

              {/* Número de pessoas */}
              <div>
                <label style={S.label}><Users size={10} style={{ display:'inline', marginRight:'5px' }} />Número de pessoas</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', paddingTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setNumeroPessoas((p) => Math.max(1, p - 1))}
                    style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      border: `1px solid ${T.goldBorder}`, background: 'transparent',
                      color: T.muted, cursor: 'pointer', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.gold; e.currentTarget.style.color = T.gold; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.goldBorder; e.currentTarget.style.color = T.muted; }}
                  >
                    <Minus size={14} />
                  </button>
                  <div style={{ textAlign: 'center', minWidth: '40px' }}>
                    <span style={{ fontSize: '32px', fontWeight: '700', color: T.cream, fontFamily: 'var(--font-display), serif', lineHeight: 1 }}>
                      {numeroPessoas}
                    </span>
                    <p style={{ margin: '2px 0 0', fontSize: '11px', color: T.muted, letterSpacing: '0.08em' }}>
                      {numeroPessoas === 1 ? 'pessoa' : 'pessoas'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNumeroPessoas((p) => Math.min(25, p + 1))}
                    style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      border: `1px solid ${T.goldBorder}`, background: 'transparent',
                      color: T.muted, cursor: 'pointer', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.gold; e.currentTarget.style.color = T.gold; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.goldBorder; e.currentTarget.style.color = T.muted; }}
                  >
                    <Plus size={14} />
                  </button>
                  {numeroPessoas > 4 && (
                    <span style={{ fontSize: '11px', color: '#D4A843', fontStyle: 'italic' }}>
                      Acima de 4 pessoas, somente via WhatsApp
                    </span>
                  )}
                </div>
              </div>

              {formError && <p style={{ color: T.error, fontSize: '12px', margin: '-8px 0 0', fontStyle: 'italic' }}>{formError}</p>}

              <div style={{ paddingTop: '8px', borderTop: `1px solid rgba(200,168,107,0.08)`, marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={handleStep1Next}
                  style={{ ...S.btnPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {numeroPessoas > 4
                    ? <><MessageCircle size={14} /> Solicitar no WhatsApp</>
                    : 'Escolher Ambiente & Mesa →'
                  }
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─────── STEP 2: Ambiente & Mesa ─────── */}
        {step === 2 && (
          <div style={{ padding: '36px 40px 40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

              {/* Space cards grid */}
              <div>
                <label style={S.label}>Escolha o ambiente</label>
                <p style={{ fontSize: '12px', color: T.muted, marginBottom: '16px', fontStyle: 'italic', marginTop: '-4px' }}>
                  Clique na foto para ver em detalhe e encontrar o ambiente ideal para sua ocasião.
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${Math.min(locais.length, type === 'user' ? 2 : 3)}, 1fr)`,
                  gap: '12px',
                }}>
                  {locais.map((local) => (
                    <SpaceCard
                      key={local.id}
                      local={local}
                      selected={localId === local.id}
                      onClick={() => handleLocalSelect(local)}
                    />
                  ))}
                </div>
              </div>

              {/* Featured space photo + tables */}
              {selectedLocal && (
                <div>
                  {/* Selected space pill */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    marginBottom: '20px',
                    padding: '10px 16px',
                    borderRadius: '4px',
                    border: `1px solid ${T.gold}`,
                    background: T.goldDim,
                  }}>
                    <Check size={14} color={T.gold} strokeWidth={2.5} />
                    <div>
                      <p style={{ margin: 0, fontSize: '9px', fontWeight: '700', letterSpacing: '0.14em', textTransform: 'uppercase', color: T.gold, opacity: 0.7 }}>
                        Ambiente selecionado
                      </p>
                      <p style={{ margin: 0, fontFamily: 'var(--font-display), serif', fontSize: '16px', fontWeight: '400', color: T.cream, fontStyle: 'italic' }}>
                        {selectedLocal.name}
                      </p>
                    </div>
                  </div>

                  {/* Tables */}
                  {mesas.length > 0 ? (
                    <div>
                      <label style={S.label}>Selecione a mesa</label>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                        gap: '8px',
                      }}>
                        {mesas.map((mesa) => (
                          <MesaBtn
                            key={mesa.id}
                            mesa={mesa}
                            selected={mesaId === mesa.id}
                            reserved={reservas.some((r) => r.mesaId === mesa.id)}
                            overCapacity={numeroPessoas > mesa.numeroPessoas}
                            inactive={!isMesaAtiva(mesa)}
                            onClick={handleMesaSelect}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: T.muted, fontSize: '13px', fontStyle: 'italic' }}>Nenhuma mesa disponível neste ambiente.</p>
                  )}
                </div>
              )}

              {formError && <p style={{ color: T.error, fontSize: '12px', fontStyle: 'italic', margin: '-12px 0 0' }}>{formError}</p>}

              <div style={{ display: 'flex', gap: '12px', paddingTop: '8px', borderTop: `1px solid rgba(200,168,107,0.08)` }}>
                <button type="button" onClick={() => { setStep(1); setFormError(''); }} style={S.btnGhost}>
                  <ChevronLeft size={13} /> Voltar
                </button>
                <button type="button" onClick={handleStep2Next} style={{ ...S.btnPrimary, flex: 1 }}>
                  Próximo →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─────── STEP 3: Extras & Confirmação ─────── */}
        {step === 3 && (
          <div style={{ padding: '36px 40px 40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

              {/* Reservation summary card */}
              <div style={{
                padding: '20px 24px',
                background: T.surface,
                borderLeft: `2px solid ${T.gold}`,
              }}>
                <p style={{ ...S.label, marginBottom: '14px' }}>Resumo da Reserva</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[
                    ['Hóspede', nome],
                    ['Data', dataReserva.split('-').reverse().join('/')],
                    ['Ambiente', localNome],
                    ['Mesa', `Mesa ${mesaNome} · ${numeroPessoas} ${numeroPessoas === 1 ? 'pessoa' : 'pessoas'}`],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p style={{ margin: '0 0 3px', fontSize: '10px', color: T.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</p>
                      <p style={{ margin: 0, fontSize: '14px', color: T.cream }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items */}
              {itensAdicionais.length > 0 && (
                <div>
                  <label style={S.label}><ShoppingBag size={10} style={{ display:'inline', marginRight:'5px' }} />Itens adicionais</label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: type === 'admin' ? 'repeat(2,1fr)' : 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '12px',
                  }}>
                    {(showAllItems ? itensAdicionais : itensAdicionais.slice(0, 5)).map((item) => {
                      const max = item.maxQuantidade || 1;
                      const cartEntry = itensCarrinho.find((i) => i.id === item.id);
                      const qty = cartEntry?.quantidade || 0;
                      const atMax = qty >= max;
                      return (
                        <ItemCard
                          key={item.id}
                          item={item}
                          qty={qty}
                          max={max}
                          atMax={atMax}
                          onAdd={() => handleAdicionarItem({ id: item.id, nome: item.name, preco: item.itemValue, maxQuantidade: max })}
                          onRemove={() => handleRemoverItem(item.id)}
                        />
                      );
                    })}
                  </div>

                  {/* Ver mais / Ver menos */}
                  {itensAdicionais.length > 5 && (
                    <button
                      type="button"
                      onClick={() => setShowAllItems((v) => !v)}
                      style={{
                        marginTop: '14px',
                        background: 'transparent',
                        border: `1px solid ${T.goldBorder}`,
                        color: T.gold,
                        padding: '10px 20px',
                        fontSize: '11px', fontWeight: '700',
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        cursor: 'pointer', fontFamily: 'inherit',
                        width: '100%',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = T.goldDim)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {showAllItems
                        ? `▲ Ver menos`
                        : `▼ Ver mais ${itensAdicionais.length - 5} itens`}
                    </button>
                  )}
                </div>
              )}

              {/* Cart */}
              {itensCarrinho.length > 0 && (
                <div style={{
                  background: T.surface,
                  borderLeft: `2px solid rgba(200,168,107,0.4)`,
                  padding: '20px 24px',
                }}>
                  <p style={{ ...S.label, marginBottom: '14px' }}>
                    Carrinho · {cartTotalQty} {cartTotalQty === 1 ? 'item' : 'itens'}
                  </p>
                  {itensCarrinho.map((item) => (
                    <div key={item.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '9px 0',
                      borderBottom: `1px solid rgba(200,168,107,0.06)`,
                    }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '14px', color: T.cream }}>{item.nome}</span>
                        {item.quantidade > 1 && (
                          <span style={{ fontSize: '11px', color: T.muted, marginLeft: '6px' }}>× {item.quantidade}</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '14px', color: T.gold, fontWeight: '600' }}>
                          {(item.preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                        {/* Stepper inline no carrinho */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button type="button" onClick={() => handleRemoverItem(item.id)}
                            style={{ background: 'none', border: `1px solid ${T.dim}`, borderRadius: '2px', cursor: 'pointer', color: T.muted, width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.error; e.currentTarget.style.color = T.error; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.dim; e.currentTarget.style.color = T.muted; }}
                          >
                            <Minus size={10} />
                          </button>
                          <span style={{ fontSize: '13px', color: T.cream, minWidth: '14px', textAlign: 'center' }}>{item.quantidade}</span>
                          <button type="button" onClick={() => handleAdicionarItem({ id: item.id, nome: item.nome, preco: item.preco, maxQuantidade: item.max })}
                            disabled={item.quantidade >= item.max}
                            style={{ background: 'none', border: `1px solid ${item.quantidade >= item.max ? T.dim : T.goldBorder}`, borderRadius: '2px', cursor: item.quantidade >= item.max ? 'not-allowed' : 'pointer', color: item.quantidade >= item.max ? T.dim : T.muted, width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                            onMouseEnter={(e) => { if (item.quantidade < item.max) { e.currentTarget.style.borderColor = T.gold; e.currentTarget.style.color = T.gold; }}}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = item.quantidade >= item.max ? T.dim : T.goldBorder; e.currentTarget.style.color = item.quantidade >= item.max ? T.dim : T.muted; }}
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', marginTop: '4px', borderTop: `1px solid rgba(200,168,107,0.12)` }}>
                    <span style={{ fontWeight: '700', color: T.cream, fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Total</span>
                    <span style={{ fontWeight: '700', color: T.gold, fontSize: '16px' }}>
                      {cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', paddingTop: '8px', borderTop: `1px solid rgba(200,168,107,0.08)` }}>
                <button type="button" onClick={() => { setStep(2); setFormError(''); }} style={S.btnGhost}>
                  <ChevronLeft size={13} /> Voltar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  style={{ ...S.btnPrimary, flex: 1, opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                >
                  {isSubmitting ? 'Confirmando...' : 'Confirmar Reserva ✓'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─────── SUCCESS ─────── */}
        {step === 'done' && (
          <div style={{ padding: '50px 40px', textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              border: `1px solid ${T.success}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              background: 'rgba(91,155,114,0.08)',
            }}>
              <Check size={26} color={T.success} />
            </div>
            <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.gold, marginBottom: '10px' }}>
              Reserva Confirmada
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display), Georgia, serif',
              fontSize: '28px', fontWeight: '400', color: T.cream,
              margin: '0 0 12px', fontStyle: 'italic',
            }}>
              Até breve, {nome.split(' ')[0]}!
            </h2>
            <p style={{ color: T.muted, fontSize: '14px', lineHeight: '1.7', marginBottom: '36px', maxWidth: '380px', margin: '0 auto 36px' }}>
              Em breve você receberá a confirmação da sua reserva via WhatsApp. Estamos ansiosos para recebê-lo.
            </p>
            <button
              type="button"
              onClick={resetForm}
              style={{
                background: 'transparent',
                border: `1px solid ${T.goldBorder}`,
                color: T.muted,
                padding: '12px 28px',
                cursor: 'pointer',
                fontSize: '11px', fontWeight: '600',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.gold; e.currentTarget.style.color = T.gold; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.goldBorder; e.currentTarget.style.color = T.muted; }}
            >
              Nova reserva
            </button>
          </div>
        )}

      </div>

    </div>
  );
};

export default ReservaForm;
