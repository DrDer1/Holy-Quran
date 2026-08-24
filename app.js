// ===== المتغيرات العامة =====
let currentPageNumber = 1;
let totalPages = 604;
let currentView = 'page'; // page, surah, juz, search
let ayahsPerPage = 15;
let currentFontSize = 1.8;

// ===== تهيئة التطبيق =====
document.addEventListener('DOMContentLoaded', async () => {
    console.log('تهيئة المصحف...');
    
    // تحميل البيانات
    await loadQuran();
    
    // استعادة الإعدادات
    if (loadFontSize()) {
        currentFontSize = parseFloat(localStorage.getItem('quranFontSize'));
    }
    
    if (loadProgress()) {
        const progress = JSON.parse(localStorage.getItem('quranProgress'));
        currentPageNumber = progress.page || 1;
        currentSurah = progress.surah || 1;
        currentAyah = progress.ayah || 1;
    }
    
    // تهيئة الواجهة
    initializeUI();
    
    // عرض الصفحة الأولى أو المحفوظة
    displayPage(currentPageNumber);
    
    // إظهار العلامة المرجعية إذا وجدت
    if (bookmark) {
        document.getElementById('bookmark').classList.remove('hidden');
    }
});

// ===== تهيئة الواجهة =====
function initializeUI() {
    // زر فتح المصحف
    document.getElementById('openQuran').addEventListener('click', () => {
        document.getElementById('cover').classList.add('hidden');
        document.getElementById('mainQuran').classList.remove('hidden');
    });
    
    // زر العودة للغلاف
    document.getElementById('backToCover').addEventListener('click', () => {
        document.getElementById('mainQuran').classList.add('hidden');
        document.getElementById('cover').classList.remove('hidden');
    });
    
    // أزرار التنقل
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPageNumber > 1) {
            currentPageNumber--;
            displayPage(currentPageNumber);
        }
    });
    
    document.getElementById('nextPage').addEventListener('click', () => {
        if (currentPageNumber < totalPages) {
            currentPageNumber++;
            displayPage(currentPageNumber);
        }
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
    
    // فتح النوافذ
    document.getElementById('showSurahs').addEventListener('click', () => {
        showSurahIndex();
    });
    
    document.getElementById('showJuz').addEventListener('click', () => {
        showJuzIndex();
    });
    
    document.getElementById('showSearch').addEventListener('click', () => {
        showSearchModal();
    });
    
    // إغلاق النوافذ
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.add('hidden');
        });
    });
    
    // البحث
    document.getElementById('searchBtn').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // العلامة المرجعية
    document.getElementById('bookmark').addEventListener('click', () => {
        if (bookmark) {
            currentPageNumber = bookmark.page;
            displayPage(currentPageNumber);
        }
    });
    
    // اختصارات لوحة المفاتيح
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // تطبيق حجم الخط
    applyFontSize();
}

// ===== عرض الصفحة =====
function displayPage(pageNumber) {
    currentPageNumber = pageNumber;
    
    // تحديث مؤشر الصفحة
    document.getElementById('currentPageNum').textContent = pageNumber;
    document.getElementById('totalPages').textContent = totalPages;
    
    // حساب الآيات للصفحة الحالية
    const startAyah = (pageNumber - 1) * ayahsPerPage;
    const endAyah = startAyah + ayahsPerPage;
    
    const pageAyahs = quranData.slice(startAyah, endAyah);
    
    // تقسيم الآيات بين الصفحتين
    const halfIndex = Math.ceil(pageAyahs.length / 2);
    const rightPageAyahs = pageAyahs.slice(0, halfIndex);
    const leftPageAyahs = pageAyahs.slice(halfIndex);
    
    // عرض المحتوى
    displayRightPage(rightPageAyahs);
    displayLeftPage(leftPageAyahs);
    
    // حفظ التقدم
    if (pageAyahs.length > 0) {
        currentSurah = pageAyahs[0].surah;
        currentAyah = pageAyahs[0].ayah;
        saveProgress();
    }
    
    // تحديث العلامة المرجعية
    updateBookmark();
}

// ===== عرض الصفحة اليمنى =====
function displayRightPage(ayahs) {
    const content = document.getElementById('pageRightContent');
    content.innerHTML = '';
    content.style.fontSize = currentFontSize + 'rem';
    
    if (ayahs.length === 0) {
        content.innerHTML = '<div style="text-align:center;color:#999;padding-top:50%;">نهاية المصحف</div>';
        return;
    }
    
    // عرض رأس السورة إذا كانت بداية سورة
    const firstAyah = ayahs[0];
    if (firstAyah.ayah === 1) {
        const surahInfo = surahNames.find(s => s.number === firstAyah.surah);
        if (surahInfo) {
            const surahHeader = document.createElement('div');
            surahHeader.className = 'surah-header';
            surahHeader.innerHTML = `سورة ${surahInfo.name}`;
            content.appendChild(surahHeader);
            
            if (firstAyah.surah !== 1 && firstAyah.surah !== 9) {
                const bismillah = document.createElement('div');
                bismillah.className = 'surah-bismillah';
                bismillah.textContent = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
                content.appendChild(bismillah);
            }
        }
    }
    
    // عرض الآيات
    ayahs.forEach(ayah => {
        const ayahContainer = document.createElement('div');
        ayahContainer.className = 'ayah-container';
        
        const ayahText = document.createElement('span');
        ayahText.className = 'ayah-text';
        ayahText.textContent = ayah.text;
        
        const ayahNumber = document.createElement('span');
        ayahNumber.className = 'ayah-number';
        ayahNumber.textContent = ayah.ayah;
        
        ayahContainer.appendChild(ayahText);
        ayahContainer.appendChild(ayahNumber);
        content.appendChild(ayahContainer);
    });
}

// ===== عرض الصفحة اليسرى =====
function displayLeftPage(ayahs) {
    const content = document.getElementById('pageLeftContent');
    content.innerHTML = '';
    content.style.fontSize = currentFontSize + 'rem';
    
    if (ayahs.length === 0) {
        content.innerHTML = '<div style="text-align:center;color:#999;padding-top:50%;"></div>';
        return;
    }
    
    // التحقق من بداية سورة جديدة
    const firstAyah = ayahs[0];
    if (firstAyah.ayah === 1) {
        const surahInfo = surahNames.find(s => s.number === firstAyah.surah);
        if (surahInfo) {
            const surahHeader = document.createElement('div');
            surahHeader.className = 'surah-header';
            surahHeader.innerHTML = `سورة ${surahInfo.name}`;
            content.appendChild(surahHeader);
            
            if (firstAyah.surah !== 1 && firstAyah.surah !== 9) {
                const bismillah = document.createElement('div');
                bismillah.className = 'surah-bismillah';
                bismillah.textContent = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
                content.appendChild(bismillah);
            }
        }
    }
    
    // عرض الآيات
    ayahs.forEach(ayah => {
        const ayahContainer = document.createElement('div');
        ayahContainer.className = 'ayah-container';
        
        const ayahText = document.createElement('span');
        ayahText.className = 'ayah-text';
        ayahText.textContent = ayah.text;
        
        const ayahNumber = document.createElement('span');
        ayahNumber.className = 'ayah-number';
        ayahNumber.textContent = ayah.ayah;
        
        ayahContainer.appendChild(ayahText);
        ayahContainer.appendChild(ayahNumber);
        content.appendChild(ayahContainer);
    });
}

// ===== تطبيق حجم الخط =====
function applyFontSize() {
    document.querySelectorAll('.page-content').forEach(el => {
        el.style.fontSize = currentFontSize + 'rem';
    });
    
    document.querySelectorAll('.ayah-text').forEach(el => {
        el.style.fontSize = currentFontSize + 'rem';
        el.style.lineHeight = (currentFontSize * 1.4) + 'rem';
    });
}

// ===== عرض فهرس السور =====
function showSurahIndex() {
    const modal = document.getElementById('surahIndex');
    const list = document.getElementById('surahIndexList');
    
    modal.classList.remove('hidden');
    list.innerHTML = '';
    
    surahNames.forEach(surah => {
        const item = document.createElement('div');
        item.className = 'surah-item';
        item.innerHTML = `
            <span class="surah-number">${surah.number}</span>
            <span class="surah-name">${surah.name}</span>
            <span class="surah-info">${surah.type} - ${surah.ayahs} آية</span>
        `;
        
        item.addEventListener('click', () => {
            // الانتقال إلى السورة
            const firstAyah = quranData.find(a => a.surah === surah.number);
            if (firstAyah) {
                const ayahIndex = quranData.indexOf(firstAyah);
                currentPageNumber = Math.floor(ayahIndex / ayahsPerPage) + 1;
                displayPage(currentPageNumber);
                modal.classList.add('hidden');
            }
        });
        
        list.appendChild(item);
    });
}

// ===== عرض فهرس الأجزاء =====
function showJuzIndex() {
    const modal = document.getElementById('juzIndex');
    const list = document.getElementById('juzIndexList');
    
    modal.classList.remove('hidden');
    list.innerHTML = '';
    
    juzBoundaries.forEach(juz => {
        const item = document.createElement('div');
        item.className = 'surah-item';
        
        const surahInfo = surahNames.find(s => s.number === juz.surah);
        const surahName = surahInfo ? surahInfo.name : '';
        
        item.innerHTML = `
            <span class="surah-number">${juz.juz}</span>
            <span class="surah-name">الجزء ${juz.juz}</span>
            <span class="surah-info">${surahName} - آية ${juz.ayah}</span>
        `;
        
        item.addEventListener('click', () => {
            const targetAyah = quranData.find(a => 
                a.surah === juz.surah && a.ayah === juz.ayah
            );
            
            if (targetAyah) {
                const ayahIndex = quranData.indexOf(targetAyah);
                currentPageNumber = Math.floor(ayahIndex / ayahsPerPage) + 1;
                displayPage(currentPageNumber);
                modal.classList.add('hidden');
            }
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

// ===== تنفيذ البحث =====
function performSearch() {
    const searchType = document.getElementById('searchType').value;
    const searchText = document.getElementById('searchInput').value.trim();
    const resultsContainer = document.getElementById('searchResults');
    
    resultsContainer.innerHTML = '';
    
    if (!searchText) {
        resultsContainer.innerHTML = '<div style="text-align:center;padding:20px;">الرجاء إدخال نص للبحث</div>';
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
        resultsContainer.innerHTML = '<div style="text-align:center;padding:20px;">لا توجد نتائج</div>';
        return;
    }
    
    results.forEach(ayah => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        
        const surahInfo = surahNames.find(s => s.number === ayah.surah);
        const surahName = surahInfo ? surahInfo.name : '';
        
        resultItem.innerHTML = `
            <div style="font-weight:bold;color:#1a472a;margin-bottom:5px;">
                سورة ${surahName} - آية ${ayah.ayah}
            </div>
            <div style="font-size:1.1rem;">${ayah.text}</div>
        `;
        
        resultItem.addEventListener('click', () => {
            const ayahIndex = quranData.indexOf(ayah);
            currentPageNumber = Math.floor(ayahIndex / ayahsPerPage) + 1;
            displayPage(currentPageNumber);
            document.getElementById('searchModal').classList.add('hidden');
        });
        
        resultsContainer.appendChild(resultItem);
    });
}

// ===== تحديث العلامة المرجعية =====
function updateBookmark() {
    bookmark = {
        page: currentPageNumber,
        surah: currentSurah,
        ayah: currentAyah,
        timestamp: Date.now()
    };
    
    localStorage.setItem('quranBookmark', JSON.stringify(bookmark));
    
    if (bookmark) {
        document.getElementById('bookmark').classList.remove('hidden');
    }
}

// ===== اختصارات لوحة المفاتيح =====
function handleKeyboardShortcuts(event) {
    // Ctrl + F للبحث
    if (event.ctrlKey && event.key === 'f') {
        event.preventDefault();
        showSearchModal();
    }
    
    // Ctrl + S لحفظ التقدم
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        saveProgress();
        alert('تم حفظ التقدم بنجاح');
    }
    
    // مفاتيح الأسهم للتنقل
    if (event.key === 'ArrowLeft') {
        if (currentPageNumber > 1) {
            currentPageNumber--;
            displayPage(currentPageNumber);
        }
    }
    
    if (event.key === 'ArrowRight') {
        if (currentPageNumber < totalPages) {
            currentPageNumber++;
            displayPage(currentPageNumber);
        }
    }
    
    // ESC لإغلاق النوافذ
    if (event.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
    }
}

// ===== حفظ حجم الخط =====
function saveFontSize() {
    localStorage.setItem('quranFontSize', currentFontSize.toString());
}

// ===== تحميل حجم الخط =====
function loadFontSize() {
    const saved = localStorage.getItem('quranFontSize');
    if (saved) {
        currentFontSize = parseFloat(saved);
        return true;
    }
    return false;
}

// ===== حفظ التقدم =====
function saveProgress() {
    const progress = {
        page: currentPageNumber,
        surah: currentSurah,
        ayah: currentAyah,
        timestamp: Date.now()
    };
    
    localStorage.setItem('quranProgress', JSON.stringify(progress));
}

// ===== استعادة التقدم =====
function loadProgress() {
    const saved = localStorage.getItem('quranProgress');
    if (saved) {
        const progress = JSON.parse(saved);
        currentPageNumber = progress.page || 1;
        currentSurah = progress.surah || 1;
        currentAyah = progress.ayah || 1;
        return true;
    }
    return false;
}
