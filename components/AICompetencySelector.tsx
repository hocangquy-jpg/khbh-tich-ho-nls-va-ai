import React, { useState } from 'react';
import { Brain, ChevronDown, ChevronUp, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';
import { AI_COMPETENCIES } from '../constants';

interface AICompetencySelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export const AICompetencySelector: React.FC<AICompetencySelectorProps> = ({ selectedIds, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const domains = Array.from(new Set(AI_COMPETENCIES.map(c => c.domain)));

  const toggleCompetency = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(i => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="bg-white border-l-4 border-amber-600 overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-amber-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="font-black text-[13px] uppercase tracking-wider text-amber-900">Khung Năng Lực AI (NLAI)</h3>
            <p className="text-[10px] text-amber-600 font-bold uppercase">{selectedIds.length} mục đã chọn</p>
          </div>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-amber-400" /> : <ChevronDown className="w-5 h-5 text-amber-400" />}
      </button>

      {isExpanded && (
        <div className="p-5 bg-amber-50/30 border-t border-amber-100 space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar">
          {domains.map(domain => (
            <div key={domain} className="space-y-3">
              <h4 className="text-[11px] font-black text-amber-800 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                {domain}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {AI_COMPETENCIES.filter(c => c.domain === domain).map(competency => (
                  <button
                    key={competency.id}
                    onClick={() => toggleCompetency(competency.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all text-left group
                      ${selectedIds.includes(competency.id) 
                        ? 'bg-amber-600 border-amber-800 text-white shadow-[4px_4px_0_0_rgba(180,83,9,1)]' 
                        : 'bg-white border-amber-100 text-slate-600 hover:border-amber-300 hover:bg-amber-50'
                      }`}
                  >
                    <div className={`mt-0.5 p-1 rounded-md flex-shrink-0 transition-colors
                      ${selectedIds.includes(competency.id) ? 'bg-amber-500/30 text-white' : 'bg-amber-50 text-amber-400 group-hover:text-amber-600'}
                    `}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-black text-[10px] mb-0.5 opacity-80 uppercase tracking-tighter">{competency.id}</div>
                      <div className="text-[11px] font-bold leading-relaxed">{competency.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
