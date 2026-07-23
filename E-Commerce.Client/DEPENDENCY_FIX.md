# Dependency Fix

Bu tam Client paketinde React 18 ile uyumsuz olan kullanılmayan `react-leaflet@5`
bağımlılığı kaldırıldı.

Proje harita ekranında `react-leaflet` kullanmıyor; doğrudan `leaflet` paketi
`src/app/components/dashboard/LeafletMap.tsx` içinde kullanılıyor.

Temiz kurulum:

```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\node_modules\.vite -ErrorAction SilentlyContinue
npm cache verify
npm install
npm run dev
```
