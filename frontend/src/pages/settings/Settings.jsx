import { useRegisterAppToolbar } from '../../contexts/AppToolbarContext';
import { PageToolbar } from '../../components/layout/PageToolbar';
import { BvModuleCanvas } from '../../components/layout/BvModuleCanvas';
import { useGlassBackdropStyle } from '../../hooks/useGlassBackdropStyle';

export default function Settings() {
  const glassBackdropStyle = useGlassBackdropStyle();

  useRegisterAppToolbar(
    () => (
      <PageToolbar title="Configurações" subtitle="Preferências da conta e do sistema" />
    ),
    []
  );

  return (
    <BvModuleCanvas>
      <div
        className="glass bv-card-hover rounded-3xl p-8 text-center text-bv-muted sm:p-10"
        style={glassBackdropStyle}
      >
        <p className="text-sm text-bv-text sm:text-base">Área em construção.</p>
      </div>
    </BvModuleCanvas>
  );
}
