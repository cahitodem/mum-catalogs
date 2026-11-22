# MUM Türkçe Platform Katalogları

Nuvio için kişisel, düzenlenebilir Exxen ve GAİN katalogları. Bu proje yalnızca katalog/metadata keşfi sağlar; video, yayın bağlantısı veya platform hesabı erişimi sağlamaz.

## Kataloglar

- Exxen Filmleri
- Exxen Dizileri
- GAİN Filmleri
- GAİN Dizileri

İlk örnekler: Exxen Dizileri içinde *Gibi* (`tt13675832`), GAİN Dizileri içinde *Ayak İşleri* (`tt14344266`). Platform katalogları ve kullanılabilirlik zaman içinde değişebileceğinden listedeki içerikleri kendiniz güncel tutun.

## İçerik ekleme

Başlıkları `data/` altındaki ilgili JSON dosyasına ekleyin:

```json
{
  "items": [
    { "id": "tt13675832", "name": "Gibi", "year": 2021 }
  ]
}
```

`id`, IMDb başlık kimliği olmalıdır (`tt` ve rakamlar). Doğru IMDb kimliği Nuvio'nun kurulu metadata eklentisinin afiş ve detayları bulmasına yardımcı olur. Aynı başlığı iki farklı platformun kataloğunda göstermek için iki dosyaya da ekleyebilirsiniz.

## Derleme ve yerel kontrol

Node.js 20+ ile:

```powershell
npm run build
```

Bu, manifestteki dört katalog için statik Stremio uyumlu yanıtları `catalog/movie/` ve `catalog/series/` altında üretir. Manifest yeni katalog eklediğinizde `manifest.json` içinde, içerik listesini de `data/<katalog-id>.json` içinde güncelleyin.

## Nuvio'ya yükleme

Manifesti HTTPS üzerinden erişilen statik bir barındırma alanına (örneğin GitHub Pages) yayınlayın. Nuvio'da **Ayarlar → Eklentiler → URL ile ekle** bölümüne yayınlanan `manifest.json` bağlantısını yapıştırın. Kataloglar, aynı barındırma kökünde `catalog/{movie|series}/{id}.json` yollarında bulunmalıdır.

Bu çalışma alanı henüz GitHub Pages'e yayınlanmış bir URL içermiyor. `mum-catalogs/manifest.json` dosyasını `https://<kullanıcı>.github.io/<depo>/manifest.json` biçiminde açılacak şekilde yayınlamadan Nuvio'ya URL ile yükleme tamamlanamaz.
