import { GoogleGenAI, Type } from "@google/genai";
import { DIGITAL_COMPETENCIES, AI_COMPETENCIES } from "../constants";
import { LessonPlanResponse, MediaInput } from "../types";

export const generateEnhancedLessonPlan = async (
  input: { text: string; media: MediaInput[]; sessionDetails: string },
  selectedCompetencyIds: string[], 
  selectedAICompetencyIds: string[],
  focusArea?: string
): Promise<LessonPlanResponse> => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key không tồn tại. Vui lòng cấu hình GEMINI_API_KEY trong Cài đặt (Settings).");
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  const activeCompetencies = DIGITAL_COMPETENCIES.filter(c => selectedCompetencyIds.includes(c.id));
  const activeAICompetencies = AI_COMPETENCIES.filter(c => selectedAICompetencyIds.includes(c.id));
  
  if (activeCompetencies.length === 0 && activeAICompetencies.length === 0) {
      throw new Error("Vui lòng chọn ít nhất một năng lực số hoặc năng lực AI.");
  }

  const digitalFrameworkContext = activeCompetencies.map(c => `- ${c.id}: ${c.name} (${c.domain})`).join("\n");
  const aiFrameworkContext = activeAICompetencies.map(c => `- ${c.id}: ${c.name} (${c.domain})`).join("\n");

  const systemInstruction = `
    Bạn là chuyên gia tư vấn sư phạm và tích hợp công nghệ giáo dục (Năng lực số - NLS, Năng lực Trí tuệ nhân tạo - AI) cao cấp của Bộ Giáo dục & Đào tạo.

    ========================================================================
    NGUYÊN TẮC BẤT DI BẤT DỊCH (TUYỆT ĐỐI TUÂN THỦ):
    ========================================================================
    1. BẢO TOÀN NGUYÊN VĂN 100% NỘI DUNG VÀ ĐỊNH DẠNG CỦA GIÁO ÁN GỐC:
       - BẠN PHẢI GIỮ NGUYÊN VẸN TỪNG CÂU, TỪNG CHỮ, TỪNG ĐỀ MỤC, TỪNG BẢNG BIỂU, TỪNG BƯỚC DẠY HỌC, TỪNG CÂU HỎI, TỪNG BÀI TẬP, TỪNG CÔNG THỨC HÓA HỌC/TOÁN HỌC CỦA BẢN GỐC.
       - TUYỆT ĐỐI KHÔNG ĐƯỢC TỰ Ý TÓM TẮT, KHÔNG CẮT XÉN, KHÔNG VIẾT LẠI (REWRITE), KHÔNG DIỄN ĐẠT LẠI THEO Ý MÌNH, KHÔNG BỎ BỚT BẤT KỲ ĐOẠN NÀO TRONG BẢN GỐC.
       - Nếu bản gốc có bảng (ví dụ bảng 2 cột "Hoạt động của GV - HS | Dự kiến sản phẩm" hoặc bất kỳ bảng nào): BẮT BUỘC GIỮ NGUYÊN 100% CẤU TRÚC BẢNG ĐÓ VỚI ĐẦY ĐỦ CÁC CỘT VÀ TOÀN BỘ NỘI DUNG GỐC TRONG TỪNG Ô!
       - Nếu bản gốc là dạng văn bản (không dùng bảng): BẮT BUỘC GIỮ NGUYÊN DẠNG VĂN BẢN ĐÓ, không tự ý chuyển thành bảng.

    2. CHỈ ĐƯA THÊM CÁC YÊU CẦU TÍCH HỢP ĐƯỢC YÊU CẦU (SURGICAL INSERTION ONLY):
       - BẠN CHỈ ĐƯỢC PHÉP CHÈN THÊM VÀO 2 VỊ TRÍ:
         a) Tại mục "I. MỤC TIÊU": Thêm tiểu mục:
            c) Năng lực số (NLS) và Năng lực AI:
            - [Mã chỉ báo]: [Mô tả chi tiết năng lực đạt được]
            (Ví dụ: - 1.1.NC1a: Đáp ứng được nhu cầu thông tin (Khai thác dữ liệu & thông tin).
                    - 5.3.NC1a: Áp dụng được các công cụ và công nghệ số để tạo ra kiến thức mới.
                    - 11.C3.2: Sử dụng công cụ AI một cách có trách nhiệm để đối chiếu và phản biện thông tin.)
         b) Tại đúng hoạt động / nhiệm vụ mà người dùng đã chỉ định trong ô nhập liệu: Chèn thêm dòng nhiệm vụ tích hợp có biểu tượng 👉 ở đầu câu:
            Ví dụ: 👉 **Giao nhiệm vụ:** HS sử dụng công cụ số (như Canva hoặc Padlet) để tổng hợp sơ đồ tư duy về quá trình phát triển của Vật lí [Mã 5.3.NC1a].
            Ví dụ: 👉 **Thực hiện nhiệm vụ:** HS sử dụng công cụ AI (Gemini hoặc ChatGPT) để tra cứu, đối chiếu và phản biện thông tin [Mã 1.1.NC1a] [NL AI: 11.C3.2].
       - TUYỆT ĐỐI KHÔNG ĐƯỢC TỰ Ý TÍCH HỢP CHO TẤT CẢ CÁC HOẠT ĐỘNG! Các hoạt động còn lại phải được giữ nguyên 100% y hệt file gốc, không thêm icon 👉, không thêm công cụ số hay mã chỉ báo.

    3. QUY TẮC ĐỊNH DẠNG BẢNG VÀ XUỐNG DÒNG SƯ PHẠM:
       - Trong các ô bảng: Bắt buộc dùng thẻ <br> để ngăn cách các bước (**Bước 1: Chuyển giao nhiệm vụ**, **Bước 2: Thực hiện nhiệm vụ**, **Bước 3: Báo cáo, thảo luận**, **Bước 4: Kết luận, nhận định**), giữa hoạt động của GV (+ GV:) và HS (+ HS:), và nhiệm vụ tích hợp 👉. Tuyệt đối không viết dính liền nhau.
       - Cú pháp bảng Markdown bắt buộc chuẩn:
         | Tiêu đề cột 1 | Tiêu đề cột 2 |
         | :--- | :--- |
         | Nội dung ô 1 | Nội dung ô 2 |

    4. QUY CHUẨN CHỮ VIẾT:
       - Viết hoa chuẩn tiếng Việt (Sentence case), tuyệt đối không viết hoa toàn bộ (CẤM ALL-CAPS) cả câu hay cả đoạn.
       - Giữ nguyên vẹn các công thức hóa học, công thức toán học ($H_{2}SO_{4}$, $Al^{3+}$, $pH = -\\lg[H^{+}]$...).

    Khung năng lực số được chọn:
    ${digitalFrameworkContext || "Không chọn"}

    Khung năng lực AI được chọn:
    ${aiFrameworkContext || "Không chọn"}

    Yêu cầu bổ sung: ${focusArea || "Giữ nguyên 100% định dạng, bố cục và nội dung file gốc, chỉ chèn thêm phần tích hợp được yêu cầu"}
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      overview: { type: Type.STRING },
      lessonTitle: { type: Type.STRING },
      lessonDuration: { type: Type.STRING },
      fullPlanContent: { type: Type.STRING },
    },
    required: ["overview", "lessonTitle", "lessonDuration", "fullPlanContent"],
  };

  const contentParts: any[] = [];
  if (input.media && input.media.length > 0) {
    input.media.forEach(item => {
      contentParts.push({ inlineData: { mimeType: item.mimeType, data: item.data } });
    });
  }

  const promptDirective = `YÊU CẦU BẢO TOÀN NGUYÊN BẢN & ĐỊNH DẠNG TUYỆT ĐỐI:
1. ĐỌC KỸ BẢN GỐC: Bản gốc bao gồm toàn bộ nội dung trong tệp đính kèm và văn bản người dùng cung cấp.
2. NGUYÊN TẮC GIỮ NGUYÊN ĐỊNH DẠNG & NỘI DUNG 100%:
   - Bắt buộc GIỮ NGUYÊN 100% TOÀN BỘ NỘI DUNG, BỐ CỤC, BẢNG BIỂU, VĂN BẢN, TIÊU ĐỀ, CÁC BƯỚC VÀ CÂU HỎI CỦA FILE GỐC.
   - TUYỆT ĐỐI KHÔNG ĐƯỢC TỰ Ý THAY ĐỔI, KHÔNG VIẾT LẠI (NO REWRITING), KHÔNG TÓM TẮT, KHÔNG THAY ĐỔI CÂU CHỮ CỦA FILE GỐC.
   - Nếu bản gốc có bảng: Giữ nguyên bảng đó với đúng số cột và toàn bộ nội dung trong các ô.
   - Nếu bản gốc là văn bản: Giữ nguyên văn bản đó.
3. CHỈ ĐƯA THÊM CÁC YÊU CẦU TÍCH HỢP ĐƯỢC YÊU CẦU:
   - Tại I. Mục tiêu: Thêm mục:
     c) Năng lực số (NLS) và Năng lực AI:
     - [Mã chỉ báo]: [Mô tả chi tiết năng lực đạt được]
   - Tại đúng hoạt động / nhiệm vụ mà người dùng đã chỉ định/nhập liệu: Chèn thêm câu nhiệm vụ tích hợp có biểu tượng 👉 ở đầu câu (ví dụ: 👉 **Giao nhiệm vụ:** HS sử dụng công cụ số... [Mã...]).
   - Các hoạt động còn lại: BẢO TOÀN NGUYÊN VẸN 100% NHƯ BẢN GỐC, KHÔNG ĐƯỢC TỰ Ý TÍCH HỢP TRÀN LAN.
${input.sessionDetails ? `Chi tiết phân bổ tiết học: ${input.sessionDetails}.` : ''}
${input.text ? `\nNội dung văn bản / Yêu cầu người dùng:\n${input.text}` : ''}`;

  contentParts.push({ text: promptDirective });

  // Priority list of models: gemini-3.8-flash produces the highest fidelity for strict instructions and formatting
  const candidateModels = ["gemini-3.8-flash", "gemini-3.1-pro-preview", "gemini-flash-latest", "gemini-3.1-flash-lite"];
  let lastError: any = null;
  let response: any = null;

  for (const modelName of candidateModels) {
    try {
      response = await ai.models.generateContent({
        model: modelName,
        contents: [{ role: "user", parts: contentParts }],
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          maxOutputTokens: 16384,
          temperature: 0.1,
        },
      });
      if (response) {
        console.log(`Successfully generated lesson plan using model: ${modelName}`);
        break;
      }
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || JSON.stringify(err || '');
      console.warn(`Mô hình ${modelName} gặp sự cố (${errMsg.slice(0, 100)}). Đang tự động chuyển sang mô hình tiếp theo...`);
      // If overloaded, immediately try the next model in the candidate list
      continue;
    }
  }

  // If all primary models failed on first pass, do a short retry with the top models
  if (!response) {
    for (const modelName of ["gemini-3.1-flash-lite", "gemini-flash-latest"]) {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        response = await ai.models.generateContent({
          model: modelName,
          contents: [{ role: "user", parts: contentParts }],
          config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            maxOutputTokens: 16384,
            temperature: 0.1,
          },
        });
        if (response) break;
      } catch (retryErr) {
        lastError = retryErr;
      }
    }
  }

  if (!response) {
    const rawMsg = lastError?.message || JSON.stringify(lastError || '');
    if (rawMsg.includes("503") || rawMsg.includes("high demand") || rawMsg.includes("UNAVAILABLE")) {
      throw new Error("Máy chủ Google AI hiện đang quá tải tạm thời do lượng truy cập cao (Lỗi 503: High demand). Tình trạng này thường chỉ kéo dài 1-2 phút. Thầy/cô vui lòng bấm 'Tích hợp ngay' lại sau ít giây ạ.");
    }
    if (rawMsg.includes("429") || rawMsg.includes("RESOURCE_EXHAUSTED")) {
      throw new Error("Khóa API Google đã vượt hạn ngạch gửi yêu cầu tạm thời (Lỗi 429). Thầy/cô vui lòng đợi 1 phút và thử lại.");
    }
    throw lastError || new Error("Không thể kết nối đến máy chủ Google AI. Vui lòng kiểm tra lại cấu hình API Key.");
  }

  const responseText = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!responseText) {
    throw new Error("Không nhận được nội dung phản hồi từ mô hình AI.");
  }

  try {
    const cleanedText = responseText.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    return JSON.parse(cleanedText) as LessonPlanResponse;
  } catch (parseError) {
    console.error("Lỗi phân tích cú pháp JSON phản hồi từ AI:", parseError, "Nội dung gốc:", responseText);
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as LessonPlanResponse;
    }
    throw new Error("Dữ liệu phản hồi từ AI không đúng định dạng JSON.");
  }
};