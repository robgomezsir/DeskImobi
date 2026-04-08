import { useRegisterAppToolbar } from '../../contexts/AppToolbarContext';

export default function Settings() {
  useRegisterAppToolbar(
    () => (
      <div className="min-w-0">
        <h1 className="text-2xl font-display font-bold tracking-tight text-bv-text md:text-3xl">Configurações</h1>
        <p className="truncate text-sm text-bv-muted">Preferências da conta e do sistema</p>
      </div>
    ),
    []
  );

  return <div className="animate-in fade-in text-bv-muted">Área em construção.</div>;
}
