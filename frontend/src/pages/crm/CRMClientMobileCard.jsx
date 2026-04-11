import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageSquare, MoreHorizontal, Loader2, Sparkles } from 'lucide-react';
import { formatClientStatus } from './clientStatusLabel';

const MotionArticle = motion.article;

/** Cartão de lead para telas menores que md (sem scroll horizontal). */
export function CRMClientMobileCard({
  client,
  index,
  reduceMotion,
  getStatusColor,
  classifyingId,
  onClassify,
  glassBackdropStyle,
  onEdit,
  onDelete,
  onMessage,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  return (
    <MotionArticle
      initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : 0.98 }}
      transition={{ duration: reduceMotion ? 0 : 0.2, delay: reduceMotion ? 0 : index * 0.04 }}
      className="glass bv-card-hover rounded-3xl p-4"
      style={glassBackdropStyle}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-bv-green/20 font-display text-lg font-bold text-bv-green">
            {client.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-bv-text-soft">{client.name}</p>
            <span
              className={`mt-1 inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${getStatusColor(client.status)}`}
            >
              {formatClientStatus(client.status)}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => onClassify(client.id)}
            disabled={classifyingId === client.id}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-bv-green/20 text-bv-green transition-colors hover:bg-bv-green/30"
            title="IA: Análise Soberana"
          >
            {classifyingId === client.id ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
          </button>
          <button
            type="button"
            onClick={() => onMessage?.(client)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-bv-surface-muted text-bv-muted transition-colors hover:bg-bv-surface-strong hover:text-bv-text"
            title="Mensagem"
          >
            <MessageSquare size={16} />
          </button>
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-bv-surface-muted text-bv-muted transition-colors hover:bg-bv-surface-strong hover:text-bv-text"
              title="Mais"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              <MoreHorizontal size={16} />
            </button>
            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-20 mt-1 min-w-[140px] rounded-xl border border-[var(--line)] bg-bv-surface py-1 shadow-lg"
              >
                <button
                  type="button"
                  role="menuitem"
                  className="block w-full px-4 py-2 text-left text-sm text-bv-text-soft hover:bg-bv-surface-muted"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit?.(client);
                  }}
                >
                  Editar
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="block w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-bv-surface-muted"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete?.(client);
                  }}
                >
                  Excluir
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-1.5 border-t border-[var(--line-subtle)] pt-3 text-xs text-bv-muted">
        <p className="flex items-center gap-2">
          <Mail size={12} className="shrink-0 text-bv-muted" />
          <span className="min-w-0 break-all">{client.email || 'N/A'}</span>
        </p>
        <p className="flex items-center gap-2">
          <Phone size={12} className="shrink-0 text-bv-muted" />
          <span>{client.phone || '—'}</span>
        </p>
      </div>

      <div className="mt-3 rounded-xl bg-bv-surface-muted/80 px-3 py-2">
        <p className="text-sm font-medium text-bv-text-soft">{client.property_type || 'Qualquer'}</p>
        <p className="text-xs text-bv-muted">{client.location || 'Sem localização'}</p>
      </div>
    </MotionArticle>
  );
}
