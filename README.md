# Đồ án: Hệ thống Thương mại Điện tử TechStore AI

## 1. Giới thiệu

### 1.1 Đặt vấn đề
Trong kỷ nguyên số hóa mạnh mẽ hiện nay, việc mua sắm thiết bị công nghệ và điện tử trực tuyến đã trở thành thói quen không thể thiếu của người tiêu dùng. Nhờ sự phát triển của internet, người dùng có thể dễ dàng tiếp cận hàng ngàn sản phẩm từ khắp nơi trên thế giới. Tuy nhiên, đi kèm với sự tiện lợi đó là một thách thức lớn: sự choáng ngợp trước lượng thông tin khổng lồ (information overload). 

Người tiêu dùng thường gặp rất nhiều khó khăn trong việc lựa chọn sản phẩm phù hợp do sự đa dạng về thương hiệu, mẫu mã, và đặc biệt là các thông số kỹ thuật phức tạp (RAM, CPU, GPU, v.v.). Việc tự tìm hiểu và đối chiếu cấu hình đòi hỏi người dùng phải có một lượng kiến thức công nghệ nhất định. Sự thiếu hụt các kênh tư vấn trực tiếp, cá nhân hóa theo thời gian thực (real-time) khiến trải nghiệm mua sắm trực tuyến trở nên mất thời gian và đôi khi dẫn đến việc mua các sản phẩm không đáp ứng đúng nhu cầu thực tế.

### 1.2 Các giải pháp đã có
Trên thị trường hiện nay đã có sự thống trị của nhiều nền tảng Thương mại điện tử (TMĐT) lớn mạnh như Shopee, Tiki, Lazada. Tuy nhiên, khi xét riêng trong lĩnh vực kinh doanh thiết bị công nghệ, định hướng của các nền tảng này vẫn bộc lộ một số hạn chế cốt lõi:
- **Bộ lọc tìm kiếm cứng nhắc:** Các bộ lọc truyền thống chủ yếu phân loại theo khoảng giá, thương hiệu hoặc đánh giá sao. Chúng mang tính chất thủ công và không thể hiểu được ngôn ngữ hoặc ý định tự nhiên của con người (Ví dụ: "Tôi muốn tìm laptop để thiết kế đồ họa 3D mức giá sinh viên").
- **Hệ thống gợi ý chưa sâu sắc:** Hầu hết các gợi ý sản phẩm chỉ dừng lại ở việc dựa trên lịch sử xem sản phẩm đơn giản hoặc các sản phẩm bán chạy nhất mang tính rập khuôn, thiếu sự tương tác hai chiều thông minh để tìm hiểu mong muốn thực sự của khách hàng.
- **Hỗ trợ khách hàng hạn chế:** Việc hỗ trợ thông qua Chatbot thường được lập trình bằng các kịch bản cứng (rule-based), không có khả năng phân tích ngữ cảnh, kiến thức mảng công nghệ chuyên sâu để tư vấn kỹ thuật.

### 1.3 Giải pháp đề xuất
Để giải quyết những vấn đề trên, dự án **TechStore AI** đề xuất một hệ thống cửa hàng công nghệ hiện đại, chuyên biệt và thông minh, tích hợp Trí tuệ nhân tạo (Google Gemini AI API) và các thuật toán Recommendation Systems vào hệ sinh thái của mình nhằm mục đích:
- Hỗ trợ tư vấn sản phẩm thông minh thông qua hội thoại ngôn ngữ tự nhiên, biến trải nghiệm mua sắm từ "tự tìm kiếm" sang "được thấu hiểu và phục vụ".
- Xây dựng một nền tảng quản trị toàn diện, theo dõi vòng đời đơn hàng và giỏ hàng thời gian thực mượt mà cho người tiêu dùng.
- Cá nhân hóa gợi ý sản phẩm một cách linh hoạt, sát với nhu cầu, ngành nghề, và ngân sách thực tế thông qua việc kết hợp các phương pháp:
  - **Sử dụng Collaborative Filtering (Lọc cộng tác):** Hệ thống triển khai hai hướng tiếp cận chính để đề xuất sản phẩm dựa trên hành vi mua sắm:
    - *User-based Collaborative Filtering:* Gợi ý sản phẩm dựa trên sự tương đồng giữa các người dùng (Ví dụ: Những người dùng có lịch sử mua sắm thiết bị tản nhiệt nước giống bạn cũng thường mua thêm keo tản nhiệt cao cấp này).
    - *Item-based Collaborative Filtering:* Gợi ý sản phẩm dựa trên sự tương đồng giữa các mặt hàng được mua cùng nhau (Ví dụ: Khách hàng mua Mainboard A thường có xu hướng mua kèm CPU B).
  - Kết hợp bổ trợ bằng mạng chấm điểm AI tĩnh (aiScore) do Google Gemini phân tích từ ngữ cảnh hội thoại thực tế của từng khách hàng.

---

## 2. Thiết kế và triển khai

### 2.1 Các yêu cầu chức năng
Hệ thống được thiết kế để phân chia rõ ràng vai trò và quyền hạn của các nhóm người dùng:

- **Người dùng (Khách hàng / Customer):** 
  - Đăng ký tài khoản mới, đăng nhập, đặt lại mật khẩu và quản lý thông tin cá nhân.
  - Quản lý sổ địa chỉ giao hàng chuyên nghiệp.
  - Tìm kiếm, lọc, và xem chi tiết thông số kỹ thuật sản phẩm, đánh giá (Rating).
  - Quản lý giỏ hàng (thêm, xóa, cập nhật số lượng) và thực hiện quy trình Đặt hàng (Checkout).
  - Nhận thông báo (Notification) thay đổi trạng thái từ hệ thống.
  - **Tương tác cốt lõi:** Yêu cầu Trợ lý AI phân tích nhu cầu, đưa ra lời khuyên và các danh sách sản phẩm ưu tiên dựa trên bối cảnh hội thoại.

- **Quản trị viên (Admin):** 
  - Bảng điều khiển (Dashboard) theo dõi tổng quan hệ thống và doanh thu, thống kê lượng sách báo và hàng hóa.
  - Quản lý danh mục, thêm mới/sửa/xóa thông tin Sản phẩm (Cập nhật số lượng tồn kho, giá bán, hình ảnh qua Cloudinary).
  - Quản lý và xử lý Đơn hàng (Cập nhật chuyển trạng thái từ Pending sang Shipping/Completed/Canceled).
  - Quản trị thông tin Người dùng trong hệ thống.

- **Trí tuệ Nhân tạo (Gemini AI System):** 
  - Tích hợp và xử lý dữ liệu hệ thống (Product Catalog) để làm ngữ cảnh (Context) trước khi trả lời người dùng.
  - Có khả năng duy trì bối cảnh hội thoại để phân tích nhu cầu liên tục và đưa ra các đề xuất sản phẩm tối ưu được gắn liền link ID trực tiếp đến Cửa hàng.

### 2.2 Các yêu cầu phi chức năng
Bên cạnh các yếu tố chức năng, hệ thống phải đáp ứng các tiêu chuẩn chất lượng sau:
- **Hiệu năng (Performance):** Thời gian tải trang dưới 2 giây đối với các thiết bị mạng thông thường. Số lượng người dùng truy cập đồng thời lên tới hàng ngàn mà không bị sập (crash) nhờ kiến trúc Node.js/Express non-blocking.
- **Bảo mật (Security):** Mật khẩu người dùng được băm (hash) bằng Bcrypt. Mọi giao tiếp với API đều đi kèm cơ chế xác thực chuỗi Token an toàn bằng JWT (JSON Web Token).
- **Khả năng mở rộng (Scalability):** Kiến trúc tách biệt rõ ràng giữa Backend (RESTful API Express) và Frontend (React) cho phép mỗi phần mềm độc lập nâng cấp và thay đổi công nghệ không ảnh hưởng tới phần còn lại.
- **Giao diện (UI/UX):** Giao diện phải mang nét hiện đại (Modern Web Design), trực quan và hỗ trợ đa nền tảng tốt (Responsive Web Design cho Mobile/Tablet).

### 2.3 Các ràng buộc (Constraints)
Trong quá trình phát triển, dự án buộc phải tuần thủ một số quy định về công nghệ như sau:
- **Ngôn ngữ phát triển:** TypeScript (Để đảm bảo tính chặt chẽ trong định nghĩa kiểu dữ liệu).
- **Cơ sở dữ liệu:** MySQL, giao tiếp thông qua thư viện Prisma ORM để tối ưu tốc độ ánh xạ đối tượng, đảm bảo an toàn truy vấn (chống SQL Injection).
- **Môi trường Server & Build Tool:** Node.js làm máy chủ chạy, Vite JS làm công cụ biên dịch Frontend để tối ưu tốc độ HMR trong quá trình code.

### 2.4 Các ràng buộc về triển khai

#### 2.4.1 Các ràng buộc kinh tế
Sử dụng các dịch vụ Cloud có chi phí tối ưu:
- Hình ảnh sản phẩm, người dùng được lưu trữ và tối ưu hóa trên nền tảng Cloudinary (Sử dụng gói tự do - Free Tier).
- Database sử dụng MySQL cục bộ nhằm tối giản chi phí vận hành máy chủ hàng tháng. 
- Tận dụng gói miễn phí của Google Gemini API để triển khai chatbot mà không làm đội lên chi phí R&D.

#### 2.4.2 Các ràng buộc về đạo đức
Thuật toán AI đưa ra quyết định dựa trên tính logic và kỹ thuật cá nhân hóa, tuyệt đối đảm bảo AI không đưa ra thông tin có ý đồ dẫn dụ lừa đảo (spam/scam), cũng như không phân biệt đối xử với các truy vấn của User. Quan trọng nhất là quyền riêng tư: Bảo mật tuyệt đối lịch sử hội thoại cá nhân và dữ liệu nhạy cảm của khách hàng trong hệ thống.

### 2.5 Mô hình hệ thống / Thiết kế giải pháp

Bằng việc sử dụng ngôn ngữ mô hình hóa UML kết hợp công cụ vẽ sơ đồ Mermaid, thiết kế kỹ thuật của nền tảng đã được đặc tả hoàn toàn.

*(Lưu ý: Xem chi tiết toàn bộ các code sơ đồ Use-case, Class, Sequence cho mọi chức năng hệ thống tại file `dia.md` đi kèm. Bạn có thể sử dụng mã đó tại [Mermaid Live Editor](https://mermaid.live/) để xuất ra hình ảnh).*

#### 2.5.1 Các kịch bản của hệ thống (Use-cases)
Khắc họa các điểm đầu vào của hệ thống cho các diễn viên. Hệ thống chia luồng riêng biệt: Customer sử dụng App (đăng ký, tương tác AI, mua sản phẩm, quản lý thông báo, quản lý Profile), Admin có công cụ Dashboard nâng cao (Quản lý User, Product, duyệt Order). 

#### 2.5.2 Mô hình lớp và đối tượng (Class Diagram)
Hệ thống Prisma Schema được cấu trúc rất chặt chẽ với các thực thể cốt lõi: 
- `User` sở hữu `Address` và `Notification`.
- `User` sở hữu 1 `Cart` (bên trong `Cart` có nhiều `CartItem` trỏ tới `Product`).
- `User` khởi tạo nhiều `Order` (gồm các `OrderItem` trỏ tới thư viện `Product`).

#### 2.5.3 Các biểu đồ tuần tự (Sequence Diagram)
Đặc tả logic các quy trình hoạt động của các hàm API:
- Cách hệ thống Backend xác thực Token và lưu Session.
- Quy trình Client gửi yêu cầu và nhận kết quả trả về từ Gemini AI.
- Quá trình giao dịch giỏ hàng, trừ tồn kho (Stock decrement) khi đặt lệnh Order thành công từ Database.

#### 2.5.4 Các màn hình giao diện người dùng
Giao diện người dùng đã được định hình trước qua quá trình phác thảo Wireframe, tập trung vào 5 hệ màn hình cốt lõi: 
- Navigation/Trang Chủ.
- Trang Duyệt Sản Phẩm & Lọc.
- Cửa sổ Trợ Lý Ảo Chatbot.
- Trang Thanh Toán & Giỏ hàng.
- Bảng Quản trị Admin Dashboard.

---

## 3. Một số thành phần khác của đồ án

### 3.1 Phân công công việc
Dưới đây là bảng phân công công việc chi tiết của nhóm trong suốt quá trình phát triển dự án. Lê Phạm Thành Đạt đóng vai trò là nhà phát triển chính (Lead Developer), đảm nhận khối lượng kỹ thuật lớn, trong khi Nguyễn Văn An giữ vai trò Nhóm trưởng kết hợp phân tích, thiết kế và hỗ trợ phát triển các module cốt lõi.

| Tên Công Việc | Nguyễn Văn An (Nhóm trưởng) | Lê Phạm Thành Đạt |
| --- | :---: | :---: |
| **1. Phân tích và thiết kế** | | |
| 1.1. Phân tích và thiết kế kiến trúc hệ thống | 60% | 40% |
| 1.2. Lên kế hoạch chi tiết, quản lý tiến độ dự án | 75% | 25% |
| 1.3. Thiết kế Cơ sở dữ liệu (Prisma Schema), thiết lập môi trường | 35% | 65% |
| 1.4. Thiết kế sơ đồ UML, nghiên cứu UX/UI / Figma | 45% | 55% |
| **2. Phát triển chức năng Cửa Hàng (Storefront)** | | |
| 2.1. Phát triển giao diện đăng nhập/đăng ký & layout chính | 35% | 65% |
| 2.2. Xây dựng module xác thực (JWT, Email, Bcrypt) & API | 40% | 60% |
| 2.3. Xây dựng trang danh sách, tìm kiếm & bộ lọc sản phẩm | 30% | 70% |
| 2.4. Phát triển chức năng Giỏ hàng & luồng mua hàng | 35% | 65% |
| **3. Phát triển chức năng Quản trị (Admin)** | | |
| 3.1. Thiết kế layout Dashboard & tích hợp biểu đồ thống kê | 55% | 45% |
| 3.2. Quản lý hệ thống Sản phẩm & Danh mục (CRUD) | 30% | 70% |
| 3.3. Quản lý trạng thái Đơn hàng & giao dịch | 40% | 60% |
| 3.4. Quản lý người dùng & phân quyền hệ thống | 50% | 50% |
| **4. Tính năng AI & Gợi ý (Recommendation)** | | |
| 4.1. Tích hợp Trợ lý Ảo Chatbot (Google Gemini API) | 35% | 65% |
| 4.2. Viết thuật toán Lọc cộng tác (Collaborative Filtering) | 25% | 75% |
| 4.3. Xây dựng cơ chế chấm điểm aiScore phân tích hội thoại | 40% | 60% |
| **5. Kiểm thử và Tối ưu** | | |
| 5.1. Lập kế hoạch kiểm thử & chuẩn bị dữ liệu Seed | 65% | 35% |
| 5.2. Kiểm thử và tối ưu tốc độ xử lý của API (Backend) | 30% | 70% |
| 5.3. Kiểm tra hiển thị responsive trên các thiết bị mobile | 40% | 60% |
| **6. Triển khai chính thức** | | |
| 6.1. Triển khai CSDL MySQL & cấu hình Cloudinary | 35% | 65% |
| 6.2. Triển khai hệ thống lên máy chủ thực tế (Cloud/VPS) | 30% | 70% |
| 6.3. Kiểm tra bảo mật và tối ưu lần cuối giao diện | 50% | 50% |
| **Tổng kết khối lượng công việc** | **~39%** | **~61%** |

### 3.2 Đảm bảo thực hiện đúng làm việc nhóm
Nhóm quản lý vòng đời phát triển dự án bằng quy trình Agile/Scrum. Sử dụng nền tảng GitHub làm kho chứa mã nguồn, luân phiên phân công người review code thông qua Pull Request trước khi Merge (gộp) mã để tránh conflict. Tổ chức họp định kỳ vào mỗi cuối tuần qua Google Meet / Discord để rà soát tiến độ (Sprint Review).

### 3.3 Các vấn đề về đạo đức và làm việc chuyên nghiệp
Tuân thủ toàn bộ các nguyên tắc làm việc chuyên nghiệp của Kỹ sư Phần mềm: Tôn trọng hoàn toàn bản quyền mã nguồn của các thư viện mã nguồn mở (Open Source), báo cáo đánh giá trung thực kết quả phần mềm. Đồng thời, nhận thức rõ tác động của sản phẩm AI và triển khai các rào chắn (guardrails) an toàn nhằm hạn chế câu trả lời gây hiểu lầm cho End-User.

### 3.4 Tác động xã hội
Hệ thống **TechStore AI** có thể góp phần thúc đẩy ứng dụng của Trí tuệ Nhân tạo vào cuộc sống đời thường, mang lại giá trị công nghệ cao áp dụng thực tế vào thị trường bán lẻ VN. Đặc biệt giúp người cao tuổi hay người không rành công nghệ cũng có cơ hội được "chuyên gia lập trình" tư vấn mua máy tính với ngôn ngữ tự nhiên, xóa nhòa khoảng cách số.

### 3.5 Kế hoạch cho kiến thức mới và chiến lược học tập
Trong quá trình code đồ án, chiến lược học tập đặt kiến thức thực hành làm trung tâm. Các kiến thức mới thu nhận bao gồm: 
- Phương pháp tối ưu Prompt (Prompt Engineering) khi gọi Gemini API.
- Tối ưu hóa Database Query với thư viện Prisma ORM cho mục tiêu Scale ứng dụng.

---

## 4. Kết luận
Dự án **TechStore AI** đã hoàn thành xuất sắc các mục tiêu thiết kế và kỹ thuật định ra từ ban đầu. Nhóm sinh viên đã tự tay xây dựng được một hệ thống thương mại điện tử chuyên biệt từ những dòng code đầu tiên (from scratch) mang độ hoàn thiện cao nhất. Việc đưa thành công hệ thống AI tư vấn thông minh (Google Gemini) vào nền tảng đã tạo ra sức mạnh cá nhân hóa nổi bật so với các nền tảng cũ, chứng minh được năng lực làm chủ tư duy hệ thống và ứng dụng các xu hướng công nghệ tương lai hiện đại (GenAI) vào lĩnh vực Phần mềm Quản trị.

---

## 5. Tài liệu tham khảo
[1] Prisma ORM Documentation: Cơ chế Query & Model (https://www.prisma.io/docs)
[2] Google Gemini API Documentation: Tích hợp thư viện genai (https://ai.google.dev/)
[3] Node.js & ReactJS Official Documents.
[4] Tài liệu hướng dẫn thiết kế cơ sở dữ liệu Hệ thống E-commerce hiện đại.
