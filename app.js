// ===== المتغيرات العامة =====
let currentPageNumber = 1;
let totalPages = 604;
let currentFontSize = 1.15;
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
let autoScaleActive = false;
let pagesIndex = [];
let db = null;

// ===== إعدادات بناء الصفحات =====
const WORDS_PER_LINE = 10;
const MAX_LINES_PER_PAGE = 15;
const TARGET_TOTAL_PAGES = 604;
const MAX_SURAHS_PER_PAGE = 2;

// ===== إعدادات IndexedDB =====
const DB_NAME = 'QuranDB';
const DB_VERSION = 1;
const STORE_QURAN = 'quranData';
const STORE_META = 'meta';

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
    
    document.getElementById('retryButton').addEventListener('click', retryLoad);
    
    try {
        db = await openDatabase();
    } catch (error) {
        console.error('فشل فتح قاعدة البيانات:', error);
    }
    
    const success = await loadQuran();
    
    if (!success) {
        showErrorScreen('تعذّر تحميل بيانات القرآن الكريم. يرجى التحقق من الاتصال بالإنترنت.');
        return;
    }
    
    buildPagesIndex();
    
    hideLoadingScreen();
    loadSettings();
    initializeUI();
    determineInitialView();
    setupSwipeGestures();
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (!isShowingOpening) {
                displayPage(currentPageNumber);
            }
        }, 200);
    });
});

// ===== فتح قاعدة البيانات =====
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            
            if (!database.objectStoreNames.contains(STORE_QURAN)) {
                database.createObjectStore(STORE_QURAN, { keyPath: 'id' });
            }
            
            if (!database.objectStoreNames.contains(STORE_META)) {
                database.createObjectStore(STORE_META, { keyPath: 'key' });
            }
        };
    });
}

// ===== حفظ بيانات القرآن في IndexedDB =====
function saveQuranToDB(data) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('قاعدة البيانات غير متاحة'));
            return;
        }
        
        const transaction = db.transaction([STORE_QURAN, STORE_META], 'readwrite');
        const quranStore = transaction.objectStore(STORE_QURAN);
        const metaStore = transaction.objectStore(STORE_META);
        
        quranStore.put({ id: 'full', data: data });
        
        metaStore.put({ key: 'lastUpdate', value: Date.now() });
        metaStore.put({ key: 'version', value: '1.0.0' });
        
        transaction.oncomplete = () => resolve(true);
        transaction.onerror = () => reject(transaction.error);
    });
}

// ===== قراءة بيانات القرآن من IndexedDB =====
function getQuranFromDB() {
    return new Promise((resolve, reject) => {
        if (!db) {
            resolve(null);
            return;
        }
        
        const transaction = db.transaction([STORE_QURAN], 'readonly');
        const store = transaction.objectStore(STORE_QURAN);
        const request = store.get('full');
        
        request.onsuccess = () => {
            const result = request.result;
            if (result && result.data) {
                resolve(result.data);
            } else {
                resolve(null);
            }
        };
        
        request.onerror = () => reject(request.error);
    });
}

// ===== إخفاء شاشة التحميل =====
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
    }
    document.getElementById('appContainer').classList.remove('hidden');
}

// ===== عرض شاشة الخطأ =====
function showErrorScreen(message) {
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorScreen').classList.remove('hidden');
    document.getElementById('appContainer').classList.add('hidden');
}

// ===== إعادة المحاولة =====
async function retryLoad() {
    document.getElementById('errorScreen').classList.add('hidden');
    document.getElementById('loadingScreen').classList.remove('hidden');
    
    const success = await loadQuran();
    
    if (!success) {
        showErrorScreen('تعذّر تحميل بيانات القرآن الكريم. يرجى التحقق من الاتصال بالإنترنت.');
        return;
    }
    
    buildPagesIndex();
    
    hideLoadingScreen();
    loadSettings();
    initializeUI();
    determineInitialView();
    setupSwipeGestures();
}

// ===== دالة تطبيع النص العربي =====
function normalizeArabic(text) {
    if (!text) return '';
    
    return text
        .replace(/[\u064B-\u065F\u0670]/g, '')
        .replace(/[\u06D6-\u06ED\u08F0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g, '')
        .replace(/[أإآٱ]/g, 'ا')
        .replace(/ى/g, 'ي')
        .replace(/ة/g, 'ه')
        .replace(/ؤ/g, 'و')
        .replace(/ئ/g, 'ي')
        .replace(/\s+/g, ' ')
        .trim();
}

// ===== دالة الحصول على الاسم المشكّل =====
function getSurahName(surahNumber) {
    const info = surahNames.find(s => s.number === surahNumber);
    if (info) {
        return info.name;
    }
    const fallback = surahList.find(s => s.number === surahNumber);
    return fallback ? fallback.name : '';
}

// ===== حساب عدد الكلمات في نص =====
function getWordCount(text) {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

// ===== بناء فهرس الصفحات =====
function buildPagesIndex() {
    pagesIndex = [];
    
    if (quranData.length === 0) {
        pagesIndex.push({ start: 0, end: 0 });
        totalPages = 1;
        return;
    }
    
    const fatihaEndIndex = quranData.findIndex(a => a.surah === 2);
    const fatihaEnd = fatihaEndIndex >= 0 ? fatihaEndIndex : 7;
    
    pagesIndex.push({
        start: 0,
        end: fatihaEnd,
        isFatihaPage: true
    });
    
    const maxWordsPerPage = WORDS_PER_LINE * MAX_LINES_PER_PAGE;
    
    let pageStart = fatihaEnd;
    let currentWords = 0;
    let currentSurahCount = 0;
    let lastSurah = quranData[fatihaEnd]?.surah || 0;
    
    for (let i = fatihaEnd; i < quranData.length; i++) {
        const ayah = quranData[i];
        const ayahWords = getWordCount(ayah.text);
        
        const isNewSurah = ayah.surah !== lastSurah;
        
        const wouldExceedSurahLimit = isNewSurah && (currentSurahCount + 1) > MAX_SURAHS_PER_PAGE;
        
        const isLastAyahOfSurah = (i === quranData.length - 1) || 
                                  (quranData[i + 1].surah !== ayah.surah);
        
        const wouldExceedWords = (currentWords + ayahWords) > maxWordsPerPage;
        
        const shouldBreakForSurahLimit = wouldExceedSurahLimit;
        const shouldBreakForWords = wouldExceedWords && 
                                     (isLastAyahOfSurah || currentWords > maxWordsPerPage * 0.85);
        
        if ((shouldBreakForSurahLimit || shouldBreakForWords) && i > pageStart) {
            pagesIndex.push({
                start: pageStart,
                end: i
            });
            
            pageStart = i;
            currentWords = ayahWords;
            currentSurahCount = 1;
            lastSurah = ayah.surah;
        } else {
            if (isNewSurah) {
                currentSurahCount++;
                lastSurah = ayah.surah;
            }
            currentWords += ayahWords;
        }
    }
    
    if (pageStart < quranData.length) {
        pagesIndex.push({
            start: pageStart,
            end: quranData.length
        });
    }
    
    totalPages = pagesIndex.length;
    console.log('تم بناء فهرس الصفحات:', totalPages, 'صفحة');
}

// ===== الحصول على الآيات في صفحة معينة =====
function getPageAyahs(pageNumber) {
    if (pageNumber < 1 || pageNumber > pagesIndex.length) return [];
    
    const pageInfo = pagesIndex[pageNumber - 1];
    return quranData.slice(pageInfo.start, pageInfo.end);
}

// ===== التحقق إذا كانت الصفحة هي صفحة الفاتحة =====
function isFatihaPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > pagesIndex.length) return false;
    return pagesIndex[pageNumber - 1].isFatihaPage === true;
}

// ===== الحصول على رقم الصفحة لآية معينة =====
function getPageOfAyah(ayahIndex) {
    for (let i = 0; i < pagesIndex.length; i++) {
        if (ayahIndex >= pagesIndex[i].start && ayahIndex < pagesIndex[i].end) {
            return i + 1;
        }
    }
    return 1;
}

// ===== معالجة بيانات القرآن =====
function processQuranData(data) {
    quranData = [];
    surahList = [];
    
    data.forEach(surah => {
        surahList.push({
            number: surah.id,
            name: surah.name,
            ayahs: surah.total_verses,
            type: surah.type === 'meccan' ? 'مكية' : 'مدنية'
        });
        
        surah.verses.forEach(ayah => {
            quranData.push({
                surah: surah.id,
                ayah: ayah.id,
                text: ayah.text.trim(),
                normalizedText: normalizeArabic(ayah.text),
                wordCount: getWordCount(ayah.text)
            });
        });
    });
}

// ===== تحميل القرآن =====
async function loadQuran() {
    try {
        let data = null;
        
        try {
            data = await getQuranFromDB();
            if (data) {
                console.log('تم تحميل البيانات من IndexedDB');
            }
        } catch (error) {
            console.warn('فشل القراءة من IndexedDB:', error);
        }
        
        if (!data) {
            console.log('جلب البيانات من الشبكة...');
            const response = await fetch('quran.json');
            
            if (!response.ok) {
                throw new Error('فشل الاتصال بالخادم: ' + response.status);
            }
            
            data = await response.json();
            
            try {
                await saveQuranToDB(data);
                console.log('تم حفظ البيانات في IndexedDB');
            } catch (error) {
                console.warn('فشل الحفظ في IndexedDB:', error);
            }
        }
        
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('بيانات القرآن غير صحيحة');
        }
        
        processQuranData(data);
        
        console.log('تم تحميل القرآن الكريم:', quranData.length, 'آية');
        return true;
    } catch (error) {
        console.error('خطأ في تحميل القرآن:', error);
        return false;
    }
}

// ===== تحميل الإعدادات =====
function loadSettings() {
    // تجاهل حجم الخط المحفوظ لأننا زدناه درجتين
    // const savedFontSize = localStorage.getItem('quranFontSize');
    // if (savedFontSize) {
    //     currentFontSize = parseFloat(savedFontSize);
    // }
    
    // حفظ الحجم الجديد
    localStorage.setItem('quranFontSize', currentFontSize.toString());
    
    const savedProgress = localStorage.getItem('quranProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        currentPageNumber = progress.page || 1;
        isFirstLaunch = false;
    } else {
        isFirstLaunch = true;
    }
    
    const savedBookmarks = localStorage.getItem('quranBookmarks');
    if (savedBookmarks) {
        bookmarks = JSON.parse(savedBookmarks);
    }
}

// ===== تحديد العرض الأولي =====
function determineInitialView() {
    if (isFirstLaunch) {
        showOpeningPage();
    } else {
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
    document.getElementById('menuToggle').addEventListener('click', openMenu);
    document.getElementById('closeMenu').addEventListener('click', closeMenu);
    document.getElementById('sideMenuOverlay').addEventListener('click', closeMenu);
    
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
    
    document.getElementById('saveBookmarkBtn').addEventListener('click', () => {
        saveBookmark();
        closeMenu();
    });
    
    document.getElementById('searchBtn').addEventListener('click', showSearchModal);
    
    const updateBtn = document.getElementById('updateAppBtn');
    if (updateBtn) {
        updateBtn.addEventListener('click', () => {
            closeMenu();
            updateApplication();
        });
    }
    
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.add('hidden');
        });
    });
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
    
    document.getElementById('searchExecute').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    document.getElementById('backFromDedication').addEventListener('click', hideDedicationPage);
    
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        console.log('التطبيق جاهز للعمل Offline');
    }
}

// ===== تحديث التطبيق =====
async function updateApplication() {
    if (!('serviceWorker' in navigator)) {
        alert('التحديث غير مدعوم في هذا المتصفح');
        return;
    }
    
    try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        
        try {
            const transaction = db.transaction([STORE_QURAN], 'readwrite');
            const store = transaction.objectStore(STORE_QURAN);
            await new Promise((resolve, reject) => {
                const request = store.delete('full');
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.warn('فشل حذف البيانات من IndexedDB:', error);
        }
        
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(r => r.unregister()));
        
        alert('تم تحديث التطبيق. سيُعاد التحميل الآن.');
        
        window.location.reload(true);
    } catch (error) {
        console.error('فشل التحديث:', error);
        alert('فشل تحديث التطبيق. يرجى المحاولة مرة أخرى.');
    }
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
        showMushafPage();
        displayPage(1);
        isFirstLaunch = false;
        return;
    }
    
    if (swipeDistance < 0) {
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

// ===== الحصول على السورة السابقة في آخر صفحة =====
function getLastSurahOfPage(pageNumber) {
    if (pageNumber < 1) return null;
    
    const pageAyahs = getPageAyahs(pageNumber);
    if (pageAyahs.length === 0) return null;
    
    return pageAyahs[pageAyahs.length - 1].surah;
}

// ===== دالة تحديث رقم الصفحة =====
function updatePageNumber(pageNumber) {
    const pageNumberElement = document.getElementById('pageNumber');
    
    if (!pageNumberElement) return;
    
    pageNumberElement.textContent = convertToArabicNumbers(pageNumber);
}

// ===== ضبط تلقائي ذكي =====
function autoFitContent() {
    const content = document.getElementById('mushafContent');
    if (!content) return;
    
    const baseSize = window.innerWidth < 480 ? 16 : 20;
    const baseFontSize = baseSize * currentFontSize;
    
    content.style.fontSize = baseFontSize + 'px';
    content.style.lineHeight = '2.1';
    
    autoScaleActive = false;
    
    requestAnimationFrame(() => {
        let availableHeight = content.clientHeight;
        let contentHeight = content.scrollHeight;
        
        if (contentHeight > availableHeight) {
            let scale = 1;
            const minScale = 0.55;
            const step = 0.02;
            
            while (scale > minScale) {
                scale -= step;
                content.style.fontSize = (baseFontSize * scale) + 'px';
                
                contentHeight = content.scrollHeight;
                if (contentHeight <= availableHeight) {
                    break;
                }
            }
            
            autoScaleActive = scale < 1;
        }
        else {
            let scale = 1;
            const maxScale = 5.0;
            const step = 0.02;
            
            while (scale < maxScale) {
                const nextScale = scale + step;
                content.style.fontSize = (baseFontSize * nextScale) + 'px';
                
                contentHeight = content.scrollHeight;
                
                if (contentHeight > availableHeight) {
                    content.style.fontSize = (baseFontSize * scale) + 'px';
                    break;
                }
                
                scale = nextScale;
            }
            
            autoScaleActive = scale > 1;
        }
    });
}

// ===== عرض الصفحة =====
function displayPage(pageNumber) {
    currentPageNumber = pageNumber;
    
    updatePageNumber(pageNumber);
    
    const pageAyahs = getPageAyahs(pageNumber);
    
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
    
    const previousPageLastSurah = getLastSurahOfPage(pageNumber - 1);
    
    const surahGroups = {};
    pageAyahs.forEach(ayah => {
        if (!surahGroups[ayah.surah]) {
            surahGroups[ayah.surah] = [];
        }
        surahGroups[ayah.surah].push(ayah);
    });
    
    const surahNumbers = Object.keys(surahGroups);
    
    surahNumbers.forEach((surahNumber, index) => {
        const surahNum = parseInt(surahNumber);
        const surahAyahs = surahGroups[surahNumber];
        
        const isNewSurah = (previousPageLastSurah === null || surahNum !== previousPageLastSurah);
        
        if (isNewSurah) {
            displaySurahHeader(content, surahNum);
        }
        
        const ayahsContainer = document.createElement('div');
        ayahsContainer.className = 'ayahs-container';
        
        surahAyahs.forEach(ayah => {
            appendAyahToContainer(ayahsContainer, ayah);
        });
        
        content.appendChild(ayahsContainer);
        
        if (index < surahNumbers.length - 1) {
            const spacer = document.createElement('div');
            spacer.style.height = '20px';
            content.appendChild(spacer);
        }
    });
    
    setTimeout(() => {
        autoFitContent();
    }, 30);
    
    if (pageAyahs.length > 0) {
        saveProgress(pageAyahs[0]);
    }
}

// ===== إضافة آية إلى حاوية =====
function appendAyahToContainer(container, ayah) {
    const ayahText = document.createElement('span');
    ayahText.className = 'ayah-text';
    ayahText.textContent = ayah.text;
    
    const ayahNumber = document.createElement('span');
    ayahNumber.className = 'ayah-number';
    ayahNumber.textContent = ' ' + convertToArabicNumbers(ayah.ayah);
    
    container.appendChild(ayahText);
    container.appendChild(ayahNumber);
    container.appendChild(document.createTextNode(' '));
}

// ===== عرض رأس السورة =====
function displaySurahHeader(content, surahNumber) {
    const surahName = getSurahName(surahNumber);
    if (surahName) {
        const surahHeader = document.createElement('div');
        surahHeader.className = 'surah-header';
        surahHeader.textContent = `سُورَةُ ${surahName}`;
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
    const surahName = getSurahName(currentSurahNumber);
    document.getElementById('topSurahName').textContent = `سُورَةُ ${surahName}`;
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
        const baseSize = window.innerWidth < 480 ? 16 : 20;
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
            <span class="index-name">${getSurahName(surah.number)}</span>
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
        
        const surahName = getSurahName(bookmark.surah);
        
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
    const firstAyahIndex = quranData.findIndex(a => a.surah === surahNumber);
    if (firstAyahIndex >= 0) {
        currentPageNumber = getPageOfAyah(firstAyahIndex);
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
    let resultLabel = '';
    
    switch (searchType) {
        case 'text':
            const normalizedSearch = normalizeArabic(searchText);
            results = quranData.filter(ayah => 
                ayah.normalizedText.includes(normalizedSearch)
            ).slice(0, 50);
            resultLabel = `نتائج البحث عن: "${searchText}"`;
            break;
            
        case 'surah':
            const surahNum = parseInt(searchText);
            if (surahNum >= 1 && surahNum <= 114) {
                results = quranData.filter(ayah => ayah.surah === surahNum);
                resultLabel = `سُورَةُ ${getSurahName(surahNum)}`;
            }
            break;
            
        case 'ayah':
            const ayahNum = parseInt(searchText);
            if (!isNaN(ayahNum) && ayahNum > 0) {
                results = quranData.filter(ayah => ayah.ayah === ayahNum);
                resultLabel = `الآية رقم ${convertToArabicNumbers(ayahNum)} في جميع السور`;
            }
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
                        resultLabel = `الجزء ${convertToArabicNumbers(juzNum)}`;
                    }
                }
            }
            break;
    }
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="bookmark-empty">لا توجد نتائج</div>';
        return;
    }
    
    const resultCount = document.createElement('div');
    resultCount.className = 'search-result-count';
    resultCount.textContent = `${resultLabel} — عدد النتائج: ${convertToArabicNumbers(results.length)}`;
    resultsContainer.appendChild(resultCount);
    
    if (searchType === 'ayah') {
        const surahGroups = {};
        results.forEach(ayah => {
            if (!surahGroups[ayah.surah]) {
                surahGroups[ayah.surah] = [];
            }
            surahGroups[ayah.surah].push(ayah);
        });
        
        Object.keys(surahGroups).forEach(surahNum => {
            const groupHeader = document.createElement('div');
            groupHeader.className = 'search-result-group-header';
            groupHeader.textContent = `سُورَةُ ${getSurahName(parseInt(surahNum))}`;
            resultsContainer.appendChild(groupHeader);
            
            surahGroups[surahNum].forEach(ayah => {
                const resultItem = createSearchResultItem(ayah);
                resultsContainer.appendChild(resultItem);
            });
        });
    } else {
        results.forEach(ayah => {
            const resultItem = createSearchResultItem(ayah);
            resultsContainer.appendChild(resultItem);
        });
    }
}

// ===== إنشاء عنصر نتيجة البحث =====
function createSearchResultItem(ayah) {
    const resultItem = document.createElement('div');
    resultItem.className = 'search-result-item';
    
    const surahName = getSurahName(ayah.surah);
    
    resultItem.innerHTML = `
        <div class="search-result-header">
            سورة ${surahName} - آية ${convertToArabicNumbers(ayah.ayah)}
        </div>
        <div class="search-result-text">${ayah.text}</div>
    `;
    
    resultItem.addEventListener('click', () => {
        const ayahIndex = quranData.indexOf(ayah);
        currentPageNumber = getPageOfAyah(ayahIndex);
        showMushafPage();
        displayPage(currentPageNumber);
        document.getElementById('searchModal').classList.add('hidden');
    });
    
    return resultItem;
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
            goToNextPage();
        }
    }
    
    if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (isShowingOpening) {
            showMushafPage();
            displayPage(1);
            isFirstLaunch = false;
        } else {
            goToPreviousPage();
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
