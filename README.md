# Geo-Notes (Ghi chú theo vị trí) - Vite + React + Capacitor + Express

## Mục tiêu
- Nút "Check-in": lưu ghi chú + lat/lng
- Danh sách các ghi chú
- Hiển thị các điểm trên bản đồ (Leaflet)

## Cấu trúc
```
.
├─ fe/   # Frontend: Vite + React + Capacitor
└─ be/   # Backend: Express
```

## Chạy Frontend (Web)
```bash
cd fe
npm install
npm run dev
```
Mặc định chạy tại: http://localhost:5173

## Capacitor (Android/iOS)
```bash
# chỉ cần làm lần đầu
npx cap init "MemeMaker" "com.example.mememaker" --web-dir=dist
npx cap add android
npx cap add ios

# build và đồng bộ web vào native
npm run build
npx cap copy
npx cap sync

# mở project native
npx cap open android
npx cap open ios
```

## Plugin / Thư viện sử dụng
- @capacitor/geolocation
- leaflet, react-leaflet

## Chạy Backend
```bash
cd be
npm install
npm run dev
```
- Healthcheck: http://localhost:4000/health
- Upload (mock): POST http://localhost:4000/upload (form-data: file)

## Ghi chú
- Trên Android/iOS cần cấp quyền định vị (Geolocation)
- Có thể mở rộng: lọc ghi chú theo bán kính, mở Google/Apple Maps dẫn đường
