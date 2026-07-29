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

# Checkpoint-4: Storage with localStorage (state is saved when the page is refreshed)

Bu mərhələdə (Checkpoint-4) brauzerin doğma **`localStorage`** imkanlarından istifadə edərək lövhədəki bütün tapşırıqların halının (state) saxlanılması və səhifə yeniləndikdə (refresh) avtomatik bərpası həyata keçirildi.

---

## 🛠️ Checkpoint-4 Nələr Edildi Və Necə Hazırlandı?

### 1. `localStorage` Məlumatlarının Saxlanılması (`saveTasksToStorage`)
- `STORAGE_KEY = 'kanban_tasks'` sabit açar sözü təyin edildi.
- `saveTasksToStorage()` funksiyası yaradıldı: `JSON.stringify(tasks)` vasitəsilə tapşırıqlar massivi string formatına çevrilərək `localStorage.setItem()` ilə yaddaşa yazılır.
- Dəyişiklik baş verən hər an avtomatik sinxronizasiya:
  1. **Yeni tapşırıq əlavə edildikdə** (`handleFormSubmit`)
  2. **Mövcud tapşırıq redaktə edildikdə** (`handleFormSubmit`)
  3. **Tapşırıq silindikdə** (`deleteTask`)
  4. **Tapşırıq başqa sütuna sürüklənib buraxıldıqda** (`drop` event)
  `saveTasksToStorage()` çağırılaraq məlumatlar anında `localStorage`-ə yazılır.

---

### 2. Səhifə Yeniləndikdə Məlumatların Bərpası (`loadTasksFromStorage`)
- `loadTasksFromStorage()` funksiyası yaradıldı: `localStorage.getItem('kanban_tasks')` vasitəsilə yaddaşdakı məlumat oxunur və `JSON.parse()` ilə JS obyekt massivinə çevrilir.
- **Təhlükəsizlik və İstisna İdarəetməsi (Error Handling):** `try...catch` bloku vasitəsilə `localStorage` saxlamasında yarana biləcək hər hansı xəta tutulur. Əgər yaddaş boşdursa və ya xəta baş verərsə, tətbiq çəkmədən boş massiv `[]` qaytarır.
- Səhifə yüklənəndə (`DOMContentLoaded`) tətbiq başlanğıc halı kimi birbaşa `localStorage`-dən gələn məlumatları istifadə edərək lövhəni render edir.

---

# Checkpoint-5: Search and filter by keyword/priority

Bu mərhələdə (Checkpoint-5) tapşırıqların real-vaxt (real-time) rejimində axtarış inputu (`#searchInput`) vasitəsilə açar sözə görə filtrlənməsi və prioritet dropdown menyusu (`#priorityFilter`) vasitəsilə dərəcəyə görə seçilməsi funksionallıqları tam reallaşdırıldı.

---

## 🛠️ Checkpoint-5 Nələr Edildi Və Necə Hazırlandı?

### 1. Açar Sözə Göre Real-Vaxt Axtarış (Search by Keyword)
- Axtarış inputuna (`#searchInput`) `input` hadisəsi (event listener) bağlandı. İstifadəçi hər hərf yazdıqda `renderBoard()` funksiyası çağırılır.
- Axtarış sorğusu registrə həssas olmadan (`toLowerCase()`) həm tapşırığın **başlığında** (`title`), həm də **açıqlamasında** (`description`) axtarılır.

---

### 2. Prioritet Dərəcəsinə Göre Filtrləmə (Filter by Priority)
- Prioritet dropdown menyusuna (`#priorityFilter`) `change` hadisəsi bağlandı.
- İstifadəçi `Bütün prioritetlər` (`all`), `Aşağı` (`low`), `Orta` (`medium`) və ya `Yüksək` (`high`) seçimlərini etdikdə lövhə anında filtrlənir.

---

### 3. Kombinə Edilmiş Filtrləmə Logikası (Combined Filtering)
- `renderBoard()` funksiyası hər 3 parametri eyni anda nəzərə alır:
  1. Tapşırığın sütun statusu (`gozlamada`, `icra_olunur`, `tamamlandi`)
  2. Seçilmiş prioritet dərəcəsi (`all` deyilsə, uyğun gələn tapşırıqlar)
  3. Axtarış inputundakı mətn (boş deyilsə, başlığında və ya açıqlamasında həmin söz olan tapşırıqlar)
- Filtrlənmiş nəticələrə əsasən hər sütunun yuxarısındakı **sayğac** (`count-<status>`) anında yenilənir.
- Əgər axtarış və ya filter nəticəsində sütunda heç bir tapşırıq qalmazsa, həmin sütunda `<div class="kanban-column__empty">Burada tapşırıq yoxdur</div>` bloku göstərilir.

---

# Checkpoint-6: Safe rendering (XSS protection) + duplicate task prevention

Bu mərhələdə (Checkpoint-6) iki kritik təhlükəsizlik mexanizmi reallaşdırıldı: **XSS (Cross-Site Scripting) hücumlarından qorunma** və **eyni adlı tapşırığın təkrar əlavə olunmasının qarşısının alınması (duplicate prevention)**.

---

## 🛠️ Checkpoint-6 Nələr Edildi Və Necə Hazırlandı?

### 1. XSS Qorunması (XSS Protection)

**Problem:** İstifadəçi daxil etdiyi mətn `innerHTML` vasitəsilə DOM-a yazılsaydı, xüsusi HTML/JavaScript simvolları icra oluna bilərdi (məsələn: `<script>alert('XSS')</script>`).

**Həll — `sanitizeText()` funksiyası:**
- İstifadəçinin daxil etdiyi xam mətn (`rawTitle`, `rawDescription`) `sanitizeText()` funksiyasından keçirilir.
- Funksiya gizli bir `<div>` elementi yaradır, daxil olan mətni `.textContent` ilə yazır (bu mərhələdə brauzerin özü `<`, `>`, `"`, `&` kimi simvolları avtomatik kodlayır), sonra `.innerHTML`-dən çıxarır. Beləliklə, mətndəki hər hansı HTML teqləri zərərsizləşdirilir.
- Kart yaradılarkən (`createTaskCard`) istifadəçi məlumatları yalnız `.textContent` ilə DOM-a yazılır: `title.textContent`, `desc.textContent`, `timeSpan.textContent` — `innerHTML`-dən tamamilə imtina edildi.
- `<ion-icon>` elementlərinin özü `document.createElement('ion-icon')` ilə yaradılıb `setAttribute()` vasitəsilə konfiqurasiya edildi — heç bir istifadəçi məlumatı `innerHTML`-ə ötürülmür.

---

### 2. Eyni Tapşırığın Əlavə Olunmasının Qarşısının Alınması (Duplicate Prevention)

**Həll — `isDuplicateTask()` funksiyası:**
- Forma göndərilmədən əvvəl yeni tapşırığın başlığı mövcud bütün tapşırıqların başlıqları ilə müqayisə edilir.
- Müqayisə registrə həssas deyil: hər iki tərəf `.trim().toLowerCase()` vasitəsilə normallaşdırılır (məsələn, `"test"`, `"TEST"`, `"Test "` eyni sayılır).
- **Redaktə zamanı istisna:** `isDuplicateTask(rawTitle, editingTaskId)` çağırılarkən `excludeId` parametri ilə redaktə olunan tapşırığın özü müqayisədən xaric edilir — eyni tapşırığı eyni adla saxlamaq mümkündür.
- **Xəta mesajı:** Dublikat aşkar olunarsa, formada submit dayandırılır və başlıq inputunun altında aydın xəta mesajı göstərilir: `"Bu adda tapşırıq artıq mövcuddur. Fərqli bir ad seçin."` — modal bağlanmır, istifadəçi başlığı dəyişə bilir.
- `clearTitleError()` funksiyası modal açılarkən, bağlanarkən avtomatik çağırılaraq xəta mesajı təmizlənir.

---

# Checkpoint-7: UI polish and responsiveness

Bu mərhələdə (Checkpoint-7) layihənin vizual keyfiyyəti və responsive dizaynı tam şəkildə yüksəldildi. Bütün mikro-animasiyalar, keçidlər (transitions), hover effektləri və çoxlu ekran ölçüsü dəstəyi sırf Vanilla CSS ilə, BEM metodologiyası çərçivəsində həyata keçirildi.

---

## 🛠️ Checkpoint-7 Nələr Edildi Və Necə Hazırlandı?

### 1. Dizayn Token Yeniləmələri (`styles.css`)
- **Rəng paletrası yeniləndi:** Səhifə fonu `#F1F5F9`, sütun fonu `#F8FAFC` — daha zəngin dərinlik hissi.
- **Kölgə sistemi genişləndirildi:** `--shadow-card-hover` tokeni əlavə edildi (indigo vurğulamalı kart kölgəsi).
- **Keçid zaman dəyişənləri:** `--transition-fast`, `--transition-base`, `--transition-slow` — bütün keçidlər vahid token sisteminə əsaslanır.
- **Yeni radius:** `--radius-xl: 20px` — header, modal kart və sütunlar üçün daha yumşaq künclər.

---

### 2. Animasiyalar və Mikro-İnteraksiyalar
- **Səhifə giriş animasiyası (`pageEntry`):** `.kanban-app` yüklənəndə `opacity 0 → 1` + `translateY(8px → 0)` ilə yumşaq görünüş.
- **Kart giriş animasiyası (`cardEntry`):** Hər yeni kart render olunanda `opacity + translateY` ilə hamar canlanma.
- **Modal açılış animasiyası (`modalSlideIn`):** Modal `opacity + translateY + scale(0.97 → 1)` ilə açılır; arxa fonun özü ayrıca `overlayFadeIn` ilə fade-in olunur.
- **Logo hover effekti:** `.app-header__logo`-ya hover edildikdə `-5deg` fırlanma + `scale(1.05)` + kölgə artması.
- **Baş düymə (Primary Button):** `translateY(-1px)` + indigo kölgəsi artması; `.btn:active`-də `scale(0.97)` press effekti.
- **Modal bağlama düyməsi:** Hover-da `rotate(90deg)` — intuitive vizual əks-əlaqə.
- **Kart hover effekti:** `translateY(-2px)` + `--shadow-card-hover` + solğun indigo kənar rəngi.
- **Kart edit/delete düymələri:** Hover-da `scale(1.1)` — düymələr yalnız kart hover edildikdə görünür (`opacity: 0 → 1`).

---

### 3. Forma və Input Keyfiyyəti
- **Axtarış inputu genişlənməsi:** Focused vəziyyətdə `width: 220px → 260px` (smooth transition ilə).
- **Focus indikatorları:** Bütün `input`, `textarea`, `select` elementlərinin focus halında `box-shadow` ilə indigo halo.
- **`:focus-within` ikonu rəngi:** Axtarış/filter qutusu aktiv olduqda ikonun rəngi `text-light → primary-color`.
- **Erişilebilirlik (Accessibility):** `:focus-visible` pseudo-class ilə klaviatura istifadəçiləri üçün görünən `outline` xətti.

---

### 4. Responsive Dizayn (Çoxlu Ekran Dəstəyi)

| Breakpoint | Tətbiq olunan dəyişikliklər |
|---|---|
| `≤ 1024px` (Tablet) | Padding azaldılır, axtarış inputu genişliyi kiçilir |
| `≤ 768px` (Mobile L) | Header vertical stack; actions 2 sütunlu grid; Kanban board 1 sütunlu layout |
| `≤ 480px` (Mobile S) | Kiçik font, kompakt padding, 1 sütunlu actions grid, modal border-radius azaldılır |

---

## 📁 Fayl Strukturu

```
.
├── index.html        # BEM sinifləri və Ionicons CDN ilə HTML
├── styles.css        # CP-7: UI polish, animasiyalar, micro-interactions, responsive
├── script.js        # XSS qorunması, Dublikat önləmə, localStorage və Real-time Filter
├── guide.md          # Checkpoint təlimatları
└── readme.md         # Layihənin tam sənədləşdirilməsi (CP-1 → CP-7)
```
