import { Competency } from './types';

// Based on "BẢNG MÃ CHỈ BÁO NĂNG LỰC SỐ THPT" (Văn bản 3456/BGDĐT-GDPT)
export const DIGITAL_COMPETENCIES: Competency[] = [
  // --- Domain I: Khai thác dữ liệu và thông tin ---
  { id: '1.1.NC1a', name: 'Đáp ứng được nhu cầu thông tin', domain: 'I. Khai thác dữ liệu & thông tin' },
  { id: '1.1.NC1b', name: 'Áp dụng được kỹ thuật tìm kiếm để lấy dữ liệu, thông tin trong môi trường số', domain: 'I. Khai thác dữ liệu & thông tin' },
  { id: '1.1.NC1c', name: 'Chỉ cho người khác cách truy cập và điều hướng dữ liệu, thông tin', domain: 'I. Khai thác dữ liệu & thông tin' },
  { id: '1.1.NC1d', name: 'Tự đề xuất được chiến lược tìm kiếm', domain: 'I. Khai thác dữ liệu & thông tin' },
  
  { id: '1.2.NC1a', name: 'Thực hiện đánh giá được độ tin cậy của nguồn dữ liệu, thông tin', domain: 'I. Khai thác dữ liệu & thông tin' },
  { id: '1.2.NC1b', name: 'Tiến hành đánh giá được các dữ liệu, thông tin số khác nhau', domain: 'I. Khai thác dữ liệu & thông tin' },
  
  { id: '1.3.NC1a', name: 'Thao tác được thông tin, dữ liệu để tổ chức, lưu trữ và truy xuất dễ dàng', domain: 'I. Khai thác dữ liệu & thông tin' },
  { id: '1.3.NC1b', name: 'Triển khai được việc tổ chức và sắp xếp dữ liệu trong môi trường có cấu trúc', domain: 'I. Khai thác dữ liệu & thông tin' },

  // --- Domain II: Giao tiếp và Hợp tác ---
  { id: '2.1.NC1a', name: 'Sử dụng được nhiều công nghệ số để tương tác', domain: 'II. Giao tiếp & Hợp tác' },
  { id: '2.1.NC1b', name: 'Cho người khác thấy phương tiện giao tiếp số phù hợp nhất cho bối cảnh cụ thể', domain: 'II. Giao tiếp & Hợp tác' },
  
  { id: '2.2.NC1a', name: 'Chia sẻ dữ liệu, thông tin thông qua nhiều công cụ số phù hợp', domain: 'II. Giao tiếp & Hợp tác' },
  { id: '2.2.NC1b', name: 'Hướng dẫn người khác cách đóng vai trò trung gian để chia sẻ thông tin', domain: 'II. Giao tiếp & Hợp tác' },
  { id: '2.2.NC1c', name: 'Áp dụng được nhiều phương pháp tham chiếu và ghi nguồn khác nhau', domain: 'II. Giao tiếp & Hợp tác' },
  
  { id: '2.3.NC1a', name: 'Đề xuất được các dịch vụ số khác nhau để tham gia vào xã hội', domain: 'II. Giao tiếp & Hợp tác' },
  { id: '2.3.NC1b', name: 'Sử dụng được các công nghệ số thích hợp để tự trang bị và tham gia vào xã hội', domain: 'II. Giao tiếp & Hợp tác' },
  
  { id: '2.4.NC1a', name: 'Đề xuất được các công cụ và công nghệ số khác nhau cho quá trình hợp tác', domain: 'II. Giao tiếp & Hợp tác' },
  
  { id: '2.5.NC1a', name: 'Áp dụng được các chuẩn mực hành vi và bí quyết khác nhau khi sử dụng công nghệ số', domain: 'II. Giao tiếp & Hợp tác' },
  { id: '2.5.NC1b', name: 'Áp dụng được các chiến lược giao tiếp khác nhau trong môi trường số phù hợp', domain: 'II. Giao tiếp & Hợp tác' },
  { id: '2.5.NC1c', name: 'Áp dụng được các khía cạnh đa dạng về văn hóa và thế hệ để xem xét trong môi trường số', domain: 'II. Giao tiếp & Hợp tác' },
  
  { id: '2.6.NC1a', name: 'Sử dụng được nhiều danh tính số khác nhau', domain: 'II. Giao tiếp & Hợp tác' },
  { id: '2.6.NC1b', name: 'Áp dụng được các cách khác nhau để bảo vệ danh tính trực tuyến', domain: 'II. Giao tiếp & Hợp tác' },
  { id: '2.6.NC1c', name: 'Sử dụng được dữ liệu tạo ra thông qua công cụ, môi trường và dịch vụ số', domain: 'II. Giao tiếp & Hợp tác' },

  // --- Domain III: Sáng tạo nội dung số ---
  { id: '3.1.NC1a', name: 'Áp dụng được các cách tạo và chỉnh sửa nội dung ở các định dạng khác nhau', domain: 'III. Sáng tạo nội dung số' },
  { id: '3.1.NC1b', name: 'Chỉ ra được những cách thể hiện bản thân thông qua việc tạo ra nội dung số', domain: 'III. Sáng tạo nội dung số' },
  
  { id: '3.2.NC1a', name: 'Làm việc với các mục nội dung mới, sửa đổi, cải thiện và tích hợp chúng', domain: 'III. Sáng tạo nội dung số' },
  
  { id: '3.3.NC1a', name: 'Áp dụng được các quy định khác nhau về bản quyền và giấy phép cho dữ liệu số', domain: 'III. Sáng tạo nội dung số' },
  
  { id: '3.4.NC1a', name: 'Tự thao tác được bằng các hướng dẫn dành cho hệ thống máy tính', domain: 'III. Sáng tạo nội dung số' },

  // --- Domain IV: An toàn ---
  { id: '4.1.NC1a', name: 'Áp dụng được các cách khác nhau để bảo vệ thiết bị và nội dung số', domain: 'IV. An toàn' },
  { id: '4.1.NC1b', name: 'Nhận thức được sự đa dạng của các rủi ro và đe dọa trong môi trường số', domain: 'IV. An toàn' },
  { id: '4.1.NC1c', name: 'Áp dụng được các biện pháp an toàn và bảo mật', domain: 'IV. An toàn' },
  { id: '4.1.NC1d', name: 'Sử dụng được các cách thức khác nhau để quan tâm đến mức độ tin cậy', domain: 'IV. An toàn' },
  
  { id: '4.2.NC1a', name: 'Áp dụng được các cách thức khác nhau để bảo vệ dữ liệu cá nhân', domain: 'IV. An toàn' },
  { id: '4.2.NC1b', name: 'Áp dụng được các cách thức đặc thù để chia sẻ dữ liệu cá nhân an toàn', domain: 'IV. An toàn' },
  { id: '4.2.NC1c', name: 'Giải thích được các tuyên bố trong chính sách quyền riêng tư', domain: 'IV. An toàn' },
  
  { id: '4.3.NC1a', name: 'Trình bày được các cách thức khác nhau để tránh rủi ro sức khỏe thể chất/tinh thần', domain: 'IV. An toàn' },
  { id: '4.3.NC1b', name: 'Áp dụng được các cách thức khác nhau để bảo vệ bản thân khỏi nguy cơ mạng', domain: 'IV. An toàn' },
  { id: '4.3.NC1c', name: 'Trình bày được các công nghệ số giúp tăng cường thịnh vượng và hòa hợp xã hội', domain: 'IV. An toàn' },
  
  { id: '4.4.NC1a', name: 'Trình bày được các cách thức khác nhau để bảo vệ môi trường khỏi tác động công nghệ', domain: 'IV. An toàn' },

  // --- Domain V: Giải quyết vấn đề ---
  { id: '5.1.NC1a', name: 'Đánh giá được các vấn đề kỹ thuật khi sử dụng môi trường số', domain: 'V. Giải quyết vấn đề' },
  { id: '5.1.NC1b', name: 'Áp dụng được các giải pháp khác nhau cho vấn đề kỹ thuật', domain: 'V. Giải quyết vấn đề' },
  
  { id: '5.2.NC1a', name: 'Đánh giá được nhu cầu công nghệ cá nhân', domain: 'V. Giải quyết vấn đề' },
  { id: '5.2.NC1b', name: 'Áp dụng được các công cụ số và giải pháp công nghệ để giải quyết nhu cầu', domain: 'V. Giải quyết vấn đề' },
  { id: '5.2.NC1c', name: 'Sử dụng được các cách khác nhau để điều chỉnh môi trường số theo nhu cầu', domain: 'V. Giải quyết vấn đề' },
  
  { id: '5.3.NC1a', name: 'Áp dụng được các công cụ và công nghệ số để tạo ra kiến thức mới', domain: 'V. Giải quyết vấn đề' },
  { id: '5.3.NC1b', name: 'Áp dụng xử lý nhận thức của cá nhân/tập thể để giải quyết vấn đề khái niệm', domain: 'V. Giải quyết vấn đề' },
  
  { id: '5.4.NC1a', name: 'Chứng minh được NLS của tôi cần được cải thiện hoặc cập nhật ở đâu', domain: 'V. Giải quyết vấn đề' },
  { id: '5.4.NC1b', name: 'Minh họa được những cách khác nhau để hỗ trợ người khác phát triển NLS', domain: 'V. Giải quyết vấn đề' },
  { id: '5.4.NC1c', name: 'Đề xuất được các cơ hội khác nhau để phát triển bản thân', domain: 'V. Giải quyết vấn đề' },

  // --- Domain VI: Ứng dụng AI ---
  { id: '6.1.NC1a', name: 'Phân tích được cách AI hoạt động trong các ứng dụng cụ thể', domain: 'VI. Ứng dụng AI' },
  { id: '6.1.NC1b', name: 'So sánh được các hệ thống AI khác nhau và cách chúng xử lý dữ liệu', domain: 'VI. Ứng dụng AI' },
  
  { id: '6.2.NC1a', name: 'Phát triển được các ứng dụng AI tùy chỉnh để giải quyết vấn đề cụ thể', domain: 'VI. Ứng dụng AI' },
  { id: '6.2.NC1b', name: 'Điều chỉnh được các hệ thống AI để phù hợp với nhu cầu cụ thể', domain: 'VI. Ứng dụng AI' },
  { id: '6.2.NC1c', name: 'Đánh giá và giảm thiểu được các rủi ro đạo đức và pháp lý của AI', domain: 'VI. Ứng dụng AI' },
  
  { id: '6.3.NC1a', name: 'Đánh giá được độ chính xác và tin cậy của các hệ thống AI', domain: 'VI. Ứng dụng AI' },
  { id: '6.3.NC1b', name: 'Xem xét được các kết quả và đưa ra nhận xét về hiệu quả của hệ thống AI', domain: 'VI. Ứng dụng AI' }
];

export const AI_COMPETENCIES: Competency[] = [
  // --- LỚP 10 ---
  { id: '10.A1.1', name: 'Thực hành xác định vai trò của con người trong sử dụng, vận hành, tùy chỉnh hệ thống AI', domain: 'Lớp 10 - A. Tư duy lấy con người làm trung tâm' },
  { id: '10.A1.2', name: 'Giải thích tầm quan trọng của việc con người kiểm soát AI (an toàn, công bằng, quyền lợi)', domain: 'Lớp 10 - A. Tư duy lấy con người làm trung tâm' },
  { id: '10.A2.1', name: 'Nêu rủi ro đối với con người, xã hội mà sản phẩm AI có thể đem lại', domain: 'Lớp 10 - A. Tư duy lấy con người làm trung tâm' },
  { id: '10.A2.MR1', name: 'Nêu biện pháp hạn chế rủi ro đối với con người, xã hội qua dự án sáng tạo AI', domain: 'Lớp 10 - A. Tư duy lấy con người làm trung tâm' },
  { id: '10.A3.1', name: 'Kể tên quy định/luật lệ bảo vệ người dùng trong không gian số (Luật An ninh mạng, Dữ liệu...)', domain: 'Lớp 10 - A. Tư duy lấy con người làm trung tâm' },
  
  { id: '10.B2.1', name: 'Nêu ví dụ hành vi sử dụng AI vi phạm quy định trường học hoặc pháp luật', domain: 'Lớp 10 - B. Đạo đức AI' },
  { id: '10.B2.MR1', name: 'Nhận biết dấu hiệu nội dung AI tạo sinh; kiểm tra mức độ minh bạch khi khai báo sử dụng AI', domain: 'Lớp 10 - B. Đạo đức AI' },
  { id: '10.B3.1', name: 'Trình bày ví dụ vấn đề đạo đức khi thiết kế/vận hành AI (thiên vị, riêng tư, minh bạch)', domain: 'Lớp 10 - B. Đạo đức AI' },

  { id: '10.C2.1', name: 'Xác định vấn đề thực tế có thể ứng dụng AI (nông nghiệp, cộng đồng thiểu số...)', domain: 'Lớp 10 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '10.C2.2', name: 'Liệt kê tên các ứng dụng AI theo tính năng hệ thống', domain: 'Lớp 10 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '10.C2.MR1', name: 'Xác định yêu cầu cần có đối với việc ứng dụng AI thực hiện nhiệm vụ cụ thể', domain: 'Lớp 10 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '10.C2.3', name: 'Nêu ví dụ trường hợp sử dụng AI hỗ trợ quá trình học tập', domain: 'Lớp 10 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '10.C2.MR2', name: 'Sử dụng được một số ứng dụng AI trong học tập', domain: 'Lớp 10 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '10.C3.1', name: 'Mô tả yêu cầu để đưa ra prompt phù hợp với mục tiêu cụ thể', domain: 'Lớp 10 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '10.C3.2', name: 'Thực hành đặt prompt giải quyết vấn đề gần gũi trong cuộc sống, học tập', domain: 'Lớp 10 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '10.C3.3', name: 'Phân biệt AI tạo sinh với hệ thống AI phân loại, dự đoán qua ví dụ cụ thể', domain: 'Lớp 10 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '10.C3.MR1', name: 'Trình bày ví dụ mô tả một số công nghệ để thiết kế và tạo AI', domain: 'Lớp 10 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '10.C4.1', name: 'Phân tích ảnh hưởng của chất lượng dữ liệu đến chất lượng AI', domain: 'Lớp 10 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '10.C4.MR1', name: 'Phân tích các dạng dữ liệu (hình ảnh, âm thanh, từ ngữ...) dùng để huấn luyện AI', domain: 'Lớp 10 - C. Các kĩ thuật và ứng dụng AI' },

  { id: '10.D1.1', name: 'Xác định nhiệm vụ/mục tiêu hệ thống AI; nêu mối liên hệ giữa mục tiêu và thành phần hệ thống', domain: 'Lớp 10 - D. Thiết kế hệ thống AI' },
  { id: '10.D2.1', name: 'Mô tả thành phần cơ bản của hệ thống AI (dữ liệu, mô hình, thuật toán, đầu ra, phản hồi)', domain: 'Lớp 10 - D. Thiết kế hệ thống AI' },
  { id: '10.D2.2', name: 'Nêu ví dụ vấn đề phát sinh khi vận hành/tối ưu AI; ý nghĩa việc khắc phục vấn đề', domain: 'Lớp 10 - D. Thiết kế hệ thống AI' },

  // --- LỚP 11 ---
  { id: '11.A1.1', name: 'Xây dựng quy trình sử dụng sản phẩm AI cụ thể một cách thích hợp', domain: 'Lớp 11 - A. Tư duy lấy con người làm trung tâm' },
  { id: '11.A1.2', name: 'Phân tích tầm quan trọng của việc dùng AI nâng cao năng lực mà vẫn kiểm soát được AI', domain: 'Lớp 11 - A. Tư duy lấy con người làm trung tâm' },
  { id: '11.A2.1', name: 'Nêu ví dụ ứng dụng AI có tác động tích cực, lợi ích xã hội lâu dài', domain: 'Lớp 11 - A. Tư duy lấy con người làm trung tâm' },
  { id: '11.A2.2', name: 'Phân tích tính bền vững và công bằng của hệ thống AI (năng lượng, môi trường, bình đẳng)', domain: 'Lớp 11 - A. Tư duy lấy con người làm trung tâm' },
  { id: '11.A3.1', name: 'Trình bày quyền cơ bản của người dùng dữ liệu (biết, đồng ý, xóa dữ liệu...)', domain: 'Lớp 11 - A. Tư duy lấy con người làm trung tâm' },
  { id: '11.A3.MR1', name: 'Phân tích mức độ đảm bảo quyền cơ bản người dùng qua dự án sáng tạo AI', domain: 'Lớp 11 - A. Tư duy lấy con người làm trung tâm' },

  { id: '11.B2.1', name: 'Nhận biết, phân loại rủi rơ/sự cố khi dùng AI dẫn đến vi phạm quy định hoặc pháp luật', domain: 'Lớp 11 - B. Đạo đức AI' },
  { id: '11.B3.MR1', name: 'Xác định và sơ đồ hoá vấn đề đạo đức phátsinh trong thiết kế và vận hành AI', domain: 'Lớp 11 - B. Đạo đức AI' },

  { id: '11.C2.1', name: 'Trình bày cách AI hỗ trợ quá trình học tập và thiết kế công cụ hỗ trợ', domain: 'Lớp 11 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '11.C2.2', name: 'Đề xuất tính năng AI hỗ trợ hoạt động học tập', domain: 'Lớp 11 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '11.C2.MR1', name: 'Sử dụng công cụ AI tạo/biên tập học liệu phục vụ học tập và đánh giá', domain: 'Lớp 11 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '11.C3.1', name: 'Xác định kĩ thuật prompt nâng cao (ràng buộc định dạng, chia nhỏ nhiệm vụ)', domain: 'Lớp 11 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '11.C3.MR1', name: 'Vận dụng kĩ thuật prompt nâng cao vào thực tế học tập/công việc', domain: 'Lớp 11 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '11.C3.2', name: 'Mô tả công nghệ AI cơ bản (chatbot, NLP, CV, cảm biến)', domain: 'Lớp 11 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '11.C3.MR2', name: 'Phân tích cách các công nghệ AI vận hành trong hệ thống', domain: 'Lớp 11 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '11.C3.MR3', name: 'Xác định phương pháp tùy chỉnh hệ thống AI (dữ liệu, tham số, RAG...)', domain: 'Lớp 11 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '11.C3.MR4', name: 'Trình bày khái niệm RAG và vai trò giảm sai lệch thông tin', domain: 'Lớp 11 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '11.C5.1', name: 'Nêu ứng dụng của mạng nơ-ron nhân tạo', domain: 'Lớp 11 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '11.C5.MR1', name: 'Trình bày kiến thức cơ bản về mạng nơ-ron nhân tạo', domain: 'Lớp 11 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '11.C5.2', name: 'Nêu ứng dụng thuật toán phân cụm và phân lớp', domain: 'Lớp 11 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '11.C5.MR2', name: 'Trình bày kiến thức cơ bản về thuật toán phân cụm, phân lớp và ý tưởng thực hiện', domain: 'Lớp 11 - C. Các kĩ thuật và ứng dụng AI' },

  { id: '11.D1.1', name: 'Trình bày cách thiết kế/vận hành tổng thể hệ thống AI (mối quan hệ mục tiêu, dữ liệu, thành phần)', domain: 'Lớp 11 - D. Thiết kế hệ thống AI' },
  { id: '11.D2.1', name: 'Trình bày cách vận hành công nghệ trong AI; mối liên hệ giữa các thành phần khi thực hiện nhiệm vụ', domain: 'Lớp 11 - D. Thiết kế hệ thống AI' },
  { id: '11.D2.MR1', name: 'Trình bày cách giải quyết vấn đề phát sinh của hệ thống AI nhằm tối ưu hoá hiệu quả', domain: 'Lớp 11 - D. Thiết kế hệ thống AI' },

  // --- LỚP 12 ---
  { id: '12.A1.1', name: 'Phân tích hệ thống AI đảm bảo con người kiểm soát/chịu trách nhiệm mọi bước quan trọng', domain: 'Lớp 12 - A. Tư duy lấy con người làm trung tâm' },
  { id: '12.A1.MR1', name: 'Phân tích quyền kiểm soát/trách nhiệm con người trong vòng đời AI qua dự án sáng tạo', domain: 'Lớp 12 - A. Tư duy lấy con người làm trung tâm' },
  { id: '12.A1.2', name: 'Phân tích vai trò con người và AI trong các bước chính của quá trình ra quyết định', domain: 'Lớp 12 - A. Tư duy lấy con người làm trung tâm' },
  { id: '12.A1.3', name: 'Kiểm tra việc thực hiện trách nhiệm giải trình của con người, đối chiếu quy định trong/ngoài nước', domain: 'Lớp 12 - A. Tư duy lấy con người làm trung tâm' },
  { id: '12.A2.1', name: 'Trình bày nguyên tắc đạo đức cơ bản thiết kế AI (an toàn, công bằng, minh bạch, riêng tư, trách nhiệm, lợi ích xã hội)', domain: 'Lớp 12 - A. Tư duy lấy con người làm trung tâm' },
  { id: '12.A2.MR1', name: 'Soạn thảo bộ nguyên tắc cá nhân cho dự án AI; đối chiếu/điều chỉnh khi có nguy cơ vi phạm', domain: 'Lớp 12 - A. Tư duy lấy con người làm trung tâm' },
  { id: '12.A3.1', name: 'Phân tích nội hàm "trách nhiệm công dân xã hội AI" (an toàn, trung thực, đạo đức, riêng tư...)', domain: 'Lớp 12 - A. Tư duy lấy con người làm trung tâm' },

  { id: '12.B1.MR1', name: 'Phân tích nguyên nhân dẫn đến vấn đề đạo đức/sai lệch trong hoạt động hệ thống AI', domain: 'Lớp 12 - B. Đạo đức AI' },
  { id: '12.B2.1', name: 'Xác định mức độ rủi ro khi dùng AI dẫn đến vi phạm quy định trường học/pháp luật', domain: 'Lớp 12 - B. Đạo đức AI' },
  { id: '12.B3.1', name: 'Trình bày quyền/trách nhiệm người phát triển/sử dụng AI; vai trò cá nhân góp ý xây dựng chính sách AI', domain: 'Lớp 12 - B. Đạo đức AI' },

  { id: '12.C2.1', name: 'Lựa chọn ý tưởng thiết kế công cụ AI để thực hiện công việc khác nhau', domain: 'Lớp 12 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '12.C2.MR1', name: 'Tùy chỉnh yêu cầu hệ thống AI để hỗ trợ học tập và hoạt động xã hội', domain: 'Lớp 12 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '12.C3.1', name: 'Nêu công cụ mã nguồn mở/miễn phí thiết kế AI (Teachable Machine, ML5.js, TensorFlow.js...)', domain: 'Lớp 12 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '12.C3.MR1', name: 'Sử dụng công cụ mã nguồn mở/miễn phí thiết kế, huấn luyện, phát triển hệ thống AI', domain: 'Lớp 12 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '12.C3.2', name: 'Nêu ví dụ về cách thức đánh giá hiệu quả của hệ thống AI', domain: 'Lớp 12 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '12.C3.MR2', name: 'Đánh giá khả năng tối ưu hệ thống AI thông qua cập nhật công nghệ, kĩ thuật mới', domain: 'Lớp 12 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '12.C3.MR3', name: 'Trình bày khái niệm cơ bản học máy (hàm mục tiêu, tối ưu hoá, overfitting)', domain: 'Lớp 12 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '12.C4.MR1', name: 'Thu thập và tổ chức dữ liệu đáp ứng yêu cầu phát triển hệ thống AI', domain: 'Lớp 12 - C. Các kĩ thuật và ứng dụng AI' },
  { id: '12.C4.MR2', name: 'Phân tích/xác định nền tảng/công cụ phát triển AI, cải thiện bộ dữ liệu', domain: 'Lớp 12 - C. Các kĩ thuật và ứng dụng AI' },

  { id: '12.D1.1', name: 'Nhận biết phương án thiết kế/vận hành AI phù hợp để đạt hiệu quả cao trong nhiệm vụ cụ thể', domain: 'Lớp 12 - D. Thiết kế hệ thống AI' },
  { id: '12.D1.MR1', name: 'Phân tích phương án thiết kế/vận hành AI phù hợp để đạt hiệu quả cao', domain: 'Lớp 12 - D. Thiết kế hệ thống AI' },
  { id: '12.D2.1', name: 'Nhận biết vai trò khác nhau trong phát triển AI; sự hợp tác giữa nhiều chuyên môn', domain: 'Lớp 12 - D. Thiết kế hệ thống AI' },
  { id: '12.D2.MR1', name: 'Phân tích nguyên nhân vấn đề phátsinh; lựa chọn cách giải quyết tối ưu hệ thống', domain: 'Lớp 12 - D. Thiết kế hệ thống AI' },
  { id: '12.D2.MR2', name: 'Trình bày khả năng và cấu trúc cơ bản của một hệ thống tác nhân AI (AI agent)', domain: 'Lớp 12 - D. Thiết kế hệ thống AI' },
  { id: '12.D2.MR3', name: 'Xây dựng và kiểm thử hệ thống tác nhân AI đơn giản phục vụ học tập/cộng đồng', domain: 'Lớp 12 - D. Thiết kế hệ thống AI' },
];

export const DEFAULT_LESSON_PLAN = '';

export const SAMPLE_LESSON_PLAN = '';