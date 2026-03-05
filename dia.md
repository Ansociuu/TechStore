# Các Mẫu Sơ Đồ Hệ Thống TechStore AI (Mermaid)

Hướng dẫn: Copy các khối mã (code block) dưới đây và dán vào [Mermaid Live Editor](https://mermaid.live/) để tạo sơ đồ.

---

## 1. Mô hình Use-case (Chia nhỏ để vừa khổ giấy A4)

*Do hệ thống có nhiều chức năng, việc gom tất cả vào 1 sơ đồ sẽ làm hình ảnh bị kéo giãn, chữ rất nhỏ khi chèn vào Word. Vì vậy, sơ đồ được chia làm 2 phần chính:*

### 1.1 Sơ đồ Use-case của Khách hàng
*(Tập trung vào trải nghiệm mua sắm và trợ lý AI)*

```mermaid
%%{init: {"themeVariables": {"fontSize": "22px"}}}%%
flowchart LR
    Customer((Khách hàng))
    
    subgraph "Tài khoản & Hồ sơ"
        direction TB
        Auth(["Đăng ký<br>Đăng nhập<br>Quên MK"])
        Profile(["Quản lý hồ sơ<br>& Địa chỉ"])
    end

    subgraph "Tương tác Sản phẩm & Mua hàng"
        direction TB
        Prod(["Xem & Lọc<br>sản phẩm"])
        Cart(["Quản lý<br>giỏ hàng"])
        Order(["Đặt hàng &<br>Thanh toán"])
        History(["Xem lịch sử<br>đơn hàng"])
    end

    subgraph "Trợ lý Ảo (GenAI)"
        direction TB
        AI1(["Chat tư vấn<br>cấu hình"])
        AI2(["Nhận gợi ý<br>cá nhân hóa"])
    end

    Customer --> Auth
    Customer --> Profile
    Customer --> Prod
    Customer --> Cart
    Customer --> Order
    Customer --> History
    Customer --> AI1
    Customer --> AI2
```

### 1.2 Sơ đồ Use-case của Quản trị viên (Admin)
*(Tập trung vào nghiệp vụ quản lý hệ thống bán hàng)*

```mermaid
%%{init: {"themeVariables": {"fontSize": "22px"}}}%%
flowchart LR
    Admin((Quản trị viên))
    
    subgraph "Quản trị Tài khoản"
        direction TB
        Auth(["Đăng nhập<br>Backend"])
        Users(["Quản lý<br>Khách hàng"])
    end

    subgraph "Quản lý Cửa hàng"
        direction TB
        Products(["Quản lý Sản phẩm<br>(Thêm/Sửa/Xóa)"])
        Orders(["Quản lý & Cập nhật<br>Đơn hàng"])
        Dashboard(["Xem Báo cáo<br>Thống kê Doanh thu"])
    end

    Admin --> Auth
    Admin --> Users
    Admin --> Products
    Admin --> Orders
    Admin --> Dashboard
```

---

## 2. Mô hình Lớp và Đối tượng (Class Diagram)

```mermaid
%%{init: {"themeVariables": {"fontSize": "22px"}}}%%
classDiagram
    class User {
        +Int id
        +String email
        +String password
        +String name
        +String role
        +String phone
        +String avatar
        +Int points
        +Int aiScore
        +DateTime createdAt
        +login()
        +register()
        +updateProfile()
        +resetPassword()
    }
    
    class Address {
        +String id
        +Int userId
        +String name
        +String phone
        +String province
        +String district
        +String ward
        +String detail
        +Boolean isDefault
        +addAddress()
        +updateAddress()
        +deleteAddress()
    }
    
    class Product {
        +Int id
        +String name
        +String description
        +Float price
        +String image
        +String category
        +Int stock
        +Boolean isHot
        +Boolean isNew
        +Float rating
        +Json specs
        +getProductDetails()
        +updateStock()
    }
    
    class Cart {
        +Int id
        +Int userId
        +DateTime updatedAt
        +clearCart()
    }
    
    class CartItem {
        +Int id
        +Int cartId
        +Int productId
        +Int quantity
        +updateQuantity()
        +removeItem()
    }
    
    class Order {
        +Int id
        +Int userId
        +Float total
        +String status
        +String shippingAddress
        +String paymentMethod
        +DateTime createdAt
        +createOrder()
        +updateStatus()
        +cancelOrder()
    }
    
    class OrderItem {
        +Int id
        +Int orderId
        +Int productId
        +Int quantity
        +Float price
    }
    
    class Notification {
        +String id
        +Int userId
        +String title
        +String message
        +String type
        +Boolean isRead
        +markAsRead()
    }

    User "1" *-- "many" Address : has
    User "1" *-- "many" Notification : receives
    User "1" -- "1" Cart : owns
    User "1" -- "many" Order : places
    Cart "1" *-- "many" CartItem : contains
    CartItem "*" -- "1" Product : references
    Order "1" *-- "many" OrderItem : contains
    OrderItem "*" -- "1" Product : references
```

---

## 3. Các Biểu Đồ Tuần Tự (Sequence Diagrams)

### 3.1 Quy trình Đăng nhập và Xác thực (Authentication)

```mermaid
%%{init: {"themeVariables": {"fontSize": "20px"}}}%%
sequenceDiagram
    actor Client as Khách hàng
    participant UI as Frontend<br>(React Component)
    participant AuthAPI as Backend<br>(Auth Routes)
    participant DB as Database<br>(MySQL via Prisma)

    Client->>UI: Điền Email & Mật khẩu,<br>nhấn "Đăng nhập"
    UI->>AuthAPI: POST /api/auth/login<br>(email, password)
    AuthAPI->>DB: Truy vấn User theo Email
    DB-->>AuthAPI: Trả về User record<br>(có chứa hashed password)
    
    alt Email không tồn tại hoặc Mật khẩu sai
        AuthAPI-->>UI: 401 Unauthorized<br>(Lỗi đăng nhập)
        UI-->>Client: Hiển thị thông báo lỗi
    else Thông tin hợp lệ
        AuthAPI->>AuthAPI: So sánh password<br>bằng Bcrypt
        AuthAPI->>AuthAPI: Tạo JWT<br>Access Token
        AuthAPI-->>UI: 200 OK<br>(Token + User Info)
        UI->>UI: Lưu Token vào<br>LocalStorage/State
        UI-->>Client: Chuyển hướng tới<br>Trang Chủ
    end
```

### 3.2 Quy trình Thêm sản phẩm vào Giỏ hàng

```mermaid
%%{init: {"themeVariables": {"fontSize": "20px"}}}%%
sequenceDiagram
    actor Client as Khách hàng
    participant UI as Frontend<br>(Product Detail Component)
    participant CartAPI as Backend (Cart API)
    participant DB as Database<br>(Cart & CartItem via Prisma)

    Client->>UI: Chọn số lượng &<br>nhấn "Thêm vào giỏ"
    UI->>CartAPI: POST /api/cart/add<br>(productId, quantity, Token)
    
    Note over CartAPI,DB: Middleware xác thực<br>user từ JWT Token
    
    CartAPI->>DB: Kiểm tra xem User<br>đã có Cart chưa?
    alt Chưa có Cart
        DB-->>CartAPI: null
        CartAPI->>DB: Tạo Cart mới cho User
    end
    
    CartAPI->>DB: Kiểm tra sản phẩm đã có<br>trong CartItem chưa?
    alt Sản phẩm đã tồn tại
        CartAPI->>DB: Cập nhật tăng số lượng<br>(quantity)
    else Sản phẩm chưa có
        CartAPI->>DB: Tạo mới CartItem
    end
    
    DB-->>CartAPI: Kết quả lưu thành công
    CartAPI-->>UI: 200 OK<br>(Cập nhật Cart thành công)
    UI-->>Client: Hiển thị Toast<br>"Thêm giỏ hàng thành công"<br>& Cập nhật icon Giỏ hàng
```

### 3.3 Quy trình Đặt hàng (Checkout)

```mermaid
%%{init: {"themeVariables": {"fontSize": "20px"}}}%%
sequenceDiagram
    actor Client as Khách hàng
    participant UI as Frontend<br>(Checkout Page)
    participant OrderAPI as Backend (Order API)
    participant CartAPI as Backend (Cart API)
    participant DB as Database (MySQL)

    Client->>UI: Kiểm tra giỏ hàng, chọn<br>địa chỉ, nhấn "Đặt hàng"
    UI->>OrderAPI: POST /api/order/create<br>(address, payment, items)
    
    OrderAPI->>DB: Lấy thông tin CartItems<br>và Giá sản phẩm
    DB-->>OrderAPI: Trả về danh sách sản phẩm
    
    OrderAPI->>OrderAPI: Tính toán Total Price &<br>Xác thực tồn kho (Stock)
    
    alt Không đủ tồn kho
        OrderAPI-->>UI: 400 Bad Request<br>(Hết hàng)
        UI-->>Client: Thông báo lỗi hết hàng
    else Tồn kho hợp lệ
        OrderAPI->>DB: Tạo record Order<br>(Status: Pending)
        OrderAPI->>DB: Tạo các record OrderItem
        OrderAPI->>DB: Trừ Stock trong Product
        OrderAPI->>CartAPI: Xóa giỏ hàng (Clear)
        CartAPI->>DB: Xóa các CartItem hiện tại
        OrderAPI-->>UI: 201 Created<br>(Order ID)
        UI-->>Client: Chuyển hướng tới trang<br>"Đặt thành công"
    end
```

### 3.4 Quy trình Trợ lý Ảo AI tư vấn (Google Gemini)

```mermaid
%%{init: {"themeVariables": {"fontSize": "20px"}}}%%
sequenceDiagram
    actor Client as Khách hàng
    participant UI as Frontend<br>(AI Chat Box)
    participant ChatAPI as Backend<br>(AI Routes)
    participant DB as Database<br>(Prisma)
    participant Gemini as Google<br>Gemini API

    Client->>UI: Nhập câu hỏi<br>(VD: "Tìm laptop đồ họa...")
    UI->>ChatAPI: POST /api/ai/chat<br>(prompt, userId)
    
    ChatAPI->>DB: Lấy Catalog Sản phẩm<br>& điểm aiScore
    DB-->>ChatAPI: Trả về Catalog & User Info
    
    ChatAPI->>Gemini: Gửi Prompt (System Context ++<br>Products Context ++ Prompt)
    Note right of Gemini: Gemini phân tích NLP<br>tìm sản phẩm hợp nhất
    
    Gemini-->>ChatAPI: Trả về Text phản hồi &<br>Danh sách Product IDs
    
    ChatAPI->>DB: Cập nhật aiScore<br>cho User
    ChatAPI-->>UI: 200 OK (Message,<br>Suggested Products)
    
    UI->>UI: Render tin nhắn AI<br>& Danh sách sản phẩm
    UI-->>Client: Hiển thị phản hồi<br>từ Trợ lý Ảo
```

### 3.5 Quy trình Quản trị viên xử lý đơn hàng (Admin)

```mermaid
%%{init: {"themeVariables": {"fontSize": "20px"}}}%%
sequenceDiagram
    actor Admin as Quản trị viên
    participant UI as Frontend<br>(Dashboard)
    participant AdminAPI as Backend<br>(Order Routes)
    participant DB as Database

    Admin->>UI: Truy cập tab<br>"Quản lý Đơn hàng"
    UI->>AdminAPI: GET /api/admin/orders<br>(kèm Admin JWT)
    
    Note over AdminAPI,DB: Middleware kiểm tra<br>Role = 'admin'
    
    AdminAPI->>DB: Truy vấn<br>danh sách Orders
    DB-->>AdminAPI: Trả về Orders Data
    AdminAPI-->>UI: 200 OK (Orders Data)
    UI-->>Admin: Hiển thị bảng Đơn hàng<br>(Đang chờ xử lý)
    
    Admin->>UI: Đổi trạng thái đơn hàng<br>thành "Đang giao"
    UI->>AdminAPI: PUT /api/admin/order/...<br>(status: "shipping")
    
    AdminAPI->>DB: Cập nhật status order
    DB-->>AdminAPI: OK
    
    AdminAPI->>DB: Tạo Notification<br>cho Khách hàng
    
    AdminAPI-->>UI: 200 OK
    UI-->>Admin: Hiển thị "Cập nhật<br>thành công"
```
