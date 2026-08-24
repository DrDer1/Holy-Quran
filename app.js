// ===== المتغيرات العامة =====
let currentPageNumber = 1;
let totalPages = 604;
let currentFontSize = 1;
let touchStartX = 0;
let touchEndX = 0;
let isDragging = false;
let bookmarks = [];
let currentSurahNumber = 1;
let currentJuzNumber = 1;
let isFirstLaunch = false;
let isShowingOpening = true;
let quranData = [];
let surahList = [];

// ===== نص الإهداء =====
const DEDICATION_TEXT = `
    <p>إلى من علمني حرفاً...</p>
    <p>إلى والديّ الكريمين</p>
    <p>وإلى كل من يبحث عن نور القرآن</p>
    <p>أهدي هذا العمل</p>
    <p>سائلاً المولى أن يجعله خالصاً لوجهه الكريم</p>
`;

// ===== تهيئة التطبيق =====
document.addEventListener('DOMContentLoaded', async () => {
    console.log('تهيئة المصحف...');
    
    // تحميل البيانات
    await loadQuran();
    
    // استعادة الإعدادات
    loadSettings();
    
    // تهيئة الواجهة
    initializeUI();
    
    // تحديد الصفحة الافتتاحية أو آخر موضع
    determineInitialView();
    
    // تفعيل السحب
    setupSwipeGestures();
});

// ===== تحميل القرآن من quran.json =====
async function loadQuran() {
    try {
        const response = await fetch('quran.json');
        const data = await response.json();
        
        quranData = [];
        surahList = [];
        
        data.forEach(surah => {
            // إضافة بيانات السورة
            surahList.push({
                number: surah.id,
                name: surah.name,
                ayahs: surah.total_verses,
                type: surah.type === 'meccan' ? 'مكية' : 'مدنية'
            });
            
            // إضافة الآيات
            surah.verses.forEach(ayah => {
                quranData.push({
                    surah: surah.id,
                    ayah: ayah.id,
                    text: ayah.text.trim()
                });
            });
        });
        
        console.log('تم تحميل القرآن الكريم:', quranData.length, 'آية');
        console.log('عدد السور:', surahList.length);
        return true;
    } catch (error) {
        console.error('خطأ في تحميل القرآن:', error);
        return false;
    }
}

// ===== تحميل الإعدادات =====
function loadSettings() {
    // استعادة حجم الخط
    const savedFontSize = localStorage.getItem('quranFontSize');
    if (savedFontSize) {
        currentFontSize = parseFloat(savedFontSize);
    }
    
    // استعادة التقدم
    const savedProgress = localStorage.getItem('quranProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        currentPageNumber = progress.page || 1;
        isFirstLaunch = false;
    } else {
        isFirstLaunch = true;
    }
    
    // استعادة المواضع المحفوظة
    const savedBookmarks = localStorage.getItem('quranBookmarks');
    if (savedBookmarks) {
        bookmarks = JSON.parse(savedBookmarks);
    }
}

// ===== تحديد العرض الأولي =====
function determineInitialView() {
    if (isFirstLaunch) {
        // أول تشغيل - عرض الصفحة الافتتاحية
        showOpeningPage();
    } else {
        // تشغيل لاحق - فتح آخر موضع مباشرة
        showMushafPage();
        displayPage(currentPageNumber);
    }
}

// ===== عرض الصفحة الافتتاحية =====
function showOpeningPage() {
    isShowingOpening = true;
    document.getElementById('openingPage').classList.remove('hidden');
    document.getElementById('mushafPage').classList.add('hidden');
    document.getElementById('topBar').classList.add('hidden');
}

// ===== عرض صفحة المصحف =====
function showMushafPage() {
    isShowingOpening = false;
    document.getElementById('openingPage').classList.add('hidden');
    document.getElementById('mushafPage').classList.remove('hidden');
    document.getElementById('topBar').classList.remove('hidden');
}

// ===== تهيئة الواجهة =====
function initializeUI() {
    // زر القائمة
    document.getElementById('menuToggle').addEventListener('click', openMenu);
    document.getElementById('closeMenu').addEventListener('click', closeMenu);
    document.getElementById('sideMenuOverlay').addEventListener('click', closeMenu);
    
    // عناصر القائمة
    document.getElementById('menuQuran').addEventListener('click', () => {
        closeMenu();
        goToLastPosition();
    });
    
    document.getElementById('menuIndex').addEventListener('click', () => {
        closeMenu();
        showIndexModal();
    });
    
    document.getElementById('menuBookmarks').addEventListener('click', () => {
        closeMenu();
        showBookmarksModal();
    });
    
    document.getElementById('menuDedication').addEventListener('click', () => {
        closeMenu();
        showDedicationPage();
    });
    
    // زر حفظ الموضع
    document.getElementById('saveBookmarkBtn').addEventListener('click', () => {
        saveBookmark();
        closeMenu();
    });
    
    // أزرار حجم الخط
    document.getElementById('fontPlus').addEventListener('click', () => {
        currentFontSize = Math.min(currentFontSize + 0.1, 1.8);
        applyFontSize();
        saveFontSize();
    });
    
    document.getElementById('fontMinus').addEventListener('click', () => {
        currentFontSize = Math.max(currentFontSize - 0.1, 0.6);
        applyFontSize();
        saveFontSize();
    });
    
    // زر البحث في الشريط العلوي
    document.getElementById('searchBtn').addEventListener('click', showSearchModal);
    
    // إغلاق النوافذ
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.add('hidden');
        });
    });
    
    // إغلاق النوافذ بالنقر خارجها
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
    
    // البحث
    document.getElementById('searchExecute').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // زر الرجوع من الإهداء
    document.getElementById('backFromDedication').addEventListener('click', hideDedicationPage);
    
    // اختصارات لوحة المفاتيح
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // تطبيق حجم الخط
    applyFontSize();
}

// ===== العودة لآخر موضع =====
function goToLastPosition() {
    const savedProgress = localStorage.getItem('quranProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        currentPageNumber = progress.page || 1;
        showMushafPage();
        displayPage(currentPageNumber);
    } else {
        showOpeningPage();
    }
}

// ===== فتح وإغلاق القائمة =====
function openMenu() {
    document.getElementById('sideMenu').classList.add('open');
    document.getElementById('sideMenuOverlay').classList.add('active');
}

function closeMenu() {
    document.getElementById('sideMenu').classList.remove('open');
    document.getElementById('sideMenuOverlay').classList.remove('active');
}

// ===== إعداد السحب =====
function setupSwipeGestures() {
    const page = document.getElementById('quranPage');
    
    page.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        isDragging = true;
    }, { passive: true });
    
    page.addEventListener('touchmove', (e) => {
        if (isDragging) {
            touchEndX = e.touches[0].clientX;
        }
    }, { passive: true });
    
    page.addEventListener('touchend', () => {
        if (isDragging) {
            handleSwipe();
            isDragging = false;
        }
    });
    
    page.addEventListener('mousedown', (e) => {
        touchStartX = e.clientX;
        isDragging = true;
    });
    
    page.addEventListener('mousemove', (e) => {
        if (isDragging) {
            touchEndX = e.clientX;
        }
    });
    
    page.addEventListener('mouseup', () => {
        if (isDragging) {
            handleSwipe();
            isDragging = false;
        }
    });
    
    page.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
        }
    });
}

// ===== معالجة السحب =====
function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    const minSwipeDistance = 60;
    
    if (Math.abs(swipeDistance) < minSwipeDistance) {
        return;
    }
    
    if (isShowingOpening) {
        if (swipeDistance < 0) {
            showMushafPage();
            displayPage(1);
            isFirstLaunch = false;
        }
        return;
    }
    
    if (swipeDistance > 0) {
        goToNextPage();
    } else {
        goToPreviousPage();
    }
}

// ===== التنقل بين الصفحات =====
function goToNextPage() {
    if (currentPageNumber < totalPages) {
        const page = document.getElementById('mushafPage');
        page.classList.add('page-turning-next');
        
        setTimeout(() => {
            currentPageNumber++;
            displayPage(currentPageNumber);
            page.classList.remove('page-turning-next');
        }, 175);
    }
}

function goToPreviousPage() {
    if (currentPageNumber > 1) {
        const page = document.getElementById('mushafPage');
        page.classList.add('page-turning-prev');
        
        setTimeout(() => {
            currentPageNumber--;
            displayPage(currentPageNumber);
            page.classList.remove('page-turning-prev');
        }, 175);
    }
}

// ===== عرض الصفحة =====
function displayPage(pageNumber) {
    currentPageNumber = pageNumber;
    
    document.getElementById('pageNumber').textContent = convertToArabicNumbers(pageNumber);
    
    const ayahsPerPage = 15;
    const startIndex = (pageNumber - 1) * ayahsPerPage;
    const endIndex = startIndex + ayahsPerPage;
    const pageAyahs = quranData.slice(startIndex, endIndex);
    
    const content = document.getElementById('mushafContent');
    content.innerHTML = '';
    
    if (pageAyahs.length === 0) {
        content.innerHTML = '<div style="text-align:center;color:#888;font-size:1.1rem;">نهاية المصحف</div>';
        return;
    }
    
    const firstAyah = pageAyahs[0];
    currentSurahNumber = firstAyah.surah;
    currentJuzNumber = getJuzNumber(firstAyah.surah, firstAyah.ayah);
    updateTopBar();
    
    // تجميع الآيات حسب السورة
    const surahGroups = {};
    pageAyahs.forEach(ayah => {
        if (!surahGroups[ayah.surah]) {
            surahGroups[ayah.surah] = [];
        }
        surahGroups[ayah.surah].push(ayah);
    });
    
    // عرض كل سورة
    const surahNumbers = Object.keys(surahGroups);
    
    surahNumbers.forEach((surahNumber, index) => {
        const surahNum = parseInt(surahNumber);
        const surahAyahs = surahGroups[surahNumber];
        
        // عرض اسم السورة
        displaySurahHeader(content, surahNum);
        
        // إنشاء حاوية الآيات
        const ayahsContainer = document.createElement('div');
        ayahsContainer.className = 'ayahs-container';
        
        surahAyahs.forEach(ayah => {
            appendAyahToContainer(ayahsContainer, ayah);
        });
        
        content.appendChild(ayahsContainer);
        
        // مسافة بين السور
        if (index < surahNumbers.length - 1) {
            const spacer = document.createElement('div');
            spacer.style.height = '20px';
            content.appendChild(spacer);
        }
    });
    
    if (pageAyahs.length > 0) {
        saveProgress(pageAyahs[0]);
    }
}

// ===== إضافة آية إلى حاوية =====
function appendAyahToContainer(container, ayah) {
    const ayahText = document.createElement('span');
    ayahText.className = 'ayah-text';
    ayahText.textContent = ayah.text + ' ';
    
    const ayahNumber = document.createElement('span');
    ayahNumber.className = 'ayah-number';
    ayahNumber.textContent = convertToArabicNumbers(ayah.ayah);
    
    container.appendChild(ayahText);
    container.appendChild(ayahNumber);
    container.appendChild(document.createTextNode(' '));
}

// ===== عرض رأس السورة =====
function displaySurahHeader(content, surahNumber) {
    const surahInfo = surahList.find(s => s.number === surahNumber);
    if (surahInfo) {
        const surahHeader = document.createElement('div');
        surahHeader.className = 'surah-header';
        surahHeader.textContent = `سُورَةُ ${surahInfo.name}`;
        content.appendChild(surahHeader);
        
        if (surahNumber !== 1 && surahNumber !== 9) {
            const bismillah = document.createElement('div');
            bismillah.className = 'surah-bismillah';
            bismillah.textContent = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
            content.appendChild(bismillah);
        }
    }
}

// ===== تحديث الشريط العلوي =====
function updateTopBar() {
    const surahInfo = surahList.find(s => s.number === currentSurahNumber);
    if (surahInfo) {
        document.getElementById('topSurahName').textContent = `سُورَةُ ${surahInfo.name}`;
    }
    document.getElementById('topJuzName').textContent = `الجزء ${convertToArabicNumbers(currentJuzNumber)}`;
}

// ===== الحصول على رقم الجزء =====
function getJuzNumber(surahNumber, ayahNumber) {
    let juz = 1;
    for (let i = 0; i < juzBoundaries.length; i++) {
        if (surahNumber > juzBoundaries[i].surah || 
            (surahNumber === juzBoundaries[i].surah && ayahNumber >= juzBoundaries[i].ayah)) {
            juz = juzBoundaries[i].juz;
        }
    }
    return juz;
}

// ===== تحويل الأرقام إلى عربية =====
function convertToArabicNumbers(number) {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return number.toString().replace(/[0-9]/g, (match) => {
        return arabicNumbers[parseInt(match)];
    });
}

// ===== تطبيق حجم الخط =====
function applyFontSize() {
    const content = document.getElementById('mushafContent');
    if (content) {
        const baseSize = window.innerWidth < 480 ? 14 : 18;
        content.style.fontSize = (baseSize * currentFontSize) + 'px';
        content.style.lineHeight = (2.1 * currentFontSize).toFixed(2);
    }
}

// ===== عرض الفهرس =====
function showIndexModal() {
    const modal = document.getElementById('indexModal');
    const list = document.getElementById('indexList');
    
    modal.classList.remove('hidden');
    list.innerHTML = '';
    
    surahList.forEach(surah => {
        const item = document.createElement('div');
        item.className = 'index-item';
        item.innerHTML = `
            <span class="index-number">${convertToArabicNumbers(surah.number)}</span>
            <span class="index-name">${surah.name}</span>
            <span class="index-info">${surah.type}</span>
        `;
        
        item.addEventListener('click', () => {
            goToSurah(surah.number);
            modal.classList.add('hidden');
        });
        
        list.appendChild(item);
    });
}

// ===== عرض البحث =====
function showSearchModal() {
    const modal = document.getElementById('searchModal');
    modal.classList.remove('hidden');
    document.getElementById('searchInput').focus();
}

// ===== عرض المواضع المحفوظة =====
function showBookmarksModal() {
    const modal = document.getElementById('bookmarksModal');
    const list = document.getElementById('bookmarksList');
    
    modal.classList.remove('hidden');
    list.innerHTML = '';
    
    if (bookmarks.length === 0) {
        list.innerHTML = '<div class="bookmark-empty">لا توجد مواضع محفوظة</div>';
        return;
    }
    
    bookmarks.forEach((bookmark) => {
        const item = document.createElement('div');
        item.className = 'bookmark-item';
        
        const surahInfo = surahList.find(s => s.number === bookmark.surah);
        const surahName = surahInfo ? surahInfo.name : '';
        
        item.innerHTML = `
            <div style="font-weight:bold;margin-bottom:3px;">الصفحة ${convertToArabicNumbers(bookmark.page)}</div>
            <div>سورة ${surahName}</div>
        `;
        
        item.addEventListener('click', () => {
            showMushafPage();
            displayPage(bookmark.page);
            modal.classList.add('hidden');
        });
        
        list.appendChild(item);
    });
}

// ===== حفظ الموضع =====
function saveBookmark() {
    const bookmark = {
        page: currentPageNumber,
        surah: currentSurahNumber,
        timestamp: Date.now()
    };
    
    bookmarks.push(bookmark);
    localStorage.setItem('quranBookmarks', JSON.stringify(bookmarks));
    
    alert('تم حفظ الموضع الحالي');
}

// ===== الانتقال إلى سورة =====
function goToSurah(surahNumber) {
    const firstAyah = quranData.find(a => a.surah === surahNumber);
    if (firstAyah) {
        const ayahIndex = quranData.indexOf(firstAyah);
        currentPageNumber = Math.floor(ayahIndex / 15) + 1;
        showMushafPage();
        displayPage(currentPageNumber);
    }
}

// ===== صفحة الإهداء =====
function showDedicationPage() {
    document.getElementById('dedicationText').innerHTML = DEDICATION_TEXT;
    document.getElementById('dedicationPage').classList.remove('hidden');
}

function hideDedicationPage() {
    document.getElementById('dedicationPage').classList.add('hidden');
}

// ===== تنفيذ البحث =====
function performSearch() {
    const searchType = document.getElementById('searchType').value;
    const searchText = document.getElementById('searchInput').value.trim();
    const resultsContainer = document.getElementById('searchResults');
    
    resultsContainer.innerHTML = '';
    
    if (!searchText) {
        resultsContainer.innerHTML = '<div class="bookmark-empty">الرجاء إدخال نص للبحث</div>';
        return;
    }
    
    let results = [];
    
    switch (searchType) {
        case 'text':
            results = quranData.filter(ayah => 
                ayah.text.includes(searchText)
            ).slice(0, 50);
            break;
            
        case 'surah':
            const surahNum = parseInt(searchText);
            if (surahNum >= 1 && surahNum <= 114) {
                results = quranData.filter(ayah => ayah.surah === surahNum);
            }
            break;
            
        case 'ayah':
            const ayahNum = parseInt(searchText);
            results = quranData.filter(ayah => ayah.ayah === ayahNum).slice(0, 50);
            break;
            
        case 'juz':
            const juzNum = parseInt(searchText);
            if (juzNum >= 1 && juzNum <= 30) {
                const juzInfo = juzBoundaries.find(j => j.juz === juzNum);
                if (juzInfo) {
                    const startAyah = quranData.find(a => 
                        a.surah === juzInfo.surah && a.ayah === juzInfo.ayah
                    );
                    if (startAyah) {
                        const startIndex = quranData.indexOf(startAyah);
                        const endIndex = juzNum < 30 ? 
                            quranData.indexOf(quranData.find(a => 
                                a.surah === juzBoundaries[juzNum].surah && 
                                a.ayah === juzBoundaries[juzNum].ayah
                            )) : quranData.length;
                        
                        results = quranData.slice(startIndex, endIndex);
                    }
                }
            }
            break;
    }
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="bookmark-empty">لا توجد نتائج</div>';
        return;
    }
    
    results.forEach(ayah => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        
        const surahInfo = surahList.find(s => s.number === ayah.surah);
        const surahName = surahInfo ? surahInfo.name : '';
        
        resultItem.innerHTML = `
            <div style="font-weight:bold;color:#00A8D6;margin-bottom:4px;">
                سورة ${surahName} - آية ${convertToArabicNumbers(ayah.ayah)}
            </div>
            <div>${ayah.text}</div>
        `;
        
        resultItem.addEventListener('click', () => {
            const ayahIndex = quranData.indexOf(ayah);
            currentPageNumber = Math.floor(ayahIndex / 15) + 1;
            showMushafPage();
            displayPage(currentPageNumber);
            document.getElementById('searchModal').classList.add('hidden');
        });
        
        resultsContainer.appendChild(resultItem);
    });
}

// ===== حفظ التقدم =====
function saveProgress(firstAyah) {
    const progress = {
        page: currentPageNumber,
        surah: firstAyah.surah,
        ayah: firstAyah.ayah,
        timestamp: Date.now()
    };
    
    localStorage.setItem('quranProgress', JSON.stringify(progress));
}

// ===== حفظ حجم الخط =====
function saveFontSize() {
    localStorage.setItem('quranFontSize', currentFontSize.toString());
}

// ===== اختصارات لوحة المفاتيح =====
function handleKeyboardShortcuts(event) {
    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (!isShowingOpening) {
            goToPreviousPage();
        }
    }
    
    if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (isShowingOpening) {
            showMushafPage();
            displayPage(1);
            isFirstLaunch = false;
        } else {
            goToNextPage();
        }
    }
    
    if (event.ctrlKey && event.key === 'f') {
        event.preventDefault();
        showSearchModal();
    }
    
    if (event.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
        closeMenu();
        hideDedicationPage();
    }
}
