// ===== المتغيرات العامة =====
let currentPageNumber = 1;
let totalPages = 556;
let currentFontSize = 1.15;
let touchStartX = 0;
let touchEndX = 0;
let isDragging = false;
let bookmarks = [];
let currentSurahNumber = 1;
let currentJuzNumber = 1;
let quranData = [];
let surahList = [];
let db = null;

// ===== إعدادات حجم الخط =====
const FIXED_FONT_SIZE_MOBILE = 16;
const FIXED_FONT_SIZE_DESKTOP = 20;

// ===== إعدادات IndexedDB =====
const DB_NAME = 'QuranDB';
const DB_VERSION = 2;
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
    
    // ===== إظهار التطبيق مباشرة =====
    const appContainer = document.getElementById('appContainer');
    if (appContainer) {
        appContainer.classList.remove('hidden');
    }
    
    const topBar = document.getElementById('topBar');
    if (topBar) {
        topBar.classList.remove('hidden');
    }
    
    // ربط زر إعادة المحاولة
    const retryBtn = document.getElementById('retryButton');
    if (retryBtn) {
        retryBtn.addEventListener('click', retryLoad);
    }
    
    // فتح قاعدة البيانات
    try {
        db = await openDatabase();
    } catch (error) {
        console.error('فشل فتح قاعدة البيانات:', error);
    }
    
    // تحميل بيانات القرآن
    const success = await loadQuranData();
    
    if (!success) {
        showErrorScreen('تعذّر تحميل بيانات القرآن الكريم. تأكد من وجود ملف quran.json.');
        return;
    }
    
    // بناء قائمة السور
    buildSurahList();
    
    // استعادة الإعدادات
    loadSettings();
    
    // تهيئة الواجهة
    initializeUI();
    
    // تفعيل السحب
    setupSwipeGestures();
    
    // عرض الصفحة المطلوبة
    displayPage(currentPageNumber);
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            displayPage(currentPageNumber);
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
            
            if (database.objectStoreNames.contains(STORE_QURAN)) {
                database.deleteObjectStore(STORE_QURAN);
            }
            if (database.objectStoreNames.contains(STORE_META)) {
                database.deleteObjectStore(STORE_META);
            }
            
            database.createObjectStore(STORE_QURAN, { keyPath: 'id' });
            database.createObjectStore(STORE_META, { keyPath: 'key' });
        };
    });
}

// ===== حفظ البيانات في IndexedDB =====
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
        
        transaction.oncomplete = () => resolve(true);
        transaction.onerror = () => reject(transaction.error);
    });
}

// ===== قراءة البيانات من IndexedDB =====
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

// ===== عرض شاشة الخطأ =====
function showErrorScreen(message) {
    const errorMsg = document.getElementById('errorMessage');
    if (errorMsg) {
        errorMsg.textContent = message;
    }
    const errorScreen = document.getElementById('errorScreen');
    if (errorScreen) {
        errorScreen.classList.remove('hidden');
    }
    const app = document.getElementById('appContainer');
    if (app) {
        app.classList.add('hidden');
    }
}

// ===== إعادة المحاولة =====
async function retryLoad() {
    const errorScreen = document.getElementById('errorScreen');
    if (errorScreen) {
        errorScreen.classList.add('hidden');
    }
    
    const success = await loadQuranData();
    
    if (!success) {
        showErrorScreen('تعذّر تحميل بيانات القرآن الكريم. تأكد من وجود ملف quran.json.');
        return;
    }
    
    buildSurahList();
    loadSettings();
    
    const app = document.getElementById('appContainer');
    if (app) {
        app.classList.remove('hidden');
    }
    
    initializeUI();
    setupSwipeGestures();
    displayPage(currentPageNumber);
}

// ===== تحميل بيانات القرآن =====
async function loadQuranData() {
    try {
        let data = null;
        
        // محاولة القراءة من IndexedDB
        try {
            data = await getQuranFromDB();
            if (data) {
                console.log('تم تحميل البيانات من IndexedDB');
            }
        } catch (error) {
            console.warn('فشل القراءة من IndexedDB:', error);
        }
        
        // إذا لم توجد، جلبها من الشبكة
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
        
        // استخراج quranData
        quranData = [];
        data.forEach(surah => {
            surah.verses.forEach(ayah => {
                quranData.push({
                    surah: surah.id,
                    ayah: ayah.id,
                    text: ayah.text.trim()
                });
            });
        });
        
        // ===== المشاركة مع quran.js =====
        window.quranData = quranData;
        
        console.log('تم تحميل القرآن الكريم:', quranData.length, 'آية');
        return true;
    } catch (error) {
        console.error('خطأ في تحميل القرآن:', error);
        return false;
    }
}

// ===== بناء قائمة السور =====
function buildSurahList() {
    surahList = [];
    
    const surahMap = {};
    
    quranData.forEach(ayah => {
        if (!surahMap[ayah.surah]) {
            surahMap[ayah.surah] = {
                number: ayah.surah,
                name: getSurahName(ayah.surah),
                ayahs: 0
            };
        }
        surahMap[ayah.surah].ayahs++;
    });
    
    surahList = Object.values(surahMap).sort((a, b) => a.number - b.number);
    console.log('تم بناء قائمة السور:', surahList.length);
}

// ===== الحصول على الاسم المشكّل =====
function getSurahName(surahNumber) {
    const info = surahNames.find(s => s.number === surahNumber);
    return info ? info.name : '';
}

// ===== تحميل الإعدادات =====
function loadSettings() {
    const savedProgress = localStorage.getItem('quranProgress');
    if (savedProgress) {
        try {
            const progress = JSON.parse(savedProgress);
            currentPageNumber = progress.page || 1;
        } catch (e) {
            currentPageNumber = 1;
        }
    } else {
        currentPageNumber = 1;
    }
    
    const savedBookmarks = localStorage.getItem('quranBookmarks');
    if (savedBookmarks) {
        try {
            bookmarks = JSON.parse(savedBookmarks);
        } catch (e) {
            bookmarks = [];
        }
    }
}

// ===== تهيئة الواجهة =====
function initializeUI() {
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) menuToggle.addEventListener('click', openMenu);
    
    const closeMenuBtn = document.getElementById('closeMenu');
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
    
    const sideMenuOverlay = document.getElementById('sideMenuOverlay');
    if (sideMenuOverlay) sideMenuOverlay.addEventListener('click', closeMenu);
    
    const menuQuran = document.getElementById('menuQuran');
    if (menuQuran) {
        menuQuran.addEventListener('click', () => {
            closeMenu();
            goToLastPosition();
        });
    }
    
    const menuIndex = document.getElementById('menuIndex');
    if (menuIndex) {
        menuIndex.addEventListener('click', () => {
            closeMenu();
            showIndexModal();
        });
    }
    
    const menuBookmarks = document.getElementById('menuBookmarks');
    if (menuBookmarks) {
        menuBookmarks.addEventListener('click', () => {
            closeMenu();
            showBookmarksModal();
        });
    }
    
    const menuDedication = document.getElementById('menuDedication');
    if (menuDedication) {
        menuDedication.addEventListener('click', () => {
            closeMenu();
            showDedicationPage();
        });
    }
    
    const saveBookmarkBtn = document.getElementById('saveBookmarkBtn');
    if (saveBookmarkBtn) {
        saveBookmarkBtn.addEventListener('click', () => {
            saveBookmark();
            closeMenu();
        });
    }
    
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) searchBtn.addEventListener('click', showSearchModal);
    
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
    
    const searchExecute = document.getElementById('searchExecute');
    if (searchExecute) searchExecute.addEventListener('click', performSearch);
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    const backFromDedication = document.getElementById('backFromDedication');
    if (backFromDedication) backFromDedication.addEventListener('click', hideDedicationPage);
    
    document.addEventListener('keydown', handleKeyboardShortcuts);
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
            const transaction = db.transaction([STORE_QURAN, STORE_META], 'readwrite');
            transaction.objectStore(STORE_QURAN).delete('full');
            transaction.objectStore(STORE_META).clear();
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
        try {
            const progress = JSON.parse(savedProgress);
            currentPageNumber = progress.page || 1;
        } catch (e) {
            currentPageNumber = 1;
        }
    } else {
        currentPageNumber = 1;
    }
    displayPage(currentPageNumber);
}

// ===== فتح وإغلاق القائمة =====
function openMenu() {
    const sideMenu = document.getElementById('sideMenu');
    if (sideMenu) sideMenu.classList.add('open');
    const overlay = document.getElementById('sideMenuOverlay');
    if (overlay) overlay.classList.add('active');
}

function closeMenu() {
    const sideMenu = document.getElementById('sideMenu');
    if (sideMenu) sideMenu.classList.remove('open');
    const overlay = document.getElementById('sideMenuOverlay');
    if (overlay) overlay.classList.remove('active');
}

// ===== إعداد السحب =====
function setupSwipeGestures() {
    const page = document.getElementById('quranPage');
    if (!page) return;
    
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
        if (page) page.classList.add('page-turning-next');
        
        setTimeout(() => {
            currentPageNumber++;
            displayPage(currentPageNumber);
            if (page) page.classList.remove('page-turning-next');
        }, 175);
    }
}

function goToPreviousPage() {
    if (currentPageNumber > 1) {
        const page = document.getElementById('mushafPage');
        if (page) page.classList.add('page-turning-prev');
        
        setTimeout(() => {
            currentPageNumber--;
            displayPage(currentPageNumber);
            if (page) page.classList.remove('page-turning-prev');
        }, 175);
    }
}

// ===== تحديث رقم الصفحة =====
function updatePageNumber(pageNumber) {
    const pageNumberElement = document.getElementById('pageNumber');
    if (!pageNumberElement) return;
    pageNumberElement.textContent = convertToArabicNumbers(pageNumber);
}

// ===== ضبط حجم الخط =====
function autoFitContent() {
    const content = document.getElementById('mushafContent');
    if (!content) return;
    
    const isMobile = window.innerWidth < 768;
    const baseSize = isMobile ? FIXED_FONT_SIZE_MOBILE : FIXED_FONT_SIZE_DESKTOP;
    
    let currentSize = baseSize * currentFontSize;
    content.style.fontSize = currentSize + 'px';
    content.style.lineHeight = '1.65';
    content.style.justifyContent = 'flex-start';
    
    const availableHeight = content.clientHeight;
    const availableWidth = content.clientWidth;
    
    let contentHeight = content.scrollHeight;
    let contentWidth = content.scrollWidth;
    
    if (contentHeight > availableHeight || contentWidth > availableWidth) {
        let attempts = 0;
        const maxAttempts = 60;
        const minSize = 9;
        
        while ((contentHeight > availableHeight || contentWidth > availableWidth) && 
               attempts < maxAttempts && 
               currentSize > minSize) {
            currentSize -= 0.5;
            content.style.fontSize = currentSize + 'px';
            
            contentHeight = content.scrollHeight;
            contentWidth = content.scrollWidth;
            attempts++;
        }
    }
    else if (contentHeight < availableHeight * 0.85) {
        let attempts = 0;
        const maxAttempts = 120;
        const maxSize = baseSize * 4.0;
        const targetHeight = availableHeight * 0.98;
        
        while (contentHeight < targetHeight && 
               currentSize < maxSize && 
               attempts < maxAttempts) {
            
            const nextSize = currentSize + 0.5;
            content.style.fontSize = nextSize + 'px';
            
            const newHeight = content.scrollHeight;
            const newWidth = content.scrollWidth;
            
            if (newHeight > availableHeight || newWidth > availableWidth) {
                content.style.fontSize = currentSize + 'px';
                break;
            }
            
            currentSize = nextSize;
            contentHeight = newHeight;
            contentWidth = newWidth;
            attempts++;
        }
        
        const finalHeight = content.scrollHeight;
        if (finalHeight < availableHeight * 0.9) {
            content.style.justifyContent = 'space-between';
        }
    }
}

// ===== عرض الصفحة =====
function displayPage(pageNumber) {
    currentPageNumber = pageNumber;
    
    updatePageNumber(pageNumber);
    
    const pageVerses = getPageVerses(pageNumber);
    const pageData = getPageData(pageNumber);
    
    const content = document.getElementById('mushafContent');
    if (!content) return;
    content.innerHTML = '';
    
    if (!pageVerses || pageVerses.length === 0) {
        content.innerHTML = '<div style="text-align:center;color:#888;font-size:1.1rem;">لا توجد بيانات لهذه الصفحة</div>';
        return;
    }
    
    const firstVerse = pageVerses[0];
    currentSurahNumber = firstVerse.surah;
    currentJuzNumber = getJuzNumber(firstVerse.surah, firstVerse.ayah);
    updateTopBar();
    
    const previousPageData = getPageData(pageNumber - 1);
    const previousLastSurah = previousPageData 
        ? previousPageData.items[previousPageData.items.length - 1].surah 
        : null;
    
    const surahGroups = {};
    pageVerses.forEach(verse => {
        if (!surahGroups[verse.surah]) {
            surahGroups[verse.surah] = [];
        }
        surahGroups[verse.surah].push(verse);
    });
    
    const surahNumbers = Object.keys(surahGroups);
    
    surahNumbers.forEach((surahNum, index) => {
        const surahNumber = parseInt(surahNum);
        const surahVerses = surahGroups[surahNum];
        
        const isNewSurah = (previousLastSurah === null || surahNumber !== previousLastSurah);
        
        if (isNewSurah) {
            displaySurahHeader(content, surahNumber);
        }
        
        const ayahsContainer = document.createElement('div');
        ayahsContainer.className = 'ayahs-container';
        
        surahVerses.forEach(verse => {
            appendAyahToContainer(ayahsContainer, verse);
        });
        
        content.appendChild(ayahsContainer);
        
        if (index < surahNumbers.length - 1) {
            const spacer = document.createElement('div');
            spacer.style.height = '20px';
            content.appendChild(spacer);
        }
    });
    
    requestAnimationFrame(() => {
        autoFitContent();
    });
    
    if (pageVerses.length > 0) {
        saveProgress(pageVerses[0]);
    }
}

// ===== إضافة آية =====
function appendAyahToContainer(container, verse) {
    const ayahText = document.createElement('span');
    ayahText.className = 'ayah-text';
    ayahText.textContent = verse.text;
    
    const ayahNumber = document.createElement('span');
    ayahNumber.className = 'ayah-number';
    ayahNumber.textContent = ' ' + convertToArabicNumbers(verse.ayah);
    
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
    const topSurahName = document.getElementById('topSurahName');
    if (topSurahName) topSurahName.textContent = `سُورَةُ ${surahName}`;
    
    const topJuzName = document.getElementById('topJuzName');
    if (topJuzName) topJuzName.textContent = `الجزء ${convertToArabicNumbers(currentJuzNumber)}`;
}

// ===== رقم الجزء =====
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

// ===== تحويل الأرقام =====
function convertToArabicNumbers(number) {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return number.toString().replace(/[0-9]/g, (match) => {
        return arabicNumbers[parseInt(match)];
    });
}

// ===== عرض الفهرس =====
function showIndexModal() {
    const modal = document.getElementById('indexModal');
    const list = document.getElementById('indexList');
    
    if (!modal || !list) return;
    
    modal.classList.remove('hidden');
    list.innerHTML = '';
    
    surahList.forEach(surah => {
        const item = document.createElement('div');
        item.className = 'index-item';
        item.innerHTML = `
            <span class="index-number">${convertToArabicNumbers(surah.number)}</span>
            <span class="index-name">${surah.name}</span>
            <span class="index-info">${surah.ayahs} آية</span>
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
    if (!modal) return;
    modal.classList.remove('hidden');
    const input = document.getElementById('searchInput');
    if (input) input.focus();
}

// ===== المواضع المحفوظة =====
function showBookmarksModal() {
    const modal = document.getElementById('bookmarksModal');
    const list = document.getElementById('bookmarksList');
    
    if (!modal || !list) return;
    
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
    const pageNumber = getPageForVerse(surahNumber, 1);
    
    if (pageNumber > 0) {
        currentPageNumber = pageNumber;
        displayPage(currentPageNumber);
    }
}

// ===== صفحة الإهداء =====
function showDedicationPage() {
    const text = document.getElementById('dedicationText');
    if (text) text.innerHTML = DEDICATION_TEXT;
    
    const page = document.getElementById('dedicationPage');
    if (page) page.classList.remove('hidden');
}

function hideDedicationPage() {
    const page = document.getElementById('dedicationPage');
    if (page) page.classList.add('hidden');
}

// ===== تنفيذ البحث =====
function performSearch() {
    const searchTypeEl = document.getElementById('searchType');
    const searchInputEl = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('searchResults');
    
    if (!searchTypeEl || !searchInputEl || !resultsContainer) return;
    
    const searchType = searchTypeEl.value;
    const searchText = searchInputEl.value.trim();
    
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
                normalizeArabic(ayah.text).includes(normalizedSearch)
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
                results = quranData.filter(ayah => ayah.ayah === ayahNum).slice(0, 50);
                resultLabel = `الآية رقم ${convertToArabicNumbers(ayahNum)}`;
            }
            break;
            
        case 'juz':
            const juzNum = parseInt(searchText);
            if (juzNum >= 1 && juzNum <= 30) {
                const juzInfo = juzBoundaries.find(j => j.juz === juzNum);
                if (juzInfo) {
                    results = quranData.filter(ayah => {
                        if (ayah.surah > juzInfo.surah) return true;
                        if (ayah.surah === juzInfo.surah && ayah.ayah >= juzInfo.ayah) return true;
                        return false;
                    }).slice(0, 100);
                    resultLabel = `الجزء ${convertToArabicNumbers(juzNum)}`;
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
    
    results.forEach(ayah => {
        const resultItem = createSearchResultItem(ayah);
        resultsContainer.appendChild(resultItem);
    });
}

// ===== تطبيع النص =====
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
        const pageNumber = getPageForVerse(ayah.surah, ayah.ayah);
        currentPageNumber = pageNumber;
        displayPage(currentPageNumber);
        
        const modal = document.getElementById('searchModal');
        if (modal) modal.classList.add('hidden');
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

// ===== اختصارات لوحة المفاتيح =====
function handleKeyboardShortcuts(event) {
    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToNextPage();
    }
    
    if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToPreviousPage();
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
