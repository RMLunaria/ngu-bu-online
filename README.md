# Ngủ bù thời gian thực — Online Multiplayer

## Chạy thử trên máy Windows

1. Cài Node.js (khuyến nghị Node.js 20 trở lên).
2. Giải nén dự án và mở Terminal/CMD **ngay trong thư mục `ngu-bu-online`** (nơi có `package.json`).
3. Chạy:

   ```bash
   npm install
   npm start
   ```

4. Mở `http://localhost:3000`. Nhập tên và mã phòng. Người chơi dùng cùng URL và cùng mã phòng sẽ gặp nhau.

Hoặc chạy `start.bat` trên Windows.

## Đưa mã nguồn lên GitHub

Tạo một repository mới trên GitHub (ví dụ `ngu-bu-online`). Với repository mới, không chọn tạo sẵn README, license hoặc `.gitignore` để tránh xung đột khi push lần đầu. Mở Terminal **trong thư mục dự án này**, rồi chạy lần lượt (thay URL bằng URL repository của bạn):

```bash
git init
git add index.html server.js package.json README.md .gitignore
git commit -m "Initial online game"
git branch -M main
git remote add origin https://github.com/USERNAME/ngu-bu-online.git
git push -u origin main
```

Nếu Git báo `remote origin already exists`, dùng `git remote -v` để kiểm tra, rồi cập nhật bằng `git remote set-url origin https://github.com/USERNAME/ngu-bu-online.git`. Nếu Git báo thiếu danh tính, cấu hình tên/email Git bằng thông tin GitHub của bạn:

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

**Quan trọng:** chỉ chạy lệnh ở thư mục `ngu-bu-online`, không chạy ở `C:\Users\...` hoặc thư mục Desktop chung. Nếu không, Git có thể nhận nhầm cả `AppData`, `Documents`, `.ssh` và các thư mục cá nhân. Không đưa mật khẩu, token hay khóa riêng vào repository.

## Mở cho bạn bè ở mạng khác cùng chơi

GitHub chỉ lưu mã nguồn; GitHub Pages không chạy được `server.js` và WebSocket của game. Bạn cần deploy **toàn bộ repository** lên một dịch vụ hosting chạy ứng dụng Node.js và hỗ trợ WebSocket (ví dụ một dịch vụ dạng Web Service). Cấu hình triển khai cơ bản:

- Build/install command: `npm install`
- Start command: `npm start`
- Port: để nền tảng tự truyền biến môi trường `PORT` (server đã đọc biến này).
- Health check (nếu nền tảng có hỗ trợ): `/health`

Sau khi deploy thành công, nền tảng cấp cho bạn một URL công khai dạng `https://...`. Gửi URL đó và mã phòng cho bạn bè. Tất cả cùng mở URL, nhập cùng mã phòng, và server sẽ tự chuyển WebSocket sang `wss://` khi trang chạy bằng HTTPS.

Chọn host có hỗ trợ WebSocket và kiểm tra giới hạn/bảng giá hiện tại trước khi dùng; chính sách gói miễn phí của các nhà cung cấp có thể thay đổi. Không cần mở port trên modem/router nhà bạn khi deploy lên hosting.

## Chạy qua mạng Wi-Fi/LAN (chỉ khi server chạy trên máy bạn)

- Dùng `ipconfig` để xem IPv4 của máy chạy server.
- Người cùng Wi-Fi mở `http://DIA-CHI-IP:3000`.
- Có thể cần cho phép Node.js qua Windows Firewall.

Cách LAN này không tự mở truy cập từ Internet; để bạn bè ở mạng khác tham gia, hãy dùng phần deploy ở trên.

## Tính năng đồng bộ hiện có

- Tên người chơi và mã phòng.
- Nhân vật người khác trong cùng phòng, tên trên đầu nhân vật.
- Vị trí, hướng quay và chuyển động cơ bản.
- Tư thế nằm/ngủ dựa trên góc xoay nhân vật.

Bản hiện tại chưa có tài khoản, chat, lưu tiến trình hoặc hệ thống chống gian lận nâng cao. Mã phòng là tên phòng, không phải mật khẩu riêng tư.
