
import React, { useMemo, useState } from 'react';
import { DIGITAL_COMPETENCIES } from '../constants';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Competency } from '../types';

interface CompetencySelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export const CompetencySelector: React.FC<CompetencySelectorProps> = ({ selectedIds, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const groupedCompetencies = useMemo(() => {
    const groups: Record<string, Competency[]> = {};
    DIGITAL_COMPETENCIES.forEach(comp => {
      if (!groups[comp.domain]) groups[comp.domain] = [];
      groups[comp.domain].push(comp);
    });
    return groups;
  }, []);

  const toggleCompetency = (id: string) => {
    if (selectedIds.includes(id)) onChange(selectedIds.filter(i => i !== id));
    else onChange([...selectedIds, id]);
  };

  const toggleDomain = (domain: string) => {
    const domainIds = groupedCompetencies[domain].map(c => c.id);
    const allSelected = domainIds.every(id => selectedIds.includes(id));
    if (allSelected) onChange(selectedIds.filter(id => !domainIds.includes(id)));
    else onChange(Array.from(new Set([...selectedIds, ...domainIds])));
  };

  const selectAll = () => onChange(DIGITAL_COMPETENCIES.map(c => c.id));
  const deselectAll = () => onChange([]);

  return (
    <div className="border-t-2 border-[#1a230f] bg-white">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 text-sm font-black text-[#1a230f] hover:bg-lime-50 transition-colors uppercase tracking-widest"
      >
        <div className="flex items-center gap-3">
          <span className="text-lime-800 text-base">Khung năng lực số</span>
          <span className="bg-lime-800 text-white text-[12px] px-3 py-1 rounded-full border border-lime-300">
            {selectedIds.length}/{DIGITAL_COMPETENCIES.length}
          </span>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-lime-800" /> : <ChevronDown className="w-5 h-5 text-lime-800" />}
      </button>

      {isExpanded && (
        <div className="p-6 pt-0 space-y-6 max-h-[450px] overflow-y-auto bg-lime-50/20 scrollbar-thin scrollbar-thumb-lime-300">
          <div className="flex gap-4 text-[12px] mb-4 border-b-2 border-lime-100 pb-3">
            <button onClick={selectAll} className="text-lime-900 hover:underline font-black uppercase">Chọn hết</button>
            <button onClick={deselectAll} className="text-slate-400 hover:text-slate-600 font-black uppercase">Xóa hết</button>
          </div>

          {(Object.entries(groupedCompetencies) as [string, Competency[]][]).map(([domain, competencies]) => {
            const domainIds = competencies.map(c => c.id);
            const isAll = domainIds.every(id => selectedIds.includes(id));
            const isSome = !isAll && domainIds.some(id => selectedIds.includes(id));

            return (
              <div key={domain} className="space-y-3 bg-white p-4 rounded-2xl border-2 border-lime-800 shadow-[4px_4px_0_0_rgba(101,163,13,0.1)]">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleDomain(domain)}>
                  <div className={`w-5 h-5 rounded border-2 border-lime-800 flex items-center justify-center transition-all ${
                    isAll ? 'bg-lime-800' : isSome ? 'bg-lime-100' : 'bg-white'
                  }`}>
                     {isAll && <Check className="w-3.5 h-3.5 text-white stroke-[4px]" />}
                     {isSome && <div className="w-2 h-2 bg-lime-800 rounded-sm" />}
                  </div>
                  <h4 className="text-[12px] font-black text-lime-950 uppercase tracking-tighter group-hover:text-lime-700">{domain}</h4>
                </div>

                <div className="pl-6 space-y-3">
                  {competencies.map(comp => {
                    const isSel = selectedIds.includes(comp.id);
                    return (
                      <div key={comp.id} onClick={() => toggleCompetency(comp.id)} className="flex items-start gap-3 cursor-pointer group">
                        <div className={`mt-0.5 w-5 h-5 rounded border-2 border-lime-800 flex-shrink-0 flex items-center justify-center transition-all ${
                          isSel ? 'bg-lime-800' : 'bg-white group-hover:border-lime-500'
                        }`}>
                          {isSel && <Check className="w-3.5 h-3.5 text-white stroke-[4px]" />}
                        </div>
                        <span className={`text-[14px] leading-tight select-none transition-colors ${isSel ? 'text-lime-900 font-black' : 'text-lime-600 font-medium'}`}>
                          <span className="font-black mr-2 text-lime-800">{comp.id}</span>
                          {comp.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
