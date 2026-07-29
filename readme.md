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

# Checkpoint-2: Add / edit / delete task functionality

Bu mərhələdə (Checkpoint-2) tapşırıqların əlavə edilməsi, redaktə olunması və silinməsi funksionallıqları tam şəkildə reallaşdırıldı. Layihənin bütün CSS sinifləri strict **BEM (Block Element Modifier)** metodologiyasına keçirildi.

---

## 🛠️ Checkpoint-2 Nələr Edildi Və Necə Hazırlandı?

### 1. BEM Metodologiyasına Keçid (`styles.css` və `index.html`)
Bütün CSS strukturu BEM standarta uyğunlaşdırıldı:
- **Bloklar (Blocks):** `.kanban-app`, `.app-header`, `.search-box`, `.filter-box`, `.btn`, `.kanban-board`, `.kanban-column`, `.task-card`, `.task-modal`, `.form-group`, `.priority-badge`.
- **Elementlər (Elements):** `.app-header__title`, `.kanban-column__header`, `.task-card__title`, `.task-card__btn`, `.task-modal__close`, `.form-group__input` və s.
- **Modifikatorlar (Modifiers):** `.btn--primary`, `.btn--secondary`, `.kanban-column__dot--pending`, `.priority-badge--low`, `.priority-badge--high`, `.task-modal--hidden`, `.task-card__btn--edit`, `.task-card__btn--delete`.

---

### 2. Tapşırıq Əlavə Etmə Funksionallığı (Add Task)
- `+ Yeni Tapşırıq` düyməsinə kliklədikdə `openModal()` çağırılır və Modal `Yeni Tapşırıq` başlığı ilə açılır.
- Forma `Başlıq *` (məcburi meyar), `Açıqlama` və `Prioritet dərəcəsi` (`Aşağı`, `Orta`, `Yüksək`) sahələrindən ibarətdir.
- `Yadda saxla` düyməsi sıxıldıqda:
  - Formanın validation-ı yoxlanılır (Başlıq boşdursa əlavə olunmur).
  - Unikal `id` (`Date.now().toString()`) yaradılaraq yeni obyekt `tasks` massivinə `gozlamada` statusu ilə daxil edilir.
  - Modal bağlanır, forma sıfırlanır və `renderBoard()` çağırılaraq DOM dərhal yenilənir.
- `Ləğv et` düyməsi və ya modalın `close-outline` (X) düyməsi sıxıldıqda modal heç bir dəyişiklik etmədən bağlanır.

---

### 3. Tapşırıq Redaktə Etmə Funksionallığı (Edit Task)
- Kart üzərindəki narıncı qələm (`pencil-outline`) ikonuna kliklədikdə `openModal(task)` çağırılır.
- `editingTaskId` dəyişəni aktivləşdirilir və Modal başlığı `Tapşırığı Redaktə Et` olaraq dəyişdirilir.
- Formanın sahələri mövcud tapşırığın məlumatları ilə pre-fill olunur (avtomatik doldurulur).
- Dəyişikliklər edilib `Yadda saxla` vurulduqda, massivdəki həmin `id`-li tapşırığın məlumatları yenilənir və board DOM-da dərhal əks olunur.

---

### 4. Tapşırıq Silmə Funksionallığı (Delete Task)
- Kart üzərindəki qırmızı zibil qutusu (`trash-outline`) ikonuna kliklədikdə brauzerin doğma təsdiq pəncərəsi çağırılır:
  `confirm("Bu tapşırığı silmək istədiyinizdən əminsiniz?")` (Videodakı sorğu mesajına 100% uyğun).
- İstifadəçi `OK` (Təsdiq) etdikdə tapşırıq `tasks` massivindən silinir və sütun sayğacları və kart siyahısı dərhal yenilənir. `Cancel` etdikdə isə tapşırıq olduğu kimi qalır.

---

# Checkpoint-3: Cross-column drag-and-drop (HTML5 Drag and Drop API)

Bu mərhələdə (Checkpoint-3) doğma **HTML5 Drag and Drop API**-dən istifadə edərək tapşırıq kartlarının sütunlar arası sürüklənib sürüşdürülməsi (Drag-and-Drop) funksionallığı tam reallaşdırıldı. Bütün BEM strukturu və çərçivəsiz Vanilla CSS prinsipləri gözlənildi.

---

## 🛠️ Checkpoint-3 Nələr Edildi Və Necə Hazırlandı?

### 1. Kart Sürüklənmə Hadisələri (`dragstart` və `dragend`)
- Hər dinamik yaradılan kart `.task-card` elementinə `draggable="true"` atributu təyin edildi.
- **`dragstart` Hadisəsi:**
  - Sürüklənən tapşırığın `id` məlumatı `e.dataTransfer.setData('text/plain', task.id)` vasitəsilə saxlanılır.
  - Sürükləmə effektini göstərmək üçün `e.dataTransfer.effectAllowed = 'move'` müəyyən edilir.
  - Karta `.task-card--dragging` BEM modifikatoru əlavə olunur (şəffaflıq 0.4 və kəsilən kənar xətt effekti ilə).
- **`dragend` Hadisəsi:**
  - Sürükləmə bitdikdə kartdan `.task-card--dragging` sinfi çıxarılır və sütunlardakı vurğulama effektləri təmizlənir.

---

### 2. Sütun Hədəf Hadisələri (`dragover`, `dragleave` və `drop`)
- `setupColumnDragAndDrop()` funksiyası vasitəsilə 3 Kanban sütununa (`.kanban-column`) dinləyicilər bağlandı:
- **`dragover` Hadisəsi:**
  - `e.preventDefault()` çağırılaraq elementin sürüşdürmə hədəfi olması təmin edilir.
  - Sütuna `.kanban-column--drag-over` BEM modifikatoru əlavə edilir (bənövşəyi kəsilən çərçivə və açıq tonlu vurğulama fonu ilə).
- **`dragleave` Hadisəsi:**
  - Sürüklənən kart sütun sahəsindən çıxdıqda `.kanban-column--drag-over` sinfi silinir.
- **`drop` Hadisəsi:**
  - `e.preventDefault()` ilə standart brauzer davranışı dayandırılır.
  - Sütunun `data-status` atributundan hədəf statusu (`gozlamada`, `icra_olunur`, `tamamlandi`) oxunur.
  - `e.dataTransfer.getData('text/plain')` vasitəsilə sürüklənən tapşırığın `id`-si əldə edilir.
  - `tasks` massivində həmin tapşırığın `status` dəyəri yeni sütunun statusu ilə yenilənir və `renderBoard()` çağırılaraq həm sütun sayğacları, həm də kartlar DOM-da dərhal yerini dəyişir.

---

## 📁 Fayl Strukturu

```
.
├── index.html        # BEM sinifləri və Ionicons CDN ilə yenilənmiş HTML
├── styles.css        # Drag-and-Drop BEM modifikatorları ilə Vanilla CSS
├── script.js        # HTML5 Drag and Drop API inteqrasiyası və dinamik DOM
├── guide.md          # Checkpoint təlimatları
└── readme.md         # Layihənin sənədləşdirilməsi (CP-1, CP-2 və CP-3)
```
