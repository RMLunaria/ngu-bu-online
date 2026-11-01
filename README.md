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
