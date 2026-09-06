import React, { useState, useMemo } from 'react';
import { Lightbulb, Download, Trash2, Sparkles, Box, Cpu, Copy, Check, FileText, Layout, ShieldCheck, Printer } from 'lucide-react';
import { LessonPlanResponse } from '../types';

interface OutputSectionProps {
  data: LessonPlanResponse | null;
  onClear: () => void;
}

// Clean markdown formatting marks
const cleanText = (text: string) => {
  return text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/__/g, '').replace(/^#+\s/g, '');
};

// Formatted Interactive Document Renderer
const FormattedDocumentViewer: React.FC<{ content: string; title: string; duration: string }> = ({ content, title, duration }) => {
  // Parse content into blocks: text paragraphs, headings, lists, tables
  const blocks = useMemo(() => {
    const rawLines = content.split('\n');
    const result: Array<{ type: 'heading1' | 'heading2' | 'activity' | 'subsection' | 'step' | 'table' | 'bullet' | 'text' | 'empty'; content?: string; rows?: string[][] }> = [];
    
    let currentTable: string[][] = [];

    const flushTable = () => {
      if (currentTable.length > 0) {
        // Filter out markdown separator row like |---|---|
        const validRows = currentTable.filter(row => !row.every(cell => /^[-\s:]+$/.test(cell)));
        if (validRows.length > 0) {
          result.push({ type: 'table', rows: validRows });
        }
        currentTable = [];
      }
    };

    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i].trim();

      if (line.startsWith('|')) {
        const cells = line.replace(/^\||\|$/g, '').split('|').map(c => c.trim());
        currentTable.push(cells);
      } else {
        flushTable();

        if (!line) {
          result.push({ type: 'empty' });
          continue;
        }

        const clean = cleanText(line);

        if (/^KẾ HOẠCH BÀI DẠY/i.test(clean) || /^BÀI\s+\d+/i.test(clean)) {
          result.push({ type: 'heading1', content: clean });
        } else if (/^[I|V|X]+\.\s+/i.test(clean)) {
          result.push({ type: 'heading2', content: clean });
        } else if (/^HOẠT ĐỘNG\s+\d+/i.test(clean)) {
          result.push({ type: 'activity', content: clean });
        } else if (/^[a-d]\.\s+/i.test(clean)) {
          result.push({ type: 'subsection', content: clean });
        } else if (/^-\s*Bước\s+\d+/i.test(clean) || /^Bước\s+\d+/i.test(clean)) {
          result.push({ type: 'step', content: clean });
        } else if (/^[•\-\*]\s+/.test(line) || /^\d+\.\s+/.test(clean)) {
          result.push({ type: 'bullet', content: clean });
        } else {
          result.push({ type: 'text', content: clean });
        }
      }
    }
    flushTable();
    return result;
  }, [content]);

  // Helper to highlight competency codes & AI keywords
  const renderHighlightedText = (text: string) => {
    const parts = text.split(/(\[Mã\s+[^\]]+\]|Mã\s+[\w\.\-]+|NLS|NL\s*AI|Google Sheets|Excel|Gemini|ChatGPT|Chatbot|AI)/gi);
    return parts.map((part, idx) => {
      if (/^(\[Mã\s+[^\]]+\]|Mã\s+[\w\.\-]+)/i.test(part)) {
        return (
          <span key={idx} className="inline-block px-2 py-0.5 mx-1 bg-lime-100 text-lime-900 border border-lime-500 rounded font-black text-xs">
            {part}
          </span>
        );
      }
      if (/^(NLS|NL\s*AI)/i.test(part)) {
        return (
          <span key={idx} className="inline-block px-1.5 py-0.5 mx-0.5 bg-amber-100 text-amber-900 border border-amber-400 rounded font-black text-xs">
            {part}
          </span>
        );
      }
      if (/^(Google Sheets|Excel|Gemini|ChatGPT|Chatbot)/i.test(part)) {
        return (
          <span key={idx} className="inline-block px-1.5 py-0.5 mx-0.5 bg-sky-100 text-sky-900 border border-sky-400 rounded font-bold text-xs">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-2xl border-2 border-[#1a230f] shadow-lg text-slate-900 font-sans leading-relaxed space-y-4 max-w-4xl mx-auto">
      {blocks.map((block, index) => {
        if (block.type === 'heading1') {
          return (
            <div key={index} className="text-center my-6 border-b-2 border-slate-200 pb-4">
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                {block.content}
              </h1>
              {duration && (
                <p className="text-sm font-bold text-slate-600 italic mt-1">
                  Thời lượng: {duration}
                </p>
              )}
            </div>
          );
        }

        if (block.type === 'heading2') {
          return (
            <div key={index} className="mt-8 mb-3 pt-3 border-t border-slate-200">
              <h2 className="text-lg font-black text-slate-900 uppercase flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border-l-4 border-lime-600">
                {block.content}
              </h2>
            </div>
          );
        }

        if (block.type === 'activity') {
          return (
            <div key={index} className="mt-6 mb-3 p-3 bg-lime-50/80 border border-lime-400 rounded-xl">
              <h3 className="text-base font-black text-lime-950 uppercase">
                {block.content}
              </h3>
            </div>
          );
        }

        if (block.type === 'subsection') {
          return (
            <div key={index} className="mt-4 mb-1 pl-1">
              <h4 className="font-bold text-slate-900 text-sm text-lime-900">
                {renderHighlightedText(block.content || '')}
              </h4>
            </div>
          );
        }

        if (block.type === 'step') {
          return (
            <div key={index} className="pl-4 py-1.5 my-1 bg-slate-50/70 border-l-2 border-slate-400 rounded-r text-sm">
              <span className="font-bold text-slate-800">
                {renderHighlightedText(block.content || '')}
              </span>
            </div>
          );
        }

        if (block.type === 'bullet') {
          return (
            <div key={index} className="pl-6 text-sm text-slate-800 relative before:content-['•'] before:absolute before:left-2 before:text-lime-700 before:font-bold">
              {renderHighlightedText(block.content || '')}
            </div>
          );
        }

        if (block.type === 'table' && block.rows && block.rows.length > 0) {
          const headerRow = block.rows[0];
          const dataRows = block.rows.slice(1);

          return (
            <div key={index} className="my-6 overflow-x-auto rounded-xl border border-slate-400 shadow-sm">
              <table className="w-full text-xs text-left border-collapse bg-white">
                <thead>
                  <tr className="bg-slate-200/80 border-b border-slate-400">
                    {headerRow.map((cell, cIdx) => (
                      <th key={cIdx} className="p-3 font-black text-slate-900 border-r last:border-r-0 border-slate-300 text-center">
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataRows.map((row, rIdx) => (
                    <tr key={rIdx} className={`border-b border-slate-300 ${rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-lime-50/50 transition-colors`}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className={`p-3 border-r last:border-r-0 border-slate-300 align-top ${cIdx === 0 || cIdx === 2 ? 'text-center' : 'text-left'}`}>
                          {cell.split('\n').map((line, lIdx) => (
                            <div key={lIdx} className="my-0.5 leading-snug">
                              {renderHighlightedText(line)}
                            </div>
                          ))}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === 'empty') {
          return <div key={index} className="h-2" />;
        }

        return (
          <p key={index} className="text-sm text-slate-800 leading-relaxed pl-2">
            {renderHighlightedText(block.content || '')}
          </p>
        );
      })}
    </div>
  );
};

export const OutputSection: React.FC<OutputSectionProps> = ({ data, onClear }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<'visual' | 'raw'>('visual');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!data?.fullPlanContent) return;
    try {
      await navigator.clipboard.writeText(data.fullPlanContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const getColWidth = (numCols: number, colIndex: number): number => {
    if (numCols <= 1) return 100;
    if (numCols === 2) return 50;
    if (numCols === 3) return colIndex === 0 ? 20 : 40;
    if (numCols === 4) return colIndex === 0 ? 10 : 30;
    if (numCols === 5) {
      const widths = [16, 12, 26, 26, 20];
      return widths[colIndex] ?? Math.floor(100 / numCols);
    }
    if (numCols === 6) {
      // Standard overview table: STT | Hoạt động | Thời lượng | Phương pháp | Sản phẩm | Mã hoá NLS/AI
      const widths = [6, 24, 10, 20, 20, 20];
      return widths[colIndex] ?? Math.floor(100 / numCols);
    }
    return Math.floor(100 / numCols);
  };

  const handleDownload = async (orientation: 'portrait' | 'landscape') => {
    if (!data || !data.fullPlanContent) return;
    setIsGenerating(true);
    try {
      const { 
        Document, Packer, Paragraph, Table, TableRow, TableCell, 
        WidthType, BorderStyle, PageOrientation, AlignmentType, TextRun, VerticalAlign 
      } = await import('docx');
      const fileSaver = await import('file-saver');
      const saveAs = fileSaver.saveAs || fileSaver.default.saveAs;
      
      const lines = data.fullPlanContent.split('\n');
      const docChildren: any[] = [
        new Paragraph({
          children: [
            new TextRun({
              text: "TẠO BỞI HỆ THỐNG CỦA THẦY HỒ CANG - GV HOÁ - THPT CHU VĂN AN",
              bold: true,
              color: "B91C1C",
              size: 24,
              font: "Times New Roman"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: (data.lessonTitle || "KẾ HOẠCH BÀI DẠY").toUpperCase(),
              bold: true,
              size: 30,
              font: "Times New Roman"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Thời gian thực hiện: ${data.lessonDuration || "Theo kế hoạch"}`,
              bold: true,
              italics: true,
              size: 24,
              font: "Times New Roman"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `BẢO TOÀN 100% BỐ CỤC FILE GỐC (DẠNG CỘT / DẠNG VĂN BẢN)`,
              bold: true,
              size: 20,
              font: "Times New Roman",
              color: "15803D"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 360 }
        })
      ];

      let currentTableRows: string[][] = [];

      const processTable = () => {
        if (currentTableRows.length === 0) return;
        const cleanRows = currentTableRows.filter(row => !row.every(cell => /^[-\s:]+$/.test(cell)));
        if (cleanRows.length > 0) {
          const numCols = cleanRows[0]?.length || 1;
          const table = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: cleanRows.map((rowCells, rowIndex) => 
              new TableRow({
                children: rowCells.map((cellText, colIndex) => {
                  const widthPercent = getColWidth(numCols, colIndex);
                  return new TableCell({
                    width: { size: widthPercent, type: WidthType.PERCENTAGE },
                    margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    children: cellText.split('\n').map(pText => 
                      new Paragraph({ 
                        children: [new TextRun({ 
                          text: cleanText(pText), 
                          bold: rowIndex === 0,
                          size: 20,
                          font: "Times New Roman"
                        })],
                        alignment: (colIndex === 0 && numCols > 3) ? AlignmentType.CENTER : AlignmentType.LEFT,
                        spacing: { before: 30, after: 30 }
                      })
                    ),
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                      bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                      left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                      right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    },
                    verticalAlign: VerticalAlign.CENTER,
                    shading: rowIndex === 0 ? { fill: "EAEAEA", type: "clear", color: "auto" } : undefined
                  });
                })
              })
            )
          });
          docChildren.push(table);
          docChildren.push(new Paragraph({ text: "", spacing: { after: 120 } })); 
        }
        currentTableRows = [];
      };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('|')) {
          const rowContent = line.replace(/^\||\|$/g, '');
          currentTableRows.push(rowContent.split('|').map(c => c.trim()));
        } else {
          if (currentTableRows.length > 0) processTable();
          if (line.length > 0) {
            const cleanLine = cleanText(line);
            const isActivityTitle = /^HOẠT ĐỘNG/i.test(cleanLine);
            const isMajorHeading = /^[I|V|X]+\.\s+/i.test(cleanLine);
            const isSubSection = /^[a-d]\.\s+/i.test(cleanLine);
            const isStep = /^-\s*Bước\s+\d+/i.test(cleanLine);
            const isListItem = /^[•\-\*]\s+/.test(line) || /^\d+\.\s+/.test(cleanLine);
            
            docChildren.push(new Paragraph({ 
              children: [new TextRun({ 
                text: cleanLine, 
                bold: isActivityTitle || isMajorHeading || isSubSection || isStep, 
                size: isMajorHeading ? 26 : isActivityTitle ? 24 : isSubSection ? 22 : 22,
                font: "Times New Roman"
              })],
              alignment: AlignmentType.LEFT,
              spacing: { 
                before: isMajorHeading ? 240 : isActivityTitle ? 200 : isSubSection ? 100 : 40, 
                after: 40 
              },
              indent: isStep ? { left: 240 } : isListItem ? { left: 360 } : undefined
            }));
          }
        }
      }
      if (currentTableRows.length > 0) processTable();

      const doc = new Document({
        sections: [{
          properties: { 
            page: { 
              size: { 
                orientation: orientation === 'portrait' ? PageOrientation.PORTRAIT : PageOrientation.LANDSCAPE 
              } 
            } 
          },
          children: docChildren
        }]
      });

      const blob = await Packer.toBlob(doc);
      const fileName = orientation === 'portrait' 
        ? "KHBD_TichHop_NLS_KhoDoc_A4.docx" 
        : "KHBD_TichHop_NLS_KhoNgang.docx";
      saveAs(blob, fileName);
    } catch (error) {
      console.error(error);
      alert("Lỗi xuất file Word. Vui lòng thử lại.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 relative overflow-hidden group">
        <div className="absolute top-10 left-10 w-20 h-20 bg-lime-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        
        <div className="relative z-10 w-full max-w-sm transform perspective-1000 rotate-x-2 rotate-y-2 hover:rotate-0 transition-transform duration-700">
          <div className="bg-white border-4 border-[#1a230f] rounded-[2.5rem] p-10 shadow-[15px_15px_0_0_rgba(26,35,15,1)] flex flex-col items-center text-center space-y-6 relative overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-lime-200 rounded-full blur-xl scale-150 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-[#1a230f] rounded-3xl flex items-center justify-center shadow-[6px_6px_0_0_rgba(101,163,13,1)]">
                <Cpu className="w-10 h-10 text-lime-200 animate-pulse" />
              </div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center border-2 border-[#1a230f] shadow animate-bounce">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-black text-[#1a230f] uppercase tracking-tighter leading-tight">
                Chờ tích hợp <br/> 
                <span className="text-lime-700">Năng Lực Số & AI</span>
              </h3>
              <div className="h-1 w-16 bg-lime-200 mx-auto rounded-full"></div>
              <p className="text-xs font-bold text-slate-500 leading-relaxed italic">
                Tải tệp KHBD (PDF/Word/Ảnh) hoặc dán nội dung để hệ thống tích hợp chuẩn xác.
              </p>
            </div>

            <div className="bg-lime-50 border border-lime-300 rounded-xl p-3 text-left w-full text-[11px] font-bold text-lime-900 space-y-1">
              <div className="flex items-center gap-1 text-lime-800 font-black">
                <ShieldCheck className="w-4 h-4 text-lime-600 flex-shrink-0" />
                CAM KẾT BẢO TOÀN 100%:
              </div>
              <div>• Dạng cột/bảng: Giữ nguyên số cột & định dạng.</div>
              <div>• Dạng văn bản: Giữ nguyên các bước & cấu trúc gốc.</div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-[11px] font-black uppercase tracking-[0.2em] text-white/70 flex items-center gap-2">
          <Box className="w-3.5 h-3.5" />
          Bảo toàn cấu trúc & bố cục bản gốc
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#fdfdf7] rounded-3xl border-4 border-[#1a230f] shadow-[12px_12px_0_0_rgba(26,35,15,1)] overflow-hidden">
      {/* Top action header */}
      <div className="p-4 border-b-4 border-[#1a230f] bg-lime-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="font-black text-[#1a230f] text-base uppercase flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-lime-700" />
            <span>KHBD ĐÃ TÍCH HỢP NLS & AI</span>
          </h2>
          {/* View switcher tabs */}
          <div className="flex bg-white/80 p-1 rounded-xl border border-[#1a230f] shadow-sm">
            <button
              onClick={() => setViewMode('visual')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black transition-all ${
                viewMode === 'visual' ? 'bg-lime-700 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              Bản in trực quan
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black transition-all ${
                viewMode === 'raw' ? 'bg-lime-700 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Văn bản thô
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 bg-white hover:bg-lime-50 text-slate-800 text-[11px] font-black uppercase px-3 py-2 rounded-xl border-2 border-[#1a230f] shadow-[2px_2px_0_0_rgba(26,35,15,1)] active:translate-y-0.5 transition-all"
            title="Sao chép toàn bộ nội dung"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Đã sao chép!" : "Sao chép"}</span>
          </button>

          <button
            onClick={() => handleDownload('portrait')}
            disabled={isGenerating}
            className="flex items-center gap-1.5 bg-lime-700 hover:bg-lime-800 text-white text-[11px] font-black uppercase px-3 py-2 rounded-xl border-2 border-[#1a230f] shadow-[3px_3px_0_0_rgba(26,35,15,1)] active:translate-y-0.5 transition-all disabled:opacity-50"
            title="Tải tệp Word khổ dọc tiêu chuẩn Bộ GD&ĐT"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải Word A4 (Khổ dọc)</span>
          </button>

          <button
            onClick={() => handleDownload('landscape')}
            disabled={isGenerating}
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-black uppercase px-3 py-2 rounded-xl border-2 border-[#1a230f] shadow-[3px_3px_0_0_rgba(26,35,15,1)] active:translate-y-0.5 transition-all disabled:opacity-50"
            title="Tải tệp Word khổ ngang cho bảng biểu nhiều cột"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải Word (Khổ ngang)</span>
          </button>

          <button 
            onClick={onClear} 
            className="p-2 bg-white text-red-500 hover:bg-red-50 border-2 border-[#1a230f] rounded-xl shadow-[2px_2px_0_0_rgba(26,35,15,1)] active:translate-y-0.5 transition-all"
            title="Xóa kết quả"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main output display */}
      <div className="flex-1 overflow-y-auto p-6 bg-lime-50/20 scrollbar-thin scrollbar-thumb-lime-400 space-y-6">
        {/* Overview banner */}
        <div className="p-4 bg-lime-50 rounded-2xl border-2 border-[#1a230f] shadow-[3px_3px_0_0_rgba(26,35,15,1)] flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-lime-950 font-bold leading-relaxed">
            <span className="uppercase text-lime-800 font-black mr-2">Điểm sáng số hóa & AI:</span>
            {data.overview}
          </div>
        </div>

        {viewMode === 'visual' ? (
          <FormattedDocumentViewer 
            content={data.fullPlanContent} 
            title={data.lessonTitle} 
            duration={data.lessonDuration} 
          />
        ) : (
          <div className="bg-white p-6 rounded-2xl border-2 border-[#1a230f] shadow-md">
            <pre className="whitespace-pre-wrap font-mono text-xs text-slate-800 leading-relaxed overflow-x-auto">
              {data.fullPlanContent}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
