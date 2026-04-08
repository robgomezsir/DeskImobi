import { createContext, useContext, useLayoutEffect, useRef } from 'react';

/**
 * Setter injetado pelo Layout autenticado para preencher a área leading do header.
 * Filhos da rota (via Outlet) chamam useRegisterAppToolbar.
 */
export const SetAppToolbarContext = createContext(/** @type {((node) => void) | null} */ (null));

export function useSetAppToolbar() {
  return useContext(SetAppToolbarContext);
}

/**
 * Registra conteúdo na faixa superior do layout (à esquerda do cluster tema/ações globais).
 * Limpa automaticamente ao desmontar ou trocar de rota.
 *
 * @param {() => import('react').ReactNode} render Retorna o JSX da área leading; usa sempre a função mais recente (ref).
 * @param {import('react').DependencyList} [deps] Dependências que, ao mudar, atualizam a toolbar (ex.: texto dinâmico).
 */
export function useRegisterAppToolbar(render, deps = []) {
  const setToolbar = useSetAppToolbar();
  const renderRef = useRef(render);
  renderRef.current = render;

  useLayoutEffect(() => {
    if (!setToolbar) return undefined;
    setToolbar(renderRef.current());
    return () => setToolbar(null);
  }, [setToolbar, ...deps]);
}
