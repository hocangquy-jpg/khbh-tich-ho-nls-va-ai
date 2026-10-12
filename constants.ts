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

// Hình ảnh minh họa thí nghiệm chuẩn (Data URI PNG)
export const SAMPLE_EXPERIMENT_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAB4CAYAAADWq7Z4AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAPSURBVHic7cEBDQAAAMKg909tDwcUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgDcbSAABbZk2sQAAAABJRU5ErkJggg==';

export const SAMPLE_LESSON_PLAN = `SỞ GD&ĐT THỪA THIÊN HUẾ - TRƯỜNG THPT CHU VĂN AN
TỔ CHUYÊN MÔN: VẬT LÍ - CÔNG NGHỆ

# KẾ HOẠCH BÀI DẠY
## BÀI 15: NĂNG LƯỢNG VÀ CÔNG CƠ HỌC
**Môn học:** Vật lí; **Lớp:** 10
**Thời lượng thực hiện:** 02 tiết

---

### I. MỤC TIÊU
#### 1. Về kiến thức:
- Nêu được khái niệm năng lượng, công cơ học và điều kiện có công cơ học.
- Viết được công thức tính công cơ học $A = F \\cdot s \\cdot \\cos(\\alpha)$, giải thích được các đại lượng và đơn vị đo Joule (J).
- Phân tích được các trường hợp công phát động ($\\alpha < 90^\\circ$), công cản ($\\alpha > 90^\\circ$) và công triệt tiêu ($\\alpha = 90^\\circ$).

#### 2. Về năng lực chung:
- **Năng lực tự chủ và tự học:** Chủ động tra cứu, khai thác thông tin và tài liệu học tập số.
- **Năng lực giao tiếp và hợp tác:** Làm việc nhóm hiệu quả, phân công nhiệm vụ rõ ràng khi thực hiện báo cáo số.
- **Năng lực giải quyết vấn đề và sáng tạo:** Đề xuất được giải pháp tính toán và ứng dụng công cơ học trong thực tế.

#### 3. Về năng lực số (NLS) và Năng lực AI:
- **[Mã 1.1.NC1a]:** Khai thác dữ liệu & thông tin - Tìm kiếm, tra cứu tài liệu học tập và số liệu thực tế trên môi trường số.
- **[Mã 3.1.NC1a]:** Sáng tạo nội dung số - Thiết kế sơ đồ tư duy hoặc infographic tổng hợp kiến thức bài học bằng công cụ số (Canva/Padlet).
- **[Mã 5.3.NC1a]:** Giải quyết vấn đề - Ứng dụng công nghệ số và phần mềm mô phỏng để giải quyết bài toán vật lí.
- **[NL AI: 10.A1.1]:** Tư duy lấy con người làm trung tâm - Xác định vai trò của con người trong việc kiểm soát, kiểm chứng thông tin từ hệ thống AI.
- **[NL AI: 10.B2.MR1]:** Đạo đức AI - Kiểm tra tính chính xác và đối chiếu nội dung do AI tạo sinh với nguồn học liệu SGK chính thống.

#### 4. Về phẩm chất:
- Chăm chỉ, trách nhiệm, trung thực và liêm chính học thuật khi sử dụng công nghệ số và trí tuệ nhân tạo.

---

### II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
- **Giáo viên:**
  + Máy tính kết nối Internet, máy chiếu/Tivi tương tác.
  + Kế hoạch bài dạy số, bài giảng điện tử (PowerPoint/Canva), video thí nghiệm lực thực hiện công.
  + Đường link không gian học tập số Padlet và phiếu bài tập tương tác trên Google Forms/Quizizz.
  + Câu lệnh gợi ý (Prompt mẫu) hướng dẫn học sinh sử dụng công cụ AI (Gemini/ChatGPT) để tra cứu mở rộng có định hướng.
- **Học sinh:**
  + SGK Vật lí 10, vở ghi, đồ dùng học tập.
  + Điện thoại thông minh hoặc máy tính bảng kết nối Internet (theo nhóm học tập).

---

### III. TIẾN TRÌNH DẠY HỌC

| Hoạt động của giáo viên và học sinh | Dự kiến sản phẩm |
| :--- | :--- |
| **HOẠT ĐỘNG 1: MỞ ĐẦU (KHỞI ĐỘNG) (10 phút)**<br><br>**Bước 1: Chuyển giao nhiệm vụ**<br>+ GV: Chiếu hình ảnh các trường hợp tác dụng lực trong đời sống (người đẩy xe hàng, lực sĩ nâng tạ, vệ tinh quay quanh Trái Đất).<br><br>![Hình 1. Thí nghiệm người kéo xe và nâng vật thực hiện công](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAB4CAYAAADWq7Z4AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAPSURBVHic7cEBDQAAAMKg909tDwcUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgDcbSAABbZk2sQAAAABJRU5ErkJggg==)<br><br>👉 **Hoạt động của GV:** Hướng dẫn HS truy cập đường link bảng tương tác Padlet của lớp để gửi nhanh nhận định: Trong các trường hợp trên, trường hợp nào lực tác dụng đã sinh công? [Mã 1.1.NC1a]<br>👉 **Hoạt động của HS:** Sử dụng thiết bị số quét mã QR để vào link Padlet, quan sát hình ảnh và chuẩn bị câu trả lời.<br><br>**Bước 2: Thực hiện nhiệm vụ**<br>+ HS: Làm việc cá nhân trong 2 phút, suy nghĩ và nhập câu trả lời lên Padlet.<br>👉 **Hoạt động của HS:** Thao tác trên điện thoại/máy tính gửi ý kiến lên không gian số chung [Mã 2.1.NC1a].<br>👉 **Hoạt động của GV:** Theo dõi màn hình Padlet thời gian thực, tổng hợp các luồng ý kiến khác nhau của học sinh.<br><br>**Bước 3: Báo cáo, thảo luận**<br>+ GV: Mời 2 học sinh có nhận định khác nhau trình bày lí do vì sao chọn hoặc không chọn.<br>+ HS: Trình bày và đối chiếu ý kiến với các bạn trong lớp.<br><br>**Bước 4: Kết luận, nhận định**<br>+ GV: Nhận xét câu trả lời, dẫn dắt vào bài mới: Để biết chính xác khi nào một lực thực hiện công và độ lớn của công tính như thế nào, chúng ta cùng nghiên cứu Bài 15. | **Sản phẩm của Hoạt động 1:**<br>- Câu trả lời của học sinh trên bảng tương tác Padlet.<br>- Nhận thức ban đầu: Để sinh công cơ học, lực phải làm cho vật chuyển dời theo một hướng xác định. |
| **HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI (45 phút)**<br><br>**1. Khái niệm công cơ học và công thức tính công**<br><br>**Bước 1: Chuyển giao nhiệm vụ**<br>+ GV: Yêu cầu học sinh đọc mục I trong SGK, kết hợp quan sát sơ đồ phân tích lực khi kéo vật chuyển dời trên mặt phẳng ngang.<br><br>![Hình 2. Sơ đồ phân tích lực kéo F hợp với hướng chuyển dời góc alpha](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAB4CAYAAADWq7Z4AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAPSURBVHic7cEBDQAAAMKg909tDwcUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgDcbSAABbZk2sQAAAABJRU5ErkJggg==)<br><br>👉 **Hoạt động của GV:**<br>- Giao nhiệm vụ cho các nhóm: Sử dụng công cụ AI (Gemini/ChatGPT) với câu lệnh gợi ý (Prompt): *"Giải thích ý nghĩa vật lí của góc alpha trong công thức tính công cơ học A = F.s.cos(alpha) khi alpha nhọn, vuông và tù. Nêu ví dụ thực tế minh họa."* [NL AI: 10.A1.1]<br>- Nhắc nhở HS: Cần đối chiếu kỹ thông tin AI phản hồi với nội dung mục I trong SGK để xác nhận tính chính xác [NL AI: 10.B2.MR1].<br>👉 **Hoạt động của HS:** Đại diện các nhóm tiếp nhận nhiệm vụ, mở ứng dụng AI và nhập câu lệnh gợi ý theo hướng dẫn của GV.<br><br>**Bước 2: Thực hiện nhiệm vụ**<br>+ HS: Làm việc theo nhóm 4 học sinh, thảo luận và ghi kết quả vào phiếu học tập số.<br>👉 **Hoạt động của HS:**<br>- Nhập lệnh vào AI, đọc câu trả lời và ghi chú các ý chính [Mã 1.1.NC1a].<br>- Đối chiếu kết quả của AI với định nghĩa trong SGK: chỉ ra điểm AI giải thích rõ và phát hiện các điểm cần diễn đạt chuẩn xác theo thuật ngữ SGK [Mã 6.3.NC1a] [NL AI: 10.B2.MR1].<br>- Tổng hợp bảng phân loại các trường hợp của công (công phát động, công cản, công triệt tiêu) vào slide báo cáo nhóm trên Canva [Mã 3.1.NC1a] [Mã 5.3.NC1a].<br>👉 **Hoạt động của GV:** Quan sát các nhóm làm việc, hướng dẫn HS cách tinh chỉnh câu lệnh khi kết quả AI đưa ra chưa rõ ràng; giám sát việc sử dụng thiết bị đúng mục đích học tập.<br><br>**Bước 3: Báo cáo, thảo luận**<br>+ HS: Đại diện Nhóm 1 chiếu slide báo cáo; Nhóm 2 phản biện; các nhóm khác nhận xét.<br>👉 **Hoạt động của GV:** Điều hành phần thảo luận, hướng dẫn học sinh nhận xét không chỉ về kiến thức Vật lí mà còn về việc chọn lọc thông tin thông minh từ AI.<br><br>**Bước 4: Kết luận, nhận định**<br>+ GV: Chuẩn hóa kiến thức:<br>  - Công thức: $A = F \\cdot s \\cdot \\cos(\\alpha)$. Đơn vị: $1\\text{ J} = 1\\text{ N} \\cdot 1\\text{ m}$.<br>  - Khi $0^\\circ \\le \\alpha < 90^\\circ \\Rightarrow \\cos(\\alpha) > 0 \\Rightarrow A > 0$: Công phát động.<br>  - Khi $\\alpha = 90^\\circ \\Rightarrow \\cos(\\alpha) = 0 \\Rightarrow A = 0$: Lực không sinh công.<br>  - Khi $90^\\circ < \\alpha \\le 180^\\circ \\Rightarrow \\cos(\\alpha) < 0 \\Rightarrow A < 0$: Công cản.<br>+ HS: Ghi chép nội dung chuẩn hóa vào vở học tập. | **Sản phẩm của Hoạt động 2:**<br>- Bảng phân tích các trường hợp của công cơ học của các nhóm.<br>- Slide báo cáo số trên Canva hoặc file tóm tắt của nhóm.<br>- Ghi nhớ kiến thức chuẩn hóa:<br>  + Công thức tính công: $A = F \\cdot s \\cdot \\cos(\\alpha)$.<br>  + Đơn vị đo công trong hệ SI: Joule (J).<br>  + Ý nghĩa dấu của công: $A > 0$ (phát động), $A < 0$ (cản), $A = 0$ (không sinh công). |
| **HOẠT ĐỘNG 3: LUYỆN TẬP (20 phút)**<br><br>**Bước 1: Chuyển giao nhiệm vụ**<br>+ GV: Giao hệ thống 5 câu hỏi trắc nghiệm và 1 bài tập tự luận tính công cơ học:<br>  *Bài toán:* Một người kéo một hòm gỗ khối lượng $m = 20\\text{ kg}$ trượt đều trên sàn nhà bằng một sợi dây hợp với phương ngang một góc $\\alpha = 30^\\circ$. Lực kéo $F = 50\\text{ N}$. Tính công của lực kéo và công của lực ma sát khi hòm trượt được quãng đường $s = 10\\text{ m}$. Cho hệ số ma sát $\\mu = 0,2$ và $g = 9,8\\text{ m/s}^2$.<br>👉 **Hoạt động của GV:** Cung cấp mã bài kiểm tra trên hệ thống Quizizz/Google Forms để học sinh làm bài cá nhân và chấm điểm tự động [Mã 1.1.NC1a].<br>👉 **Hoạt động của HS:** Truy cập hệ thống bài tập trực tuyến bằng điện thoại/máy tính cá nhân.<br><br>**Bước 2: Thực hiện nhiệm vụ**<br>+ HS: Làm bài trắc nghiệm trực tuyến trong 7 phút, sau đó giải bài tập tự luận ra vở nháp.<br>👉 **Hoạt động của HS:** Giải bài và nộp kết quả trực tiếp trên hệ thống khảo sát số.<br>👉 **Hoạt động của GV:** Theo dõi bảng thống kê thời gian thực của Quizizz, xác định ngay các câu hỏi có tỉ lệ sai cao để hỗ trợ chữa bài kịp thời.<br><br>**Bước 3: Báo cáo, thảo luận**<br>+ GV: Chiếu bảng phân tích kết quả bài tập của cả lớp, gọi học sinh giải thích các câu hỏi hay nhầm lẫn.<br>+ HS: Trao đổi về cách giải bài toán tự luận: xác định góc $\\alpha$ giữa lực ma sát và hướng chuyển động ($\\alpha = 180^\\circ \\Rightarrow \\cos(180^\\circ) = -1$).<br><br>**Bước 4: Kết luận, nhận định**<br>+ GV: Chốt phương pháp giải bài tập tính công: Bắt buộc vẽ hình, xác định phương chiều của lực và hướng chuyển dời, xác định chính xác góc $\\alpha$. | **Sản phẩm của Hoạt động 3:**<br>- Kết quả bài kiểm tra trắc nghiệm số trên Quizizz của học sinh.<br>- Lời giải bài tập tự luận:<br>  + Công của lực kéo: $A_F = F \\cdot s \\cdot \\cos(30^\\circ) = 50 \\cdot 10 \\cdot \\frac{\\sqrt{3}}{2} \\approx 433\\text{ J}$.<br>  + Công của lực ma sát: $A_{ms} = F_{ms} \\cdot s \\cdot \\cos(180^\\circ) = -\\mu \\cdot N \\cdot s = -343\\text{ J}$. |
| **HOẠT ĐỘNG 4: VẬN DỤNG, TÌM TÒI MỞ RỘNG (15 phút)**<br><br>**Bước 1: Chuyển giao nhiệm vụ**<br>+ GV: Đặt vấn đề thực tiễn: "Tại sao khi leo dốc bằng xe đạp hoặc đi bộ, người ta thường đi theo đường ngoằn ngoèo (đường đèo chữ chi) thay vì đi thẳng dốc? Công thực hiện trong hai trường hợp có khác nhau không?"<br>👉 **Hoạt động của GV:** Hướng dẫn HS về nhà thiết kế 1 infographic hoặc bài trình bày ngắn (trên Canva hoặc Google Slides) giải thích hiện tượng trên dựa vào kiến thức công và lực, nộp sản phẩm vào thư mục Google Drive của lớp [Mã 3.1.NC1a] [Mã 5.3.NC1a].<br>👉 **Hoạt động của HS:** Nhận nhiệm vụ dự án học tập nhỏ, lưu liên kết nộp bài về thiết bị.<br><br>**Bước 2: Thực hiện nhiệm vụ**<br>+ HS: Thực hiện nhiệm vụ tại nhà theo nhóm 2 - 3 học sinh.<br>👉 **Hoạt động của HS:** Khai thác tài liệu số, áp dụng công cụ thiết kế số để tạo sản phẩm học tập [Mã 3.1.NC1a].<br><br>**Bước 3: Báo cáo, đánh giá**<br>+ HS: Nộp sản phẩm qua link Google Drive trước buổi học tiếp theo.<br>+ GV: Nhận xét và chấm điểm sản phẩm số vào đầu tiết học sau. | **Sản phẩm của Hoạt động 4:**<br>- Sản phẩm infographic/slide của các nhóm nộp qua liên kết số.<br>- Lời giải thích khoa học: Đi đường ngoằn ngoèo làm giảm góc nghiêng, giảm lực cản trọng lực tác dụng ngược chiều dốc, dù quãng đường $s$ tăng nhưng lực $F$ cần tác dụng nhỏ hơn, giúp người đạp xe đỡ mệt hơn (quy tắc bảo toàn công của máy cơ đơn giản). |
`;

export const DEFAULT_LESSON_PLAN = SAMPLE_LESSON_PLAN;