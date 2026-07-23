# AI Assistant Frontend

Bu frontend iki sade AI sohbet deneyimi içerir:

- Seller Panel: `/panel/seller/ai-assistant`
- Customer Chat Widget: müşteri sayfalarında sağ altta

## Davranış

### Seller

- Yalnızca sohbet ekranı bulunur.
- PDF ve görseller sohbet kutusundaki ataç düğmesiyle eklenir.
- Dosya inceleme isteği normal sohbet mesajıyla gönderilir.
- Görsel üretme isteği de normal sohbet mesajıyla yazılır.
- Backend cevapta `generatedImageUrl` döndürürse görsel sohbet balonunda gösterilir.

### Customer

- Yalnızca metin tabanlı sohbet bulunur.
- Dosya yükleme özelliği yoktur.

## Backend bağlantısı

Varsayılan olarak frontend önizlemesi için mock servis kullanılır. Gerçek backend hazır
olduğunda `src/app/services/aiAssistantService.ts` dosyasının sonundaki export'u değiştir:

```ts
export const aiAssistantService = createHttpAiAssistantService('https://api.example.com');
```

Aynı origin kullanılıyorsa:

```ts
export const aiAssistantService = createHttpAiAssistantService();
```

## Tek endpoint

`POST /api/ai/chat`

İstek `multipart/form-data` olarak gönderilir.

Form alanları:

- `audience`: `seller` veya `customer`
- `message`: kullanıcı mesajı
- `attachments`: yalnızca Seller tarafında sıfır veya daha fazla PDF/görsel

Metin cevap örneği:

```json
{
  "id": "message-id",
  "content": "Asistan cevabı",
  "createdAt": "2026-07-19T14:00:00Z"
}
```

Görsel üretimi cevap örneği:

```json
{
  "id": "message-id",
  "content": "Görsel hazırlandı.",
  "generatedImageUrl": "https://cdn.example.com/generated/image.webp",
  "createdAt": "2026-07-19T14:00:00Z"
}
```

Backend, mesajın görsel üretme isteği olduğunu Gemini akışında belirleyip aynı chat
endpoint'inden `generatedImageUrl` döndürebilir.

## Dosya kuralları

Seller frontend'i:

- PDF ve `image/*` MIME türlerini kabul eder.
- Dosya başına 15 MB sınırı uygular.
- En fazla 5 dosya kabul eder.
- Görseller için yerel önizleme oluşturur.

Gerçek MIME doğrulaması, dosya boyutu kontrolü, güvenlik taraması ve API anahtarı
backend tarafında uygulanmalıdır. Gemini API anahtarı frontend koduna yazılmamalıdır.
