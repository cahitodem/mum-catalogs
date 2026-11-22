# MUM Türkçe Platform Katalogları

Nuvio için kişisel, düzenlenebilir Exxen ve GAİN katalogları. Bu proje yalnızca katalog/metadata keşfi sağlar; video, yayın bağlantısı veya platform hesabı erişimi sağlamaz.

## Kataloglar

- Exxen Filmleri
- Exxen Dizileri
- GAİN Filmleri
- GAİN Dizileri

Kataloglar şu an doğrulanmış IMDb kimlikleri bulunan dizi ve programlardan oluşan bir başlangıç listesidir. Exxen ana sayfasındaki tam liste ve TMDB GAİN ağı düzenli değişebilir; bu depodaki listeler bu sayfaların otomatik ve eksiksiz kopyası değildir. Yeni başlıkları `data/` altına ekleyip derleyebilirsiniz. Mahsun J, TMDB'deki GAİN ağına göre GAİN kataloğunda tutulur.

## İçerik ekleme

Başlıkları `data/` altındaki ilgili JSON dosyasına ekleyin:

```json
{
  "items": [
    { "id": "tt13675832", "name": "Gibi", "year": 2021 }
  ]
}
```

`id`, IMDb başlık kimliği olmalıdır (`tt` ve rakamlar). Derleme, her içerik için poster URL'sini katalog yanıtına ekler. İsterseniz kaynak veride `poster` alanıyla kendi HTTPS poster adresinizi belirtebilirsiniz. Aynı başlığı iki farklı platformun kataloğunda göstermek için iki dosyaya da ekleyebilirsiniz.

## Derleme ve yerel kontrol

Node.js 20+ ile:

```powershell
npm run build
```

Bu, manifestteki dört katalog için statik Stremio uyumlu yanıtları `catalog/movie/` ve `catalog/series/` altında üretir. Manifest yeni katalog eklediğinizde `manifest.json` içinde, içerik listesini de `data/<katalog-id>.json` içinde güncelleyin.

## Nuvio'ya yükleme

Manifesti HTTPS üzerinden erişilen statik bir barındırma alanına (örneğin GitHub Pages) yayınlayın. Nuvio'da **Ayarlar → Eklentiler → URL ile ekle** bölümüne yayınlanan `manifest.json` bağlantısını yapıştırın. Kataloglar, aynı barındırma kökünde `catalog/{movie|series}/{id}.json` yollarında bulunmalıdır.

GitHub Pages kullanılıyorsa manifest URL'si `https://<kullanıcı>.github.io/<depo>/manifest.json` biçimindedir. Güncelleme sonrası Nuvio'da eklentiyi yenileyin; Nuvio önbelleğinde eski katalog yanıtı kalmışsa eklentiyi kaldırıp yeniden ekleyin.
