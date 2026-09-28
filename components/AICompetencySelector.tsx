import React, { useState, useMemo } from 'react';
import { 
  Cpu, ChevronDown, ChevronUp, Check, CheckCircle2, 
  Search, X, Sparkles, Filter, Layers, CheckSquare, Square
} from 'lucide-react';
import { AI_COMPETENCIES } from '../constants';
import { Competency } from '../types';

interface AICompetencySelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export const AICompetencySelector: React.FC<AICompetencySelectorProps> = ({ selectedIds, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeGrade, setActiveGrade] = useState<'all' | '10' | '11' | '12'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract Grade and group competencies
  const parsedCompetencies = useMemo(() => {
    return AI_COMPETENCIES.map(comp => {
      let grade = '10';
      if (comp.id.startsWith('11.') || comp.domain.includes('Lớp 11')) grade = '11';
      else if (comp.id.startsWith('12.') || comp.domain.includes('Lớp 12')) grade = '12';

      // Clean domain name for display (e.g. "A. Tư duy lấy con người làm trung tâm")
      const cleanDomain = comp.domain.replace(/^Lớp\s+\d+\s*-\s*/i, '').trim();

      return {
        ...comp,
        grade,
        cleanDomain
      };
    });
  }, []);

  // Filter competencies based on active grade tab and search query
  const filteredCompetencies = useMemo(() => {
    return parsedCompetencies.filter(comp => {
      const matchesGrade = activeGrade === 'all' || comp.grade === activeGrade;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesGrade;

      const matchesSearch = 
        comp.id.toLowerCase().includes(query) ||
        comp.name.toLowerCase().includes(query) ||
        comp.domain.toLowerCase().includes(query) ||
        comp.cleanDomain.toLowerCase().includes(query);

      return matchesGrade && matchesSearch;
    });
  }, [parsedCompetencies, activeGrade, searchQuery]);

  // Group filtered competencies by Domain
  const groupedByDomain = useMemo(() => {
    const groups: Record<string, typeof parsedCompetencies> = {};
    filteredCompetencies.forEach(comp => {
      const groupKey = activeGrade === 'all' ? comp.domain : comp.cleanDomain;
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(comp);
    });
    return groups;
  }, [filteredCompetencies, activeGrade]);

  const toggleCompetency = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(i => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const toggleDomainGroup = (groupCompetencies: Competency[]) => {
    const groupIds = groupCompetencies.map(c => c.id);
    const allSelected = groupIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      onChange(selectedIds.filter(id => !groupIds.includes(id)));
    } else {
      onChange(Array.from(new Set([...selectedIds, ...groupIds])));
    }
  };

  const selectCurrentFiltered = () => {
    const idsToAdd = filteredCompetencies.map(c => c.id);
    onChange(Array.from(new Set([...selectedIds, ...idsToAdd])));
  };

  const deselectCurrentFiltered = () => {
    const idsToRemove = new Set(filteredCompetencies.map(c => c.id));
    onChange(selectedIds.filter(id => !idsToRemove.has(id)));
  };

  const selectAllAI = () => {
    onChange(AI_COMPETENCIES.map(c => c.id));
  };

  const deselectAllAI = () => {
    onChange([]);
  };

  return (
    <div className="bg-white border-t-2 md:border-t-0 md:border-l-2 border-[#1a230f] flex flex-col">
      {/* Header Button */}
      <button 
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 md:p-5 bg-gradient-to-r from-amber-50/80 via-white to-orange-50/60 hover:bg-amber-100/60 transition-all text-left group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-amber-500 to-amber-700 text-white rounded-xl shadow-[2px_2px_0_0_rgba(180,83,9,1)] group-hover:scale-105 transition-transform">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm md:text-base text-amber-950 uppercase tracking-wide">
                Khung Năng Lực AI (NLAI)
              </h3>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300 rounded-md">
                Lớp 10 - 11 - 12
              </span>
            </div>
            <p className="text-xs text-amber-700 font-bold mt-0.5 flex items-center gap-1.5">
              <span>Đã chọn:</span>
              <span className="bg-amber-600 text-white px-2 py-0.5 rounded-full text-[11px] font-black shadow-xs">
                {selectedIds.length} / {AI_COMPETENCIES.length} chỉ báo
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <span className="text-[11px] font-black text-amber-800 bg-amber-100 px-2 py-1 rounded-lg border border-amber-300 hidden md:inline-block">
              {selectedIds.length} mục
            </span>
          )}
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 border border-amber-300 group-hover:bg-amber-200 transition-colors">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Expanded Content Panel */}
      {isExpanded && (
        <div className="p-4 md:p-5 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/30 border-t-2 border-amber-200 space-y-4">
          
          {/* Grade Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-amber-100 pb-3">
            <div className="flex items-center gap-1.5 p-1 bg-amber-100/70 rounded-xl border border-amber-300">
              <button
                type="button"
                onClick={() => setActiveGrade('all')}
                className={`px-3 py-1.5 rounded-lg font-black text-xs uppercase tracking-tight transition-all ${
                  activeGrade === 'all'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'text-amber-900 hover:bg-amber-200/70'
                }`}
              >
                Tất cả ({AI_COMPETENCIES.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveGrade('10')}
                className={`px-3 py-1.5 rounded-lg font-black text-xs uppercase tracking-tight transition-all ${
                  activeGrade === '10'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'text-amber-900 hover:bg-amber-200/70'
                }`}
              >
                Lớp 10
              </button>
              <button
                type="button"
                onClick={() => setActiveGrade('11')}
                className={`px-3 py-1.5 rounded-lg font-black text-xs uppercase tracking-tight transition-all ${
                  activeGrade === '11'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'text-amber-900 hover:bg-amber-200/70'
                }`}
              >
                Lớp 11
              </button>
              <button
                type="button"
                onClick={() => setActiveGrade('12')}
                className={`px-3 py-1.5 rounded-lg font-black text-xs uppercase tracking-tight transition-all ${
                  activeGrade === '12'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'text-amber-900 hover:bg-amber-200/70'
                }`}
              >
                Lớp 12
              </button>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={selectCurrentFiltered}
                className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 font-black rounded-lg border border-amber-300 shadow-2xs transition-all active:scale-95"
                title="Chọn các mục đang hiển thị"
              >
                + Chọn hết {activeGrade !== 'all' ? `Lớp ${activeGrade}` : ''}
              </button>
              <button
                type="button"
                onClick={deselectCurrentFiltered}
                className="px-2.5 py-1 bg-white hover:bg-red-50 text-slate-600 hover:text-red-700 font-bold rounded-lg border border-slate-300 shadow-2xs transition-all active:scale-95"
                title="Bỏ chọn các mục đang hiển thị"
              >
                Bỏ chọn
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-amber-700 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm nhanh mã NL (vd: 10.C3, 11.A1, 12.D) hoặc từ khóa (prompt, mô hình, dữ liệu, đạo đức)..."
              className="w-full pl-9 pr-8 py-2 bg-white border-2 border-amber-300 rounded-xl text-xs md:text-sm font-semibold text-slate-800 placeholder:text-amber-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200 transition-all shadow-xs"
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

          {/* Selected chips quick view */}
          {selectedIds.length > 0 && (
            <div className="p-2.5 bg-amber-100/60 rounded-xl border border-amber-300 flex flex-wrap items-center gap-1.5 max-h-24 overflow-y-auto">
              <span className="text-[11px] font-black text-amber-950 uppercase mr-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                Đã chọn ({selectedIds.length}):
              </span>
              {selectedIds.map(id => (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-600 text-white font-mono font-black text-[11px] rounded-md shadow-2xs"
                >
                  {id}
                  <button
                    type="button"
                    onClick={() => toggleCompetency(id)}
                    className="hover:bg-amber-700 rounded p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={deselectAllAI}
                className="text-[10px] font-bold text-red-700 hover:underline ml-auto"
              >
                Xóa tất cả
              </button>
            </div>
          )}

          {/* Competency Items List grouped by Domain */}
          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
            {Object.keys(groupedByDomain).length === 0 ? (
              <div className="p-6 text-center text-slate-500 font-medium bg-amber-50/50 rounded-xl border border-dashed border-amber-300">
                Không tìm thấy chỉ báo Năng lực AI nào phù hợp với từ khóa &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              (Object.entries(groupedByDomain) as [string, typeof parsedCompetencies][]).map(([domain, comps]) => {
                const groupIds = comps.map(c => c.id);
                const allGroupSelected = groupIds.every(id => selectedIds.includes(id));
                const someGroupSelected = !allGroupSelected && groupIds.some(id => selectedIds.includes(id));

                return (
                  <div 
                    key={domain} 
                    className="bg-white rounded-2xl border-2 border-amber-300/80 shadow-[3px_3px_0_0_rgba(217,119,6,0.15)] overflow-hidden transition-all"
                  >
                    {/* Domain Header with Group Select */}
                    <div 
                      onClick={() => toggleDomainGroup(comps)}
                      className="px-4 py-2.5 bg-gradient-to-r from-amber-100/90 to-orange-50/80 border-b border-amber-200 flex items-center justify-between cursor-pointer hover:bg-amber-100 transition-colors select-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-md border-2 border-amber-700 flex items-center justify-center transition-all ${
                          allGroupSelected 
                            ? 'bg-amber-700 text-white' 
                            : someGroupSelected 
                              ? 'bg-amber-200 text-amber-800' 
                              : 'bg-white'
                        }`}>
                          {allGroupSelected && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                          {someGroupSelected && <div className="w-2 h-2 bg-amber-700 rounded-xs" />}
                        </div>
                        <h4 className="text-xs md:text-sm font-black text-amber-950 uppercase tracking-tight">
                          {domain}
                        </h4>
                      </div>
                      <span className="text-[11px] font-bold text-amber-800">
                        {comps.filter(c => selectedIds.includes(c.id)).length}/{comps.length}
                      </span>
                    </div>

                    {/* Competencies in this Domain */}
                    <div className="p-2.5 space-y-2">
                      {comps.map(comp => {
                        const isSelected = selectedIds.includes(comp.id);
                        return (
                          <div
                            key={comp.id}
                            onClick={() => toggleCompetency(comp.id)}
                            className={`p-3 rounded-xl border-2 transition-all cursor-pointer select-none flex items-start gap-3 group ${
                              isSelected
                                ? 'bg-amber-50 border-amber-600 shadow-[3px_3px_0_0_rgba(217,119,6,0.8)]'
                                : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/40'
                            }`}
                          >
                            {/* Checkbox indicator */}
                            <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-amber-600 border-amber-700 text-white'
                                : 'border-slate-300 bg-slate-50 group-hover:border-amber-500'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                {/* Prominent Competency Code Pill */}
                                <span className={`px-2 py-0.5 rounded-md font-mono font-black text-xs tracking-tight transition-colors ${
                                  isSelected
                                    ? 'bg-amber-700 text-white border border-amber-800 shadow-2xs'
                                    : 'bg-amber-100 text-amber-900 border border-amber-300 group-hover:bg-amber-200'
                                }`}>
                                  Mã: {comp.id}
                                </span>
                                
                                <span className="text-[10px] font-bold uppercase text-slate-500">
                                  Lớp {comp.grade}
                                </span>
                              </div>

                              {/* Competency Name & Description */}
                              <p className={`text-xs md:text-sm leading-relaxed transition-colors ${
                                isSelected 
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
              })
            )}
          </div>

          {/* Bottom Help / Guidance */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-amber-900">
            <span className="font-semibold">
              💡 Thầy/Cô có thể bấm vào tên nhóm để chọn toàn bộ chỉ báo của nhóm đó.
            </span>
            <button
              type="button"
              onClick={selectAllAI}
              className="font-black text-amber-800 hover:underline uppercase text-[11px] whitespace-nowrap ml-2"
            >
              Chọn tất cả ({AI_COMPETENCIES.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
