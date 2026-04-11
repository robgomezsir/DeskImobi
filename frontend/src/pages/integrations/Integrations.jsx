import { BV_MODULES } from '../../constants/brandModules';
import { useRegisterAppToolbar } from '../../contexts/AppToolbarContext';
import { PageToolbar } from '../../components/layout/PageToolbar';
import { BvModuleCanvas } from '../../components/layout/BvModuleCanvas';
import { useGlassBackdropStyle } from '../../hooks/useGlassBackdropStyle';

const integrations = BV_MODULES.integrations;

export default function Integrations() {
  const glassBackdropStyle = useGlassBackdropStyle();

  useRegisterAppToolbar(
    () => <PageToolbar title={integrations.officialName} subtitle={integrations.tagline} />,
    []
  );

  return (
    <BvModuleCanvas>
      <div className="space-y-6">
        <p className="text-sm text-bv-muted">
          Em breve você poderá conectar portais, CRMs e ferramentas em um só lugar.
        </p>
        <div
          className="glass bv-card-hover rounded-card-3xl p-card-6 sm:p-card-8"
          style={glassBackdropStyle}
        >
          <p className="text-sm text-bv-text-soft">
            Esta área seguirá o padrão de cartões do brand (preenchimento com accent a 6% e borda a 10%).
          </p>
        </div>
      </div>
    </BvModuleCanvas>
  );
}
