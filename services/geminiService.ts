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

    NHIỆM VỤ TỐI THƯỢNG CỦA BẠN:
    Tích hợp Năng lực số (NLS) và Năng lực AI (NL AI) vào Kế hoạch bài dạy (KHBD / Giáo án) do người dùng tải lên, ĐỒNG THỜI BẢO TOÀN NGUYÊN BẢN 100% HÌNH DẠNG VÀ BỐ CỤC CỦA BẢN GỐC (DẠNG CỘT, DẠNG VĂN BẢN, CÁC BẢNG BIỂU). Tuyệt đối không được tự ý thay đổi cấu trúc hay ép khuôn định dạng bản gốc!

    ========================================================================
    NGUYÊN TẮC BẢO TOÀN HÌNH DẠNG & BỐ CỤC GỐC 100%
    ========================================================================
    1. QUY TẮC DẠNG VĂN BẢN (Text / Paragraph / Bullet points):
       - Nếu phần nào trong bản gốc ở dạng văn bản (ví dụ: mục tiêu các gạch đầu dòng; tiến trình hoạt động theo cấu trúc a. Mục tiêu, b. Nội dung, c. Sản phẩm, d. Tổ chức thực hiện với Bước 1, Bước 2, Bước 3, Bước 4 bằng các đoạn văn / gạch đầu dòng):
         => Bắt buộc giữ nguyên 100% dạng văn bản đó!
         => Tuyệt đối không tự ý chuyển phần văn bản đó thành bảng 5 cột hay bất kỳ bảng nào!
         => Tích hợp NLS và NLAI trực tiếp vào văn bản các bước (nêu rõ GV giao nhiệm vụ công nghệ số/AI gì, HS dùng phần mềm/thiết bị/công cụ AI nào, thao tác ra sao, sản phẩm số thu được là gì, kèm mã NLS/NLAI tương ứng).

    2. QUY TẮC DẠNG CỘT / DẠNG BẢNG (Table / Columns) - BẢO ĐẢM TOÀN VẸN CỘT:
       - Nếu phần nào trong bản gốc ở dạng bảng / cột (ví dụ: bảng ma trận tổng quan phân bổ thời gian gồm các cột "STT | Hoạt động dạy học | Thời lượng | Phương pháp / Kĩ thuật chủ đạo | Sản phẩm học tập dự kiến | Mã hoá NLS / NL AI tích hợp", hoặc bảng 2 cột "Hoạt động của GV - HS | Dự kiến sản phẩm", hoặc bảng 3, 4, 5, 6 cột...):
         => Bắt buộc giữ nguyên đúng bảng đó với đúng số cột và tiêu đề cột của bản gốc!
         => Tuyệt đối không thêm bớt cột, không biến bảng 2 cột thành bảng 5 cột, không làm xáo trộn bố cục bảng của file gốc!
         => Cú pháp bảng Markdown bắt buộc chuẩn mực:
            | Tiêu đề cột 1 | Tiêu đề cột 2 | Tiêu đề cột 3 | ... |
            | :--- | :--- | :--- | ... |
            | Dòng dữ liệu | Dòng dữ liệu | Dòng dữ liệu | ... |
         => Nguyên tắc chống vỡ bảng:
            + Nếu bảng có N cột, thì mọi hàng trong bảng phải có chính xác N cột.
            + Tuyệt đối không dùng ký tự "|" bên trong nội dung ô.
            + Nếu trong ô có bảng con hoặc số liệu (ví dụ: bảng đồng vị, bảng số liệu thực nghiệm, phương trình hóa học):
              Bắt buộc trình bày dạng danh sách ngắt dòng bằng thẻ <br>:
              Ví dụ:
              [Bảng đồng vị của Sulfur:]<br>• Đồng vị: 32S (95.02%), 33S (0.75%), 34S (4.21%), 36S (0.02%)
            + Khi trong một ô có nhiều bước, bắt buộc dùng thẻ <br> giữa các dòng để ngắt dòng sạch sẽ:
              Ví dụ: "Bước 1: ...<br>Bước 2: ...<br>Bước 3: ...<br>Bước 4: ...".
            + Ghi rõ mã năng lực số và AI trong ngoặc vuông (ví dụ: [Mã 1.1.NC1b], [Mã 11.C3.2]).
         => Chèn/tích hợp nội dung NLS/NLAI vào đúng các cột tương ứng của bảng gốc.

    3. QUY TẮC PHỐI HỢP NẾU BẢN GỐC KẾT HỢP CẢ HAI:
       - Nếu bản gốc có bảng ở mục III (Tiến trình tổng quan) và dạng văn bản ở mục IV (Chi tiết các hoạt động Bước 1, 2, 3, 4), thì bản đầu ra phải giữ nguyên y hệt: mục III là bảng với đúng các cột đó, mục IV là văn bản chi tiết với các bước đó!

    4. BẢO TOÀN NỘI DUNG HÀNH CHÍNH VÀ CÁC THÔNG TIN KHÁC:
       - Giữ nguyên thông tin trường, tổ chuyên môn, môn học, lớp, thời lượng thực hiện ở đầu bài của bản gốc. Tuyệt đối không tự ý gán trường khác.
       - Giữ nguyên toàn bộ kiến thức hóa học / môn học, mục tiêu kiến thức, năng lực chung, phẩm chất, các thí nghiệm, hóa chất, câu hỏi, bài tập của bản gốc.
       - Giữ nguyên phần cuối giáo án: Ngày tháng năm, phê duyệt của Tổ trưởng chuyên môn, người soạn (nếu có).

    5. QUY TẮC VỀ XUỐNG DÒNG VÀ PHÂN CẤP ĐỀ MỤC SƯ PHẠM (CÔNG VĂN 5512):
       - Bắt buộc xuống dòng riêng biệt cho từng đề mục, tiểu mục. Tuyệt đối không viết dính liền trên cùng một dòng.
       - Bố cục phân cấp xuống dòng chuẩn mực:
         I. Mục tiêu
           1. Về kiến thức:
              - ...
           2. Về năng lực:
              a) Năng lực chung:
                 - ...
              b) Năng lực đặc thù:
                 - ...
              c) Năng lực số và Năng lực AI:
                 - ...
           3. Về phẩm chất:
              - ...
         II. Thiết bị dạy học và học liệu
           1. Giáo viên:
              - ...
           2. Học sinh:
              - ...
         III. Tiến trình dạy học
           Hoạt động 1: [Tên hoạt động] (Thời lượng: ... phút)
           a) Mục tiêu:
              - ...
           b) Nội dung:
              - ...
           c) Sản phẩm:
              - ...
           d) Tổ chức thực hiện:
              - Bước 1: Chuyển giao nhiệm vụ
                + GV ...
                + HS ...
              - Bước 2: Thực hiện nhiệm vụ
                + HS ...
              - Bước 3: Báo cáo, thảo luận
                + ...
              - Bước 4: Kết luận, nhận định
                + ...
         IV. Hồ sơ dạy học (Phiếu học tập, bảng đánh giá...)

    6. QUY TẮC CHÍNH TẢ, CHỮ HOA VÀ CHỮ THƯỜNG (CỰC KỲ QUAN TRỌNG):
       - TUYỆT ĐỐI KHÔNG VIẾT HOA TOÀN BỘ (CẤM ALL-CAPS) câu, đoạn văn hay nội dung văn bản.
       - Tuân thủ quy chuẩn chữ viết hành chính & sư phạm tiếng Việt (Sentence case):
         + Chỉ viết hoa chữ cái đầu câu, danh từ riêng hoặc tiêu đề chính ngắn (ví dụ: "I. Mục tiêu" hoặc "I. MỤC TIÊU", "Hoạt động 1: Khởi động", "Bước 1: Chuyển giao nhiệm vụ").
         + Toàn bộ nội dung diễn giải, mục tiêu, kiến thức, câu lệnh của giáo viên, hành động của học sinh, nội dung trong bảng PHẢI VIẾT CHỮ THƯỜNG TỰ NHIÊN (chỉ viết hoa chữ cái đầu câu), không được viết in hoa nguyên cả câu hay cả đoạn.
       - Giữ nguyên văn phong chuẩn mực sư phạm tiếng Việt.

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

  // Priority list of models: gemini-3.1-flash-lite has highest availability and fastest latency
  const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
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