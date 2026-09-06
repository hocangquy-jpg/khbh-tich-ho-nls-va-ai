
import React, { useRef, useState } from 'react';
import { BookOpen, Sparkles, Image as ImageIcon, FileText, FileUp, Target, Trash2, X, Paperclip, Clock, ShieldCheck } from 'lucide-react';
import { ProcessingStatus, MediaInput } from '../types';
import { DEFAULT_LESSON_PLAN } from '../constants';
import { CompetencySelector } from './CompetencySelector';
import { AICompetencySelector } from './AICompetencySelector';

interface InputSectionProps {
  value: string;
  onChange: (val: string) => void;
  mediaInputs: MediaInput[];
  onMediaChange: (media: MediaInput[]) => void;
  sessionDetails: string;
  onSessionDetailsChange: (val: string) => void;
  onAnalyze: () => void;
  status: ProcessingStatus;
  selectedCompetencyIds: string[];
  onCompetencyChange: (ids: string[]) => void;
  selectedAICompetencyIds: string[];
  onAICompetencyChange: (ids: string[]) => void;
  focusArea: string;
  onFocusAreaChange: (val: string) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({ 
  value, 
  onChange, 
  mediaInputs,
  onMediaChange,
  sessionDetails,
  onSessionDetailsChange,
  onAnalyze, 
  status,
  selectedCompetencyIds,
  onCompetencyChange,
  selectedAICompetencyIds,
  onAICompetencyChange,
  focusArea,
  onFocusAreaChange
}) => {
  const isLoading = status === ProcessingStatus.ANALYZING;
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const [isReadingFile, setIsReadingFile] = useState(false);

  const processFiles = async (files: FileList) => {
    setIsReadingFile(true);
    const isReplacingDefault = value === DEFAULT_LESSON_PLAN || value.trim() === '';
    let newTextContent = isReplacingDefault ? '' : value;
    const newMediaItems: MediaInput[] = [];
    
    try {
      const filePromises = Array.from(files).map(async (file: File) => {
        const lowerName = file.name.toLowerCase();
        const isDocx = lowerName.endsWith('.docx');
        const isTxt = lowerName.endsWith('.txt');
        const isPdf = lowerName.endsWith('.pdf');

        if (isDocx || isTxt) {
          if (isDocx) {
            const mammoth = await import('mammoth');
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            
            // Pre-process HTML to prevent nested tables inside table cells from breaking the outer table markdown layout
            let processedHtml = result.value;
            if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
              try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(processedHtml, 'text/html');
                
                // Find all nested tables inside td or th
                const nestedTables = doc.querySelectorAll('td table, th table');
                nestedTables.forEach(nestedTable => {
                  const rows = Array.from(nestedTable.querySelectorAll('tr'));
                  const lines: string[] = [];
                  rows.forEach(tr => {
                    const cells = Array.from(tr.querySelectorAll('th, td')).map(c => c.textContent?.trim() || '');
                    if (cells.length > 0 && cells.some(Boolean)) {
                      lines.push(cells.join('  •  '));
                    }
                  });
                  const replacement = doc.createElement('div');
                  replacement.innerHTML = '<br><strong>[Bảng số liệu con:]</strong><br>' + lines.map(l => `• ${l}`).join('<br>') + '<br>';
                  nestedTable.parentNode?.replaceChild(replacement, nestedTable);
                });
                
                processedHtml = doc.body.innerHTML;
              } catch (e) {
                console.error("Error preprocessing HTML nested tables:", e);
              }
            }

            const TurndownService = (await import('turndown')).default;
            const { gfm } = await import('turndown-plugin-gfm');
            const turndownService = new TurndownService({
              headingStyle: 'atx',
              bulletListMarker: '-',
            });
            turndownService.use(gfm);
            const markdown = turndownService.turndown(processedHtml);
            return { 
              type: 'text', 
              content: isReplacingDefault && files.length === 1 ? markdown : `\n\n--- [Nội dung file: ${file.name}] ---\n${markdown}` 
            };
          } else {
            const text = await file.text();
            return { 
              type: 'text', 
              content: isReplacingDefault && files.length === 1 ? text : `\n\n--- [Nội dung file: ${file.name}] ---\n${text}` 
            };
          }
        } else {
          return new Promise<{ type: 'media', data: MediaInput }>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64String = reader.result as string;
              const base64Data = base64String.split(',')[1];
              let mime = file.type;
              if (!mime) {
                if (isPdf) mime = 'application/pdf';
                else if (lowerName.endsWith('.png')) mime = 'image/png';
                else mime = 'image/jpeg';
              }
              resolve({
                type: 'media', 
                data: { name: file.name, mimeType: mime, data: base64Data }
              });
            };
            reader.readAsDataURL(file);
          });
        }
      });

      const results = await Promise.all(filePromises);
      (results as any[]).forEach(res => {
        if (res.type === 'text') {
          newTextContent = newTextContent ? `${newTextContent}\n\n${res.content}` : res.content;
        } else if (res.type === 'media') {
          newMediaItems.push(res.data);
        }
      });

      // If only media (PDF/images) uploaded and previous text was default lesson plan, clear text or leave minimal note
      if (newMediaItems.length > 0 && isReplacingDefault && !newTextContent) {
        newTextContent = `[Đã tải lên tệp: ${newMediaItems.map(m => m.name).join(', ')}]\n\nHệ thống sẽ đọc trực tiếp từ tệp gốc này để bảo toàn 100% hình dạng & bố cục (dạng cột / dạng văn bản). Bạn có thể ghi chú thêm bên dưới nếu cần:`;
      }

      onChange(newTextContent);
      onMediaChange([...mediaInputs, ...newMediaItems]);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi đọc file. Vui lòng thử lại với định dạng khác.");
    } finally {
      setIsReadingFile(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
      if (docInputRef.current) docInputRef.current.value = '';
    }
  };

  const hasContent = value.length > 0 || mediaInputs.length > 0;

  return (
    <div className="flex flex-col h-full bg-[#f7f8f0] rounded-3xl border-4 border-[#1a230f] shadow-[12px_12px_0_0_rgba(26,35,15,1)] overflow-hidden transition-all">
      <div className="p-5 border-b-4 border-[#1a230f] bg-lime-200">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-[#1a230f] rounded-lg shadow-[2px_2px_0_0_rgba(101,163,13,1)]">
                    <BookOpen className="w-5 h-5 text-lime-200" />
                </div>
                <h2 className="font-black text-[#1a230f] text-xl uppercase tracking-tight">Cổng nhập liệu</h2>
            </div>
            {hasContent && (
                <button 
                  onClick={() => { onChange(''); onMediaChange([]); }} 
                  className="w-10 h-10 bg-white hover:bg-lime-50 text-lime-800 border-2 border-[#1a230f] rounded-xl shadow-[3px_3px_0_0_rgba(26,35,15,1)] active:translate-y-0.5 transition-all"
                >
                    <Trash2 className="w-5 h-5 mx-auto" />
                </button>
            )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input type="file" ref={imageInputRef} onChange={(e) => e.target.files && processFiles(e.target.files)} accept="image/*" className="hidden" multiple />
          <input type="file" ref={docInputRef} onChange={(e) => e.target.files && processFiles(e.target.files)} accept=".pdf,.docx,.txt" className="hidden" multiple />
          
          <button 
            onClick={() => imageInputRef.current?.click()}
            disabled={isLoading || isReadingFile}
            className="flex items-center justify-center gap-2 bg-lime-600 hover:bg-lime-700 text-white border-2 border-[#1a230f] py-3 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-[4px_4px_0_0_rgba(26,35,15,1)] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50"
          >
            <ImageIcon className="w-4 h-4" />
            TẢI ẢNH KHBH
          </button>

          <button 
            onClick={() => docInputRef.current?.click()}
            disabled={isLoading || isReadingFile}
            className="flex items-center justify-center gap-2 bg-stone-600 hover:bg-stone-700 text-white border-2 border-[#1a230f] py-3 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-[4px_4px_0_0_rgba(26,35,15,1)] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            Tải PDF/Word gốc
          </button>
        </div>

        {/* Layout preservation badge */}
        <div className="mt-3 bg-white/80 border-2 border-[#1a230f] rounded-xl px-3 py-2 flex items-center gap-2 shadow-[2px_2px_0_0_rgba(26,35,15,1)]">
          <ShieldCheck className="w-4 h-4 text-lime-700 flex-shrink-0" />
          <span className="text-[10px] font-black text-lime-950 uppercase tracking-tight">
            Cam kết: Giữ nguyên 100% hình dạng & bố cục file gốc (dạng cột / dạng văn bản)
          </span>
        </div>
      </div>
      
      {mediaInputs.length > 0 && (
        <div className="px-5 py-3 flex flex-wrap gap-2 border-b-2 border-dashed border-lime-200 bg-lime-50">
          {mediaInputs.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-white border-2 border-[#1a230f] rounded-lg px-3 py-1 shadow-[2px_2px_0_0_rgba(26,35,15,1)]">
               <Paperclip className="w-3 h-3 text-lime-600" />
               <span className="text-[10px] font-bold text-[#1a230f] truncate max-w-[120px]">{item.name}</span>
               <button onClick={() => onMediaChange(mediaInputs.filter((_, i) => i !== idx))} className="hover:text-red-500 transition-colors">
                 <X className="w-3 h-3" />
               </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex-1 p-5 bg-white relative">
        <textarea
            className="w-full h-full p-5 text-lg text-lime-800 leading-relaxed bg-[#fdfdf7] border-4 border-[#1a230f] rounded-2xl focus:outline-none focus:ring-4 focus:ring-lime-200 resize-none transition-all placeholder:text-lime-300 font-bold"
            placeholder="Nội dung văn bản bổ sung (nếu có)..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isLoading || isReadingFile}
        />
        {!hasContent && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none opacity-30">
            <FileUp className="w-12 h-12 text-lime-600 mx-auto mb-2" />
            <p className="font-black uppercase text-xs text-lime-800">Vui lòng tải tệp nguồn</p>
          </div>
        )}
      </div>

      <div className="px-5 py-4 space-y-4 bg-lime-50/50 border-t-2 border-[#1a230f]">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <div className="flex items-center gap-1.5 ml-1">
                    <Clock className="w-3 h-3 text-lime-700" />
                    <h3 className="text-[9px] font-black text-lime-900 uppercase">Tiết học</h3>
                </div>
                <textarea
                    className="w-full h-14 p-2 text-sm text-lime-800 font-bold bg-white border-2 border-[#1a230f] rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 resize-none shadow-[2px_2px_0_0_rgba(26,35,15,1)]"
                    placeholder="VD: Tiết 1, 2, 3..."
                    value={sessionDetails}
                    onChange={(e) => onSessionDetailsChange(e.target.value)}
                    disabled={isLoading}
                />
            </div>
            <div className="space-y-1">
                <div className="flex items-center gap-1.5 ml-1">
                    <Target className="w-3 h-3 text-lime-700" />
                    <h3 className="text-[9px] font-black text-lime-900 uppercase">Yêu cầu thêm</h3>
                </div>
                <textarea
                    className="w-full h-14 p-2 text-sm text-lime-800 font-bold bg-white border-2 border-[#1a230f] rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 resize-none shadow-[2px_2px_0_0_rgba(26,35,15,1)]"
                    placeholder="VD: Ưu tiên AI..."
                    value={focusArea}
                    onChange={(e) => onFocusAreaChange(e.target.value)}
                    disabled={isLoading}
                />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <CompetencySelector selectedIds={selectedCompetencyIds} onChange={onCompetencyChange} />
        <AICompetencySelector selectedIds={selectedAICompetencyIds} onChange={onAICompetencyChange} />
      </div>

      <div className="p-5 bg-white border-t-4 border-[#1a230f]">
        <button
          onClick={onAnalyze}
          disabled={isLoading || isReadingFile || !hasContent || (selectedCompetencyIds.length === 0 && selectedAICompetencyIds.length === 0)}
          className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all transform border-2 border-[#1a230f]
            ${isLoading || isReadingFile || !hasContent || (selectedCompetencyIds.length === 0 && selectedAICompetencyIds.length === 0)
              ? 'bg-slate-300 cursor-not-allowed grayscale' 
              : 'bg-lime-800 hover:bg-lime-900 shadow-[6px_6px_0_0_rgba(26,35,15,1)] active:translate-y-1 active:shadow-none'
            }`}
        >
          {isLoading ? (
            <><span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /><span>Đang tích hợp...</span></>
          ) : (
            <><Sparkles className="w-6 h-6" /><span>Tích hợp Năng lực số ngay</span></>
          )}
        </button>
      </div>
    </div>
  );
};
