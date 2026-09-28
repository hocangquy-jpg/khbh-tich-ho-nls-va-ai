import React, { useMemo, useState } from 'react';
import { DIGITAL_COMPETENCIES } from '../constants';
import { ChevronDown, ChevronUp, Check, Search, X, Layers, CheckCircle2, Bookmark } from 'lucide-react';
import { Competency } from '../types';

interface CompetencySelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export const CompetencySelector: React.FC<CompetencySelectorProps> = ({ selectedIds, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDomain, setActiveDomain] = useState<string>('all');

  const domains = useMemo(() => {
    return Array.from(new Set(DIGITAL_COMPETENCIES.map(c => c.domain)));
  }, []);

  const filteredCompetencies = useMemo(() => {
    return DIGITAL_COMPETENCIES.filter(comp => {
      const matchesDomain = activeDomain === 'all' || comp.domain === activeDomain;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesDomain;

      const matchesSearch =
        comp.id.toLowerCase().includes(query) ||
        comp.name.toLowerCase().includes(query) ||
        comp.domain.toLowerCase().includes(query);

      return matchesDomain && matchesSearch;
    });
  }, [activeDomain, searchQuery]);

  const groupedCompetencies = useMemo(() => {
    const groups: Record<string, Competency[]> = {};
    filteredCompetencies.forEach(comp => {
      if (!groups[comp.domain]) groups[comp.domain] = [];
      groups[comp.domain].push(comp);
    });
    return groups;
  }, [filteredCompetencies]);

  const toggleCompetency = (id: string) => {
    if (selectedIds.includes(id)) onChange(selectedIds.filter(i => i !== id));
    else onChange([...selectedIds, id]);
  };

  const toggleDomain = (domain: string) => {
    const domainComps = DIGITAL_COMPETENCIES.filter(c => c.domain === domain);
    const domainIds = domainComps.map(c => c.id);
    const allSelected = domainIds.every(id => selectedIds.includes(id));
    if (allSelected) onChange(selectedIds.filter(id => !domainIds.includes(id)));
    else onChange(Array.from(new Set([...selectedIds, ...domainIds])));
  };

  const selectAll = () => onChange(DIGITAL_COMPETENCIES.map(c => c.id));
  const deselectAll = () => onChange([]);

  return (
    <div className="border-t-2 border-[#1a230f] bg-white flex flex-col">
      <button 
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 md:p-5 bg-gradient-to-r from-lime-50/80 via-white to-emerald-50/60 hover:bg-lime-100/60 transition-all text-left group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-lime-700 to-lime-900 text-white rounded-xl shadow-[2px_2px_0_0_rgba(26,35,15,1)] group-hover:scale-105 transition-transform">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm md:text-base text-[#1a230f] uppercase tracking-wide">
                Khung Năng Lực Số (NLS)
              </h3>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-black uppercase bg-lime-100 text-lime-900 border border-lime-300 rounded-md">
                6 Miền năng lực
              </span>
            </div>
            <p className="text-xs text-lime-800 font-bold mt-0.5 flex items-center gap-1.5">
              <span>Đã chọn:</span>
              <span className="bg-lime-800 text-white px-2 py-0.5 rounded-full text-[11px] font-black shadow-xs">
                {selectedIds.length} / {DIGITAL_COMPETENCIES.length} chỉ báo
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <span className="text-[11px] font-black text-lime-900 bg-lime-100 px-2 py-1 rounded-lg border border-lime-300 hidden md:inline-block">
              {selectedIds.length} mục
            </span>
          )}
          <div className="p-1.5 rounded-lg bg-lime-100 text-lime-900 border border-lime-300 group-hover:bg-lime-200 transition-colors">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 md:p-5 bg-gradient-to-b from-lime-50/40 via-white to-lime-50/30 border-t-2 border-lime-200 space-y-4">
          {/* Quick Select & Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-lime-100 pb-3">
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={selectAll}
                className="px-3 py-1 bg-lime-800 hover:bg-lime-900 text-white font-black rounded-lg shadow-2xs transition-all active:scale-95"
              >
                + Chọn hết ({DIGITAL_COMPETENCIES.length})
              </button>
              <button
                type="button"
                onClick={deselectAll}
                className="px-3 py-1 bg-white hover:bg-red-50 text-slate-600 hover:text-red-700 font-bold rounded-lg border border-slate-300 shadow-2xs transition-all active:scale-95"
              >
                Xóa hết
              </button>
            </div>
            
            {/* Domain Filter Dropdown */}
            <select
              value={activeDomain}
              onChange={(e) => setActiveDomain(e.target.value)}
              className="px-3 py-1 text-xs font-bold text-lime-950 bg-white border border-lime-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-300"
            >
              <option value="all">Tất cả miền năng lực ({domains.length})</option>
              {domains.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-lime-700 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm nhanh mã NLS (vd: 1.1.NC1a, 5.3) hoặc nội dung..."
              className="w-full pl-9 pr-8 py-2 bg-white border-2 border-lime-300 rounded-xl text-xs md:text-sm font-semibold text-slate-800 placeholder:text-lime-500 focus:outline-none focus:border-lime-700 focus:ring-2 focus:ring-lime-200 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Competency Items List */}
          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
            {(Object.entries(groupedCompetencies) as [string, Competency[]][]).map(([domain, competencies]) => {
              const domainIds = competencies.map(c => c.id);
              const isAll = domainIds.every(id => selectedIds.includes(id));
              const isSome = !isAll && domainIds.some(id => selectedIds.includes(id));

              return (
                <div 
                  key={domain} 
                  className="bg-white rounded-2xl border-2 border-lime-700/80 shadow-[3px_3px_0_0_rgba(101,163,13,0.15)] overflow-hidden transition-all"
                >
                  {/* Domain Header */}
                  <div 
                    onClick={() => toggleDomain(domain)}
                    className="px-4 py-2.5 bg-gradient-to-r from-lime-100/90 to-emerald-50/80 border-b border-lime-200 flex items-center justify-between cursor-pointer hover:bg-lime-200/70 transition-colors select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-md border-2 border-lime-800 flex items-center justify-center transition-all ${
                        isAll ? 'bg-lime-800 text-white' : isSome ? 'bg-lime-200 text-lime-900' : 'bg-white'
                      }`}>
                        {isAll && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                        {isSome && <div className="w-2 h-2 bg-lime-800 rounded-xs" />}
                      </div>
                      <h4 className="text-xs md:text-sm font-black text-lime-950 uppercase tracking-tight">
                        {domain}
                      </h4>
                    </div>
                    <span className="text-[11px] font-bold text-lime-900">
                      {competencies.filter(c => selectedIds.includes(c.id)).length}/{competencies.length}
                    </span>
                  </div>

                  {/* Competency Items */}
                  <div className="p-2.5 space-y-2">
                    {competencies.map(comp => {
                      const isSel = selectedIds.includes(comp.id);
                      return (
                        <div 
                          key={comp.id} 
                          onClick={() => toggleCompetency(comp.id)} 
                          className={`p-3 rounded-xl border-2 transition-all cursor-pointer select-none flex items-start gap-3 group ${
                            isSel
                              ? 'bg-lime-50 border-lime-700 shadow-[3px_3px_0_0_rgba(77,124,15,0.8)]'
                              : 'bg-white border-slate-200 hover:border-lime-400 hover:bg-lime-50/40'
                          }`}
                        >
                          <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                            isSel
                              ? 'bg-lime-800 border-lime-900 text-white'
                              : 'border-slate-300 bg-slate-50 group-hover:border-lime-600'
                          }`}>
                            {isSel && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded-md font-mono font-black text-xs tracking-tight transition-colors ${
                                isSel
                                  ? 'bg-lime-800 text-white border border-lime-900 shadow-2xs'
                                  : 'bg-lime-100 text-lime-900 border border-lime-300 group-hover:bg-lime-200'
                              }`}>
                                Mã: {comp.id}
                              </span>
                            </div>
                            <p className={`text-xs md:text-sm leading-relaxed transition-colors ${
                              isSel 
                                ? 'text-slate-950 font-bold' 
                                : 'text-slate-700 font-semibold group-hover:text-slate-900'
                            }`}>
                              {comp.name}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
