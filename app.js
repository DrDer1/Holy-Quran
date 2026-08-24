// ============================================================
// APP.JS - تطبيق المصحف الكريم
// ============================================================

let currentSurah = 0;
let currentAyah = 0;
let fontSize = 100;
let lastRead = null;

// ============================================================
// LOAD DATA
// ============================================================

async function loadQuran() {
    try {
        const response = await fetch('quran.json');
        QURAN_DATA = await response.json();
        console.log('✅ تم تحميل القرآن بنجاح');
    } catch(e) {
        console.warn('⚠️ لم يتم العثور على quran.json');
        alert('❌ خطأ: لم يتم العثور على ملف quran.json');
        return;
    }
    
    loadLastRead();
    renderSurahList();
    renderJuzGrid();
    loadFontSize();
}

// ============================================================
// SURAH LIST
// ============================================================

function renderSurahList() {
    const list = document.getElementById('surahList');
    list.innerHTML = '';
    const surahNumbers = Object.keys(QURAN_DATA).map(Number).sort((a,b) => a-b);
    
    surahNumbers.forEach(num => {
        const count = QURAN_DATA[num].length;
        const name = SURAH_NAMES[num-1] || `سورة ${num}`;
        const div = document.createElement('div');
        div.className = 'surah-item';
        div.innerHTML = `
            <span class="number">${num}</span>
            <span class="name">${name}</span>
            <span class="info">${count} آيات</span>
        `;
        div.onclick = () => openSurah(num);
        list.appendChild(div);
    });
}

// ============================================================
// JUZ
// ============================================================

function renderJuzGrid() {
    const grid = document.getElementById('juzGrid');
    grid.innerHTML = '';
    for (let i = 1; i <= 30; i++) {
        const div = document.createElement('div');
        div.className = 'juz-item';
        div.innerHTML = `
            <span class="juz-num">${i}</span>
            <span class="juz-label">الجزء</span>
        `;
        div.onclick = () => openJuz(i);
        grid.appendChild(div);
    }
}

function openJuz(juzNum) {
    const idx = juzNum - 1;
    const bound = JUZ_BOUNDARIES[idx];
    if (!bound) return;
    openSurah(bound.surah, bound.ayah);
}

// ============================================================
// OPEN SURAH
// ============================================================

function openSurah(num, highlightAyah = null) {
    const surah = QURAN_DATA[num];
    if (!surah) {
        alert('⚠️ السورة غير موجودة في البيانات');
        return;
    }
    
    currentSurah = num;
    
    // إخفاء التبويبات
    document.querySelector('.tab-content.active')?.classList.remove('active');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    // عرض شاشة الآيات
    const screen = document.getElementById('ayahScreen');
    screen.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    const name = SURAH_NAMES[num-1] || `سورة ${num}`;
    document.getElementById('surahTitle').textContent = `${name} (${num})`;
    
    const list = document.getElementById('ayahList');
    list.innerHTML = '';
    
    // البسملة (عدا الفاتحة والتوبة)
    if (num !== 1 && num !== 9) {
        const bism = document.createElement('div');
        bism.className = 'bismillah';
        bism.textContent = '﷽';
        list.appendChild(bism);
    }
    
    surah.forEach(ayah => {
        const div = document.createElement('div');
        div.className = 'ayah-line';
        if (highlightAyah && ayah.ayah === highlightAyah) {
            div.classList.add('highlight');
        }
        div.innerHTML = `<span class="ayah-num">${ayah.ayah}</span> ${ayah.text}`;
        div.id = `ayah-${ayah.ayah}`;
        list.appendChild(div);
    });
    
    // تطبيق حجم الخط
    applyFontSize();
    
    // حفظ آخر مكان
    const ayahToSave = highlightAyah || 1;
    saveLastRead(num, ayahToSave);
    
    // تمرير للآية المميزة
    if (highlightAyah) {
        setTimeout(() => {
            const el = document.getElementById(`ayah-${highlightAyah}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    } else {
        document.getElementById('ayahScreen').scrollTop = 0;
    }
}

function closeAyahScreen() {
    document.getElementById('ayahScreen').classList.remove('active');
    document.body.style.overflow = '';
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
        const tabId = activeTab.id.replace('tab', '').toLowerCase();
        switchTab(tabId);
    } else {
        switchTab('surah');
    }
}

// ============================================================
// SEARCH
// ============================================================

function doSearch() {
    const textQuery = document.getElementById('searchText').value.trim();
    const ayahNum = parseInt(document.getElementById('searchAyah').value);
    const juzNum = parseInt(document.getElementById('searchJuz').value);
    
    const results = document.getElementById('searchResults');
    results.innerHTML = '';
    
    if (!textQuery && !ayahNum && !juzNum) {
        results.innerHTML = `<div class="no-results"><span>🔍</span> أدخل كلمة أو رقم آية أو رقم جزء</div>`;
        return;
    }
    
    let found = [];
    const surahNumbers = Object.keys(QURAN_DATA).map(Number).sort((a,b) => a-b);
    
    // بحث برقم الجزء
    if (juzNum >= 1 && juzNum <= 30) {
        const bound = JUZ_BOUNDARIES[juzNum - 1];
        const nextBound = JUZ_BOUNDARIES[juzNum] || { surah: 999, ayah: 999 };
        
        for (const sNum of surahNumbers) {
            const surah = QURAN_DATA[sNum];
            for (const ayah of surah) {
                let inJuz = false;
                if (sNum === bound.surah && ayah.ayah >= bound.ayah) inJuz = true;
                if (sNum > bound.surah && sNum < nextBound.surah) inJuz = true;
                if (sNum === bound.surah && sNum !== nextBound.surah && sNum < nextBound.surah) inJuz = true;
                if (sNum === nextBound.surah && ayah.ayah < nextBound.ayah && sNum !== bound.surah) inJuz = true;
                if (sNum === bound.surah && sNum === nextBound.surah) {
                    inJuz = (ayah.ayah >= bound.ayah && ayah.ayah < nextBound.ayah);
                }
                if (inJuz) {
                    found.push({
                        surah: sNum,
                        ayah: ayah.ayah,
                        text: ayah.text,
                        surahName: SURAH_NAMES[sNum-1] || `سورة ${sNum}`
                    });
                }
            }
        }
    }
    
    // بحث برقم الآية
    if (ayahNum >= 1) {
        for (const sNum of surahNumbers) {
            const surah = QURAN_DATA[sNum];
            const ayah = surah.find(a => a.ayah === ayahNum);
            if (ayah) {
                found.push({
                    surah: sNum,
                    ayah: ayah.ayah,
                    text: ayah.text,
                    surahName: SURAH_NAMES[sNum-1] || `سورة ${sNum}`
                });
            }
        }
    }
    
    // بحث بالنص
    if (textQuery.length > 0) {
        for (const sNum of surahNumbers) {
            const surah = QURAN_DATA[sNum];
            for (const ayah of surah) {
                if (ayah.text.includes(textQuery)) {
                    found.push({
                        surah: sNum,
                        ayah: ayah.ayah,
                        text: ayah.text,
                        surahName: SURAH_NAMES[sNum-1] || `سورة ${sNum}`
                    });
                }
            }
        }
    }
    
    // إزالة المكررات
    const unique = [];
    const seen = new Set();
    for (const item of found) {
        const key = `${item.surah}-${item.ayah}`;
        if (!seen.has(key)) {
            seen.add(key);
            unique.push(item);
        }
    }
    
    if (unique.length === 0) {
        results.innerHTML = `<div class="no-results"><span>📭</span> لا توجد نتائج</div>`;
        return;
    }
    
    // عرض النتائج
    let html = `<div class="section-title">نتائج البحث (${unique.length})</div>`;
    unique.slice(0, 100).forEach(item => {
        const preview = item.text.length > 80 ? item.text.substring(0, 80) + '…' : item.text;
        html += `
            <div class="ayah-line" style="cursor:pointer;border-bottom:1px solid #111a22;" 
                 onclick="openSurah(${item.surah}, ${item.ayah})">
                <span class="ayah-num">${item.surah}:${item.ayah}</span>
                <span style="color:#888;font-size:0.8em;">${item.surahName}</span>
                <br>
                <span style="font-size:0.95em;">${preview}</span>
            </div>
        `;
    });
    if (unique.length > 100) {
        html += `<div style="text-align:center;color:#555;padding:15px;">... عرض ${100} من ${unique.length} نتيجة</div>`;
    }
    results.innerHTML = html;
    switchTab('search');
}

function clearSearch() {
    document.getElementById('searchText').value = '';
    document.getElementById('searchAyah').value = '';
    document.getElementById('searchJuz').value = '';
    document.getElementById('searchResults').innerHTML = '';
}

// ============================================================
// FONT SIZE
// ============================================================

function changeFontSize(delta) {
    fontSize = Math.min(180, Math.max(60, fontSize + delta));
    applyFontSize();
    localStorage.setItem('quran-font-size', fontSize);
}

function resetFontSize() {
    fontSize = 100;
    applyFontSize();
    localStorage.setItem('quran-font-size', fontSize);
}

function applyFontSize() {
    document.getElementById('fontSizeDisplay').textContent = fontSize + '%';
    document.querySelectorAll('.ayah-line').forEach(el => {
        el.style.fontSize = (fontSize / 100) + 'em';
    });
    document.querySelectorAll('.bismillah').forEach(el => {
        el.style.fontSize = (fontSize / 100 * 1.8) + 'em';
    });
    document.querySelectorAll('.surah-title').forEach(el => {
        el.style.fontSize = (fontSize / 100 * 1.8) + 'em';
    });
}

function loadFontSize() {
    const saved = localStorage.getItem('quran-font-size');
    if (saved) {
        fontSize = parseInt(saved);
        applyFontSize();
    }
}

// ============================================================
// LAST READ (localStorage)
// ============================================================

function saveLastRead(surah, ayah) {
    lastRead = { surah, ayah };
    localStorage.setItem('quran-last-read', JSON.stringify(lastRead));
    showSaveIndicator();
    document.getElementById('lastReadBtn').style.display = 'inline-block';
}

function loadLastRead() {
    const saved = localStorage.getItem('quran-last-read');
    if (saved) {
        try {
            lastRead = JSON.parse(saved);
            document.getElementById('lastReadBtn').style.display = 'inline-block';
        } catch(e) {
            document.getElementById('lastReadBtn').style.display = 'none';
        }
    } else {
        document.getElementById('lastReadBtn').style.display = 'none';
    }
}

function goToLastRead() {
    if (lastRead && QURAN_DATA[lastRead.surah]) {
        openSurah(lastRead.surah, lastRead.ayah);
    } else {
        alert('📭 لم يتم العثور على آخر مكان قراءة');
    }
}

function showSaveIndicator() {
    const el = document.getElementById('saveIndicator');
    el.classList.add('show');
    clearTimeout(el._timeout);
    el._timeout = setTimeout(() => {
        el.classList.remove('show');
    }, 1500);
}

// ============================================================
// TABS
// ============================================================

function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    const contentMap = {
        'surah': 'tabContentSurah',
        'juz': 'tabContentJuz',
        'search': 'tabContentSearch'
    };
    
    const contentEl = document.getElementById(contentMap[tab]);
    if (contentEl) contentEl.classList.add('active');
    
    const btnMap = {
        'surah': 'tabSurah',
        'juz': 'tabJuz',
        'search': 'tabSearch'
    };
    const btnEl = document.getElementById(btnMap[tab]);
    if (btnEl) btnEl.classList.add('active');
}

// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (document.getElementById('ayahScreen').classList.contains('active')) {
            closeAyahScreen();
        }
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        switchTab('search');
        document.getElementById('searchText').focus();
    }
});

// ============================================================
// SERVICE WORKER REGISTRATION (PWA)
// ============================================================

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log('✅ Service Worker registered'))
        .catch(() => console.log('⚠️ Service Worker registration failed'));
}

// ============================================================
// INIT
// ============================================================

document.addEventListener('DOMContentLoaded', loadQuran);

console.log('📖 المصحف الكريم جاهز!');
console.log('💡 الميزات:');
console.log('  - بحث برقم الآية');
console.log('  - بحث برقم الجزء');
console.log('  - بحث بنص');
console.log('  - تكبير/تصغير النص');
console.log('  - حفظ آخر مكان قراءة');
console.log('  - وضع ليلي دائم');
console.log('  - PWA (تثبيت على الجوال)');
console.log('⌨️ اختصارات: ESC للإغلاق, Ctrl+F للبحث');
