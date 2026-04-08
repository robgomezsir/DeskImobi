import { createContext, useContext, useLayoutEffect, useRef } from 'react';

/**
 * Setter injetado pelo Layout para o FAB por rota (Outlet).
 */
export const SetAppFabContext = createContext(/** @type {((node) => void) | null} */ (null));

export function useSetAppFab() {
  return useContext(SetAppFabContext);
}

/**
 * Registra o conteúdo do FAB (normalmente um botão). Limpa ao desmontar ou trocar de rota.
 *
 * @param {() => import('react').ReactNode} render
 * @param {import('react').DependencyList} [deps]
 */
export function useRegisterAppFab(render, deps = []) {
  const setFab = useSetAppFab();
  const renderRef = useRef(render);
  renderRef.current = render;

  useLayoutEffect(() => {
    if (!setFab) return undefined;
    setFab(renderRef.current());
    return () => setFab(null);
  }, [setFab, ...deps]);
}
