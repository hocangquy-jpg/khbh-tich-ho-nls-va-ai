import React from 'react';
import { Target, CheckCircle2, Circle, AlertTriangle, Layers } from 'lucide-react';

export type ActivityOption = 'all' | 'act1' | 'act2' | 'act3' | 'act4' | 'custom';

export interface ActivitySelectionConfig {
  mode: ActivityOption;
  customText?: string;
}

interface ActivitySelectorProps {
  selectedMode: ActivityOption;
  onSelectMode: (mode: ActivityOption) => void;
  customActivityName?: string;
  onCustomActivityNameChange?: (name: string) => void;
}

export const ACTIVITIES = [
  {
    id: 'act1' as ActivityOption,
    number: '1',
    name: 'Hoạt động 1: Mở đầu (Khởi động)',
    shortName: 'HĐ 1: Khởi động',
    desc: 'Tích hợp công cụ số/AI vào khởi động, kích hoạt tư duy, khảo sát nhanh (Padlet, Quizizz, Mentimeter...).',
    badge: 'Khởi động',
    color: 'border-amber-500 bg-amber-50 text-amber-900',
    activeColor: 'bg-amber-600 text-white border-amber-800'
  },
  {
    id: 'act2' as ActivityOption,
    number: '2',
    name: 'Hoạt động 2: Hình thành kiến thức mới',
    shortName: 'HĐ 2: Kiến thức mới',
    desc: 'Khai thác AI, mô phỏng PhET/GeoGebra, làm việc nhóm tạo sản phẩm Canva, đối chiếu phản biện SGK.',
    badge: 'Trọng tâm',
    color: 'border-sky-500 bg-sky-50 text-sky-900',
    activeColor: 'bg-sky-700 text-white border-sky-900'
  },
  {
    id: 'act3' as ActivityOption,
    number: '3',
    name: 'Hoạt động 3: Luyện tập',
    shortName: 'HĐ 3: Luyện tập',
    desc: 'Luyện tập tương tác số qua Google Forms, trắc nghiệm AI, bảng tính Google Sheets, đánh giá tự động.',
    badge: 'Luyện tập',
    color: 'border-emerald-500 bg-emerald-50 text-emerald-900',
    activeColor: 'bg-emerald-700 text-white border-emerald-900'
  },
  {
    id: 'act4' as ActivityOption,
    number: '4',
    name: 'Hoạt động 4: Vận dụng, tìm tòi mở rộng',
    shortName: 'HĐ 4: Vận dụng',
    desc: 'Dự án số thực tiễn, thiết kế infographic/video báo cáo Canva, giải quyết bài toán thực tế bằng công nghệ.',
    badge: 'Vận dụng',
    color: 'border-purple-500 bg-purple-50 text-purple-900',
    activeColor: 'bg-purple-700 text-white border-purple-900'
  },
  {
    id: 'all' as ActivityOption,
    number: '★',
    name: 'Tích hợp toàn bộ bài học (Tất cả 4 hoạt động)',
    shortName: 'Toàn bộ bài',
    desc: 'Tích hợp NLS và NLAI xuyên suốt toàn bộ tiến trình dạy học của giáo án.',
    badge: 'Toàn bài',
    color: 'border-stone-400 bg-stone-50 text-stone-800',
    activeColor: 'bg-stone-800 text-white border-[#1a230f]'
  }
];

export const ActivitySelector: React.FC<ActivitySelectorProps> = ({
  selectedMode,
  onSelectMode,
  customActivityName = '',
  onCustomActivityNameChange
}) => {
  return (
    <div className="bg-white border-4 border-[#1a230f] rounded-2xl p-4 shadow-[4px_4px_0_0_rgba(26,35,15,1)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b-2 border-lime-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#1a230f] rounded-lg text-lime-300">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-[#1a230f] tracking-tight">
              Chọn hoạt động cần tích hợp NLS & AI (Quy định bắt buộc)
            </h3>
            <p className="text-[10px] text-red-600 font-black">
              👉 LƯU Ý RẤT QUAN TRỌNG: Chỉ tích hợp NLS và NLAI vào đúng 01 hoạt động được chọn, giữ nguyên bản 100% các hoạt động còn lại!
            </p>
          </div>
        </div>
        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-300">
          Chỉ định 1 hoạt động
        </span>
      </div>

      {/* Grid of Activities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
        {ACTIVITIES.filter(a => a.id !== 'all').map((act) => {
          const isSelected = selectedMode === act.id;
          return (
            <button
              key={act.id}
              type="button"
              onClick={() => onSelectMode(act.id)}
              className={`text-left p-2.5 rounded-xl border-2 transition-all flex flex-col justify-between relative ${
                isSelected
                  ? `${act.activeColor} shadow-[3px_3px_0_0_rgba(26,35,15,1)] -translate-y-0.5 ring-2 ring-lime-400`
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {act.badge}
                  </span>
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </div>
                <h4 className="text-xs font-black leading-tight line-clamp-1">
                  {act.shortName}
                </h4>
                <p className={`text-[10px] mt-1 leading-snug line-clamp-2 ${
                  isSelected ? 'text-white/90' : 'text-slate-500 font-medium'
                }`}>
                  {act.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Sub-activity Selector for Activity 2 (Knowledge Formation) or custom */}
      {selectedMode === 'act2' && (
        <div className="mt-3 p-3 bg-sky-50/80 border-2 border-sky-300 rounded-xl space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-600 animate-ping" />
              <label className="text-[11px] font-black uppercase text-sky-950">
                🎯 Chỉ định tiểu hoạt động con trong Hoạt động 2 (Bắt buộc nếu chỉ tích hợp 1 phần):
              </label>
            </div>
            {customActivityName && (
              <button
                type="button"
                onClick={() => onCustomActivityNameChange?.('')}
                className="text-[10px] text-sky-700 hover:text-red-600 font-bold underline"
              >
                Xóa chỉ định
              </button>
            )}
          </div>

          <p className="text-[10px] text-sky-900 leading-relaxed font-semibold">
            👉 <span className="font-black text-red-600">Quy tắc quan trọng:</span> Hoạt động Hình thành kiến thức mới thường gồm nhiều hoạt động con (2.1, 2.2, 2.3, 2.4...). Khi thầy/cô chọn hoặc nhập một hoạt động con nào, hệ thống <span className="font-black text-red-600 underline">CHỈ tích hợp NLS & NLAI vào đúng hoạt động đó</span>, tuyệt đối không tích hợp vào tất cả các hoạt động còn lại!
          </p>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] font-bold text-sky-800">Chọn nhanh:</span>
            {[
              { label: 'HĐ 2.1', value: 'Hoạt động 2.1' },
              { label: 'HĐ 2.2', value: 'Hoạt động 2.2' },
              { label: 'HĐ 2.3', value: 'Hoạt động 2.3' },
              { label: 'HĐ 2.4', value: 'Hoạt động 2.4' },
            ].map(preset => {
              const isActive = customActivityName?.trim().toLowerCase().startsWith(preset.value.toLowerCase());
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => onCustomActivityNameChange?.(preset.value)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all border ${
                    isActive
                      ? 'bg-sky-700 text-white border-sky-900 shadow-sm'
                      : 'bg-white text-sky-800 border-sky-200 hover:bg-sky-100'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Custom Sub-activity input */}
          <div className="relative">
            <input
              type="text"
              value={customActivityName || ''}
              onChange={(e) => onCustomActivityNameChange?.(e.target.value)}
              placeholder="VD: Hoạt động 2.1: Cấu tạo nguyên tử, phân tử sulfur (hoặc dán tên hoạt động con)..."
              className="w-full px-3 py-2 text-xs font-bold text-sky-950 bg-white border-2 border-sky-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-sky-400/80 shadow-inner"
            />
          </div>

          {customActivityName ? (
            <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-md border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
              <span>
                Đã chỉ định: <strong className="text-emerald-950">"{customActivityName}"</strong>. Chỉ hoạt động này được tích hợp NLS/AI; các hoạt động 2.2, 2.3... và HĐ 1, 3, 4 giữ nguyên bản 100%!
              </span>
            </div>
          ) : (
            <div className="text-[10px] text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200">
              💡 Thầy/cô có thể nhập tên hoạt động con ở trên HOẶC chỉ dán đúng nội dung hoạt động con đó vào ô văn bản giáo án. AI sẽ tự động khoanh vùng chuẩn xác.
            </div>
          )}
        </div>
      )}

      {/* Option: All activities (optional override) */}
      <div className="mt-2 pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            onSelectMode('all');
            onCustomActivityNameChange?.('');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 text-[11px] font-bold transition-all ${
            selectedMode === 'all'
              ? 'bg-[#1a230f] text-white border-[#1a230f] shadow-[2px_2px_0_0_rgba(101,163,13,1)]'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
          }`}
          title="Chỉ dùng khi người dùng muốn tích hợp cho toàn bộ 4 hoạt động"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Tích hợp cả bài (Toàn bộ 4 hoạt động - chỉ khi cần)</span>
        </button>

        <div className="flex items-center gap-1 text-[10px] text-slate-700 font-bold bg-amber-50 px-2 py-1 rounded border border-amber-300">
          <span>Đang chọn tích hợp: </span>
          <span className="font-black text-red-600 uppercase">
            {ACTIVITIES.find(a => a.id === selectedMode)?.name || 'Tùy chọn'}
            {selectedMode === 'act2' && customActivityName ? ` ➜ [${customActivityName}]` : ''}
          </span>
        </div>
      </div>
    </div>
  );
};
