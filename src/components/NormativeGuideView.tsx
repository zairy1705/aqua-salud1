import React from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  AlertOctagon, 
  Droplet, 
  FlaskConical, 
  FileText, 
  ExternalLink,
  CheckCircle2,
  Info
} from 'lucide-react';

export const NormativeGuideView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-teal-100 text-teal-800 border border-teal-200">
            Marco Regulatorio Peruano
          </span>
          <span className="text-xs text-slate-500 font-medium">
            MINSA / DIGESA / SUNASS
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Normativa Técnica: D.S. N.° 031-2010-SA
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Reglamento de la Calidad del Agua para Consumo Humano. Parámetros de desinfección obligatoria, límites máximos permisibles (LMP) y protocolos de seguridad química.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Article 62 & LMP Table (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Article 62 Highlight Box */}
          <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-md border border-teal-800/60">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Artículo 62° — Desinfección Obligatoria del Agua</span>
            </div>
            <blockquote className="text-xs sm:text-sm leading-relaxed text-slate-200 italic border-l-2 border-teal-400 pl-4 my-3">
              "Toda agua destinada al consumo humano debe ser sometida a un proceso de desinfección con cloro o compuesto de cloro. En cualquier punto de la red de distribución el agua debe contener una concentración de cloro residual libre no menor a <strong>0.5 mg/L (ppm)</strong> y un límite máximo permisible de <strong>2.0 mg/L (ppm)</strong> en el grifo del consumidor."
            </blockquote>
            <p className="text-[11px] text-teal-300 font-mono mt-3">
              * En situaciones de emergencia o desastres sanitarios, la Autoridad de Salud puede disponer una concentración mínima de 1.0 mg/L.
            </p>
          </div>

          {/* Table of Permissible Limits (LMP) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-extrabold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              <span>Límites Máximos Permisibles (LMP) — Anexo I y II</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-600 border-b">
                  <tr>
                    <th className="p-2.5">Parámetro</th>
                    <th className="p-2.5">Unidad</th>
                    <th className="p-2.5">Límite Normativo (LMP)</th>
                    <th className="p-2.5">Rango Óptimo Recomendado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="bg-teal-50/40 font-semibold">
                    <td className="p-2.5 text-teal-950">Cloro Residual Libre (CRL)</td>
                    <td className="p-2.5">mg/L (ppm)</td>
                    <td className="p-2.5 font-mono text-teal-800">0.50 – 2.00</td>
                    <td className="p-2.5 text-teal-700">1.0 – 1.5 en salida / 0.8 en grifo</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Potencial de Hidrógeno (pH)</td>
                    <td className="p-2.5">Unidades pH</td>
                    <td className="p-2.5 font-mono">6.50 – 8.50</td>
                    <td className="p-2.5 text-slate-500">6.8 – 7.6 (Mayor HOCl)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Turbiedad</td>
                    <td className="p-2.5">NTU</td>
                    <td className="p-2.5 font-mono">&lt; 5.00</td>
                    <td className="p-2.5 text-slate-500">&lt; 1.0 (Evita neutralizar cloro)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Coliformes Totales</td>
                    <td className="p-2.5">UFC / 100 mL</td>
                    <td className="p-2.5 font-mono text-rose-700">0 (Ausencia total)</td>
                    <td className="p-2.5 text-emerald-700">0 (Ausencia)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Escherichia coli</td>
                    <td className="p-2.5">UFC / 100 mL</td>
                    <td className="p-2.5 font-mono text-rose-700">0 (Ausencia total)</td>
                    <td className="p-2.5 text-emerald-700">0 (Ausencia)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Conductividad (a 25 °C)</td>
                    <td className="p-2.5">µS / cm</td>
                    <td className="p-2.5 font-mono">1,500</td>
                    <td className="p-2.5 text-slate-500">&lt; 1,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Chlorine Chemistry & pH Explanation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-teal-600" />
              <span>La Química de la Desinfección: Relación pH y HOCl</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Al diluir hipoclorito en agua, se produce una reacción reversible en equilibrio:
            </p>
            <div className="bg-slate-100 p-3 rounded-xl text-center font-mono text-xs font-bold text-slate-800">
              Cl₂ + H₂O ⇌ HOCl (Ácido Hipocloroso) + H⁺ + Cl⁻ ⇌ OCl⁻ (Ion Hipoclorito)
            </div>
            <ul className="text-xs text-slate-600 space-y-2 pt-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>HOCl (Ácido Hipocloroso):</strong> Es la especie biocida activa más potente (hasta <strong>80 veces más eficaz</strong> destruyendo bacterias y virus que el ion hipoclorito).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Efecto del pH:</strong> A pH 7.0, el 75% del cloro es HOCl (alta desinfección). A pH 8.5, el HOCl cae a menos del 10%, dominando el ion OCl⁻ poco desinfectante.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sampling Protocol & PPE Safety (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Sampling Protocol Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Droplet className="w-4 h-4 text-cyan-600" />
              <span>Protocolo de Toma de Muestra de Cloro</span>
            </h3>
            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <strong className="text-slate-800 block mb-0.5">1. Selección del Grifo:</strong>
                Preferir grifos de metal conectados directamente a la red matriz. Evitar grifos con aireadores, mangueras o filtros.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <strong className="text-slate-800 block mb-0.5">2. Purga Obligatoria (2 a 3 minutos):</strong>
                Abrir el grifo a flujo moderado continuo para renovar el agua de la acometida domiciliaria.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <strong className="text-slate-800 block mb-0.5">3. Enjuague de la Celda DPD:</strong>
                Enjuagar tres veces el tubo fotométrico con el agua del grifo antes de tomar la muestra de 10 mL.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <strong className="text-slate-800 block mb-0.5">4. Reacción con DPD #1:</strong>
                Adicionar la pastilla DPD #1 o reactivo en polvo. Disolver e interpretar el color antes de 60 segundos.
              </div>
            </div>
          </div>

          {/* Safety & PPE Chemical Handling */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 text-amber-900">
              <AlertOctagon className="w-4 h-4 text-amber-600" />
              <span>Seguridad Química y EPP para Operadores</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              El Hipoclorito de Calcio (HTH) al 65-70% es un comburente enérgico clasificado por Naciones Unidas (ONU 1748, Clase 5.1).
            </p>
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-950 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Equipo de Protección Personal (EPP):</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                <li><strong>Guantes:</strong> De Nitrilo o Neopreno de caña larga resistentes a químicos.</li>
                <li><strong>Protección Ocular:</strong> Goggles / Lentes de seguridad con protección lateral contra salpicaduras.</li>
                <li><strong>Protección Respiratoria:</strong> Respirador con filtros para vapores inorgánicos (gases ácidos de cloro) y polvo.</li>
                <li><strong>Ropa Protectora:</strong> Mandil o delantal de PVC impermeable y botas de jebe.</li>
              </ul>
            </div>

            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900">
              <strong>¡REGLA DE ORO DE DILUCIÓN!</strong> Siempre verter el hipoclorito dentro del agua. NUNCA verter agua directamente sobre el cloro concentrado seco, ya que genera una reacción exotérmica con emisión violenta de cloro gas.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
