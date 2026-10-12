import { GoogleGenAI, Type } from "@google/genai";
import { DIGITAL_COMPETENCIES, AI_COMPETENCIES } from "../constants";
import { LessonPlanResponse, MediaInput } from "../types";

export const generateEnhancedLessonPlan = async (
  input: { text: string; media: MediaInput[]; sessionDetails: string },
  selectedCompetencyIds: string[], 
  selectedAICompetencyIds: string[],
  focusArea?: string,
  targetActivity: string = 'act2',
  specificSubActivity: string = ''
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

  // Determine human-readable activity target instruction
  let activityScopeText = "";
  let targetActivityName = "";
  const subTarget = specificSubActivity?.trim();

  if (targetActivity === 'act1') {
    targetActivityName = "Hoạt động 1: Mở đầu (Khởi động)";
    activityScopeText = "CHỈ TÍCH HỢP VÀO HOẠT ĐỘNG 1 (MỞ ĐẦU / KHỞI ĐỘNG). TUYỆT ĐỐI BẢO LƯU NGUYÊN BẢN 100% HOẠT ĐỘNG 2, HOẠT ĐỘNG 3, HOẠT ĐỘNG 4 (KHÔNG TÍCH HỢP, KHÔNG CHÈN 👉 VÀO HOẠT ĐỘNG 2, 3, 4)!";
  } else if (targetActivity === 'act2') {
    targetActivityName = "Hoạt động 2: Hình thành kiến thức mới";
    if (subTarget) {
      activityScopeText = `CHỈ TÍCH HỢP VÀO ĐÚNG TIỂU HOẠT ĐỘNG: "${subTarget}" TRONG HOẠT ĐỘNG 2 (HÌNH THÀNH KIẾN THỨC MỚI).
👉 QUY TẮC BẮT BUỘC TỪ GIÁO VIÊN: Hoạt động hình thành kiến thức gồm rất nhiều hoạt động con. Giáo viên đã chỉ định cụ thể: "${subTarget}".
👉 BẠN CHỈ ĐƯỢC PHÉP TÍCH HỢP NLS VÀ NLAI VÀO DUY NHẤT HOẠT ĐỘNG CON "${subTarget}"!
👉 TUYỆT ĐỐI KHÔNG TÍCH HỢP VÀO TẤT CẢ CÁC HOẠT ĐỘNG CON CÒN LẠI CỦA PHẦN HÌNH THÀNH KIẾN THỨC (ví dụ: các hoạt động con khác như 2.2, 2.3, 2.4... phải giữ nguyên 100%, không chèn NLS/NLAI)!
👉 ĐỒNG THỜI BẢO LƯU NGUYÊN BẢN 100% HOẠT ĐỘNG 1, HOẠT ĐỘNG 3, HOẠT ĐỘNG 4!`;
    } else {
      activityScopeText = `CHỈ TÍCH HỢP VÀO 01 HOẠT ĐỘNG CON MÀ GIÁO VIÊN NHẬP HOẶC CHỈ ĐỊNH TRONG PHẦN HÌNH THÀNH KIẾN THỨC MỚI.
👉 QUY TẮC BẮT BUỘC TỪ GIÁO VIÊN: Trong hoạt động hình thành kiến thức của bài học có rất nhiều hoạt động con (ví dụ: 2.1, 2.2, 2.3, 2.4... hoặc Hoạt động 1, Hoạt động 2...).
👉 KHI GIÁO VIÊN CHỌN HOẠT ĐỘNG HÌNH THÀNH KIẾN THỨC, NHƯNG CHỈ NHẬP NỘI DUNG CỦA MỘT HOẠT ĐỘNG CON NÀO (hoặc chỉ định một hoạt động con nào), THÌ BẠN CHỈ THỰC HIỆN TÍCH HỢP NLS, NLAI VÀO ĐÚNG HOẠT ĐỘNG ĐÓ!
👉 TUYỆT ĐỐI KHÔNG ĐƯỢC TÍCH HỢP VÀO TẤT CẢ CÁC HOẠT ĐỘNG CỦA PHẦN HOẠT ĐỘNG HÌNH THÀNH KIẾN THỨC!
👉 TẤT CẢ CÁC HOẠT ĐỘNG CON CÒN LẠI CỦA PHẦN HÌNH THÀNH KIẾN THỨC VÀ CÁC HOẠT ĐỘNG 1, 3, 4 ĐỀU PHẢI ĐƯỢC GIỮ NGUYÊN BẢN 100%!`;
    }
  } else if (targetActivity === 'act3') {
    targetActivityName = "Hoạt động 3: Luyện tập";
    activityScopeText = "CHỈ TÍCH HỢP VÀO HOẠT ĐỘNG 3 (LUYỆN TẬP). TUYỆT ĐỐI BẢO LƯU NGUYÊN BẢN 100% HOẠT ĐỘNG 1, HOẠT ĐỘNG 2, HOẠT ĐỘNG 4 (KHÔNG TÍCH HỢP, KHÔNG CHÈN 👉 VÀO HOẠT ĐỘNG 1, 2, 4)!";
  } else if (targetActivity === 'act4') {
    targetActivityName = "Hoạt động 4: Vận dụng, tìm tòi mở rộng";
    activityScopeText = "CHỈ TÍCH HỢP VÀO HOẠT ĐỘNG 4 (VẬN DỤNG, TÌM TÒI MỞ RỘNG). TUYỆT ĐỐI BẢO LƯU NGUYÊN BẢN 100% HOẠT ĐỘNG 1, HOẠT ĐỘNG 2, HOẠT ĐỘNG 3 (KHÔNG TÍCH HỢP, KHÔNG CHÈN 👉 VÀO HOẠT ĐỘNG 1, 2, 3)!";
  } else {
    targetActivityName = "Toàn bộ bài học (Tất cả 4 hoạt động)";
    activityScopeText = "TÍCH HỢP VÀO CẢ 4 HOẠT ĐỘNG DẠY HỌC (HOẠT ĐỘNG 1, 2, 3, 4).";
  }

  // =========================================================================
  // IMAGE PRESERVATION TOKEN ENGINE:
  // Extract all base64 data URIs from input text so Gemini won't blow up token limits
  // or corrupt/lose image data. Replace with lightweight tokens and restore later.
  // =========================================================================
  const imageMap = new Map<string, string>();
  let imageCounter = 0;
  let textForAi = input.text || '';

  // 1. Matches markdown images: ![alt](data:image/... or http...)
  textForAi = textForAi.replace(
    /!\[([^\]]*)\]\((data:image\/[a-zA-Z0-9\+\/\=;:,]+|https?:\/\/[^\)\s]+)\)/gi,
    (_, alt, src) => {
      imageCounter++;
      const token = `__DOCX_IMG_PRESERVED_${imageCounter}__`;
      imageMap.set(token, src);
      return `![${alt || 'Hình ảnh'}](${token})`;
    }
  );

  // 2. Matches HTML img tags: <img src="data:image/..." ...>
  textForAi = textForAi.replace(
    /<img\s+[^>]*src=["'](data:image\/[a-zA-Z0-9\+\/\=;:,]+)["'][^>]*>/gi,
    (_, src) => {
      imageCounter++;
      const token = `__DOCX_IMG_PRESERVED_${imageCounter}__`;
      imageMap.set(token, src);
      return `![Hình ảnh](${token})`;
    }
  );

  // 3. Matches raw leftover long data:image URIs
  textForAi = textForAi.replace(
    /(data:image\/[a-zA-Z0-9\+\/\=;:,]{50,})/gi,
    (src) => {
      imageCounter++;
      const token = `__DOCX_IMG_PRESERVED_${imageCounter}__`;
      imageMap.set(token, src);
      return token;
    }
  );

  const systemInstruction = `
    Bạn là chuyên gia tư vấn sư phạm và tích hợp công nghệ giáo dục (Năng lực số - NLS, Năng lực Trí tuệ nhân tạo - AI) cao cấp của Bộ Giáo dục & Đào tạo.

    ========================================================================
    NGUYÊN TẮC BẤT DI BẤT DỊCH (ĐẶC BIỆT LƯU Ý VÀ TUYỆT ĐỐI TUÂN THỦ THEO YÊU CẦU NGƯỜI DÙNG):
    ========================================================================
    1. QUY TẮC PHẠM VI TÍCH HỢP (NGHIÊM NGẶT - CHỈ DUY NHẤT 01 HOẠT ĐỘNG / TIỂU HOẠT ĐỘNG ĐƯỢC CHỈ ĐỊNH):
       👉 HOẠT ĐỘNG ĐƯỢC CHỈ ĐỊNH: "${targetActivityName}${subTarget ? ` ➜ Tiểu hoạt động cụ thể: ${subTarget}` : ''}".
       👉 ${activityScopeText}
       👉 BẠN CHỈ ĐƯỢC TÍCH HỢP NLS VÀ NLAI VÀO ĐÚNG HOẠT ĐỘNG ĐÓ!
       👉 TUYỆT ĐỐI KHÔNG TÍCH HỢP CẢ BÀI.
       👉 ĐẶC BIỆT LƯU Ý ĐỐI VỚI HOẠT ĐỘNG HÌNH THÀNH KIẾN THỨC MỚI:
          - Trong hoạt động hình thành kiến thức của bài học thường có rất nhiều hoạt động con (ví dụ: Hoạt động 2.1, Hoạt động 2.2, Hoạt động 2.3, Hoạt động 2.4... hoặc tiểu hoạt động 1, 2, 3...).
          - Khi giáo viên chọn Hoạt động hình thành kiến thức, nhưng chỉ nhập một hoạt động nào (hoặc chỉ định một tiểu hoạt động cụ thể như Hoạt động 2.1):
            BẠN CHỈ ĐƯỢC THỰC HIỆN TÍCH HỢP NLS, NLAI VÀO ĐÚNG HOẠT ĐỘNG ĐÓ!
            TUYỆT ĐỐI KHÔNG ĐƯỢC TÍCH HỢP VÀO TẤT CẢ CÁC HOẠT ĐỘNG CỦA PHẦN HOẠT ĐỘNG HÌNH THÀNH KIẾN THỨC!
       👉 TẤT CẢ CÁC HOẠT ĐỘNG CÒN LẠI (bao gồm tất cả các hoạt động con khác trong phần hình thành kiến thức và các hoạt động 1, 3, 4) PHẢI ĐƯỢC GIỮ NGUYÊN 100% NGUYÊN BẢN TỪ BẢN GỐC (không chèn 👉, không chèn prompt AI, không chèn link công cụ số vào các hoạt động không được chọn).

    2. BẢO TOÀN NGUYÊN VĂN 100% NỘI DUNG, BỐ CỤC VÀ ĐỊNH DẠNG CỦA GIÁO ÁN GỐC:
       - BẠN PHẢI GIỮ NGUYÊN VẸN TỪNG CÂU, TỪNG CHỮ, TỪNG ĐỀ MỤC, TỪNG BẢNG BIỂU, TỪNG BƯỚC DẠY HỌC, TỪNG CÂU HỎI, TỪNG BÀI TẬP, TỪNG CÔNG THỨC HÓA HỌC/TOÁN HỌC CỦA BẢN GỐC.
       - TUYỆT ĐỐI KHÔNG ĐƯỢC TỰ Ý TÓM TẮT, KHÔNG CẮT XÉN, KHÔNG VIẾT LẠI (REWRITE), KHÔNG DIỄN ĐẠT LẠI THEO Ý MÌNH, KHÔNG BỎ BỚT BẤT KỲ ĐOẠN NÀO TRONG BẢN GỐC.
       - Nếu bản gốc có bảng (ví dụ bảng 2 cột "Hoạt động của giáo viên và học sinh | Dự kiến sản phẩm" hoặc bất kỳ bảng nào): BẮT BUỘC GIỮ NGUYÊN 100% CẤU TRÚC BẢNG ĐÓ VỚI ĐẦY ĐỦ CÁC CỘT VÀ TOÀN BỘ NỘI DUNG GỐC TRONG TỪNG Ô!
       - Nếu bản gốc là dạng văn bản (không dùng bảng): BẮT BUỘC GIỮ NGUYÊN DẠNG VĂN BẢN ĐÓ, không tự ý chuyển thành bảng.

    3. BẢO LƯU TUYỆT ĐỐI 100% TẤT CẢ CÁC THẺ HÌNH ẢNH:
       - Nếu trong bài có chứa các mã hình ảnh dạng \`![alt](__DOCX_IMG_PRESERVED_X__)\` hoặc bất kỳ thẻ ảnh nào: BẠN PHẢI GIỮ NGUYÊN 100% CÁC THẺ HÌNH ẢNH NÀY TẠI ĐÚNG VỊ TRÍ GỐC CỦA CHÚNG (kể cả trong các ô bảng hoặc trong các hoạt động).
       - TUYỆT ĐỐI KHÔNG ĐƯỢC XÓA BỎ, KHÔNG SỬA ĐỔI HOẶC BỎ BỚT BẤT KỲ MÃ THẺ HÌNH ẢNH NÀO!

    4. QUY CÁCH TÍCH HỢP BẮT BUỘC Ở HOẠT ĐỘNG ĐƯỢC CHỌN (ĐẦY ĐỦ CẢ 2 PHẦN):
       Ở đúng hoạt động được tích hợp (${targetActivityName}), BẮT BUỘC PHẢI THỰC HIỆN ĐỦ CẢ 2 NỘI DUNG SAU:

       a) ĐƯA NỘI DUNG TÍCH HỢP VÀO DƯỚI PHẦN MỤC TIÊU CỦA HOẠT ĐỘNG:
          - Đặt ngay dưới tên hoạt động và dưới mục "a) Mục tiêu:" (hoặc "Mục tiêu:") của hoạt động đó:
            * Năng lực số (NLS) và Năng lực AI cần đạt:
            - [Mã NLS]: [Mô tả chi tiết mục tiêu năng lực số HS đạt được trong hoạt động này]
            - [Mã NL AI]: [Mô tả chi tiết mục tiêu năng lực AI HS đạt được trong hoạt động này]
          (Đồng thời cập nhật tương ứng vào mục "I. MỤC TIÊU" chung ở phần đầu bài tại tiểu mục "c) Năng lực số và AI").

       b) PHẦN TỔ CHỨC THỰC HIỆN CỦA HOẠT ĐỘNG CẦN CÓ ĐẦY ĐỦ 3 PHẦN:
          👉 **Hoạt động của GV:**
             + Hướng dẫn nhiệm vụ số, cung cấp đường link không gian số (Padlet, Google Forms, mô phỏng PhET, GeoGebra, Canva).
             + Cung cấp mẹo câu lệnh mẫu (Prompt) hướng dẫn học sinh khai thác AI có định hướng sư phạm rõ ràng.
             + Nhắc nhở liêm chính học thuật và bảo mật dữ liệu cá nhân khi sử dụng công nghệ số và AI.
             + Hỗ trợ kỹ thuật kịp thời cho các nhóm học sinh.
             + Điều hành báo cáo sản phẩm số và đánh giá xác nhận.
             [Ghi rõ mã năng lực: [Mã ...] [NL AI: ...] tương ứng]

          👉 **Hoạt động của HS:**
             + Thao tác trực tiếp trên thiết bị số/công cụ AI.
             + Khai thác dữ liệu số.
             + Đọc và đối chiếu thông tin AI cung cấp với SGK để phản biện.
             + Làm việc nhóm tạo sản phẩm học tập (sơ đồ tư duy Canva, bảng tính Google Sheets, slide báo cáo).
             + Thu nhận sản phẩm và phản biện chéo nhóm bạn.
             [Ghi rõ mã năng lực: [Mã ...] [NL AI: ...] tương ứng]

          👉 **Thảo luận, báo cáo, kết luận nhận định của giáo viên:**
             + Đánh giá cụ thể chất lượng sản phẩm số của học sinh, nhận xét năng lực phản biện dữ liệu số và liêm chính học thuật.

    5. QUY TẮC ĐỊNH DẠNG BẢNG VÀ XUỐNG DÒNG:
       - Trong các ô bảng: Bắt buộc dùng thẻ <br> để ngăn cách các bước (**Bước 1: Chuyển giao nhiệm vụ**, **Bước 2: Thực hiện nhiệm vụ**, **Bước 3: Báo cáo, thảo luận**, **Bước 4: Kết luận, nhận định**), giữa hoạt động của GV (+ GV:) và HS (+ HS:), và nhiệm vụ tích hợp 👉. Tuyệt đối không viết dính liền nhau.
       - Cú pháp bảng Markdown bắt buộc chuẩn:
         | Tiêu đề cột 1 | Tiêu đề cột 2 |
         | :--- | :--- |
         | Nội dung ô 1 | Nội dung ô 2 |

    6. QUY CHUẨN CHỮ VIẾT:
       - Viết hoa chuẩn tiếng Việt (Sentence case), tuyệt đối không viết hoa toàn bộ (CẤM ALL-CAPS) cả câu hay cả đoạn.
       - Giữ nguyên vẹn các công thức hóa học, công thức toán học ($H_{2}SO_{4}$, $Al^{3+}$, $pH = -\\lg[H^{+}]$, $A = F \\cdot s \\cdot \\cos(\\alpha)$...).

    Khung năng lực số được chọn:
    ${digitalFrameworkContext || "Không chọn"}

    Khung năng lực AI được chọn:
    ${aiFrameworkContext || "Không chọn"}

    Yêu cầu bổ sung: ${focusArea || "Chỉ tích hợp vào đúng hoạt động chỉ định; giữ nguyên 100% định dạng, bố cục, bảng biểu và hình ảnh của file gốc"}
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

  const promptDirective = `YÊU CẦU TÍCH HỢP CHI TIẾT & BẢO TOÀN NGUYÊN BẢN TUYỆT ĐỐI:
1. ĐỌC KỸ BẢN GỐC: Bản gốc bao gồm toàn bộ nội dung trong tệp đính kèm và văn bản người dùng cung cấp.
2. PHẠM VI TÍCH HỢP RẤT QUAN TRỌNG (TUYỆT ĐỐI CHẤP HÀNH):
   👉 ${activityScopeText}
   👉 ĐẶC BIỆT: Nếu là Hoạt động Hình thành kiến thức mới (thường gồm nhiều hoạt động con 2.1, 2.2, 2.3...), KHI GIÁO VIÊN CHỈ NHẬP HOẶC CHỈ ĐỊNH 01 HOẠT ĐỘNG CON (${subTarget || 'hoạt động con được người dùng nhập'}), BẠN CHỈ THỰC HIỆN TÍCH HỢP NLS VÀ NLAI VÀO ĐÚNG HOẠT ĐỘNG ĐÓ!
   👉 TUYỆT ĐỐI KHÔNG ĐƯỢC TÍCH HỢP VÀO TẤT CẢ CÁC HOẠT ĐỘNG CỦA PHẦN HOẠT ĐỘNG HÌNH THÀNH KIẾN THỨC!
   👉 Tất cả các hoạt động con khác và các hoạt động 1, 3, 4 phải được GIỮ NGUYÊN 100% NỘI DUNG VÀ ĐỊNH DẠNG BAN ĐẦU!
3. Ở ĐÚNG HOẠT ĐỘNG ĐƯỢC TÍCH HỢP, CẦN ĐẢM BẢO:
   - Đưa nội dung tích hợp NLS và NLAI vào dưới phần mục tiêu của hoạt động đó (Mục tiêu NLS & AI).
   - Phần tổ chức thực hiện cần:
     👉 Hoạt động của GV: Hướng dẫn nhiệm vụ số, cung cấp đường link không gian số (Padlet, Google Forms, mô phỏng PhET, GeoGebra, Canva), mẹo câu lệnh mẫu (Prompt) hướng dẫn HS khai thác AI có định hướng, nhắc nhở liêm chính học thuật và bảo mật dữ liệu cá nhân, hỗ trợ kỹ thuật, điều hành báo cáo sản phẩm số và đánh giá xác nhận.
     👉 Hoạt động của HS: Thao tác trực tiếp trên thiết bị số/công cụ AI, khai thác dữ liệu số, đọc và đối chiếu thông tin AI cung cấp với SGK để phản biện, làm việc nhóm tạo sản phẩm học tập (sơ đồ tư duy Canva, bảng tính Google Sheets, slide báo cáo), thu nhận sản phẩm và phản biện chéo nhóm bạn.
     👉 Thảo luận, báo cáo, kết luận nhận định của giáo viên.
4. BẢO TỒN 100% TẤT CẢ CÁC MÃ THẺ HÌNH ẢNH: ![alt](__DOCX_IMG_PRESERVED_X__) tại đúng vị trí gốc của chúng trong bài.
5. GIỮ NGUYÊN CẤU TRÚC BẢNG BIỂU (dạng 2 cột) hoặc văn bản của bài học gốc.
${input.sessionDetails ? `Chi tiết phân bổ tiết học: ${input.sessionDetails}.` : ''}
${textForAi ? `\nNội dung văn bản / Giáo án gốc:\n${textForAi}` : ''}`;


  contentParts.push({ text: promptDirective });

  // Priority list of models: gemini-3.8-flash for highest fidelity text generation and instruction following
  const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-pro-preview", "gemini-3.1-flash-lite"];
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
          maxOutputTokens: 65536,
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
    for (const modelName of ["gemini-3.8-flash", "gemini-flash-latest"]) {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        response = await ai.models.generateContent({
          model: modelName,
          contents: [{ role: "user", parts: contentParts }],
          config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            maxOutputTokens: 65536,
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

  // =========================================================================
  // ROBUST JSON REPAIR & PARSE ENGINE:
  // Handles unterminated strings, partial truncation, or unescaped characters
  // =========================================================================
  const parseJsonSafely = (raw: string): LessonPlanResponse => {
    let text = raw.trim();
    // Strip markdown code fences if wrapped
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    // 1. Direct standard JSON.parse
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === 'object') return parsed as LessonPlanResponse;
    } catch (_) {
      // Continue to repair strategies
    }

    // 2. Extract content between first '{' and last '}'
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        const candidate = text.slice(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(candidate);
        if (parsed && typeof parsed === 'object') return parsed as LessonPlanResponse;
      } catch (_) {
        // Continue to bracket repair
      }
    }

    // 3. Bracket & String state repair for truncated JSON
    const s = firstBrace !== -1 ? text.slice(firstBrace) : text;
    let inString = false;
    let escape = false;
    const stack: string[] = [];

    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === '\\') {
        if (inString) escape = true;
        continue;
      }
      if (ch === '"') {
        inString = !inString;
        continue;
      }
      if (!inString) {
        if (ch === '{' || ch === '[') {
          stack.push(ch);
        } else if (ch === '}' && stack.length && stack[stack.length - 1] === '{') {
          stack.pop();
        } else if (ch === ']' && stack.length && stack[stack.length - 1] === '[') {
          stack.pop();
        }
      }
    }

    let repaired = s;
    if (escape) {
      repaired = repaired.slice(0, -1);
    }
    if (inString) {
      repaired += '"';
    }
    while (stack.length > 0) {
      const top = stack.pop();
      if (top === '{') repaired += '}';
      else if (top === '[') repaired += ']';
    }

    try {
      const parsed = JSON.parse(repaired);
      if (parsed && typeof parsed === 'object') return parsed as LessonPlanResponse;
    } catch (_) {
      // Continue to regex field salvage
    }

    // 4. Regex salvage for partial or truncated response
    const extractStringField = (fieldName: string): string => {
      const regex = new RegExp(`"${fieldName}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`);
      const match = text.match(regex);
      if (match) {
        try {
          return JSON.parse(`"${match[1]}"`);
        } catch {
          return match[1];
        }
      }
      return '';
    };

    const overview = extractStringField('overview');
    const lessonTitle = extractStringField('lessonTitle');
    const lessonDuration = extractStringField('lessonDuration');

    const planKeyPos = text.indexOf('"fullPlanContent"');
    if (planKeyPos !== -1) {
      const colonPos = text.indexOf(':', planKeyPos);
      const startQuote = text.indexOf('"', colonPos + 1);
      if (startQuote !== -1) {
        let planBody = text.slice(startQuote + 1);
        planBody = planBody.replace(/["}\]\s]+$/, '');
        const cleanContent = planBody
          .replace(/\\r\\n/g, '\n')
          .replace(/\\n/g, '\n')
          .replace(/\\t/g, '\t')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\');

        return {
          overview: overview || "Tích hợp Năng lực số và AI thành công.",
          lessonTitle: lessonTitle || "KẾ HOẠCH BÀI DẠY TÍCH HỢP",
          lessonDuration: lessonDuration || "Tiết học",
          fullPlanContent: cleanContent
        };
      }
    }

    throw new Error("Dữ liệu phản hồi từ AI không đúng định dạng JSON. Vui lòng nhấn 'Tích hợp ngay' để thử lại.");
  };

  const parsedResponse = parseJsonSafely(responseText);

  // =========================================================================
  // RESTORE IMAGES 100%:
  // Replace tokens back to the exact original base64 data URIs
  // =========================================================================
  if (parsedResponse && parsedResponse.fullPlanContent && imageMap.size > 0) {
    let restoredContent = parsedResponse.fullPlanContent;
    for (const [token, originalSrc] of imageMap.entries()) {
      restoredContent = restoredContent.replaceAll(token, originalSrc);
      // Also handle cases if AI stripped leading/trailing underscores: DOCX_IMG_PRESERVED_1
      const stripped = token.replace(/^_+|_+$/g, '');
      if (restoredContent.includes(stripped)) {
        restoredContent = restoredContent.replaceAll(stripped, originalSrc);
      }
    }
    parsedResponse.fullPlanContent = restoredContent;
  }

  return parsedResponse;
};