import React, { useState, useMemo } from 'react';
import { 
  Lightbulb, Download, Trash2, Sparkles, Box, Cpu, Copy, Check, 
  FileText, Layout, ShieldCheck, Columns3, CheckCircle2, Info
} from 'lucide-react';
import { LessonPlanResponse } from '../types';

interface OutputSectionProps {
  data: LessonPlanResponse | null;
  onClear: () => void;
}

// Clean markdown formatting marks
const cleanText = (text: string) => {
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/__/g, '')
    .replace(/^#+\s/g, '');
};

// Cleanly format chemistry isotopes, formulas, subscripts, superscripts and reaction arrows
export const formatChemistryAndMath = (text: string): string => {
  const supMap: Record<string, string> = { "0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","+":"⁺","-":"⁻","n":"ⁿ","m":"ᵐ" };
  const subMap: Record<string, string> = { "0":"₀","1":"₁","2":"₂","3":"₃","4":"₄","5":"₅","6":"₆","7":"₇","8":"₈","9":"₉","+":"₊","-":"₋" };

  const toSup = (s: string) => s.split('').map(c => supMap[c] || c).join('');
  const toSub = (s: string) => s.split('').map(c => subMap[c] || c).join('');

  return text
    .replace(/\\rightarrow|->/g, '→')
    .replace(/\\rightleftharpoons|<=>/g, '⇌')
    .replace(/\\cdot/g, '·')
    .replace(/\\times/g, '×')
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\ne/g, '≠')
    // ^{...} and _{...}
    .replace(/\^\{([^}]+)\}/g, (_, sup) => toSup(sup))
    .replace(/_\{([^}]+)\}/g, (_, sub) => toSub(sub))
    // ^2 or ^+ or _2 or _3
    .replace(/\^([0-9+-n]+)/g, (_, sup) => toSup(sup))
    .replace(/_([0-9+-]+)/g, (_, sub) => toSub(sub))
    .replace(/\$/g, '');
};

// Sanitize and normalize table rows to strictly guarantee that all rows have exactly the same number of columns as the header
export const sanitizeAndNormalizeTable = (rawRows: string[][]): string[][] => {
  // 1. Remove pure markdown separator rows (e.g. |---|---| or |:-:|:-:|)
  const isSeparator = (r: string[]) => r.every(cell => /^[-\s:|]+$/.test(cell.trim()));
  const validRows = rawRows.filter(r => r.length > 0 && !isSeparator(r));
  if (validRows.length === 0) return [];

  // 2. Identify header row and determine expected columns count
  const headerRow = validRows[0].map(c => c.trim());
  const expectedCols = headerRow.length;

  const result: string[][] = [headerRow];

  for (let i = 1; i < validRows.length; i++) {
    let row = validRows[i].map(c => c.trim());

    // Strip trailing empty cells or markdown alignment symbols (':-', '---', ':-:')
    while (row.length > expectedCols && /^[-\s:|]+$/.test(row[row.length - 1])) {
      row.pop();
    }

    if (row.length === expectedCols) {
      result.push(row);
    } else if (row.length > expectedCols) {
      // Row has more cells than header (e.g. 9 cells in a 2-column table because of unescaped subtable or isotope pipes)
      const prefix = row.slice(0, expectedCols - 1);
      const overflowCells = row.slice(expectedCols - 1).filter(c => !/^[-\s:|]+$/.test(c));

      let mergedLastCol = "";
      if (overflowCells.length > 0) {
        const first = overflowCells[0];
        const rest = overflowCells.slice(1);
        if (rest.length > 0) {
          mergedLastCol = (first ? first + "<br>" : "") + "• " + rest.join(" &nbsp;|&nbsp; ");
        } else {
          mergedLastCol = first;
        }
      }
      result.push([...prefix, mergedLastCol]);
    } else {
      // Row has fewer cells than header -> pad with empty strings
      while (row.length < expectedCols) {
        row.push("");
      }
      result.push(row);
    }
  }

  return result;
};

// Calculate scientific column width percentage based on column content/header
const calculateColumnWidths = (headerCells: string[]): number[] => {
  const numCols = headerCells.length;
  if (numCols <= 1) return [100];
  // Với bảng 2 cột KHBH chuẩn Công văn 5512: Cột Hoạt động của GV & HS luôn nhiều nội dung hơn, chiếm 58%, cột Sản phẩm chiếm 42%
  if (numCols === 2) return [58, 42];

  const weights = headerCells.map(cell => {
    const text = cleanText(cell).toLowerCase().trim();
    if (/^(stt|tt|#|số tt)$/i.test(text)) return 7;
    if (/(thời lượng|thời gian|định lượng|số phút|thời gian \(phút\))/i.test(text)) return 10;
    if (/(mã hoá|mã số|nls|nl ai|tích hợp nls|nla|năng lực số|mã hoá nls \/ nl ai tích hợp)/i.test(text)) return 18;
    if (/(phương pháp|kĩ thuật|hình thức|kĩ thuật dạy học)/i.test(text)) return 18;
    if (/(sản phẩm|sản phẩm học tập|sản phẩm dự kiến)/i.test(text)) return 24;
    if (/(hoạt động của gv|giáo viên|gv)/i.test(text)) return 28;
    if (/(hoạt động của hs|học sinh|hs)/i.test(text)) return 28;
    if (/(hoạt động dạy học|hoạt động|nhiệm vụ)/i.test(text)) return 24;
    if (/(nội dung)/i.test(text)) return 18;
    if (/(mục tiêu)/i.test(text)) return 18;
    return 20;
  });

  const total = weights.reduce((acc, w) => acc + w, 0);
  const percentages = weights.map(w => Math.max(6, Math.round((w / total) * 100)));
  const sumPercent = percentages.reduce((acc, p) => acc + p, 0);
  if (sumPercent !== 100 && percentages.length > 0) {
    percentages[percentages.length - 1] += (100 - sumPercent);
  }
  return percentages;
};

// Intelligently normalize heading hierarchy and guarantee clean line breaks between headings, subsections and steps
export const normalizeHeadingsHierarchy = (text: string): string => {
  if (!text) return "";
  const lines = text.split('\n');
  const result: string[] = [];

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    // Do not split inside markdown table rows
    if (trimmed.startsWith('|')) {
      result.push(rawLine);
      continue;
    }

    let line = rawLine;

    // 1. Break before Major Headings: I. II. III. IV. V. VI. VII. VIII. IX. X.
    line = line.replace(/([^\n])\s+((?:I|II|III|IV|V|VI|VII|VIII|IX|X)\.\s+[A-ZÀ-ỸĐ])/g, "$1\n\n$2");

    // 2. Break before numeric sections: "1. Về kiến thức", "2. Về năng lực", "1. Giáo viên:", "2. Học sinh:"
    line = line.replace(/((?:I|II|III|IV|V|VI|VII|VIII|IX|X)\.[^\n\d]+?)\s+(\d+\.\s+[A-ZÀ-ỸĐ])/g, "$1\n$2");
    line = line.replace(/([.:;!?])\s+(\d+\.\s+[A-ZÀ-ỸĐ])/g, "$1\n$2");

    // 3. Break before Hoạt động 1, Hoạt động 2...
    line = line.replace(/((?:I|II|III|IV|V|VI|VII|VIII|IX|X)\.[^\n]+?)\s+(Hoạt động\s+\d+[:.])/gi, "$1\n\n$2");
    line = line.replace(/([.:;!?])\s+(Hoạt động\s+\d+[:.])/gi, "$1\n\n$2");
    line = line.replace(/([^\n])\s+(HOẠT ĐỘNG\s+\d+[:.])/g, "$1\n\n$2");

    // 4. Break before alpha subsections: a) Mục tiêu, b) Nội dung, c) Sản phẩm, d) Tổ chức thực hiện, a) Năng lực chung...
    line = line.replace(/(\d+\.[^\n]+?:)\s+([a-e][\)\.]\s+[A-ZÀ-ỸĐ])/g, "$1\n$2");
    line = line.replace(/(Hoạt động\s+\d+[:.][^\n]+?)\s+([a-e][\)\.]\s+[A-ZÀ-ỸĐ])/gi, "$1\n$2");
    line = line.replace(/([.:;!?])\s+([a-e][\)\.]\s+[A-ZÀ-ỸĐ])/g, "$1\n$2");

    // 5. Break before Steps: Bước 1, Bước 2, Bước 3, Bước 4
    line = line.replace(/([.:;!?])\s+(-?\s*Bước\s+\d+:?)/gi, "$1\n$2");
    line = line.replace(/([a-e][\)\.][^\n]+?:)\s+(-?\s*Bước\s+\d+:?)/gi, "$1\n$2");

    // 6. Break before GV / HS activity labels if merged on same line
    line = line.replace(/([.:;!?])\s+([•\-\+]?\s*(?:GV|HS|Giáo viên|Học sinh)\s*[:\-])/gi, "$1\n$2");

    // 7. Break before bullets (+ or - or •) when following punctuation
    line = line.replace(/([;.:])\s+([•\-\+]\s+[A-ZÀ-ỸĐa-z0-9])/g, "$1\n$2");

    // Helper: Normalize excessive ALL-CAPS text (giữ nguyên câu hoa đầu chuẩn tiếng Việt, không hét ALL-CAPS, không phá hỏng công thức hóa học)
    const fixLineCasing = (txt: string): string => {
      const trimmed = txt.trim();
      if (!trimmed || trimmed.startsWith('|')) return txt;

      // Do NOT touch official administrative titles and major section headings
      if (/^(?:I|II|III|IV|V|VI|VII|VIII|IX|X)\.\s+/i.test(trimmed)) return txt;
      if (/^KẾ HOẠCH BÀI DẠY|^GIÁO ÁN|^BÀI\s+\d+|^CỘNG HÒA XÃ HỘI|^ĐỘC LẬP - TỰ DO|^TRƯỜNG THPT|^SỞ GD&ĐT|^PHÒNG GD&ĐT|^TỔ CHUYÊN MÔN/i.test(trimmed)) {
        return txt;
      }

      // Check if line contains chemical formulas or math expressions (e.g. H2SO4, Al3+, ->, pH)
      const hasChemistryOrMath = /[A-Z][a-z]?\d+|\^|_|→|⇌|≤|≥|≠|\bpH\b|\bSO[23]\b|\bCO2\b|\bH2O\b/i.test(trimmed);
      if (hasChemistryOrMath) {
        return txt; // Never lower-case chemistry
      }

      // Check if line is excessively uppercase (> 70% uppercase letters and long)
      const letters = trimmed.replace(/[^a-zA-Zà-ỹÀ-ỸĐđ]/g, '');
      if (letters.length > 25) {
        const upperCount = (letters.match(/[A-ZÀ-ỸĐ]/g) || []).length;
        if (upperCount / letters.length > 0.70) {
          // Convert to Sentence case
          const lowered = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
          return lowered
            .replace(/^(i|ii|iii|iv|v|vi|vii|viii|ix|x)\.\s+/i, (m) => m.toUpperCase())
            .replace(/^(hoạt động\s+\d+)/i, (m) => m.charAt(0).toUpperCase() + m.slice(1).toLowerCase())
            .replace(/^(bước\s+\d+)/i, (m) => m.charAt(0).toUpperCase() + m.slice(1).toLowerCase())
            .replace(/:\s*([a-zà-ỹđ])/g, (_, p1) => ": " + p1.toUpperCase())
            .replace(/(\bnls\b|\bnlai\b|\bai\b|\bgv\b|\bhs\b|\bgd&đt\b|\bbgdđt\b|\bthpt\b|\bthcs\b|\bstem\b|\bkhtn\b)/gi, (m) => m.toUpperCase())
            .replace(/(\[mã\s+[^\]]+\])/gi, (m) => m.toUpperCase());
        }
      }
      return txt;
    };

    // Add all newly created lines with casing normalization
    const subLines = line.split('\n');
    for (const sl of subLines) {
      result.push(fixLineCasing(sl));
    }
  }

  return result.join('\n');
};

// Formatted Interactive Document Renderer
const FormattedDocumentViewer: React.FC<{ content: string; title: string; duration: string }> = ({ content, title, duration }) => {
  // Parse content into blocks: text paragraphs, headings, lists, tables with strict hierarchy
  const blocks = useMemo(() => {
    const normalized = normalizeHeadingsHierarchy(content);
    const rawLines = normalized.split('\n');
    const result: Array<{ 
      type: 'heading1' | 'heading2' | 'activity' | 'numericSection' | 'subsection' | 'step' | 'table' | 'bullet' | 'text' | 'empty'; 
      content?: string; 
      rows?: string[][] 
    }> = [];
    
    let currentTable: string[][] = [];

    const flushTable = () => {
      if (currentTable.length > 0) {
        const normalizedRows = sanitizeAndNormalizeTable(currentTable);
        if (normalizedRows.length > 0) {
          result.push({ type: 'table', rows: normalizedRows });
        }
        currentTable = [];
      }
    };

    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i].trim();

      if (line.startsWith('|')) {
        const isSep = (s: string) => /^[\|\s:\-]+$/.test(s);
        // If a new table header starts immediately after another table without an empty line:
        if (currentTable.length > 0 && !isSep(line) && i + 1 < rawLines.length && isSep(rawLines[i + 1].trim())) {
          flushTable();
        }
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
        } else if (/^(I|II|III|IV|V|VI|VII|VIII|IX|X)\.\s+/i.test(clean)) {
          result.push({ type: 'heading2', content: clean });
        } else if (/^HOẠT ĐỘNG\s+\d+/i.test(clean)) {
          result.push({ type: 'activity', content: clean });
        } else if (/^(\d+)\.\s+/i.test(clean)) {
          result.push({ type: 'numericSection', content: clean });
        } else if (/^[a-e][\)\.]\s+/i.test(clean)) {
          result.push({ type: 'subsection', content: clean });
        } else if (/^-\s*Bước\s+\d+/i.test(clean) || /^Bước\s+\d+/i.test(clean)) {
          result.push({ type: 'step', content: clean });
        } else if (/^[•\-\*\+]\s+/.test(line)) {
          result.push({ type: 'bullet', content: clean });
        } else {
          result.push({ type: 'text', content: clean });
        }
      }
    }
    flushTable();
    return result;
  }, [content]);

  // Helper to highlight competency codes & AI keywords with math & chemical formula support
  const renderHighlightedText = (rawText: string) => {
    const formatted = formatChemistryAndMath(rawText);
    let cleanWithLineBreaks = formatted
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&');
    
    // Intelligently break before steps, GV/HS, and subsections inside cells if merged on one line
    cleanWithLineBreaks = cleanWithLineBreaks
      .replace(/([^\n])\s+(-?\s*Bước\s+\d+:?)/gi, '$1\n$2')
      .replace(/([^\n])\s+([•\-\+]?\s*(?:GV|HS|Giáo viên|Học sinh)\s*[:\-])/gi, '$1\n$2')
      .replace(/([.:;!?])\s+(\d+\.\s+[A-ZÀ-ỸĐ])/g, '$1\n$2')
      .replace(/([.:;!?])\s+([a-e][\)\.]\s+[A-ZÀ-ỸĐ])/g, '$1\n$2');

    const lines = cleanWithLineBreaks.split('\n').map(s => s.trim()).filter(Boolean);

    return lines.map((line, lIdx) => {
      // Check if line is a Step heading: "Bước 1: ...", "Bước 2: ..."
      const isStep = /^(-?\s*Bước\s+\d+:?)/i.test(line);
      const isGvHs = /^[•\-\+]?\s*(?:GV|HS|Giáo viên|Học sinh)\s*[:\-]/i.test(line);

      // Parse markdown bold **text** within each line
      const boldSegments = line.split(/(\*\*[^*]+\*\*)/g);

      return (
        <div 
          key={lIdx} 
          className={`leading-relaxed ${
            isStep 
              ? 'font-bold text-sky-900 bg-sky-50/75 px-2.5 py-1.5 rounded-lg border-l-3 border-sky-600 mt-3 mb-1.5 shadow-2xs' 
              : isGvHs 
                ? 'pl-3 my-1 text-slate-900 font-medium' 
                : lIdx > 0 ? 'mt-1' : ''
          }`}
        >
          {boldSegments.map((segment, bIdx) => {
            const isBold = segment.startsWith('**') && segment.endsWith('**');
            const cleanSegment = isBold ? segment.slice(2, -2) : segment;

            const parts = cleanSegment.split(/(\[Mã\s+[^\]]+\]|\[NLS:[^\]]+\]|\[NL\s*AI:[^\]]+\]|Mã\s+[\w\.\-]+|NLS|NL\s*AI|Google Sheets|Google Forms|Excel|Gemini|ChatGPT|Chatbot|Canva|Padlet|Quizizz|PhET|Mentimeter|Kahoot|AI)/gi);

            const renderedParts = parts.map((part, pIdx) => {
              if (/^(\[Mã\s+[^\]]+\]|\[NLS:[^\]]+\]|\[NL\s*AI:[^\]]+\]|Mã\s+[\w\.\-]+)/i.test(part)) {
                return (
                  <span key={pIdx} className="inline-block px-1.5 py-0.5 mx-0.5 bg-emerald-100 text-emerald-900 border border-emerald-400 rounded-md font-bold text-xs shadow-2xs">
                    {part}
                  </span>
                );
              }
              if (/^(NLS|NL\s*AI)/i.test(part)) {
                return (
                  <span key={pIdx} className="inline-block px-1.5 py-0.5 mx-0.5 bg-amber-100 text-amber-900 border border-amber-400 rounded-md font-bold text-xs shadow-2xs">
                    {part}
                  </span>
                );
              }
              if (/^(Google Sheets|Google Forms|Excel|Gemini|ChatGPT|Chatbot|Canva|Padlet|Quizizz|PhET|Mentimeter|Kahoot)/i.test(part)) {
                return (
                  <span key={pIdx} className="inline-block px-1.5 py-0.5 mx-0.5 bg-sky-100 text-sky-900 border border-sky-400 rounded-md font-bold text-xs shadow-2xs">
                    {part}
                  </span>
                );
              }
              return part;
            });

            if (isBold) {
              return <strong key={bIdx} className="font-bold text-slate-950">{renderedParts}</strong>;
            }
            return <React.Fragment key={bIdx}>{renderedParts}</React.Fragment>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="bg-white p-6 md:p-12 rounded-2xl border-2 border-[#1a230f] shadow-lg text-slate-900 font-sans leading-relaxed space-y-4 max-w-5xl mx-auto">
      {blocks.map((block, index) => {
        if (block.type === 'heading1') {
          return (
            <div key={index} className="text-center my-6 border-b-2 border-slate-200 pb-4">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
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
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border-l-4 border-lime-600">
                {block.content}
              </h2>
            </div>
          );
        }

        if (block.type === 'activity') {
          return (
            <div key={index} className="mt-6 mb-3 ml-4 p-3 bg-lime-50/90 border border-lime-400 rounded-xl shadow-xs">
              <h3 className="text-base font-bold text-lime-950">
                {block.content}
              </h3>
            </div>
          );
        }

        if (block.type === 'numericSection') {
          return (
            <div key={index} className="mt-4 mb-1.5 ml-4">
              <div className="font-bold text-base text-slate-900 flex items-baseline gap-1.5">
                {renderHighlightedText(block.content || '')}
              </div>
            </div>
          );
        }

        if (block.type === 'subsection') {
          return (
            <div key={index} className="mt-2.5 mb-1 ml-8">
              <div className="font-bold text-sm text-lime-950 flex items-baseline gap-1.5">
                {renderHighlightedText(block.content || '')}
              </div>
            </div>
          );
        }

        if (block.type === 'step') {
          return (
            <div key={index} className="ml-12 my-1.5 pl-3 py-1.5 bg-slate-50/80 border-l-3 border-sky-500 rounded-r text-sm">
              <div className="text-slate-800">
                {renderHighlightedText(block.content || '')}
              </div>
            </div>
          );
        }

        if (block.type === 'bullet') {
          return (
            <div key={index} className="ml-12 my-1 text-sm text-slate-800 relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-lime-700 before:font-bold">
              {renderHighlightedText(block.content || '')}
            </div>
          );
        }

        if (block.type === 'table' && block.rows && block.rows.length > 0) {
          const headerRow = block.rows[0];
          const dataRows = block.rows.slice(1);
          const colWidths = calculateColumnWidths(headerRow);

          return (
            <div key={index} className="my-6 overflow-x-auto rounded-xl border border-slate-300 shadow-xs">
              <table className="w-full text-xs text-left border-collapse bg-white">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300">
                    {headerRow.map((cell, cIdx) => (
                      <th 
                        key={cIdx} 
                        style={{ width: `${colWidths[cIdx]}%` }}
                        className="p-3 font-black text-slate-900 border-r last:border-r-0 border-slate-300 text-center tracking-tight align-middle"
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataRows.map((row, rIdx) => (
                    <tr 
                      key={rIdx} 
                      className={`border-b border-slate-200 ${rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'} hover:bg-lime-50/40 transition-colors`}
                    >
                      {row.map((cell, cIdx) => (
                        <td 
                          key={cIdx} 
                          className={`p-3 border-r last:border-r-0 border-slate-200 align-top ${
                            cIdx === 0 || /thời|tiết|stt|tt/i.test(headerRow[cIdx] || '') ? 'text-center' : 'text-left'
                          }`}
                        >
                          <div className="leading-relaxed space-y-1">
                            {renderHighlightedText(cell)}
                          </div>
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
          <div key={index} className="text-sm text-slate-800 leading-relaxed pl-2">
            {renderHighlightedText(block.content || '')}
          </div>
        );
      })}
    </div>
  );
};

export const OutputSection: React.FC<OutputSectionProps> = ({ data, onClear }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<'visual' | 'raw'>('visual');
  const [copied, setCopied] = useState(false);

  // Analyze whether the document has tables and determine maximum columns
  const tableAnalytics = useMemo(() => {
    if (!data?.fullPlanContent) return { hasTable: false, maxCols: 0, tableCount: 0 };
    const lines = data.fullPlanContent.split('\n');
    let maxCols = 0;
    let tableCount = 0;
    let inTable = false;

    for (const line of lines) {
      if (line.trim().startsWith('|')) {
        const cols = line.trim().replace(/^\||\|$/g, '').split('|').length;
        if (cols > maxCols) maxCols = cols;
        if (!inTable) {
          inTable = true;
          tableCount++;
        }
      } else {
        inTable = false;
      }
    }
    return { hasTable: maxCols > 0, maxCols, tableCount };
  }, [data?.fullPlanContent]);

  const handleCopy = async () => {
    if (!data?.fullPlanContent) return;
    try {
      const normalizedContent = normalizeHeadingsHierarchy(data.fullPlanContent);
      await navigator.clipboard.writeText(normalizedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = async (orientation: 'portrait' | 'landscape') => {
    if (!data || !data.fullPlanContent) return;
    setIsGenerating(true);
    try {
      const { 
        Document, Packer, Paragraph, Table, TableRow, TableCell, 
        WidthType, BorderStyle, PageOrientation, AlignmentType, TextRun, VerticalAlign,
        Footer, PageNumber
      } = await import('docx');
      const fileSaver = await import('file-saver');
      const saveAs = fileSaver.saveAs || fileSaver.default.saveAs;
      
      const normalizedContent = normalizeHeadingsHierarchy(data.fullPlanContent);
      const lines = normalizedContent.split('\n');
      
      // Check if administrative header already exists in content
      const hasAdminHeaderInContent = /trường\s+thpt|sở\s+gd&đt|phòng\s+gd&đt|cộng\s+hòa\s+xã\s+hội/i.test(normalizedContent.slice(0, 400));
      const hasTitleInContent = /kế\s+hoạch\s+bài\s+dạy|giáo\s+án/i.test(normalizedContent.slice(0, 400));

      const docChildren: any[] = [];

      // Only add administrative header if not already present in the content
      if (!hasAdminHeaderInContent) {
        const headerTable = new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              cantSplit: true,
              children: [
                new TableCell({
                  width: { size: 52, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                  },
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "SỞ GD&ĐT ... - TRƯỜNG THPT ...", font: "Times New Roman", size: 22, bold: true })],
                      alignment: AlignmentType.CENTER
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "TỔ CHUYÊN MÔN: ...", font: "Times New Roman", size: 22, bold: true })],
                      alignment: AlignmentType.CENTER
                    }),
                  ]
                }),
                new TableCell({
                  width: { size: 48, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                  },
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", font: "Times New Roman", size: 22, bold: true })],
                      alignment: AlignmentType.CENTER
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: "Độc lập - Tự do - Hạnh phúc", font: "Times New Roman", size: 22, bold: true, underline: {} })],
                      alignment: AlignmentType.CENTER
                    }),
                  ]
                })
              ]
            })
          ]
        });
        docChildren.push(headerTable);
        docChildren.push(new Paragraph({ text: "", spacing: { after: 120 } }));
      }

      if (!hasTitleInContent) {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "KẾ HOẠCH BÀI DẠY",
                bold: true,
                size: 30, // 15pt
                font: "Times New Roman",
                color: "0F172A"
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 40 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: data.lessonTitle || "Tên bài dạy",
                bold: true,
                size: 28, // 14pt
                font: "Times New Roman",
                color: "1E3A8A"
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 60 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Thời lượng thực hiện: ${data.lessonDuration || "Theo phân phối chương trình"}`,
                bold: true,
                italics: true,
                size: 24, // 12pt
                font: "Times New Roman",
                color: "334155"
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `(Kế hoạch bài dạy biên soạn theo Công văn 5512/BGDĐT - Tích hợp Khung Năng lực số & Năng lực AI)`,
                italics: true,
                size: 21, // 10.5pt
                font: "Times New Roman",
                color: "15803D"
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 260 }
          })
        );
      }

      let currentTableRows: string[][] = [];

      // Function to parse and format clean paragraphs inside table cells with chemistry & NLS/AI support
      const formatCellParagraphs = (cellRaw: string, isHeader: boolean, isCenterCol: boolean) => {
        if (!cellRaw || !cellRaw.trim()) {
          return [new Paragraph({ 
            children: [new TextRun({ text: "", font: "Times New Roman", size: 22 })],
            spacing: { before: 20, after: 20 }
          })];
        }

        // Clean HTML tags and apply chemistry/math formatting
        let rawPrepared = cellRaw
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<\/div>/gi, '\n')
          .replace(/<[^>]+>/g, '')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&');

        // Break before steps, GV/HS, subsections inside cells if merged on the same line
        rawPrepared = rawPrepared
          .replace(/([^\n])\s+(-?\s*Bước\s+\d+:?)/gi, '$1\n$2')
          .replace(/([^\n])\s+([•\-\+]?\s*(?:GV|HS|Giáo viên|Học sinh)\s*[:\-])/gi, '$1\n$2')
          .replace(/([.:;!?])\s+(\d+\.\s+[A-ZÀ-ỸĐ])/g, '$1\n$2')
          .replace(/([.:;!?])\s+([a-e][\)\.]\s+[A-ZÀ-ỸĐ])/g, '$1\n$2')
          .replace(/([;.:])\s+([•\-\+]\s+[A-ZÀ-ỸĐa-z0-9])/g, '$1\n$2');

        const cleanContent = formatChemistryAndMath(rawPrepared);

        const cellLines = cleanContent.split('\n').map(s => s.trim()).filter(Boolean);
        if (cellLines.length === 0) {
          return [new Paragraph({ 
            children: [new TextRun({ text: "", font: "Times New Roman", size: 22 })],
            spacing: { before: 20, after: 20 }
          })];
        }

        return cellLines.map(rawLine => {
          const runs: any[] = [];

          if (isHeader) {
            runs.push(new TextRun({
              text: cleanText(rawLine),
              bold: true,
              size: 22, // 11pt
              font: "Times New Roman",
              color: "0F172A"
            }));
            return new Paragraph({
              children: runs,
              alignment: AlignmentType.CENTER,
              spacing: { before: 40, after: 40, line: 260 }
            });
          }

          // Check for step indicators like "Bước 1:", "Bước 2:" and GV/HS labels
          let lineText = rawLine;
          const stepMatch = lineText.match(/^(-?\s*Bước\s+\d+:?)(.*)$/i);
          const gvHsMatch = !stepMatch && lineText.match(/^([•\-\+]?\s*(?:GV|HS|Giáo viên|Học sinh)\s*[:\-])(.*)$/i);

          let paragraphSpacing = { before: 20, after: 20, line: 260 };
          let indentConfig: any = undefined;

          if (stepMatch) {
            paragraphSpacing = { before: 80, after: 30, line: 260 };
            runs.push(new TextRun({
              text: stepMatch[1].trim() + " ",
              bold: true,
              size: 22,
              font: "Times New Roman",
              color: "1E3A8A"
            }));
            lineText = stepMatch[2].trim();
          } else if (gvHsMatch) {
            indentConfig = { left: 160 }; // Indent 0.28cm for GV and HS activities
            runs.push(new TextRun({
              text: gvHsMatch[1].trim() + " ",
              bold: true,
              size: 22,
              font: "Times New Roman",
              color: "0F172A"
            }));
            lineText = gvHsMatch[2].trim();
          } else if (/^[•\-\*\+]\s+/.test(lineText)) {
            indentConfig = { left: 240, hanging: 120 };
          }

          // Parse bold markdown **...** and NLS/AI tags
          const boldParts = lineText.split(/(\*\*[^*]+\*\*)/g);
          boldParts.forEach(bPart => {
            if (!bPart) return;
            const isBold = bPart.startsWith('**') && bPart.endsWith('**');
            const cleanPart = isBold ? bPart.slice(2, -2) : bPart;

            const parts = cleanPart.split(/(\[Mã\s+[^\]]+\]|\[NLS:[^\]]+\]|\[NL\s*AI:[^\]]+\]|Mã\s+[\w\.\-]+|NLS|NL\s*AI|Google Sheets|Google Forms|Excel|Gemini|ChatGPT|Chatbot|Canva|Padlet|Quizizz|PhET|Mentimeter|Kahoot)/gi);
            parts.forEach(part => {
              if (!part) return;
              if (/^(\[Mã\s+[^\]]+\]|\[NLS:[^\]]+\]|\[NL\s*AI:[^\]]+\]|Mã\s+[\w\.\-]+)/i.test(part)) {
                runs.push(new TextRun({
                  text: part,
                  bold: true,
                  size: 22,
                  font: "Times New Roman",
                  color: "15803D" // Forest green
                }));
              } else if (/^(NLS|NL\s*AI)/i.test(part)) {
                runs.push(new TextRun({
                  text: part,
                  bold: true,
                  size: 22,
                  font: "Times New Roman",
                  color: "B45309" // Amber brown
                }));
              } else if (/^(Google Sheets|Google Forms|Excel|Gemini|ChatGPT|Chatbot|Canva|Padlet|Quizizz|PhET|Mentimeter|Kahoot)/i.test(part)) {
                runs.push(new TextRun({
                  text: part,
                  bold: true,
                  size: 22,
                  font: "Times New Roman",
                  color: "0369A1" // Sky blue
                }));
              } else {
                runs.push(new TextRun({
                  text: part,
                  bold: isBold,
                  size: 22,
                  font: "Times New Roman",
                  color: "1E293B"
                }));
              }
            });
          });

          return new Paragraph({
            children: runs,
            alignment: isCenterCol ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
            spacing: paragraphSpacing,
            indent: indentConfig
          });
        });
      };

      // Function to parse a raw line outside tables into a beautifully formatted Word paragraph
      const formatBodyParagraph = (rawLine: string): any => {
        const cleanContent = formatChemistryAndMath(
          rawLine
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/div>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
        ).trim();

        if (!cleanContent) {
          return null;
        }

        // Check if raw line contains multiple sub-lines after cleaning
        if (cleanContent.includes('\n')) {
          const splitLines = cleanContent.split('\n').map(s => s.trim()).filter(Boolean);
          const paras: any[] = [];
          for (const sl of splitLines) {
            const p = formatBodyParagraph(sl);
            if (p) {
              if (Array.isArray(p)) paras.push(...p);
              else paras.push(p);
            }
          }
          return paras.length > 0 ? paras : null;
        }

        const cleanNoMd = cleanText(cleanContent);

        // 1. National Motto & Country Title: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM" / "Độc lập - Tự do - Hạnh phúc"
        if (/^CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM/i.test(cleanNoMd)) {
          return new Paragraph({
            children: [
              new TextRun({
                text: cleanNoMd,
                bold: true,
                size: 24, // 12pt
                font: "Times New Roman",
                color: "0F172A"
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 20 }
          });
        }
        if (/^Độc lập\s*[-–]\s*Tự do\s*[-–]\s*Hạnh phúc/i.test(cleanNoMd)) {
          return new Paragraph({
            children: [
              new TextRun({
                text: cleanNoMd,
                bold: true,
                underline: {},
                size: 24, // 12pt
                font: "Times New Roman",
                color: "0F172A"
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 120 }
          });
        }

        // 2. School / Department Header Lines: "SỞ GD&ĐT...", "TRƯỜNG THPT...", "TỔ CHUYÊN MÔN...", "GIÁO VIÊN:..."
        if (/^(?:SỞ|PHÒNG)\s+GD&ĐT|^TRƯỜNG\s+THPT|^TỔ\s+CHUYÊN\s+MÔN|^GIÁO\s+VIÊN\s*:/i.test(cleanNoMd)) {
          return new Paragraph({
            children: [
              new TextRun({
                text: cleanNoMd,
                bold: true,
                size: 24, // 12pt
                font: "Times New Roman",
                color: "1E293B"
              })
            ],
            alignment: AlignmentType.LEFT,
            spacing: { before: 30, after: 30 }
          });
        }

        // 3. Lesson Plan Title: "KẾ HOẠCH BÀI DẠY", "GIÁO ÁN", "KẾ HOẠCH BÀI HỌC"
        if (/^(?:KẾ\s+HOẠCH\s+BÀI\s+DẠY|GIÁO\s+ÁN|KẾ\s+HOẠCH\s+BÀI\s+HỌC)$/i.test(cleanNoMd)) {
          return new Paragraph({
            children: [
              new TextRun({
                text: cleanNoMd.toUpperCase(),
                bold: true,
                size: 30, // 15pt
                font: "Times New Roman",
                color: "0F172A"
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 160, after: 40 }
          });
        }

        // 4. Lesson Topic: "BÀI 12: ...", "BÀI 12. ..."
        if (/^BÀI\s+\d+[:.]/i.test(cleanNoMd) || (/^BÀI\s+\d+/i.test(cleanNoMd) && cleanNoMd.length < 80)) {
          return new Paragraph({
            children: [
              new TextRun({
                text: cleanNoMd,
                bold: true,
                size: 28, // 14pt
                font: "Times New Roman",
                color: "1E3A8A" // Navy Blue
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 60 }
          });
        }

        // 5. Subject / Duration / Class subtitle: "Môn học: ...", "Thời lượng: ...", "Lớp: ..."
        if (/^(?:Môn|Môn học|Thời lượng|Thời gian thực hiện|Thời lượng thực hiện|Lớp|Tiết)\s*[:\-]/i.test(cleanNoMd) && cleanNoMd.length < 120) {
          return new Paragraph({
            children: [
              new TextRun({
                text: cleanNoMd,
                bold: true,
                italics: true,
                size: 24, // 12pt
                font: "Times New Roman",
                color: "334155"
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 120 }
          });
        }

        // 6. Major Section: "I. MỤC TIÊU", "II. THIẾT BỊ DẠY HỌC", "III. TIẾN TRÌNH DẠY HỌC", "IV. HỒ SƠ DẠY HỌC"
        const isMajorHeading = /^(I|II|III|IV|V|VI|VII|VIII|IX|X)\.\s+/i.test(cleanNoMd);
        if (isMajorHeading) {
          return new Paragraph({
            children: [
              new TextRun({
                text: cleanNoMd,
                bold: true,
                size: 28, // 14pt standard
                font: "Times New Roman",
                color: "0F172A"
              })
            ],
            alignment: AlignmentType.LEFT,
            spacing: { before: 240, after: 100 }
          });
        }

        // 7. Activity Title: "HOẠT ĐỘNG 1: ...", "Hoạt động 1. ..."
        const isActivity = /^hoạt động\s+\d+[:.]/i.test(cleanNoMd);
        if (isActivity) {
          return new Paragraph({
            children: [
              new TextRun({
                text: cleanNoMd,
                bold: true,
                size: 26, // 13pt
                font: "Times New Roman",
                color: "1E3A8A" // Deep navy blue
              })
            ],
            alignment: AlignmentType.LEFT,
            spacing: { before: 180, after: 80 },
            indent: { left: 360 }
          });
        }

        // 8. Match Hierarchy Categories:
        // Level 1: Numeric Section: "1. Về kiến thức", "2. Về năng lực", "1. Giáo viên:", "2. Học sinh:"
        const numMatch = cleanContent.match(/^(\d+\.[^:\n]{0,45}:?)(.*)$/i);
        const isNumeric = /^(\d+)\.\s+/i.test(cleanNoMd);

        // Level 2: Alpha Subsection: "a) Mục tiêu:", "b) Nội dung:", "c) Sản phẩm:", "d) Tổ chức thực hiện:", "a) Năng lực chung:"
        const alphaMatch = cleanContent.match(/^([a-e][\)\.][^:\n]{0,45}:?)(.*)$/i);
        const isAlpha = /^([a-e][\)\.]\s+)/i.test(cleanNoMd);

        // Level 3: Pedagogical Step: "Bước 1: Chuyển giao nhiệm vụ", "- Bước 1: ..."
        const stepMatch = cleanContent.match(/^(-?\s*Bước\s+\d+:?)(.*)$/i);

        // Teacher / Student Action: "+ GV:", "- GV:", "GV:", "+ HS:", "- HS:", "HS:"
        const gvHsMatch = cleanContent.match(/^([•\-\+]?\s*(?:GV|HS|Giáo viên|Học sinh)\s*[:\-])(.*)$/i);

        let prefixRun: any = null;
        let mainContent = cleanContent;
        let indentConfig: any = { firstLine: 360 }; // Default paragraph indent 1.27cm
        let paragraphSpacing = { before: 30, after: 30, line: 276 };

        if (stepMatch) {
          prefixRun = new TextRun({
            text: stepMatch[1].trim() + " ",
            bold: true,
            size: 24, // 12pt
            font: "Times New Roman",
            color: "1E3A8A"
          });
          mainContent = stepMatch[2].trim();
          indentConfig = { left: 1080 }; // Level 3 indent (~1.9cm)
          paragraphSpacing = { before: 50, after: 30, line: 260 };
        } else if (gvHsMatch) {
          prefixRun = new TextRun({
            text: gvHsMatch[1].trim() + " ",
            bold: true,
            size: 24,
            font: "Times New Roman",
            color: "0F172A"
          });
          mainContent = gvHsMatch[2].trim();
          indentConfig = { left: 1440 }; // Level 4 indent (~2.54cm) for GV/HS action
          paragraphSpacing = { before: 20, after: 20, line: 260 };
        } else if (alphaMatch || isAlpha) {
          if (alphaMatch && alphaMatch[1]) {
            prefixRun = new TextRun({
              text: alphaMatch[1].trim() + " ",
              bold: true,
              size: 25, // 12.5pt
              font: "Times New Roman",
              color: "0F172A"
            });
            mainContent = (alphaMatch[2] || "").trim();
          }
          indentConfig = { left: 720 }; // Level 2 indent (~1.27cm)
          paragraphSpacing = { before: 70, after: 30, line: 260 };
        } else if (numMatch || isNumeric) {
          if (numMatch && numMatch[1]) {
            prefixRun = new TextRun({
              text: numMatch[1].trim() + " ",
              bold: true,
              size: 26, // 13pt
              font: "Times New Roman",
              color: "1E293B"
            });
            mainContent = (numMatch[2] || "").trim();
          }
          indentConfig = { left: 360 }; // Level 1 indent (~0.63cm)
          paragraphSpacing = { before: 120, after: 40, line: 260 };
        } else if (/^[•\-\*\+]\s+/.test(cleanContent)) {
          indentConfig = { left: 1080, hanging: 240 }; // List hanging indent under subsections
          paragraphSpacing = { before: 20, after: 20, line: 260 };
        }

        // Build runs for line with markdown bold, NLS, AI tags, and digital tools
        const runs: any[] = [];
        if (prefixRun) runs.push(prefixRun);

        const boldParts = mainContent.split(/(\*\*[^*]+\*\*)/g);
        boldParts.forEach(bPart => {
          if (!bPart) return;
          const isBold = bPart.startsWith('**') && bPart.endsWith('**');
          const cleanPart = isBold ? bPart.slice(2, -2) : bPart;

          const subParts = cleanPart.split(/(\[Mã\s+[^\]]+\]|\[NLS:[^\]]+\]|\[NL\s*AI:[^\]]+\]|Mã\s+[\w\.\-]+|NLS|NL\s*AI|Google Sheets|Google Forms|Excel|Gemini|ChatGPT|Chatbot|Canva|Padlet|Quizizz|PhET|Mentimeter|Kahoot)/gi);
          
          subParts.forEach(sp => {
            if (!sp) return;
            if (/^(\[Mã\s+[^\]]+\]|\[NLS:[^\]]+\]|\[NL\s*AI:[^\]]+\]|Mã\s+[\w\.\-]+)/i.test(sp)) {
              runs.push(new TextRun({
                text: sp,
                bold: true,
                size: 24,
                font: "Times New Roman",
                color: "15803D" // Forest green
              }));
            } else if (/^(NLS|NL\s*AI)/i.test(sp)) {
              runs.push(new TextRun({
                text: sp,
                bold: true,
                size: 24,
                font: "Times New Roman",
                color: "B45309" // Amber brown
              }));
            } else if (/^(Google Sheets|Google Forms|Excel|Gemini|ChatGPT|Chatbot|Canva|Padlet|Quizizz|PhET|Mentimeter|Kahoot)/i.test(sp)) {
              runs.push(new TextRun({
                text: sp,
                bold: true,
                size: 24,
                font: "Times New Roman",
                color: "0369A1" // Sky blue
              }));
            } else {
              runs.push(new TextRun({
                text: sp,
                bold: isBold,
                size: 24, // 12pt standard
                font: "Times New Roman",
                color: "1E293B"
              }));
            }
          });
        });

        return new Paragraph({
          children: runs,
          alignment: AlignmentType.JUSTIFIED, // Chuẩn văn bản hành chính Việt Nam
          spacing: paragraphSpacing,
          indent: indentConfig
        });
      };

      const processTable = () => {
        if (currentTableRows.length === 0) return;
        const normalizedRows = sanitizeAndNormalizeTable(currentTableRows);
        if (normalizedRows.length > 0) {
          const headerRow = normalizedRows[0];
          const colWidths = calculateColumnWidths(headerRow);

          const table = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: normalizedRows.map((rowCells, rowIndex) => {
              const isHeader = rowIndex === 0;

              return new TableRow({
                tableHeader: isHeader, // Repeats header across pages!
                cantSplit: true,       // Prevents row from cutting across pages!
                children: rowCells.map((cellText, colIndex) => {
                  const widthPercent = colWidths[colIndex] ?? Math.floor(100 / colWidths.length);
                  const headerTitle = cleanText(headerRow[colIndex] || '').toLowerCase();
                  const isCenterCol = colIndex === 0 || /^(stt|tt|#|thời|tiết)/i.test(headerTitle);

                  return new TableCell({
                    width: { size: widthPercent, type: WidthType.PERCENTAGE },
                    margins: { top: 120, bottom: 120, left: 140, right: 140 },
                    children: formatCellParagraphs(cellText, isHeader, isCenterCol),
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 4, color: "1E293B" },
                      bottom: { style: BorderStyle.SINGLE, size: 4, color: "1E293B" },
                      left: { style: BorderStyle.SINGLE, size: 4, color: "1E293B" },
                      right: { style: BorderStyle.SINGLE, size: 4, color: "1E293B" },
                    },
                    verticalAlign: VerticalAlign.TOP, // Vertical align top for pedagogical table alignment
                    shading: isHeader 
                      ? { fill: "E2E8F0" } 
                      : (rowIndex % 2 === 1 ? { fill: "F8FAFC" } : { fill: "FFFFFF" })
                  });
                })
              });
            })
          });

          docChildren.push(table);
          docChildren.push(new Paragraph({ text: "", spacing: { after: 120 } })); 
        }
        currentTableRows = [];
      };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('|')) {
          const isSep = (s: string) => /^[\|\s:\-]+$/.test(s);
          // If a new table header starts without an empty line separating tables:
          if (currentTableRows.length > 0 && !isSep(line) && i + 1 < lines.length && isSep(lines[i + 1].trim())) {
            processTable();
          }
          const rowContent = line.replace(/^\||\|$/g, '');
          currentTableRows.push(rowContent.split('|').map(c => c.trim()));
        } else {
          if (currentTableRows.length > 0) processTable();
          if (line.length > 0) {
            const bodyPara = formatBodyParagraph(line);
            if (bodyPara) {
              if (Array.isArray(bodyPara)) {
                docChildren.push(...bodyPara);
              } else {
                docChildren.push(bodyPara);
              }
            }
          }
        }
      }
      if (currentTableRows.length > 0) processTable();

      // Official Vietnamese standard margins (Nghị định 30/2020/NĐ-CP):
      // Portrait: Top 2cm (1134), Bottom 2cm (1134), Left 2.5cm (1417), Right 1.5cm (850)
      // Landscape: Top 1.5cm (850), Bottom 1.5cm (850), Left 2cm (1134), Right 1.5cm (850)
      const pageMargins = orientation === 'portrait' 
        ? { top: 1134, bottom: 1134, left: 1417, right: 850 }
        : { top: 850, bottom: 850, left: 1134, right: 850 };

      const doc = new Document({
        sections: [{
          properties: { 
            page: { 
              size: { 
                orientation: orientation === 'portrait' ? PageOrientation.PORTRAIT : PageOrientation.LANDSCAPE 
              },
              margin: pageMargins
            } 
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({ text: "Trang ", font: "Times New Roman", size: 20, color: "64748B" }),
                    new TextRun({ children: [PageNumber.CURRENT], font: "Times New Roman", size: 20, color: "64748B" }),
                    new TextRun({ text: " / ", font: "Times New Roman", size: 20, color: "64748B" }),
                    new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Times New Roman", size: 20, color: "64748B" })
                  ]
                })
              ]
            })
          },
          children: docChildren
        }]
      });

      const blob = await Packer.toBlob(doc);
      const safeTitle = (data.lessonTitle || "KHBD_TichHop_NLS_AI")
        .replace(/[^a-zA-Z0-9\u00C0-\u1EF9]/g, '_')
        .substring(0, 40);
      
      const fileName = orientation === 'portrait' 
        ? `${safeTitle}_KhoDoc_A4.docx` 
        : `${safeTitle}_KhoNgang_BangBieu.docx`;
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

            <div className="bg-lime-50 border border-lime-300 rounded-xl p-3 text-left w-full text-[11px] font-bold text-lime-900 space-y-1.5">
              <div className="flex items-center gap-1 text-lime-800 font-black">
                <ShieldCheck className="w-4 h-4 text-lime-600 flex-shrink-0" />
                CAM KẾT CHUẨN XUẤT WORD KHOA HỌC:
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 flex-shrink-0" />
                <span><strong>Dạng cột / bảng:</strong> Tự động căn chỉnh độ rộng cột chuẩn mực, lặp lại tiêu đề khi qua trang.</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 flex-shrink-0" />
                <span><strong>Dạng văn bản:</strong> Giữ trọn vẹn từng gạch đầu dòng, các bước 1, 2, 3, 4 gốc.</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-[11px] font-black uppercase tracking-[0.2em] text-white/70 flex items-center gap-2">
          <Box className="w-3.5 h-3.5" />
          Xuất Word chuẩn Nghị định 30/2020/NĐ-CP
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
          <span className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1 bg-lime-200/80 text-lime-950 font-bold text-[10px] rounded-lg border border-lime-600/40">
            📄 Chuẩn NĐ 30 & CV 5512 (Times New Roman, Căn đều 2 bên)
          </span>
          {/* View switcher tabs */}
          <div className="flex bg-white/80 p-1 rounded-xl border border-[#1a230f] shadow-xs">
            <button
              onClick={() => setViewMode('visual')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black transition-all ${
                viewMode === 'visual' ? 'bg-lime-700 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              Bản in trực quan
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black transition-all ${
                viewMode === 'raw' ? 'bg-lime-700 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
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

          {/* Portrait Export */}
          <button
            onClick={() => handleDownload('portrait')}
            disabled={isGenerating}
            className="flex items-center gap-1.5 bg-lime-700 hover:bg-lime-800 text-white text-[11px] font-black uppercase px-3 py-2 rounded-xl border-2 border-[#1a230f] shadow-[3px_3px_0_0_rgba(26,35,15,1)] active:translate-y-0.5 transition-all disabled:opacity-50"
            title="Xuất file Word khổ dọc tiêu chuẩn Bộ GD&ĐT"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải Word A4 (Khổ dọc)</span>
          </button>

          {/* Landscape Export (Emphasized if table detected) */}
          <button
            onClick={() => handleDownload('landscape')}
            disabled={isGenerating}
            className={`flex items-center gap-1.5 text-white text-[11px] font-black uppercase px-3 py-2 rounded-xl border-2 border-[#1a230f] shadow-[3px_3px_0_0_rgba(26,35,15,1)] active:translate-y-0.5 transition-all disabled:opacity-50 ${
              tableAnalytics.maxCols >= 4 
                ? 'bg-amber-600 hover:bg-amber-700 ring-2 ring-amber-400' 
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
            title="Xuất file Word khổ ngang tối ưu nhất cho bảng biểu nhiều cột"
          >
            <Download className="w-3.5 h-3.5" />
            <span>
              {tableAnalytics.maxCols >= 4 ? `⭐ Tải Word Khổ Ngang (${tableAnalytics.maxCols} cột)` : "Tải Word (Khổ ngang)"}
            </span>
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
      <div className="flex-1 overflow-y-auto p-6 bg-lime-50/20 scrollbar-thin scrollbar-thumb-lime-400 space-y-4">
        {/* Table layout notice banner */}
        {tableAnalytics.hasTable && (
          <div className="p-3 bg-white border-2 border-[#1a230f] rounded-2xl shadow-[3px_3px_0_0_rgba(26,35,15,1)] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-100 rounded-xl border border-amber-400 text-amber-900">
                <Columns3 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-black text-[#1a230f] uppercase">
                  Đã tối ưu bảng biểu ({tableAnalytics.maxCols} cột):
                </span>{" "}
                <span className="text-slate-700 font-medium">
                  Tự động phân bổ độ rộng cột khoa học, lặp lại dòng tiêu đề khi sang trang trong Word, văn bản ngắt dòng sạch đẹp dễ chỉnh sửa.
                </span>
              </div>
            </div>
            {tableAnalytics.maxCols >= 4 && (
              <span className="hidden md:inline-flex px-2.5 py-1 bg-amber-50 text-amber-900 font-black text-[10px] rounded-lg border border-amber-300 whitespace-nowrap">
                Khuyên dùng Khổ ngang
              </span>
            )}
          </div>
        )}

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
