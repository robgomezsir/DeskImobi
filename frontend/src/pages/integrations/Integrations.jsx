import { BV_MODULES } from '../../constants/brandModules';
import { useRegisterAppToolbar } from '../../contexts/AppToolbarContext';
import { PageToolbar } from '../../components/layout/PageToolbar';

const integrations = BV_MODULES.integrations;

export default function Integrations() {
  useRegisterAppToolbar(
    () => <PageToolbar title={integrations.officialName} subtitle={integrations.tagline} />,
    []
  );

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <p className="text-sm text-bv-muted">
        Em breve você poderá conectar portais, CRMs e ferramentas em um só lugar.
      </p>
      <div className="glass rounded-2xl border p-6 sm:p-8">
        <p className="text-sm text-bv-text-soft">
          Esta área seguirá o padrão de cartões do brand (preenchimento com accent a 6% e borda a 10%).
        </p>
      </div>
    </div>
  );
}
