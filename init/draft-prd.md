# PRD - QUY ĐỊNH TÀI CHÍNH VÀ MỤC VỤ - GIÁO PHẬN BUÔN MA THUỘT (AI)

Ngày tạo: 28/01/2026 (Cập nhật)
Phiên bản: 1.0
Mục tiêu: Định nghĩa phạm vi cho Phiên bản Sản phẩm Khả dụng Tối thiểu (MVP)

# 1. MỤC TIÊU SẢN PHẨM (GOAL)

**Tên:** Hệ thống Quản lý Giáo phận Buôn Ma Thuột (GPBMT.ORG)

**Mục đích:** Số hóa toàn diện quy trình quản lý cho Giáo phận, bao gồm:

| Module                | Mô tả                                                 |
| --------------------- | ----------------------------------------------------- |
| ⛪ Giáo xứ & Giáo dân | Quản lý danh sách giáo xứ và giáo dân trực thuộc      |
| 💰 Tài chính          | Quản lý 11 quỹ và giao dịch tài chính chi tiết        |
| 👔 Nhân sự & Lương    | Quản lý nhân viên, bảng lương và phúc lợi             |
| 👨‍🎓 Hành chính         | Quản lý tài sản và các hợp đồng cho thuê có liên quan |

# 2. Mô tả luồng và điều hướng

## 2.1 Module Giáo xứ - Giáo dân

**Nghiệp vụ:**

- Quản lý giáo xứ (2.1.1)
- Quản lý giáo dân (2.1.2)

### 2.1.1 Quản lý giáo xứ

Quản lý tất cả giáo xứ thuộc giáo phận

### **Yêu cầu tính năng:**

- CRUD cơ bản

### 2.1.2 Quản lý giáo dân

Quản lý tất cả giáo dân thuộc giáo phận

### **Yêu cầu tính năng:**

- CRUD cơ bản
- Mỗi giáo dân phải gắn với một giáo xứ

## 2.2 Module Tài chính (\*)

**Nghiệp vụ:**

- Danh mục quỹ (2.2.1)
- Danh mục thu chi (2.2.2)
- Tài khoản ngân hàng (2.2.3)
- Đối tượng nhận gửi (2.2.4)
- Quản lý giao dịch (2.2.5) (\*)

### 2.2.1 Danh mục quỹ

Hệ thống cho phép cấu hình và phân loại các quỹ thu theo mục đích sử dụng. Danh sách các quỹ hiện hữu được chia thành 3 nhóm chính

**A. Nhóm Quỹ chuyển cho Hội đồng Giám mục Việt Nam (HĐGMVN)**

| STT | Tên Quỹ                                              | Ghi chú                                   |
| --- | ---------------------------------------------------- | ----------------------------------------- |
| 1   | Quỹ Liên hiệp Truyền giáo                            | Đóng góp cho hoạt động truyền giáo chung  |
| 2   | Quỹ Thiếu nhi Truyền giáo                            | Hỗ trợ công tác truyền giáo cho thiếu nhi |
| 3   | Quỹ Lễ Thánh Phêrô và Phaolô (Đồng tiền Thánh Phêrô) | Hiệp thông với Tòa Thánh                  |
| 4   | Quỹ Truyền giáo                                      | Phục vụ các hoạt động truyền giáo         |

---

**B. Nhóm Quỹ chuyển cho Tòa Giám mục Buôn Ma Thuột (TGM BMT)**

| STT | Tên Quỹ                                    | Ghi chú                                  |
| --- | ------------------------------------------ | ---------------------------------------- |
| 5   | Quỹ Giúp Đại Chủng viện                    | Hỗ trợ đào tạo chủng sinh                |
| 6   | Quỹ Phòng thu Tòa Giám mục (Văn phòng TGM) | Phục vụ hoạt động hành chính của TGM     |
| 7   | Quỹ Tôn chân Chúa                          | Phục vụ các sinh hoạt phụng vụ / đạo đức |

---

**C. Các Quỹ nội bộ & Nguồn thu mục vụ khác (Bổ sung)**

| STT | Tên Quỹ / Nguồn thu               | Mô tả                                                                          |
| --- | --------------------------------- | ------------------------------------------------------------------------------ |
| 8   | Quỹ Giúp Cha hưu                  | Quỹ an sinh cho hàng giáo sĩ; tiếp nhận đóng góp định kỳ từ Giáo xứ và ân nhân |
| 9   | Tiền xin lễ (Mass Stipends)       | Quản lý tiếp nhận & phân bổ tiền xin lễ theo ý chỉ                             |
| 10  | Tiền rổ & Quyên góp (Collections) | Quyên góp trong thánh lễ và các dịp đặc biệt (lễ bổn mạng, lễ hội…)            |
| 11  | Ân nhân & Tài trợ                 | Theo dõi các khoản đóng góp lớn cho dự án mục vụ hoặc từ thiện                 |

### **Yêu cầu tính năng:**

- CRUD cơ bản
- Mỗi khi phát sinh 1 giao dịch bất kỳ nó luôn gắn liền với một "quỹ"
- Hiển thị các thông tin cơ bản, và kèm theo đó là phần balance (số dư) ứng với từng loại quỹ.

Tham khảo công thức

![image.png](9cc91782-7af0-4dac-8d0b-2293e4a522ec.png)

### 2.2.2 Danh mục thu chi

Tương tự như các loại quỹ, danh mục thu chi phân loại các khoản thu chi được rõ ràng minh bạch cho nhiều mục đích sử dụng.

### **Yêu cầu tính năng:**

- CRUD cơ bản
- Mỗi khi phát sinh 1 giao dịch bất kỳ nó luôn gắn liền với một "Danh mục thu/chi"
- Đặc biệt có 2 danh mục không được xóa và toggle trạng thái: **Tiền lương nhân viên** và **Thu tiền cho thuê tài sản**

### 2.2.3 Tài khoản ngân hàng

Quản lý các tài khoản ngân hàng có chức năng nhận/thanh toán các khoản phí, nếu giao dịch đó là chuyển khoản

### **Yêu cầu tính năng:**

- CRUD cơ bản
- Mỗi khi phát sinh 1 giao dịch bất kỳ nếu nó là chuyển khoản thì nó phải gắn với 1 trong số những tài khoản mà hệ thống đang quản lý
- Hiển thị các thông tin cơ bản, và kèm theo đó là phần balance (số dư) ứng với từng tài khoản.

Tham khảo công thức:

![image.png](d4c77ef1-d8ea-4d1d-b084-46147e794008.png)

### 2.2.4 Đối tượng nhận gửi

Nội dung này giúp các khoản thu chi thêm phần minh bạch và dễ truy xuất thông tin người nhận/gửi khi có vấn đề phát sinh (quản lý thông tin cơ bản của đối tượng: tên, SĐT (\*), và thông tin tài khoản ngân hàng)

### **Yêu cầu tính năng:**

- CRUD cơ bản
- Xây component dạng select cho phép search và nút add nhanh → cho phép thêm nhanh đối tượng mới ở page khác

### 2.2.5 Quản lý giao dịch (\*)

Tính năng cốt lõi, cho phép xem danh sách, xử lý các khoản thu chi từ nhiều nguồn, duyệt phiếu và điều chỉnh các khoản phí

Các khoản thu/ chi có thể được tạo theo 3 cách chính:

- Nhập tay (điền form cho chức năng tạo giao dịch)
- Duyệt và tạo khoản chi cho Bảng lương nhân viên (Module nhân sự)
- Đóng tiền thuê tài sản (Module Hành chính)

### **Yêu cầu tính năng:**

- CRUD cơ bản
- Hỗ trợ upload hình ảnh, document và preview được
- Lọc nâng cao, lọc với nhiều tiêu chí, hỗ trợ lọc date range
- Hiển thị table cho 3 loại khoản khác nhau: Khoản thu (income), Khoản chi (expense), Khoản điều chỉnh (adjustment)
- Khoản điều chỉnh (adjustment) có cấu trúc tương tự phiếu thu nhưng cần quan tâm: Loại điều chỉnh (Tăng/Giảm) + Lý do điều chỉnh
- Chỉ được phép sửa xóa khi trạng thái phiếu chưa được duyệt, phiếu chỉ được duyệt bởi user có quyền “super admin” hoặc “cha quản lý”, sau khi duyệt các khoản phí này → tạo phiếu thu chi và xem chi tiết từ khoản thu chi
- User có quyền “super admin” hoặc “cha quản lý” mới có quyền hủy duyệt cho phiếu thu chi
- Đảm bảo phải có đối tượng nhận/ gửi khi tạo giao dịch
- Nếu hình thức thanh toán là chuyển khoản phải đảm bảo chắc rằng cả 2 bên đều có tài khoản

## 2.3 Module Nhân sự (\*)

**Nghiệp vụ:**

- Danh sách nhân sự (2.3.1)
- Bảng lương (2.3.2)

### 2.3.1 Danh sách nhân sự

Quản lý công nhân viên phục vụ trong giáo phận, hằng tháng sẽ phát hành một bảng lương cho tất cả nhân sự có HĐLĐ. Khi duyệt bảng lương sẽ tạo thành các giao dịch (loại chi lương cho nhân sự)

### **Yêu cầu tính năng:**

- CRUD cơ bản
- Chức năng sửa thông tin cơ bản
- Chức năng tạo/xem/sửa HĐLĐ với loại HĐ là có thời hạn hoặc không thời hạn và lương cơ bản

### 2.3.2 Bảng lương

Hiển thị chi tiết lương và các khoản phát sinh của tất cả các nhân sự **có HĐLĐ**. Mỗi tháng chỉ phát hành một bảng lương

### **Yêu cầu tính năng:**

- Hiển thị bảng lương theo tháng (show các thông tin cơ bản : tên, lương CB, phụ cấp, chuyên cần, tiền ứng,…)
- Kiểm tra xem 1 tháng bất kỳ đã có bảng lương chưa, nếu chưa thì cho phép tạo bảng lương mới
- Hành động duyệt bảng lương phải kiểm tra xem thông tin nhân sự đã nằm trong đối tượng nhận gửi hay chưa nếu chưa thì cần lấy thông tin nhân sự để thêm vào Đối tượng nhận gửi
- Bảng lương có 2 trạng thái: trước duyệt có thể chỉnh sửa các số liệu, sau duyệt chỉ read-only
- Bảng lương sau khi được duyệt sẽ tạo thành các giao dịch (loại chi lương cho nhân sự)

## 2.4 Module hành chính (\*)

**Nghiệp vụ:**

- Quản lý tài sản (2.4.1)
- Hợp đồng cho thuê (2.4.2)

### 2.4.1 Quản lý tài sản

Quản lý tài sản thuộc sở hữu của giáo phận. Một số tài sản sẽ được cho thuê để tạo thêm nguồn thu

### **Yêu cầu tính năng:**

- CRUD cơ bản các thông tin: Loại tài sản, diện tích, giá trị, trạng thái, hình ảnh ,…
- Hỗ trợ upload hình ảnh, document và preview được

### 2.4.2 Hợp đồng cho thuê

Một số tài sản mà giáo phận chưa có nhu cầu sử dụng sẽ được cho thuê (nhà, đất,…) sẽ được cho các cá nhân thuê lại nhằm tạo nguồn thu cho các quỹ.

Hợp đồng cần cung cấp thông tin đầy đủ của bên thuê: tên, điện thoại, địa chỉ, email,... và thông tin tài khoản ngân hàng (nếu hình thức chuyển khoản), thời hạn, tiền cọc,...

Khi đã có hợp đồng, theo chu kỳ người thuê sẽ nộp một khoản phí ứng với số tiền thuê trên hợp đồng

### **Yêu cầu tính năng:**

- CRUD cơ bản
- Hỗ trợ upload hình ảnh, document và preview được
- Chức năng edit sẽ bị giới hạn chỉ sửa được mỗi thời hạn và số tiền thuê
- Thực hiện giao dịch cho việc trả tiền thuê hằng tháng thành công sẽ tạo thành giao dịch (loại tiền thuê tài sản)
- Khoản thanh toán luôn gắn với 1 quỹ nhất định, có thể đổi sang quỹ khác,
- Nếu hình thức là chuyển khoản phải đảm bảo đủ cả thông tin tài khoản 2 bên gửi và nhận, nếu thiếu thông tin một trong hai thì không cho người dùng chọn phương thức này và đưa ra dòng chỉ dẫn

## 2.5 Module hệ thống

**Nghiệp vụ:**

- Phân quyền (2.5.1)
- Audit Log (2.5.2)

### 2.5.1 Phân quyền (RBAC)

Hệ thống phân quyền theo mô hình RBAC (Role-Based Access Control) nhằm kiểm soát quyền truy cập của người dùng vào các chức năng trong hệ thống. Mỗi người dùng được gán một vai trò, và vai trò đó quyết định những gì họ có thể xem, tạo, sửa, xóa.

Hệ thống có **5 vai trò** chính:

| Vai trò     | Mô tả                          | Phạm vi                               |
| ----------- | ------------------------------ | ------------------------------------- |
| Super Admin | Tòa Giám mục                   | Toàn quyền trên toàn hệ thống         |
| Cha Quản lý | Quản lý tài chính giáo phận    | Duyệt giao dịch, bảng lương, hợp đồng |
| Cha xứ      | Quản lý giáo xứ được phân công | Chỉ dữ liệu giáo xứ của mình          |
| Kế toán VP  | Văn phòng Tòa Giám mục         | Nhập liệu tài chính, nhân sự          |
| Thư ký GX   | Hỗ trợ Cha xứ                  | Nhập liệu giáo dân, giao dịch cơ bản  |

### **Yêu cầu tính năng:**

**Quản lý người dùng:**

- CRUD tài khoản người dùng: họ tên, email, số điện thoại, mật khẩu
- Gán vai trò cho người dùng (chỉ được chọn 1 trong 5 vai trò)
- Gán người dùng vào giáo xứ cụ thể (áp dụng cho Cha xứ, Thư ký GX)
- Kích hoạt / Vô hiệu hóa tài khoản mà không cần xóa
- Reset mật khẩu cho người dùng

**Phân quyền theo vai trò:**

- Mỗi vai trò có danh sách quyền truy cập vào các module được định nghĩa sẵn
- Menu sidebar tự động ẩn/hiện dựa trên vai trò của người dùng đăng nhập
- Các API endpoint phải kiểm tra quyền trước khi thực thi
- Nếu người dùng truy cập URL không có quyền, redirect về Dashboard kèm thông báo lỗi

### 2.5.2 Audit Log (Nhật ký hệ thống)

Ghi lại toàn bộ lịch sử thao tác của người dùng trên hệ thống nhằm mục đích:

- Truy vết khi có sự cố hoặc tranh chấp dữ liệu
- Đảm bảo tính minh bạch trong quản lý tài chính
- Hỗ trợ kiểm toán nội bộ

Mỗi bản ghi audit log bao gồm: **Ai** làm **gì**, với **đối tượng nào**, **khi nào**, từ **đâu** (IP/thiết bị).

### **Yêu cầu tính năng:**

**Ghi nhận tự động:**

- Tự động ghi log khi có thao tác: Tạo, Sửa, Xóa trên các đối tượng quan trọng
- Đối tượng cần ghi log: Người dùng, Giáo xứ, Giao dịch, Quỹ, Nhân sự, Bảng lương, Tài sản, Hợp đồng
- Lưu trữ giá trị trước và sau khi thay đổi (old_value, new_value) để có thể so sánh
- Ghi nhận thông tin thiết bị: IP address, User Agent, thời gian

**Xem và tìm kiếm:**

- Hiển thị danh sách log theo thứ tự thời gian (mới nhất trước)
- Lọc theo: Khoảng thời gian, Người thực hiện, Loại hành động (Create/Update/Delete), Module/Đối tượng
- Tìm kiếm theo từ khóa trong nội dung thay đổi
- Xem chi tiết một log: hiển thị đầy đủ old_value và new_value dạng JSON hoặc bảng so sánh

# 3. ĐỐI TƯỢNG NGƯỜI DÙNG & TÍNH NĂNG CỐT LÕI (MUST-HAVE FEATURES)

### 3.1 SUPER ADMIN (Quản Trị Hệ Thống)

| User Story ID | Tên tính năng      | Mô tả chi tiết (Acceptance Criteria)  | Ưu tiên |
| ------------- | ------------------ | ------------------------------------- | ------- |
| SA-01         | Quản lý Người dùng | - Tạo tài khoản mới (trừ super_admin) |

- Sửa thông tin người dùng
- Khóa/mở khóa tài khoản
- Xóa người dùng | **MUST HAVE** |
  | SA-02 | Phân quyền User | - Gán vai trò cho người dùng
- Thay đổi vai trò khi cần | **MUST HAVE** |
  | SA-03 | Tạo Giao dịch Thu | - Nhập khoản thu mới
- Chọn quỹ, danh mục, tài khoản
- Đính kèm hình ảnh chứng từ | **MUST HAVE** |
  | SA-04 | Tạo Giao dịch Chi | - Nhập khoản chi mới
- Hỗ trợ chi thường và chi lương
- Đính kèm hình ảnh chứng từ | **MUST HAVE** |
  | SA-05 | Phê duyệt Giao dịch | - Duyệt đơn lẻ hoặc hàng loạt
- Từ chối giao dịch không hợp lệ | **MUST HAVE** |
  | SA-06 | Quản lý Phiếu Thu Chi | - Tạo phiếu sau khi duyệt
- Hủy phiếu đã tạo | **MUST HAVE** |
  | SA-07 | Xem Dashboard | - Xem thống kê tổng quan
- Biểu đồ thu chi | **SHOULD HAVE** |
  | SA-08 | Cài đặt Hệ thống | - Truy cập toàn bộ cài đặt
- Quản lý cấu hình hệ thống | **SHOULD HAVE** |

### 3.2 CHA QUẢN LÝ (Quản Lý Giáo Phận)

| User Story ID | Tên tính năng       | Mô tả chi tiết (Acceptance Criteria) | Ưu tiên |
| ------------- | ------------------- | ------------------------------------ | ------- |
| CQL-01        | Phê duyệt Khoản Thu | - Xem danh sách thu chờ duyệt        |

- Duyệt đơn lẻ hoặc hàng loạt
- Từ chối với lý do | **MUST HAVE** |
  | CQL-02 | Phê duyệt Khoản Chi | - Xem danh sách chi chờ duyệt
- Duyệt đơn lẻ hoặc hàng loạt
- Từ chối với lý do | **MUST HAVE** |
  | CQL-03 | Xem Dashboard | - Xem thống kê tổng quan
- Theo dõi hoạt động giáo phận | **MUST HAVE** |
  | CQL-04 | Quản lý Giáo xứ | - Xem thông tin các giáo xứ
- Cập nhật thông tin giáo xứ | **SHOULD HAVE** |
  | CQL-05 | Quản lý Nhân sự | - Xem danh sách nhân sự
- Cập nhật thông tin nhân viên | **SHOULD HAVE** |
  | CQL-06 | Quản lý Bảng lương | - Xem bảng lương
- Phê duyệt bảng lương | **SHOULD HAVE** |
  | CQL-07 | Quản lý Tài sản | - Xem danh sách tài sản
- Xem hợp đồng cho thuê | **COULD HAVE** |

### 3.3 CHA XỨ (Quản Lý Giáo Xứ)

| User Story ID | Tên tính năng | Mô tả chi tiết (Acceptance Criteria)  | Ưu tiên |
| ------------- | ------------- | ------------------------------------- | ------- |
| CX-01         | Tạo Khoản Thu | - Nhập khoản thu (lễ, quyên góp, ...) |

- Chọn quỹ và danh mục
- Gửi duyệt lên Cha Quản Lý | **MUST HAVE** |
  | CX-02 | Tạo Khoản Chi | - Nhập khoản chi thường
- Đính kèm chứng từ
- Gửi duyệt lên Cha Quản Lý | **MUST HAVE** |
  | CX-03 | Quản lý Giáo dân | - Thêm hồ sơ giáo dân mới
- Cập nhật thông tin giáo dân
- Quản lý thông tin gia đình | **MUST HAVE** |
  | CX-04 | Xem Dashboard | - Xem thống kê giáo xứ
- Theo dõi thu chi | **MUST HAVE** |
  | CX-05 | Quản lý Giáo xứ | - Xem/sửa thông tin giáo xứ
- Cấu hình giáo xứ | **SHOULD HAVE** |
  | CX-06 | Quản lý Tài sản | - Xem danh sách tài sản giáo xứ
- Cập nhật thông tin tài sản | **SHOULD HAVE** |
  | CX-07 | Quản lý Hợp đồng thuê | - Xem hợp đồng cho thuê
- Tạo khoản thu từ tiền thuê | **SHOULD HAVE** |
  | CX-08 | Xem Giao dịch | - Xem lịch sử giao dịch đã tạo
- Theo dõi trạng thái duyệt | **SHOULD HAVE** |

### 3.4 KẾ TOÁN (Quản Lý Tài Chính)

| User Story ID | Tên tính năng        | Mô tả chi tiết (Acceptance Criteria) | Ưu tiên |
| ------------- | -------------------- | ------------------------------------ | ------- |
| KT-01         | Quản lý Danh mục Quỹ | - Tạo/sửa/xóa quỹ                    |

- Phân loại quỹ (A, B, C)
- Quản lý kỳ ngân sách | **MUST HAVE** |
  | KT-02 | Quản lý Danh mục Thu Chi | - Tạo danh mục thu/chi mới
- Thiết lập danh mục cha-con
- Không xóa danh mục hệ thống | **MUST HAVE** |
  | KT-03 | Quản lý Tài khoản NH | - Thêm tài khoản ngân hàng
- Thiết lập TK thu/chi/cả hai
- Đặt TK mặc định | **MUST HAVE** |
  | KT-04 | Quản lý Đối tượng | - Thêm người nộp/nhận tiền
- Lưu thông tin ngân hàng
- Kích hoạt/vô hiệu hóa | **MUST HAVE** |
  | KT-05 | Xem Giao dịch | - Xem tất cả giao dịch
- Lọc theo trạng thái, ngày, quỹ | **MUST HAVE** |
  | KT-06 | Đối soát | - Kiểm tra số dư các quỹ
- Đối chiếu với ngân hàng | **SHOULD HAVE** |
  | KT-07 | Điều chỉnh số dư | - Tạo phiếu điều chỉnh tăng/giảm
- Ghi nhận lý do điều chỉnh | **SHOULD HAVE** |
  | KT-08 | Quản lý Nhân sự | - Xem danh sách nhân viên
- Cập nhật thông tin lương | **SHOULD HAVE** |
  | KT-09 | Xử lý Bảng lương | - Tạo bảng lương hàng tháng
- Tính: Cơ bản + Phụ cấp - Khấu trừ
- Theo dõi trạng thái thanh toán | **SHOULD HAVE** |
  | KT-10 | Xem Dashboard | - Xem thống kê tài chính
- Biểu đồ thu chi | **SHOULD HAVE** |

### 3.5 THƯ KÝ GX (Hỗ Trợ Cha Xứ)

| User Story ID | Tên tính năng      | Mô tả chi tiết (Acceptance Criteria) | Ưu tiên |
| ------------- | ------------------ | ------------------------------------ | ------- |
| TK-01         | Nhập liệu Giáo dân | - Thêm hồ sơ giáo dân mới            |

- Cập nhật thông tin cơ bản
- Quản lý thông tin gia đình | **MUST HAVE** |
  | TK-02 | Nhập Khoản Thu | - Tạo khoản thu (lễ, quyên góp)
- Chọn người nộp, quỹ, danh mục
- Gửi duyệt lên Cha Xứ/Cha QL | **MUST HAVE** |
  | TK-03 | Nhập Khoản Chi | - Tạo khoản chi nhỏ
- Đính kèm chứng từ
- Gửi duyệt lên Cha Xứ/Cha QL | **MUST HAVE** |
  | TK-04 | Xem Giao dịch đã tạo | - Xem danh sách giao dịch đã nhập
- Theo dõi trạng thái duyệt | **SHOULD HAVE** |

# 4. CÁC TÍNH NĂNG MỞ RỘNG (SHOULD/COULD HAVE)

- Audit log theo dõi sự thay đổi dữ liệu cho module Tài chính
- Quản lý nhiều ORG
- Phân quyền theo cây thư mục
- Data scope (chỉ thấy được những data ngang cập hoặc dưới cấp, không thấy được những data vượt cấp)
