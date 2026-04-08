import { useRegisterAppToolbar } from '../../contexts/AppToolbarContext';
import { PageToolbar } from '../../components/layout/PageToolbar';

export default function Settings() {
  useRegisterAppToolbar(
    () => (
      <PageToolbar title="Configurações" subtitle="Preferências da conta e do sistema" />
    ),
    []
  );

  return <div className="animate-in fade-in text-bv-muted">Área em construção.</div>;
}
