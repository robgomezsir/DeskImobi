import { useRegisterAppToolbar } from '../../contexts/AppToolbarContext';
import { PageToolbar } from '../../components/layout/PageToolbar';
import { BvModuleCanvas } from '../../components/layout/BvModuleCanvas';
import { useGlassBackdropStyle } from '../../hooks/useGlassBackdropStyle';

export default function Settings() {
  const glassBackdropStyle = useGlassBackdropStyle();

  useRegisterAppToolbar(
    () => (
      <PageToolbar title="Configurações" />
    ),
    []
  );

  return (
    <BvModuleCanvas>
      <div
        className="glass bv-card-hover rounded-card-3xl p-card-8 text-center text-bv-muted sm:p-card-10"
        style={glassBackdropStyle}
      >
        <p className="text-sm text-bv-text sm:text-base">Área em construção.</p>
      </div>
    </BvModuleCanvas>
  );
}
