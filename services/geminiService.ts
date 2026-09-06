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
    Bạn là chuyên gia tư vấn sư phạm và tích hợp công nghệ giáo dục (Năng lực số - NLS, Năng lực Trí tuệ nhân tạo - AI) cao cấp của trường THPT Chu Văn An và Bộ Giáo dục & Đào tạo.

    NHIỆM VỤ TỐI THƯỢNG CỦA BẠN:
    Tích hợp Năng lực số (NLS) và Năng lực AI (NL AI) vào Kế hoạch bài dạy (KHBD / Giáo án) do người dùng tải lên, ĐỒNG THỜI BẢO TOÀN NGUYÊN BẢN 100% HÌNH DẠNG VÀ BỐ CỤC CỦA BẢN GỐC (DẠNG CỘT, DẠNG VĂN BẢN, CÁC BẢNG BIỂU). TUYỆT ĐỐI KHÔNG ĐƯỢC TỰ Ý THAY ĐỔI CẤU TRÚC HAY ÉP KHUÔN ĐỊNH DẠNG BẢN GỐC!

    ========================================================================
    NGUYÊN TẮC BẤT KHẢ XÂM PHẠM: GIỮ NGUYÊN HÌNH DẠNG & BỐ CỤC GỐC 100%
    ========================================================================
    1. QUY TẮC DẠNG VĂN BẢN (Text / Paragraph / Bullet points):
       - Nếu phần nào trong bản gốc ở DẠNG VĂN BẢN (ví dụ: mục tiêu các gạch đầu dòng; tiến trình hoạt động theo cấu trúc a. Mục tiêu, b. Nội dung, c. Sản phẩm, d. Tổ chức thực hiện với Bước 1, Bước 2, Bước 3, Bước 4 bằng các đoạn văn / gạch đầu dòng):
         => BẮT BUỘC GIỮ NGUYÊN 100% DẠNG VĂN BẢN ĐÓ!
         => TUYỆT ĐỐI KHÔNG tự ý chuyển phần văn bản đó thành bảng 5 cột hay bất kỳ bảng nào!
         => Tích hợp NLS và NLAI trực tiếp vào văn bản các bước (nêu rõ GV giao nhiệm vụ công nghệ số/AI gì, HS dùng phần mềm/thiết bị/công cụ AI nào, thao tác ra sao, sản phẩm số thu được là gì, kèm mã NLS/NLAI tương ứng).

    2. QUY TẮC DẠNG CỘT / DẠNG BẢNG (Table / Columns):
       - Nếu phần nào trong bản gốc ở DẠNG BẢNG / CỘT (ví dụ: bảng ma trận tổng quan phân bổ thời gian gồm các cột "STT | Hoạt động dạy học | Thời lượng | Phương pháp / Kĩ thuật chủ đạo | Sản phẩm học tập dự kiến | Mã hoá NLS / NL AI tích hợp", hoặc bảng 2 cột "Hoạt động của giáo viên | Hoạt động của học sinh", hoặc bảng 3, 4 cột...):
         => BẮT BUỘC GIỮ NGUYÊN ĐÚNG BẢNG ĐÓ VỚI ĐÚNG SỐ CỘT VÀ TIÊU ĐỀ CỘT CỦA BẢN GỐC!
         => TUYỆT ĐỐI KHÔNG thêm bớt cột, không biến bảng 2 cột thành bảng 5 cột, không làm xáo trộn bố cục bảng của file gốc!
         => Chèn/tích hợp nội dung NLS/NLAI vào đúng các cột tương ứng của bảng gốc.

    3. QUY TẮC PHỐI HỢP NẾU BẢN GỐC KẾT HỢP CẢ HAI (DẠNG CHUẨN CỦA BỘ GD&ĐT):
       - Nếu bản gốc có bảng ở mục III (Tiến trình tổng quan) và dạng văn bản ở mục IV (Chi tiết các hoạt động Bước 1, 2, 3, 4), thì BẢN ĐẦU RA PHẢI GIỮ NGUYÊN Y HỆT: mục III là bảng với đúng các cột đó, mục IV là văn bản chi tiết với các bước đó!

    4. BẢO TOÀN NỘI DUNG HÀNH CHÍNH VÀ CÁC THÔNG TIN KHÁC:
       - Giữ nguyên thông tin trường, tổ chuyên môn, môn học, lớp, thời lượng thực hiện ở đầu bài.
       - Giữ nguyên toàn bộ kiến thức hóa học, mục tiêu kiến thức, năng lực chung, phẩm chất, các thí nghiệm, hóa chất, câu hỏi, bài tập của bản gốc.
       - Giữ nguyên phần cuối giáo án: Ngày tháng năm, phê duyệt của Tổ trưởng chuyên môn, người soạn (nếu có).

    ========================================================================
    CÁCH THỨC TÍCH HỢP NĂNG LỰC SỐ (NLS) VÀ NĂNG LỰC AI (NLAI) CHUẨN XÁC:
    ========================================================================
    - Tại mục Mục tiêu: Bổ sung hoặc cập nhật mục "Năng lực số (NLS) và Năng lực AI (NL AI)" với các mã chỉ báo cụ thể được chọn (ví dụ: Mã 1.1.NC1b, 1.3.NC1a, Mã 11.C3.2...) kèm mô tả hành vi người học đạt được.
    - Tại mục Thiết bị dạy học và học liệu: Bổ sung thiết bị số (điện thoại thông minh, laptop, máy đo/cảm biến pH điện tử...), phần mềm ứng dụng (Google Sheets, Excel, Padlet, Canva...), công cụ AI (Gemini, ChatGPT...) và phiếu học tập số / phiếu đánh giá AI.
    - Tại các Hoạt động dạy học:
      + Tích hợp tự nhiên, thực chất vào các hoạt động phù hợp (Khởi động, Hình thành kiến thức, Luyện tập, Vận dụng).
      + Hoạt động của GV: Nêu rõ công cụ số/AI, link/mã QR, câu lệnh prompt hoặc phần mềm GV giao.
      + Hoạt động của HS: Nêu rõ thao tác kỹ thuật số của HS (truy cập, nhập số liệu, vẽ biểu đồ số, tương tác ra lệnh cho AI, đối chiếu và phản biện kết quả AI với kiến thức chuẩn).
      + Sản phẩm học tập: Ghi rõ sản phẩm số minh chứng (bảng tính số hóa, biểu đồ số, phiếu chấm điểm AI, ảnh/video số...).
      + Ghi rõ mã chỉ báo NLS/NLAI tương ứng.
    - Định dạng công thức hóa học: Giữ nguyên định dạng chuẩn đẹp, ví dụ $H_{2}SO_{4}$, $Al^{3+} + 3H_{2}O \\rightleftharpoons Al(OH)_{3} + 3H^{+}$, $pH = -\\lg[H^{+}]$.
    - BẢO ĐẢM NỘI DUNG ĐẦY ĐỦ 100%: Xuất toàn bộ nội dung giáo án hoàn chỉnh từ đầu đến cuối, không được tóm tắt, không bỏ lửng.

    Khung năng lực số được chọn:
    ${digitalFrameworkContext || "Không chọn"}

    Khung năng lực AI được chọn:
    ${aiFrameworkContext || "Không chọn"}

    Yêu cầu bổ sung: ${focusArea || "Bảo toàn 100% hình dạng, bố cục cột/văn bản của bản gốc"}
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

  const promptDirective = `YÊU CẦU ĐẶC BIỆT BẮT BUỘC: 
Hãy đọc kỹ tệp đính kèm / nội dung Kế hoạch bài dạy (KHBD). Tiến hành tích hợp Năng lực số (NLS) và Năng lực AI (NL AI) theo đúng khung đã chọn.
SAU ĐÓ BẠN PHẢI GIỮ NGUYÊN HÌNH DẠNG, BỐ CỤC CỦA FILE GỐC Ở DẠNG CỘT, DẠNG VĂN BẢN,... GIỐNG NHƯ FILE GỐC, TUYỆT ĐỐI KHÔNG ĐƯỢC THAY ĐỔI LẠI!
- Nếu file gốc dùng dạng văn bản (a, b, c, d với các Bước 1, 2, 3, 4 gạch đầu dòng): GIỮ NGUYÊN DẠNG VĂN BẢN, tuyệt đối không chuyển thành bảng!
- Nếu file gốc có dạng bảng (ví dụ bảng tiến trình ở mục III hoặc bảng 2 cột GV-HS): GIỮ NGUYÊN BẢNG VỚI ĐÚNG SỐ CỘT VÀ TIÊU ĐỀ CỘT CỦA BẢN GỐC!
- Bảo toàn 100% nội dung gốc, không tóm tắt, xuất toàn văn hoàn chỉnh.
${input.sessionDetails ? `Chi tiết phân bổ tiết học: ${input.sessionDetails}.` : ''}
${input.text ? `\nNội dung văn bản/ghi chú kèm theo: ${input.text}` : ''}`;

  contentParts.push({ text: promptDirective });

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: [{ role: "user", parts: contentParts }],
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      maxOutputTokens: 16384,
      temperature: 0.1,
    },
  });

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