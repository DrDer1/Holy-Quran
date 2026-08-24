// ===== المتغيرات العامة =====
let currentPageNumber = 1;
let totalPages = 604;
let currentFontSize = 1.8;
let touchStartX = 0;
let touchEndX = 0;
let isDragging = false;
let currentBookmark = null;

// ===== تهيئة التطبيق =====
document.addEventListener('DOMContentLoaded', async () => {
    console.log('تهيئة المصحف...');
    
    // تحميل البيانات
    await loadQuran();
    
    // استعادة الإعدادات
    loadSettings();
    
    // تهيئة الواجهة
    initializeUI();
    
    // عرض الصفحة
    displayPage(currentPageNumber);
    
    // تفعيل السحب
    setupSwipeGestures();
});

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
    }
    
    // استعادة العلامة المرجعية
    const savedBookmark = localStorage.getItem('quranBookmark');
    if (savedBookmark) {
        currentBookmark = JSON.parse(savedBookmark);
    }
}

// ===== تهيئة الواجهة =====
function initializeUI() {
    // زر القائمة
    document.getElementById('menuToggle').addEventListener('click', toggleMenu);
    document.getElementById('closeMenu').addEventListener('click', toggleMenu);
    
    // عناصر القائمة
    document.getElementById('menuSurahs').addEventListener('click', () => {
        toggleMenu();
        showSurahModal();
    });
    
    document.getElementById('menuJuz').addEventListener('click', () => {
        toggleMenu();
        showJuzModal();
    });
    
    document.getElementById('menuSearch').addEventListener('click', () => {
        toggleMenu();
        showSearchModal();
    });
    
    document.getElementById('menuBookmark').addEventListener('click', () => {
        toggleMenu();
        goToBookmark();
    });
    
    // أزرار حجم الخط
    document.getElementById('fontPlus').addEventListener('click', () => {
        currentFontSize = Math.min(currentFontSize + 0.2, 3.5);
        applyFontSize();
        saveFontSize();
    });
    
    document.getElementById('fontMinus').addEventListener('click', () => {
        currentFontSize = Math.max(currentFontSize - 0.2, 1.0);
        applyFontSize();
        saveFontSize();
    });
    
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
    document.getElementById('searchBtn').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // اختصارات لوحة المفاتيح
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // تطبيق حجم الخط
    applyFontSize();
}

// ===== تبديل القائمة الجانبية =====
function toggleMenu() {
    const menu = document.getElementById('sideMenu');
    menu.classList.toggle('open');
}

// ===== إعداد السحب =====
function setupSwipeGestures() {
    const page = document.getElementById('quranPage');
    
    // لمس
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
    
    // فأرة
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
    const minSwipeDistance = 50;
    
    if (Math.abs(swipeDistance) < minSwipeDistance) {
        return;
    }
    
    if (swipeDistance > 0) {
        // سحب لليمين - الصفحة التالية (معكوس)
        goToNextPage();
    } else {
        // سحب لليسار - الصفحة السابقة (معكوس)
        goToPreviousPage();
    }
}

// ===== التنقل بين الصفحات =====
function goToNextPage() {
    if (currentPageNumber < totalPages) {
        const page = document.getElementById('quranPage');
        page.classList.add('page-turning-next');
        
        setTimeout(() => {
            currentPageNumber++;
            displayPage(currentPageNumber);
            page.classList.remove('page-turning-next');
        }, 250);
    }
}

function goToPreviousPage() {
    if (currentPageNumber > 1) {
        const page = document.getElementById('quranPage');
        page.classList.add('page-turning-prev');
        
        setTimeout(() => {
            currentPageNumber--;
            displayPage(currentPageNumber);
            page.classList.remove('page-turning-prev');
        }, 250);
    }
}

// ===== عرض الصفحة =====
function displayPage(pageNumber) {
    currentPageNumber = pageNumber;
    
    // تحديث رقم الصفحة
    document.getElementById('pageNumber').textContent = convertToArabicNumbers(pageNumber);
    
    // حساب الآيات للصفحة
    const ayahsPerPage = 15;
    const startIndex = (pageNumber - 1) * ayahsPerPage;
    const endIndex = startIndex + ayahsPerPage;
    const pageAyahs = quranData.slice(startIndex, endIndex);
    
    // عرض المحتوى
    const content = document.getElementById('pageContent');
    content.innerHTML = '';
    content.style.fontSize = currentFontSize + 'rem';
    content.style.lineHeight = (currentFontSize * 1.5) + 'rem';
    
    if (pageAyahs.length === 0) {
        content.innerHTML = '<div style="text-align:center;color:#999;padding-top:50%;">نهاية المصحف</div>';
        return;
    }
    
    // عرض رأس السورة إذا كانت بداية سورة
    const firstAyah = pageAyahs[0];
    if (firstAyah.ayah === 1) {
        displaySurahHeader(content, firstAyah.surah);
    }
    
    // عرض الآيات
    pageAyahs.forEach(ayah => {
        const ayahContainer = document.createElement('div');
        ayahContainer.className = 'ayah-container';
        
        const ayahText = document.createElement('span');
        ayahText.className = 'ayah-text';
        ayahText.textContent = ayah.text;
        
        const ayahNumber = document.createElement('span');
        ayahNumber.className = 'ayah-number';
        ayahNumber.textContent = convertToArabicNumbers(ayah.ayah);
        
        ayahContainer.appendChild(ayahText);
        ayahContainer.appendChild(ayahNumber);
        content.appendChild(ayahContainer);
    });
    
    // حفظ التقدم
    if (pageAyahs.length > 0) {
        saveProgress(pageAyahs[0]);
    }
}

// ===== عرض رأس السورة =====
function displaySurahHeader(content, surahNumber) {
    const surahInfo = surahNames.find(s => s.number === surahNumber);
    if (surahInfo) {
        const surahHeader = document.createElement('div');
        surahHeader.className = 'surah-header';
        surahHeader.innerHTML = `سورة ${surahInfo.name}`;
        content.appendChild(surahHeader);
        
        if (surahNumber !== 1 && surahNumber !== 9) {
            const bismillah = document.createElement('div');
            bismillah.className = 'surah-bismillah';
            bismillah.textContent = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
            content.appendChild(bismillah);
        }
    }
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
    const content = document.getElementById('pageContent');
    content.style.fontSize = currentFontSize + 'rem';
    content.style.lineHeight = (currentFontSize * 1.5) + 'rem';
}

// ===== عرض نافذة السور =====
function showSurahModal() {
    const modal = document.getElementById('surahModal');
    const list = document.getElementById('surahList');
    
    modal.classList.remove('hidden');
    list.innerHTML = '';
    
    surahNames.forEach(surah => {
        const item = document.createElement('div');
        item.className = 'surah-item';
        item.innerHTML = `
            <span class="surah-number">${convertToArabicNumbers(surah.number)}</span>
            <span class="surah-name">${surah.name}</span>
            <span class="surah-info">${surah.type} - ${surah.ayahs} آية</span>
        `;
        
        item.addEventListener('click', () => {
            goToSurah(surah.number);
            modal.classList.add('hidden');
        });
        
        list.appendChild(item);
    });
}

// ===== عرض نافذة الأجزاء =====
function showJuzModal() {
    const modal = document.getElementById('juzModal');
    const list = document.getElementById('juzList');
    
    modal.classList.remove('hidden');
    list.innerHTML = '';
    
    juzBoundaries.forEach(juz => {
        const item = document.createElement('div');
        item.className = 'surah-item';
        
        const surahInfo = surahNames.find(s => s.number === juz.surah);
        const surahName = surahInfo ? surahInfo.name : '';
        
        item.innerHTML = `
            <span class="surah-number">${convertToArabicNumbers(juz.juz)}</span>
            <span class="surah-name">الجزء ${convertToArabicNumbers(juz.juz)}</span>
            <span class="surah-info">${surahName} - آية ${convertToArabicNumbers(juz.ayah)}</span>
        `;
        
        item.addEventListener('click', () => {
            goToJuz(juz.juz);
            modal.classList.add('hidden');
        });
        
        list.appendChild(item);
    });
}

// ===== عرض نافذة البحث =====
function showSearchModal() {
    const modal = document.getElementById('searchModal');
    modal.classList.remove('hidden');
    document.getElementById('searchInput').focus();
}

// ===== الانتقال إلى سورة =====
function goToSurah(surahNumber) {
    const firstAyah = quranData.find(a => a.surah === surahNumber);
    if (firstAyah) {
        const ayahIndex = quranData.indexOf(firstAyah);
        currentPageNumber = Math.floor(ayahIndex / 15) + 1;
        displayPage(currentPageNumber);
        setBookmark();
    }
}

// ===== الانتقال إلى جزء =====
function goToJuz(juzNumber) {
    const juzInfo = juzBoundaries.find(j => j.juz === juzNumber);
    if (juzInfo) {
        const targetAyah = quranData.find(a => 
            a.surah === juzInfo.surah && a.ayah === juzInfo.ayah
        );
        
        if (targetAyah) {
            const ayahIndex = quranData.indexOf(targetAyah);
            currentPageNumber = Math.floor(ayahIndex / 15) + 1;
            displayPage(currentPageNumber);
            setBookmark();
        }
    }
}

// ===== تنفيذ البحث =====
function performSearch() {
    const searchType = document.getElementById('searchType').value;
    const searchText = document.getElementById('searchInput').value.trim();
    const resultsContainer = document.getElementById('searchResults');
    
    resultsContainer.innerHTML = '';
    
    if (!searchText) {
        resultsContainer.innerHTML = '<div style="text-align:center;padding:20px;color:#999;">الرجاء إدخال نص للبحث</div>';
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
        resultsContainer.innerHTML = '<div style="text-align:center;padding:20px;color:#999;">لا توجد نتائج</div>';
        return;
    }
    
    results.forEach(ayah => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        
        const surahInfo = surahNames.find(s => s.number === ayah.surah);
        const surahName = surahInfo ? surahInfo.name : '';
        
        resultItem.innerHTML = `
            <div style="font-weight:bold;color:#c9a84c;margin-bottom:5px;">
                سورة ${surahName} - آية ${convertToArabicNumbers(ayah.ayah)}
            </div>
            <div style="font-size:1.1rem;">${ayah.text}</div>
        `;
        
        resultItem.addEventListener('click', () => {
            const ayahIndex = quranData.indexOf(ayah);
            currentPageNumber = Math.floor(ayahIndex / 15) + 1;
            displayPage(currentPageNumber);
            document.getElementById('searchModal').classList.add('hidden');
            setBookmark();
        });
        
        resultsContainer.appendChild(resultItem);
    });
}

// ===== العلامة المرجعية =====
function setBookmark() {
    currentBookmark = {
        page: currentPageNumber,
        timestamp: Date.now()
    };
    
    localStorage.setItem('quranBookmark', JSON.stringify(currentBookmark));
}

function goToBookmark() {
    if (currentBookmark) {
        displayPage(currentBookmark.page);
    } else {
        alert('لا توجد علامة مرجعية محفوظة');
    }
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
    // الأسهم للتنقل
    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPreviousPage();
    }
    
    if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToNextPage();
    }
    
    // Ctrl + F للبحث
    if (event.ctrlKey && event.key === 'f') {
        event.preventDefault();
        showSearchModal();
    }
    
    // ESC لإغلاق النوافذ والقائمة
    if (event.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
        document.getElementById('sideMenu').classList.remove('open');
    }
    
    // M لفتح القائمة
    if (event.key === 'm' || event.key === 'M') {
        toggleMenu();
    }
}
