# Checkpoint-1: Dynamic rendering of tasks from a JS array (DOM manipulation)

Bu mərhələdə (Checkpoint-1) Kanban tapşırıq lövhəsinin struktur HTML-i, müasir CSS dizaynı və tapşırıqların JavaScript massivindən (array) dinamik şəkildə DOM-a render olunması həyata keçirildi. Bütün ikonlar **Ionicons** kitabxanası (`<ion-icon>`) ilə təchiz edilmişdir.

---

## 🛠️ Nələr Edildi Və Necə Hazırlandı?

### 1. HTML Quruluşu (`index.html`)
- **Ionicons İnteqrasiyası:** CDN vasitəsilə Ionicons skripti daxil edildi (`<script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>`).
- **App Header (Naviqasiya paneli):**
  - Sol tərəfdə Bənövşəyi fonlu `grid-outline` ikonlu loqo və `Kanban İdarəetmə` başlığı yerləşdirildi.
  - Sağ tərəfdə axtarış inputu (`search-outline` ikonu ilə), prioritet filter menyusu (`funnel-outline` ikonu ilə) və `+ Yeni Tapşırıq` (`add-outline` ikonu ilə) düyməsi əlavə edildi.
- **Kanban Board Container (Lövhə sütunları):**
  - **3 Sütun** yaradıldı:
    1. `Gözləmədə` (`data-status="gozlamada"`) - Boz status indikatoru ilə.
    2. `İcra olunur` (`data-status="icra_olunur"`) - Narıncı/Sarı status indikatoru ilə.
    3. `Tamamlandı` (`data-status="tamamlandi"`) - Yaşıl status indikatoru ilə.
  - Hər bir sütun üçün dinamik sayğac `count-<status>` və tapşırıqlar siyahısı konteyneri `list-<status>` hazırlandı.
- **Modal Dialoq (`taskModal`):**
  - `close-outline` ikonu ilə modal pəncərənin bağlanma düyməsi və forma sahələri yerləşdirildi.

---

### 2. CSS Dizaynı (`styles.css`)
- **Vendor Prefix Məhdudiyyəti:** Çərçivə (framework) istifadə edilmədi, heç bir `-webkit-` prefiksi daxil edilmədən sırf standart CSS qaydalarından istifadə olundu.
- **Dizayn Konsepsiyası:**
  - Video nümunəsinə uyğun piksel-piksel dəqiqlikdə rənglər:
    - Səhifə fonu: `#F8FAFC`
    - Sütun fonları: `#F1F5F9`
    - Əsas düymələr və brend rəngi: `#4F46E5` (Indigo-600)
  - Prioritet nişanları (Badges):
    - `AŞAĞI`: Açıq yaşıl fon (`#DEF7EC`), tünd yaşıl yazı (`#03543F`).
    - `ORTA`: Açıq sarı/narıncı fon (`#FEF3C7`), tünd narıncı yazı (`#B45309`).
    - `YÜKSƏK`: Açıq qırmızı fon (`#FEE2E2`), tünd qırmızı yazı (`#B91C1C`).
  - Ionicons ölçüləri və rəng ahəngdarlığı CSS `font-size` və `color` vasitəsilə tənzimləndi.

---

### 3. JavaScript Dinamik DOM Renderasiyası (`script.js`)
- **State (Dövr halı):**
  - Tapşırıqlar `tasks` adlı JS obyekt massivində saxlanılır. Hər tapşırığın `id`, `title`, `description`, `priority` (`low` | `medium` | `high`), `status` (`gozlamada` | `icra_olunur` | `tamamlandi`) və `createdAt` sahələri var.
- **Dinamik Kart Yaradılması (`createTaskCard`):**
  - JavaScript `document.createElement()` vasitəsilə kartın HTML elementləri təhlükəsiz şəkildə qurulur.
  - Kartın aşağı hissəsində Ionicons `time-outline` (saat), `pencil-outline` (redaktə) və `trash-outline` (sil) ikonları istifadə olunur.
- **Lövhənin Renderməsi (`renderBoard`):**
  - `tasks` massivindəki elementi statuslarına görə filtrləyir, sayğacları yeniləyir və DOM-a yerləşdirir. Sütun boş olduqda `Burada tapşırıq yoxdur` göstərir.

---

## 📁 Fayl Strukturu

```
.
├── index.html        # Kanban board HTML strukturu, Ionicons CDN və Modal komponenti
├── styles.css        # Sırf Vanilla CSS (No Webkit, No Framework)
├── script.js        # JavaScript massivindən dinamik DOM renderasiyası
├── guide.md          # Checkpoint təlimatları
└── readme.md         # Layihənin addım-addım sənədləşdirilməsi
```
