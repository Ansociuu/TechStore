#  TechStore - Nền tảng Thương mại Điện tử Tích hợp AI

Chào mừng đến với **TechStore**, một dự án website thương mại điện tử hiện đại chuyên kinh doanh các sản phẩm công nghệ (Laptop, Điện thoại, Tablet, Phụ kiện). Dự án được xây dựng với trải nghiệm người dùng tối ưu, giao diện cao cấp và tích hợp **Trí tuệ nhân tạo (Gemini AI)** để hỗ trợ khách hàng mua sắm thông minh.


##  Tính năng Nổi bật

*   **Hiệu năng vượt trội**: Xây dựng trên nền tảng Vite và React 19, đảm bảo tốc độ tải trang cực nhanh.
*   **AI Assistant**: Trợ lý ảo thông minh (Google Gemini) tư vấn sản phẩm, so sánh cấu hình và giải đáp thắc mắc khách hàng 24/7.
*   **Giao diện Hiện đại**: Thiết kế theo phong cách Glassmorphism, Responsive hoàn hảo trên mọi thiết bị (Desktop, Tablet, Mobile).
*   **Dark/Light Mode**: Chế độ Sáng/Tối linh hoạt, tự động nhận diện sở thích người dùng hoặc tùy chỉnh thủ công.
*   **Tìm kiếm & Lọc thông minh**: Hệ thống lọc sản phẩm theo danh mục, mức giá và thương hiệu với phản hồi tức thì.
*   **Quản lý Giỏ hàng**: Thao tác thêm, sửa, xóa sản phẩm trong giỏ hàng mượt mà.

##  Công nghệ Sử dụng

Dự án sử dụng các công nghệ tiên tiến nhất hiện nay:

| Lĩnh vực | Công nghệ |
| :--- | :--- |
| **Frontend Core** | ![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) |
| **Styling** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) |
| **AI Integration** | ![Google Gemini](https://img.shields.io/badge/Google_Gemini_AI-8E75B2?style=flat&logo=google&logoColor=white) |

##  Cài đặt và Chạy thử (Local)

Để chạy dự án trên máy cá nhân, vui lòng làm theo các bước sau:

### 1. Yêu cầu hệ thống
*   [Node.js](https://nodejs.org/) (Phiên bản v16 trở lên)
*   [Git](https://git-scm.com/)

### 2. Cài đặt

**Bước 1: Clone dự án**
```bash
git clone https://github.com/Ansociuu/TechStore.git
```

**Bước 2: Cài đặt thư viện**
```bash
npm install
```

**Bước 3: Cấu hình môi trường**
Tạo file `.env.local` tại thư mục gốc của frontend và thêm API Key:
```env
VITE_GOOGLE_API_KEY=your_gemini_api_key_here
```
*(Bạn có thể lấy API Key miễn phí tại [Google AI Studio](https://aistudio.google.com/))*

**Bước 4: Khởi chạy**
```bash
npm run dev
```
Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:5173`

##  Cấu trúc Dự án

```
frontend/
├── src/
│   ├── components/  # Các component tái sử dụng (Navbar, ProductCard...)
│   ├── pages/       # Các trang chính (Home, Listing, Cart...)
│   ├── services/    # Xử lý Logic AI và API
│   ├── types.ts     # Các định nghĩa kiểu dữ liệu (TypeScript)
│   └── App.tsx      # Component gốc và Routing
└── ...

