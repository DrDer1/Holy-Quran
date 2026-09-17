// ===== أسماء السور المشكّلة =====
const surahNames = [
    { number: 1, name: "الْفَاتِحَةِ" },
    { number: 2, name: "الْبَقَرَةِ" },
    { number: 3, name: "آلِ عِمْرَانَ" },
    { number: 4, name: "النِّسَاءِ" },
    { number: 5, name: "الْمَائِدَةِ" },
    { number: 6, name: "الْأَنْعَامِ" },
    { number: 7, name: "الْأَعْرَافِ" },
    { number: 8, name: "الْأَنْفَالِ" },
    { number: 9, name: "التَّوْبَةِ" },
    { number: 10, name: "يُونُسَ" },
    { number: 11, name: "هُودٍ" },
    { number: 12, name: "يُوسُفَ" },
    { number: 13, name: "الرَّعْدِ" },
    { number: 14, name: "إِبْرَاهِيمَ" },
    { number: 15, name: "الْحِجْرِ" },
    { number: 16, name: "النَّحْلِ" },
    { number: 17, name: "الْإِسْرَاءِ" },
    { number: 18, name: "الْكَهْفِ" },
    { number: 19, name: "مَرْيَمَ" },
    { number: 20, name: "طه" },
    { number: 21, name: "الْأَنْبِيَاءِ" },
    { number: 22, name: "الْحَجِّ" },
    { number: 23, name: "الْمُؤْمِنُونَ" },
    { number: 24, name: "النُّورِ" },
    { number: 25, name: "الْفُرْقَانِ" },
    { number: 26, name: "الشُّعَرَاءِ" },
    { number: 27, name: "النَّمْلِ" },
    { number: 28, name: "الْقَصَصِ" },
    { number: 29, name: "الْعَنْكَبُوتِ" },
    { number: 30, name: "الرُّومِ" },
    { number: 31, name: "لُقْمَانَ" },
    { number: 32, name: "السَّجْدَةِ" },
    { number: 33, name: "الْأَحْزَابِ" },
    { number: 34, name: "سَبَإٍ" },
    { number: 35, name: "فَاطِرٍ" },
    { number: 36, name: "يس" },
    { number: 37, name: "الصَّافَّاتِ" },
    { number: 38, name: "ص" },
    { number: 39, name: "الزُّمَرِ" },
    { number: 40, name: "غَافِرٍ" },
    { number: 41, name: "فُصِّلَتْ" },
    { number: 42, name: "الشُّورَى" },
    { number: 43, name: "الزُّخْرُفِ" },
    { number: 44, name: "الدُّخَانِ" },
    { number: 45, name: "الْجَاثِيَةِ" },
    { number: 46, name: "الْأَحْقَافِ" },
    { number: 47, name: "مُحَمَّدٍ" },
    { number: 48, name: "الْفَتْحِ" },
    { number: 49, name: "الْحُجُرَاتِ" },
    { number: 50, name: "ق" },
    { number: 51, name: "الذَّارِيَاتِ" },
    { number: 52, name: "الطُّورِ" },
    { number: 53, name: "النَّجْمِ" },
    { number: 54, name: "الْقَمَرِ" },
    { number: 55, name: "الرَّحْمَٰنِ" },
    { number: 56, name: "الْوَاقِعَةِ" },
    { number: 57, name: "الْحَدِيدِ" },
    { number: 58, name: "الْمُجَادَلَةِ" },
    { number: 59, name: "الْحَشْرِ" },
    { number: 60, name: "الْمُمْتَحَنَةِ" },
    { number: 61, name: "الصَّفِّ" },
    { number: 62, name: "الْجُمُعَةِ" },
    { number: 63, name: "الْمُنَافِقُونَ" },
    { number: 64, name: "التَّغَابُنِ" },
    { number: 65, name: "الطَّلَاقِ" },
    { number: 66, name: "التَّحْرِيمِ" },
    { number: 67, name: "الْمُلْكِ" },
    { number: 68, name: "الْقَلَمِ" },
    { number: 69, name: "الْحَاقَّةِ" },
    { number: 70, name: "الْمَعَارِجِ" },
    { number: 71, name: "نُوحٍ" },
    { number: 72, name: "الْجِنِّ" },
    { number: 73, name: "الْمُزَّمِّلِ" },
    { number: 74, name: "الْمُدَّثِّرِ" },
    { number: 75, name: "الْقِيَامَةِ" },
    { number: 76, name: "الْإِنْسَانِ" },
    { number: 77, name: "الْمُرْسَلَاتِ" },
    { number: 78, name: "النَّبَإِ" },
    { number: 79, name: "النَّازِعَاتِ" },
    { number: 80, name: "عَبَسَ" },
    { number: 81, name: "التَّكْوِيرِ" },
    { number: 82, name: "الانْفِطَارِ" },
    { number: 83, name: "الْمُطَفِّفِينَ" },
    { number: 84, name: "الانْشِقَاقِ" },
    { number: 85, name: "الْبُرُوجِ" },
    { number: 86, name: "الطَّارِقِ" },
    { number: 87, name: "الْأَعْلَى" },
    { number: 88, name: "الْغَاشِيَةِ" },
    { number: 89, name: "الْفَجْرِ" },
    { number: 90, name: "الْبَلَدِ" },
    { number: 91, name: "الشَّمْسِ" },
    { number: 92, name: "اللَّيْلِ" },
    { number: 93, name: "الضُّحَى" },
    { number: 94, name: "الشَّرْحِ" },
    { number: 95, name: "التِّينِ" },
    { number: 96, name: "الْعَلَقِ" },
    { number: 97, name: "الْقَدْرِ" },
    { number: 98, name: "الْبَيِّنَةِ" },
    { number: 99, name: "الزَّلْزَلَةِ" },
    { number: 100, name: "الْعَادِيَاتِ" },
    { number: 101, name: "الْقَارِعَةِ" },
    { number: 102, name: "التَّكَاثُرِ" },
    { number: 103, name: "الْعَصْرِ" },
    { number: 104, name: "الْهُمَزَةِ" },
    { number: 105, name: "الْفِيلِ" },
    { number: 106, name: "قُرَيْشٍ" },
    { number: 107, name: "الْمَاعُونِ" },
    { number: 108, name: "الْكَوْثَرِ" },
    { number: 109, name: "الْكَافِرُونَ" },
    { number: 110, name: "النَّصْرِ" },
    { number: 111, name: "الْمَسَدِ" },
    { number: 112, name: "الْإِخْلَاصِ" },
    { number: 113, name: "الْفَلَقِ" },
    { number: 114, name: "النَّاسِ" }
];

// ===== حدود الأجزاء =====
const juzBoundaries = [
    { juz: 1, surah: 1, ayah: 1 },
    { juz: 2, surah: 2, ayah: 142 },
    { juz: 3, surah: 2, ayah: 253 },
    { juz: 4, surah: 3, ayah: 93 },
    { juz: 5, surah: 4, ayah: 24 },
    { juz: 6, surah: 4, ayah: 148 },
    { juz: 7, surah: 5, ayah: 82 },
    { juz: 8, surah: 6, ayah: 111 },
    { juz: 9, surah: 7, ayah: 88 },
    { juz: 10, surah: 8, ayah: 41 },
    { juz: 11, surah: 9, ayah: 93 },
    { juz: 12, surah: 11, ayah: 6 },
    { juz: 13, surah: 12, ayah: 53 },
    { juz: 14, surah: 15, ayah: 1 },
    { juz: 15, surah: 17, ayah: 1 },
    { juz: 16, surah: 18, ayah: 75 },
    { juz: 17, surah: 21, ayah: 1 },
    { juz: 18, surah: 23, ayah: 1 },
    { juz: 19, surah: 25, ayah: 21 },
    { juz: 20, surah: 27, ayah: 56 },
    { juz: 21, surah: 29, ayah: 46 },
    { juz: 22, surah: 33, ayah: 31 },
    { juz: 23, surah: 36, ayah: 28 },
    { juz: 24, surah: 39, ayah: 32 },
    { juz: 25, surah: 41, ayah: 47 },
    { juz: 26, surah: 46, ayah: 1 },
    { juz: 27, surah: 51, ayah: 31 },
    { juz: 28, surah: 58, ayah: 1 },
    { juz: 29, surah: 67, ayah: 1 },
    { juz: 30, surah: 78, ayah: 1 }
];

// ===== فهرس صفحات المصحف (604 صفحة) =====
// هذا الفهرس يعتمد على تقسيم مصحف المدينة النبوية
// كل صفحة تحتوي على قائمة من المقاطع (items)
// كل مقطع: { surah, from, to }
// إذا كانت الصفحة تحتوي على عدة سور، تُضاف مقاطع متعددة
const mushafPageIndex = [
    // ===== الجزء 1 =====
    // صفحة 1: الفاتحة كاملة
    { page: 1, items: [{ surah: 1, from: 1, to: 7 }] },
    // صفحة 2: البقرة 1-5
    { page: 2, items: [{ surah: 2, from: 1, to: 5 }] },
    // صفحة 3: البقرة 6-16
    { page: 3, items: [{ surah: 2, from: 6, to: 16 }] },
    // صفحة 4: البقرة 17-24
    { page: 4, items: [{ surah: 2, from: 17, to: 24 }] },
    // صفحة 5: البقرة 25-29
    { page: 5, items: [{ surah: 2, from: 25, to: 29 }] },
    // صفحة 6: البقرة 30-37
    { page: 6, items: [{ surah: 2, from: 30, to: 37 }] },
    // صفحة 7: البقرة 38-48
    { page: 7, items: [{ surah: 2, from: 38, to: 48 }] },
    // صفحة 8: البقرة 49-57
    { page: 8, items: [{ surah: 2, from: 49, to: 57 }] },
    // صفحة 9: البقرة 58-61
    { page: 9, items: [{ surah: 2, from: 58, to: 61 }] },
    // صفحة 10: البقرة 62-69
    { page: 10, items: [{ surah: 2, from: 62, to: 69 }] },
    // صفحة 11: البقرة 70-76
    { page: 11, items: [{ surah: 2, from: 70, to: 76 }] },
    // صفحة 12: البقرة 77-83
    { page: 12, items: [{ surah: 2, from: 77, to: 83 }] },
    // صفحة 13: البقرة 84-88
    { page: 13, items: [{ surah: 2, from: 84, to: 88 }] },
    // صفحة 14: البقرة 89-92
    { page: 14, items: [{ surah: 2, from: 89, to: 92 }] },
    // صفحة 15: البقرة 93-96
    { page: 15, items: [{ surah: 2, from: 93, to: 96 }] },
    // صفحة 16: البقرة 97-102
    { page: 16, items: [{ surah: 2, from: 97, to: 102 }] },
    // صفحة 17: البقرة 103-111
    { page: 17, items: [{ surah: 2, from: 103, to: 111 }] },
    // صفحة 18: البقرة 112-118
    { page: 18, items: [{ surah: 2, from: 112, to: 118 }] },
    // صفحة 19: البقرة 119-126
    { page: 19, items: [{ surah: 2, from: 119, to: 126 }] },
    // صفحة 20: البقرة 127-134
    { page: 20, items: [{ surah: 2, from: 127, to: 134 }] },
    // صفحة 21: البقرة 135-141
    { page: 21, items: [{ surah: 2, from: 135, to: 141 }] },
    // صفحة 22: البقرة 142-145
    { page: 22, items: [{ surah: 2, from: 142, to: 145 }] },
    // صفحة 23: البقرة 146-153
    { page: 23, items: [{ surah: 2, from: 146, to: 153 }] },
    // صفحة 24: البقرة 154-162
    { page: 24, items: [{ surah: 2, from: 154, to: 162 }] },
    // صفحة 25: البقرة 163-170
    { page: 25, items: [{ surah: 2, from: 163, to: 170 }] },
    // صفحة 26: البقرة 171-176
    { page: 26, items: [{ surah: 2, from: 171, to: 176 }] },
    // صفحة 27: البقرة 177-181
    { page: 27, items: [{ surah: 2, from: 177, to: 181 }] },
    // صفحة 28: البقرة 182-186
    { page: 28, items: [{ surah: 2, from: 182, to: 186 }] },
    // صفحة 29: البقرة 187-190
    { page: 29, items: [{ surah: 2, from: 187, to: 190 }] },
    // صفحة 30: البقرة 191-196
    { page: 30, items: [{ surah: 2, from: 191, to: 196 }] },
    // صفحة 31: البقرة 197-202
    { page: 31, items: [{ surah: 2, from: 197, to: 202 }] },
    // صفحة 32: البقرة 203-209
    { page: 32, items: [{ surah: 2, from: 203, to: 209 }] },
    // صفحة 33: البقرة 210-215
    { page: 33, items: [{ surah: 2, from: 210, to: 215 }] },
    // صفحة 34: البقرة 216-219
    { page: 34, items: [{ surah: 2, from: 216, to: 219 }] },
    // صفحة 35: البقرة 220-224
    { page: 35, items: [{ surah: 2, from: 220, to: 224 }] },
    // صفحة 36: البقرة 225-230
    { page: 36, items: [{ surah: 2, from: 225, to: 230 }] },
    // صفحة 37: البقرة 231-234
    { page: 37, items: [{ surah: 2, from: 231, to: 234 }] },
    // صفحة 38: البقرة 235-237
    { page: 38, items: [{ surah: 2, from: 235, to: 237 }] },
    // صفحة 39: البقرة 238-245
    { page: 39, items: [{ surah: 2, from: 238, to: 245 }] },
    // صفحة 40: البقرة 246-248
    { page: 40, items: [{ surah: 2, from: 246, to: 248 }] },
    // صفحة 41: البقرة 249-252
    { page: 41, items: [{ surah: 2, from: 249, to: 252 }] },
    // صفحة 42: البقرة 253-256
    { page: 42, items: [{ surah: 2, from: 253, to: 256 }] },
    // صفحة 43: البقرة 257-259
    { page: 43, items: [{ surah: 2, from: 257, to: 259 }] },
    // صفحة 44: البقرة 260-264
    { page: 44, items: [{ surah: 2, from: 260, to: 264 }] },
    // صفحة 45: البقرة 265-269
    { page: 45, items: [{ surah: 2, from: 265, to: 269 }] },
    // صفحة 46: البقرة 270-274
    { page: 46, items: [{ surah: 2, from: 270, to: 274 }] },
    // صفحة 47: البقرة 275-281
    { page: 47, items: [{ surah: 2, from: 275, to: 281 }] },
    // صفحة 48: البقرة 282
    { page: 48, items: [{ surah: 2, from: 282, to: 282 }] },
    // صفحة 49: البقرة 283-286
    { page: 49, items: [{ surah: 2, from: 283, to: 286 }] },
    // صفحة 50: آل عمران 1-9
    { page: 50, items: [{ surah: 3, from: 1, to: 9 }] },
    // صفحة 51: آل عمران 10-15
    { page: 51, items: [{ surah: 3, from: 10, to: 15 }] },
    // صفحة 52: آل عمران 16-22
    { page: 52, items: [{ surah: 3, from: 16, to: 22 }] },
    // صفحة 53: آل عمران 23-29
    { page: 53, items: [{ surah: 3, from: 23, to: 29 }] },
    // صفحة 54: آل عمران 30-37
    { page: 54, items: [{ surah: 3, from: 30, to: 37 }] },
    // صفحة 55: آل عمران 38-45
    { page: 55, items: [{ surah: 3, from: 38, to: 45 }] },
    // صفحة 56: آل عمران 46-52
    { page: 56, items: [{ surah: 3, from: 46, to: 52 }] },
    // صفحة 57: آل عمران 53-61
    { page: 57, items: [{ surah: 3, from: 53, to: 61 }] },
    // صفحة 58: آل عمران 62-70
    { page: 58, items: [{ surah: 3, from: 62, to: 70 }] },
    // صفحة 59: آل عمران 71-77
    { page: 59, items: [{ surah: 3, from: 71, to: 77 }] },
    // صفحة 60: آل عمران 78-83
    { page: 60, items: [{ surah: 3, from: 78, to: 83 }] },
    // صفحة 61: آل عمران 84-91
    { page: 61, items: [{ surah: 3, from: 84, to: 91 }] },
    // صفحة 62: آل عمران 92-100
    { page: 62, items: [{ surah: 3, from: 92, to: 100 }] },
    // صفحة 63: آل عمران 101-108
    { page: 63, items: [{ surah: 3, from: 101, to: 108 }] },
    // صفحة 64: آل عمران 109-115
    { page: 64, items: [{ surah: 3, from: 109, to: 115 }] },
    // صفحة 65: آل عمران 116-121
    { page: 65, items: [{ surah: 3, from: 116, to: 121 }] },
    // صفحة 66: آل عمران 122-132
    { page: 66, items: [{ surah: 3, from: 122, to: 132 }] },
    // صفحة 67: آل عمران 133-140
    { page: 67, items: [{ surah: 3, from: 133, to: 140 }] },
    // صفحة 68: آل عمران 141-148
    { page: 68, items: [{ surah: 3, from: 141, to: 148 }] },
    // صفحة 69: آل عمران 149-153
    { page: 69, items: [{ surah: 3, from: 149, to: 153 }] },
    // صفحة 70: آل عمران 154-157
    { page: 70, items: [{ surah: 3, from: 154, to: 157 }] },
    // صفحة 71: آل عمران 158-165
    { page: 71, items: [{ surah: 3, from: 158, to: 165 }] },
    // صفحة 72: آل عمران 166-173
    { page: 72, items: [{ surah: 3, from: 166, to: 173 }] },
    // صفحة 73: آل عمران 174-180
    { page: 73, items: [{ surah: 3, from: 174, to: 180 }] },
    // صفحة 74: آل عمران 181-186
    { page: 74, items: [{ surah: 3, from: 181, to: 186 }] },
    // صفحة 75: آل عمران 187-194
    { page: 75, items: [{ surah: 3, from: 187, to: 194 }] },
    // صفحة 76: آل عمران 195-200
    { page: 76, items: [{ surah: 3, from: 195, to: 200 }] },
    // صفحة 77: النساء 1-6
    { page: 77, items: [{ surah: 4, from: 1, to: 6 }] },
    // صفحة 78: النساء 7-11
    { page: 78, items: [{ surah: 4, from: 7, to: 11 }] },
    // صفحة 79: النساء 12-14
    { page: 79, items: [{ surah: 4, from: 12, to: 14 }] },
    // صفحة 80: النساء 15-19
    { page: 80, items: [{ surah: 4, from: 15, to: 19 }] },
    // صفحة 81: النساء 20-23
    { page: 81, items: [{ surah: 4, from: 20, to: 23 }] },
    // صفحة 82: النساء 24-26
    { page: 82, items: [{ surah: 4, from: 24, to: 26 }] },
    // صفحة 83: النساء 27-33
    { page: 83, items: [{ surah: 4, from: 27, to: 33 }] },
    // صفحة 84: النساء 34-37
    { page: 84, items: [{ surah: 4, from: 34, to: 37 }] },
    // صفحة 85: النساء 38-44
    { page: 85, items: [{ surah: 4, from: 38, to: 44 }] },
    // صفحة 86: النساء 45-51
    { page: 86, items: [{ surah: 4, from: 45, to: 51 }] },
    // صفحة 87: النساء 52-59
    { page: 87, items: [{ surah: 4, from: 52, to: 59 }] },
    // صفحة 88: النساء 60-65
    { page: 88, items: [{ surah: 4, from: 60, to: 65 }] },
    // صفحة 89: النساء 66-74
    { page: 89, items: [{ surah: 4, from: 66, to: 74 }] },
    // صفحة 90: النساء 75-79
    { page: 90, items: [{ surah: 4, from: 75, to: 79 }] },
    // صفحة 91: النساء 80-86
    { page: 91, items: [{ surah: 4, from: 80, to: 86 }] },
    // صفحة 92: النساء 87-91
    { page: 92, items: [{ surah: 4, from: 87, to: 91 }] },
    // صفحة 93: النساء 92-94
    { page: 93, items: [{ surah: 4, from: 92, to: 94 }] },
    // صفحة 94: النساء 95-99
    { page: 94, items: [{ surah: 4, from: 95, to: 99 }] },
    // صفحة 95: النساء 100-104
    { page: 95, items: [{ surah: 4, from: 100, to: 104 }] },
    // صفحة 96: النساء 105-112
    { page: 96, items: [{ surah: 4, from: 105, to: 112 }] },
    // صفحة 97: النساء 113-119
    { page: 97, items: [{ surah: 4, from: 113, to: 119 }] },
    // صفحة 98: النساء 120-127
    { page: 98, items: [{ surah: 4, from: 120, to: 127 }] },
    // صفحة 99: النساء 128-133
    { page: 99, items: [{ surah: 4, from: 128, to: 133 }] },
    // صفحة 100: النساء 134-140
    { page: 100, items: [{ surah: 4, from: 134, to: 140 }] },
    // صفحة 101: النساء 141-147
    { page: 101, items: [{ surah: 4, from: 141, to: 147 }] },
    // صفحة 102: النساء 148-154
    { page: 102, items: [{ surah: 4, from: 148, to: 154 }] },
    // صفحة 103: النساء 155-162
    { page: 103, items: [{ surah: 4, from: 155, to: 162 }] },
    // صفحة 104: النساء 163-170
    { page: 104, items: [{ surah: 4, from: 163, to: 170 }] },
    // صفحة 105: النساء 171-175
    { page: 105, items: [{ surah: 4, from: 171, to: 175 }] },
    // صفحة 106: النساء 176 + المائدة 1-2
    { page: 106, items: [{ surah: 4, from: 176, to: 176 }, { surah: 5, from: 1, to: 2 }] },
    // صفحة 107: المائدة 3-5
    { page: 107, items: [{ surah: 5, from: 3, to: 5 }] },
    // صفحة 108: المائدة 6-9
    { page: 108, items: [{ surah: 5, from: 6, to: 9 }] },
    // صفحة 109: المائدة 10-13
    { page: 109, items: [{ surah: 5, from: 10, to: 13 }] },
    // صفحة 110: المائدة 14-17
    { page: 110, items: [{ surah: 5, from: 14, to: 17 }] },
    // صفحة 111: المائدة 18-23
    { page: 111, items: [{ surah: 5, from: 18, to: 23 }] },
    // صفحة 112: المائدة 24-31
    { page: 112, items: [{ surah: 5, from: 24, to: 31 }] },
    // صفحة 113: المائدة 32-36
    { page: 113, items: [{ surah: 5, from: 32, to: 36 }] },
    // صفحة 114: المائدة 37-41
    { page: 114, items: [{ surah: 5, from: 37, to: 41 }] },
    // صفحة 115: المائدة 42-45
    { page: 115, items: [{ surah: 5, from: 42, to: 45 }] },
    // صفحة 116: المائدة 46-50
    { page: 116, items: [{ surah: 5, from: 46, to: 50 }] },
    // صفحة 117: المائدة 51-56
    { page: 117, items: [{ surah: 5, from: 51, to: 56 }] },
    // صفحة 118: المائدة 57-63
    { page: 118, items: [{ surah: 5, from: 57, to: 63 }] },
    // صفحة 119: المائدة 64-70
    { page: 119, items: [{ surah: 5, from: 64, to: 70 }] },
    // صفحة 120: المائدة 71-76
    { page: 120, items: [{ surah: 5, from: 71, to: 76 }] },
    // صفحة 121: المائدة 77-82
    { page: 121, items: [{ surah: 5, from: 77, to: 82 }] },
    // صفحة 122: المائدة 83-89
    { page: 122, items: [{ surah: 5, from: 83, to: 89 }] },
    // صفحة 123: المائدة 90-95
    { page: 123, items: [{ surah: 5, from: 90, to: 95 }] },
    // صفحة 124: المائدة 96-103
    { page: 124, items: [{ surah: 5, from: 96, to: 103 }] },
    // صفحة 125: المائدة 104-109
    { page: 125, items: [{ surah: 5, from: 104, to: 109 }] },
    // صفحة 126: المائدة 110-113
    { page: 126, items: [{ surah: 5, from: 110, to: 113 }] },
    // صفحة 127: المائدة 114-120
    { page: 127, items: [{ surah: 5, from: 114, to: 120 }] },
    // صفحة 128: الأنعام 1-8
    { page: 128, items: [{ surah: 6, from: 1, to: 8 }] },
    // صفحة 129: الأنعام 9-18
    { page: 129, items: [{ surah: 6, from: 9, to: 18 }] },
    // صفحة 130: الأنعام 19-26
    { page: 130, items: [{ surah: 6, from: 19, to: 26 }] },
    // صفحة 131: الأنعام 27-35
    { page: 131, items: [{ surah: 6, from: 27, to: 35 }] },
    // صفحة 132: الأنعام 36-44
    { page: 132, items: [{ surah: 6, from: 36, to: 44 }] },
    // صفحة 133: الأنعام 45-52
    { page: 133, items: [{ surah: 6, from: 45, to: 52 }] },
    // صفحة 134: الأنعام 53-59
    { page: 134, items: [{ surah: 6, from: 53, to: 59 }] },
    // صفحة 135: الأنعام 60-68
    { page: 135, items: [{ surah: 6, from: 60, to: 68 }] },
    // صفحة 136: الأنعام 69-73
    { page: 136, items: [{ surah: 6, from: 69, to: 73 }] },
    // صفحة 137: الأنعام 74-81
    { page: 137, items: [{ surah: 6, from: 74, to: 81 }] },
    // صفحة 138: الأنعام 82-90
    { page: 138, items: [{ surah: 6, from: 82, to: 90 }] },
    // صفحة 139: الأنعام 91-94
    { page: 139, items: [{ surah: 6, from: 91, to: 94 }] },
    // صفحة 140: الأنعام 95-101
    { page: 140, items: [{ surah: 6, from: 95, to: 101 }] },
    // صفحة 141: الأنعام 102-110
    { page: 141, items: [{ surah: 6, from: 102, to: 110 }] },
    // صفحة 142: الأنعام 111-118
    { page: 142, items: [{ surah: 6, from: 111, to: 118 }] },
    // صفحة 143: الأنعام 119-124
    { page: 143, items: [{ surah: 6, from: 119, to: 124 }] },
    // صفحة 144: الأنعام 125-131
    { page: 144, items: [{ surah: 6, from: 125, to: 131 }] },
    // صفحة 145: الأنعام 132-139
    { page: 145, items: [{ surah: 6, from: 132, to: 139 }] },
    // صفحة 146: الأنعام 140-145
    { page: 146, items: [{ surah: 6, from: 140, to: 145 }] },
    // صفحة 147: الأنعام 146-150
    { page: 147, items: [{ surah: 6, from: 146, to: 150 }] },
    // صفحة 148: الأنعام 151-157
    { page: 148, items: [{ surah: 6, from: 151, to: 157 }] },
    // صفحة 149: الأنعام 158-165
    { page: 149, items: [{ surah: 6, from: 158, to: 165 }] },
    // صفحة 150: الأعراف 1-11
    { page: 150, items: [{ surah: 7, from: 1, to: 11 }] },
    // صفحة 151: الأعراف 12-22
    { page: 151, items: [{ surah: 7, from: 12, to: 22 }] },
    // صفحة 152: الأعراف 23-30
    { page: 152, items: [{ surah: 7, from: 23, to: 30 }] },
    // صفحة 153: الأعراف 31-37
    { page: 153, items: [{ surah: 7, from: 31, to: 37 }] },
    // صفحة 154: الأعراف 38-43
    { page: 154, items: [{ surah: 7, from: 38, to: 43 }] },
    // صفحة 155: الأعراف 44-51
    { page: 155, items: [{ surah: 7, from: 44, to: 51 }] },
    // صفحة 156: الأعراف 52-57
    { page: 156, items: [{ surah: 7, from: 52, to: 57 }] },
    // صفحة 157: الأعراف 58-67
    { page: 157, items: [{ surah: 7, from: 58, to: 67 }] },
    // صفحة 158: الأعراف 68-73
    { page: 158, items: [{ surah: 7, from: 68, to: 73 }] },
    // صفحة 159: الأعراف 74-81
    { page: 159, items: [{ surah: 7, from: 74, to: 81 }] },
    // صفحة 160: الأعراف 82-87
    { page: 160, items: [{ surah: 7, from: 82, to: 87 }] },
    // صفحة 161: الأعراف 88-95
    { page: 161, items: [{ surah: 7, from: 88, to: 95 }] },
    // صفحة 162: الأعراف 96-104
    { page: 162, items: [{ surah: 7, from: 96, to: 104 }] },
    // صفحة 163: الأعراف 105-113
    { page: 163, items: [{ surah: 7, from: 105, to: 113 }] },
    // صفحة 164: الأعراف 114-121
    { page: 164, items: [{ surah: 7, from: 114, to: 121 }] },
    // صفحة 165: الأعراف 122-130
    { page: 165, items: [{ surah: 7, from: 122, to: 130 }] },
    // صفحة 166: الأعراف 131-137
    { page: 166, items: [{ surah: 7, from: 131, to: 137 }] },
    // صفحة 167: الأعراف 138-143
    { page: 167, items: [{ surah: 7, from: 138, to: 143 }] },
    // صفحة 168: الأعراف 144-149
    { page: 168, items: [{ surah: 7, from: 144, to: 149 }] },
    // صفحة 169: الأعراف 150-155
    { page: 169, items: [{ surah: 7, from: 150, to: 155 }] },
    // صفحة 170: الأعراف 156-159
    { page: 170, items: [{ surah: 7, from: 156, to: 159 }] },
    // صفحة 171: الأعراف 160-163
    { page: 171, items: [{ surah: 7, from: 160, to: 163 }] },
    // صفحة 172: الأعراف 164-170
    { page: 172, items: [{ surah: 7, from: 164, to: 170 }] },
    // صفحة 173: الأعراف 171-178
    { page: 173, items: [{ surah: 7, from: 171, to: 178 }] },
    // صفحة 174: الأعراف 179-187
    { page: 174, items: [{ surah: 7, from: 179, to: 187 }] },
    // صفحة 175: الأعراف 188-195
    { page: 175, items: [{ surah: 7, from: 188, to: 195 }] },
    // صفحة 176: الأعراف 196-203
    { page: 176, items: [{ surah: 7, from: 196, to: 203 }] },
    // صفحة 177: الأعراف 204-206 + الأنفال 1
    { page: 177, items: [{ surah: 7, from: 204, to: 206 }, { surah: 8, from: 1, to: 1 }] },
    // صفحة 178: الأنفال 2-9
    { page: 178, items: [{ surah: 8, from: 2, to: 9 }] },
    // صفحة 179: الأنفال 10-16
    { page: 179, items: [{ surah: 8, from: 10, to: 16 }] },
    // صفحة 180: الأنفال 17-25
    { page: 180, items: [{ surah: 8, from: 17, to: 25 }] },
    // صفحة 181: الأنفال 26-33
    { page: 181, items: [{ surah: 8, from: 26, to: 33 }] },
    // صفحة 182: الأنفال 34-40
    { page: 182, items: [{ surah: 8, from: 34, to: 40 }] },
    // صفحة 183: الأنفال 41-45
    { page: 183, items: [{ surah: 8, from: 41, to: 45 }] },
    // صفحة 184: الأنفال 46-52
    { page: 184, items: [{ surah: 8, from: 46, to: 52 }] },
    // صفحة 185: الأنفال 53-61
    { page: 185, items: [{ surah: 8, from: 53, to: 61 }] },
    // صفحة 186: الأنفال 62-69
    { page: 186, items: [{ surah: 8, from: 62, to: 69 }] },
    // صفحة 187: الأنفال 70-75
    { page: 187, items: [{ surah: 8, from: 70, to: 75 }] },
    // صفحة 188: التوبة 1-6
    { page: 188, items: [{ surah: 9, from: 1, to: 6 }] },
    // صفحة 189: التوبة 7-13
    { page: 189, items: [{ surah: 9, from: 7, to: 13 }] },
    // صفحة 190: التوبة 14-20
    { page: 190, items: [{ surah: 9, from: 14, to: 20 }] },
    // صفحة 191: التوبة 21-26
    { page: 191, items: [{ surah: 9, from: 21, to: 26 }] },
    // صفحة 192: التوبة 27-31
    { page: 192, items: [{ surah: 9, from: 27, to: 31 }] },
    // صفحة 193: التوبة 32-36
    { page: 193, items: [{ surah: 9, from: 32, to: 36 }] },
    // صفحة 194: التوبة 37-40
    { page: 194, items: [{ surah: 9, from: 37, to: 40 }] },
    // صفحة 195: التوبة 41-47
    { page: 195, items: [{ surah: 9, from: 41, to: 47 }] },
    // صفحة 196: التوبة 48-54
    { page: 196, items: [{ surah: 9, from: 48, to: 54 }] },
    // صفحة 197: التوبة 55-61
    { page: 197, items: [{ surah: 9, from: 55, to: 61 }] },
    // صفحة 198: التوبة 62-68
    { page: 198, items: [{ surah: 9, from: 62, to: 68 }] },
    // صفحة 199: التوبة 69-72
    { page: 199, items: [{ surah: 9, from: 69, to: 72 }] },
    // صفحة 200: التوبة 73-79
    { page: 200, items: [{ surah: 9, from: 73, to: 79 }] },
    // صفحة 201: التوبة 80-86
    { page: 201, items: [{ surah: 9, from: 80, to: 86 }] },
    // صفحة 202: التوبة 87-93
    { page: 202, items: [{ surah: 9, from: 87, to: 93 }] },
    // صفحة 203: التوبة 94-99
    { page: 203, items: [{ surah: 9, from: 94, to: 99 }] },
    // صفحة 204: التوبة 100-106
    { page: 204, items: [{ surah: 9, from: 100, to: 106 }] },
    // صفحة 205: التوبة 107-111
    { page: 205, items: [{ surah: 9, from: 107, to: 111 }] },
    // صفحة 206: التوبة 112-118
    { page: 206, items: [{ surah: 9, from: 112, to: 118 }] },
    // صفحة 207: التوبة 119-122 + يونس 1
    { page: 207, items: [{ surah: 9, from: 119, to: 122 }, { surah: 9, from: 123, to: 129 }] },
    // صفحة 208: يونس 1-6
    { page: 208, items: [{ surah: 10, from: 1, to: 6 }] },
    // صفحة 209: يونس 7-14
    { page: 209, items: [{ surah: 10, from: 7, to: 14 }] },
    // صفحة 210: يونس 15-20
    { page: 210, items: [{ surah: 10, from: 15, to: 20 }] },
    // صفحة 211: يونس 21-25
    { page: 211, items: [{ surah: 10, from: 21, to: 25 }] },
    // صفحة 212: يونس 26-33
    { page: 212, items: [{ surah: 10, from: 26, to: 33 }] },
    // صفحة 213: يونس 34-42
    { page: 213, items: [{ surah: 10, from: 34, to: 42 }] },
    // صفحة 214: يونس 43-53
    { page: 214, items: [{ surah: 10, from: 43, to: 53 }] },
    // صفحة 215: يونس 54-61
    { page: 215, items: [{ surah: 10, from: 54, to: 61 }] },
    // صفحة 216: يونس 62-70
    { page: 216, items: [{ surah: 10, from: 62, to: 70 }] },
    // صفحة 217: يونس 71-78
    { page: 217, items: [{ surah: 10, from: 71, to: 78 }] },
    // صفحة 218: يونس 79-88
    { page: 218, items: [{ surah: 10, from: 79, to: 88 }] },
    // صفحة 219: يونس 89-97
    { page: 219, items: [{ surah: 10, from: 89, to: 97 }] },
    // صفحة 220: يونس 98-107
    { page: 220, items: [{ surah: 10, from: 98, to: 107 }] },
    // صفحة 221: يونس 108-109 + هود 1-5
    { page: 221, items: [{ surah: 10, from: 108, to: 109 }, { surah: 11, from: 1, to: 5 }] },
    // صفحة 222: هود 6-12
    { page: 222, items: [{ surah: 11, from: 6, to: 12 }] },
    // صفحة 223: هود 13-19
    { page: 223, items: [{ surah: 11, from: 13, to: 19 }] },
    // صفحة 224: هود 20-28
    { page: 224, items: [{ surah: 11, from: 20, to: 28 }] },
    // صفحة 225: هود 29-37
    { page: 225, items: [{ surah: 11, from: 29, to: 37 }] },
    // صفحة 226: هود 38-45
    { page: 226, items: [{ surah: 11, from: 38, to: 45 }] },
    // صفحة 227: هود 46-53
    { page: 227, items: [{ surah: 11, from: 46, to: 53 }] },
    // صفحة 228: هود 54-62
    { page: 228, items: [{ surah: 11, from: 54, to: 62 }] },
    // صفحة 229: هود 63-68
    { page: 229, items: [{ surah: 11, from: 63, to: 68 }] },
    // صفحة 230: هود 69-74
    { page: 230, items: [{ surah: 11, from: 69, to: 74 }] },
    // صفحة 231: هود 75-82
    { page: 231, items: [{ surah: 11, from: 75, to: 82 }] },
    // صفحة 232: هود 83-88
    { page: 232, items: [{ surah: 11, from: 83, to: 88 }] },
    // صفحة 233: هود 89-97
    { page: 233, items: [{ surah: 11, from: 89, to: 97 }] },
    // صفحة 234: هود 98-107
    { page: 234, items: [{ surah: 11, from: 98, to: 107 }] },
    // صفحة 235: هود 108-115
    { page: 235, items: [{ surah: 11, from: 108, to: 115 }] },
    // صفحة 236: هود 116-123
    { page: 236, items: [{ surah: 11, from: 116, to: 123 }] },
    // صفحة 237: يوسف 1-6
    { page: 237, items: [{ surah: 12, from: 1, to: 6 }] },
    // صفحة 238: يوسف 7-14
    { page: 238, items: [{ surah: 12, from: 7, to: 14 }] },
    // صفحة 239: يوسف 15-20
    { page: 239, items: [{ surah: 12, from: 15, to: 20 }] },
    // صفحة 240: يوسف 21-29
    { page: 240, items: [{ surah: 12, from: 21, to: 29 }] },
    // صفحة 241: يوسف 30-34
    { page: 241, items: [{ surah: 12, from: 30, to: 34 }] },
    // صفحة 242: يوسف 35-43
    { page: 242, items: [{ surah: 12, from: 35, to: 43 }] },
    // صفحة 243: يوسف 44-52
    { page: 243, items: [{ surah: 12, from: 44, to: 52 }] },
    // صفحة 244: يوسف 53-63
    { page: 244, items: [{ surah: 12, from: 53, to: 63 }] },
    // صفحة 245: يوسف 64-69
    { page: 245, items: [{ surah: 12, from: 64, to: 69 }] },
    // صفحة 246: يوسف 70-78
    { page: 246, items: [{ surah: 12, from: 70, to: 78 }] },
    // صفحة 247: يوسف 79-86
    { page: 247, items: [{ surah: 12, from: 79, to: 86 }] },
    // صفحة 248: يوسف 87-92
    { page: 248, items: [{ surah: 12, from: 87, to: 92 }] },
    // صفحة 249: يوسف 93-99
    { page: 249, items: [{ surah: 12, from: 93, to: 99 }] },
    // صفحة 250: يوسف 100-106
    { page: 250, items: [{ surah: 12, from: 100, to: 106 }] },
    // صفحة 251: يوسف 107-111 + الرعد 1-4
    { page: 251, items: [{ surah: 12, from: 107, to: 111 }, { surah: 13, from: 1, to: 4 }] },
    // صفحة 252: الرعد 5-12
    { page: 252, items: [{ surah: 13, from: 5, to: 12 }] },
    // صفحة 253: الرعد 13-18
    { page: 253, items: [{ surah: 13, from: 13, to: 18 }] },
    // صفحة 254: الرعد 19-28
    { page: 254, items: [{ surah: 13, from: 19, to: 28 }] },
    // صفحة 255: الرعد 29-34
    { page: 255, items: [{ surah: 13, from: 29, to: 34 }] },
    // صفحة 256: الرعد 35-43
    { page: 256, items: [{ surah: 13, from: 35, to: 43 }] },
    // صفحة 257: إبراهيم 1-8
    { page: 257, items: [{ surah: 14, from: 1, to: 8 }] },
    // صفحة 258: إبراهيم 9-15
    { page: 258, items: [{ surah: 14, from: 9, to: 15 }] },
    // صفحة 259: إبراهيم 16-24
    { page: 259, items: [{ surah: 14, from: 16, to: 24 }] },
    // صفحة 260: إبراهيم 25-33
    { page: 260, items: [{ surah: 14, from: 25, to: 33 }] },
    // صفحة 261: إبراهيم 34-42
    { page: 261, items: [{ surah: 14, from: 34, to: 42 }] },
    // صفحة 262: إبراهيم 43-52 + الحجر 1
    { page: 262, items: [{ surah: 14, from: 43, to: 52 }, { surah: 15, from: 1, to: 1 }] },
    // صفحة 263: الحجر 2-15
    { page: 263, items: [{ surah: 15, from: 2, to: 15 }] },
    // صفحة 264: الحجر 16-31
    { page: 264, items: [{ surah: 15, from: 16, to: 31 }] },
    // صفحة 265: الحجر 32-51
    { page: 265, items: [{ surah: 15, from: 32, to: 51 }] },
    // صفحة 266: الحجر 52-70
    { page: 266, items: [{ surah: 15, from: 52, to: 70 }] },
    // صفحة 267: الحجر 71-90
    { page: 267, items: [{ surah: 15, from: 71, to: 90 }] },
    // صفحة 268: الحجر 91-99 + النحل 1-6
    { page: 268, items: [{ surah: 15, from: 91, to: 99 }, { surah: 16, from: 1, to: 6 }] },
    // صفحة 269: النحل 7-14
    { page: 269, items: [{ surah: 16, from: 7, to: 14 }] },
    // صفحة 270: النحل 15-26
    { page: 270, items: [{ surah: 16, from: 15, to: 26 }] },
    // صفحة 271: النحل 27-34
    { page: 271, items: [{ surah: 16, from: 27, to: 34 }] },
    // صفحة 272: النحل 35-42
    { page: 272, items: [{ surah: 16, from: 35, to: 42 }] },
    // صفحة 273: النحل 43-54
    { page: 273, items: [{ surah: 16, from: 43, to: 54 }] },
    // صفحة 274: النحل 55-64
    { page: 274, items: [{ surah: 16, from: 55, to: 64 }] },
    // صفحة 275: النحل 65-72
    { page: 275, items: [{ surah: 16, from: 65, to: 72 }] },
    // صفحة 276: النحل 73-79
    { page: 276, items: [{ surah: 16, from: 73, to: 79 }] },
    // صفحة 277: النحل 80-87
    { page: 277, items: [{ surah: 16, from: 80, to: 87 }] },
    // صفحة 278: النحل 88-93
    { page: 278, items: [{ surah: 16, from: 88, to: 93 }] },
    // صفحة 279: النحل 94-102
    { page: 279, items: [{ surah: 16, from: 94, to: 102 }] },
    // صفحة 280: النحل 103-110
    { page: 280, items: [{ surah: 16, from: 103, to: 110 }] },
    // صفحة 281: النحل 111-118
    { page: 281, items: [{ surah: 16, from: 111, to: 118 }] },
    // صفحة 282: النحل 119-128
    { page: 282, items: [{ surah: 16, from: 119, to: 128 }] },
    // صفحة 283: الإسراء 1-7
    { page: 283, items: [{ surah: 17, from: 1, to: 7 }] },
    // صفحة 284: الإسراء 8-17
    { page: 284, items: [{ surah: 17, from: 8, to: 17 }] },
    // صفحة 285: الإسراء 18-27
    { page: 285, items: [{ surah: 17, from: 18, to: 27 }] },
    // صفحة 286: الإسراء 28-38
    { page: 286, items: [{ surah: 17, from: 28, to: 38 }] },
    // صفحة 287: الإسراء 39-49
    { page: 287, items: [{ surah: 17, from: 39, to: 49 }] },
    // صفحة 288: الإسراء 50-59
    { page: 288, items: [{ surah: 17, from: 50, to: 59 }] },
    // صفحة 289: الإسراء 60-69
    { page: 289, items: [{ surah: 17, from: 60, to: 69 }] },
    // صفحة 290: الإسراء 70-77
    { page: 290, items: [{ surah: 17, from: 70, to: 77 }] },
    // صفحة 291: الإسراء 78-85
    { page: 291, items: [{ surah: 17, from: 78, to: 85 }] },
    // صفحة 292: الإسراء 86-95
    { page: 292, items: [{ surah: 17, from: 86, to: 95 }] },
    // صفحة 293: الإسراء 96-105
    { page: 293, items: [{ surah: 17, from: 96, to: 105 }] },
    // صفحة 294: الإسراء 106-111 + الكهف 1-4
    { page: 294, items: [{ surah: 17, from: 106, to: 111 }, { surah: 18, from: 1, to: 4 }] },
    // صفحة 295: الكهف 5-15
    { page: 295, items: [{ surah: 18, from: 5, to: 15 }] },
    // صفحة 296: الكهف 16-20
    { page: 296, items: [{ surah: 18, from: 16, to: 20 }] },
    // صفحة 297: الكهف 21-27
    { page: 297, items: [{ surah: 18, from: 21, to: 27 }] },
    // صفحة 298: الكهف 28-34
    { page: 298, items: [{ surah: 18, from: 28, to: 34 }] },
    // صفحة 299: الكهف 35-45
    { page: 299, items: [{ surah: 18, from: 35, to: 45 }] },
    // صفحة 300: الكهف 46-53
    { page: 300, items: [{ surah: 18, from: 46, to: 53 }] },
    // صفحة 301: الكهف 54-61
    { page: 301, items: [{ surah: 18, from: 54, to: 61 }] },
    // صفحة 302: الكهف 62-74
    { page: 302, items: [{ surah: 18, from: 62, to: 74 }] },
    // صفحة 303: الكهف 75-83
    { page: 303, items: [{ surah: 18, from: 75, to: 83 }] },
    // صفحة 304: الكهف 84-97
    { page: 304, items: [{ surah: 18, from: 84, to: 97 }] },
    // صفحة 305: الكهف 98-110
    { page: 305, items: [{ surah: 18, from: 98, to: 110 }] },
    // صفحة 306: مريم 1-11
    { page: 306, items: [{ surah: 19, from: 1, to: 11 }] },
    // صفحة 307: مريم 12-25
    { page: 307, items: [{ surah: 19, from: 12, to: 25 }] },
    // صفحة 308: مريم 26-38
    { page: 308, items: [{ surah: 19, from: 26, to: 38 }] },
    // صفحة 309: مريم 39-51
    { page: 309, items: [{ surah: 19, from: 39, to: 51 }] },
    // صفحة 310: مريم 52-64
    { page: 310, items: [{ surah: 19, from: 52, to: 64 }] },
    // صفحة 311: مريم 65-76
    { page: 311, items: [{ surah: 19, from: 65, to: 76 }] },
    // صفحة 312: مريم 77-95
    { page: 312, items: [{ surah: 19, from: 77, to: 95 }] },
    // صفحة 313: مريم 96-98 + طه 1-12
    { page: 313, items: [{ surah: 19, from: 96, to: 98 }, { surah: 20, from: 1, to: 12 }] },
    // صفحة 314: طه 13-37
    { page: 314, items: [{ surah: 20, from: 13, to: 37 }] },
    // صفحة 315: طه 38-51
    { page: 315, items: [{ surah: 20, from: 38, to: 51 }] },
    // صفحة 316: طه 52-64
    { page: 316, items: [{ surah: 20, from: 52, to: 64 }] },
    // صفحة 317: طه 65-76
    { page: 317, items: [{ surah: 20, from: 65, to: 76 }] },
    // صفحة 318: طه 77-87
    { page: 318, items: [{ surah: 20, from: 77, to: 87 }] },
    // صفحة 319: طه 88-98
    { page: 319, items: [{ surah: 20, from: 88, to: 98 }] },
    // صفحة 320: طه 99-113
    { page: 320, items: [{ surah: 20, from: 99, to: 113 }] },
    // صفحة 321: طه 114-125
    { page: 321, items: [{ surah: 20, from: 114, to: 125 }] },
    // صفحة 322: طه 126-135 + الأنبياء 1-10
    { page: 322, items: [{ surah: 20, from: 126, to: 135 }, { surah: 21, from: 1, to: 10 }] },
    // صفحة 323: الأنبياء 11-24
    { page: 323, items: [{ surah: 21, from: 11, to: 24 }] },
    // صفحة 324: الأنبياء 25-35
    { page: 324, items: [{ surah: 21, from: 25, to: 35 }] },
    // صفحة 325: الأنبياء 36-44
    { page: 325, items: [{ surah: 21, from: 36, to: 44 }] },
    // صفحة 326: الأنبياء 45-57
    { page: 326, items: [{ surah: 21, from: 45, to: 57 }] },
    // صفحة 327: الأنبياء 58-72
    { page: 327, items: [{ surah: 21, from: 58, to: 72 }] },
    // صفحة 328: الأنبياء 73-81
    { page: 328, items: [{ surah: 21, from: 73, to: 81 }] },
    // صفحة 329: الأنبياء 82-90
    { page: 329, items: [{ surah: 21, from: 82, to: 90 }] },
    // صفحة 330: الأنبياء 91-101
    { page: 330, items: [{ surah: 21, from: 91, to: 101 }] },
    // صفحة 331: الأنبياء 102-112
    { page: 331, items: [{ surah: 21, from: 102, to: 112 }] },
    // صفحة 332: الحج 1-5
    { page: 332, items: [{ surah: 22, from: 1, to: 5 }] },
    // صفحة 333: الحج 6-15
    { page: 333, items: [{ surah: 22, from: 6, to: 15 }] },
    // صفحة 334: الحج 16-23
    { page: 334, items: [{ surah: 22, from: 16, to: 23 }] },
    // صفحة 335: الحج 24-30
    { page: 335, items: [{ surah: 22, from: 24, to: 30 }] },
    // صفحة 336: الحج 31-38
    { page: 336, items: [{ surah: 22, from: 31, to: 38 }] },
    // صفحة 337: الحج 39-46
    { page: 337, items: [{ surah: 22, from: 39, to: 46 }] },
    // صفحة 338: الحج 47-55
    { page: 338, items: [{ surah: 22, from: 47, to: 55 }] },
    // صفحة 339: الحج 56-63
    { page: 339, items: [{ surah: 22, from: 56, to: 63 }] },
    // صفحة 340: الحج 64-72
    { page: 340, items: [{ surah: 22, from: 64, to: 72 }] },
    // صفحة 341: الحج 73-78 + المؤمنون 1-17
    { page: 341, items: [{ surah: 22, from: 73, to: 78 }, { surah: 23, from: 1, to: 17 }] },
    // صفحة 342: المؤمنون 18-27
    { page: 342, items: [{ surah: 23, from: 18, to: 27 }] },
    // صفحة 343: المؤمنون 28-42
    { page: 343, items: [{ surah: 23, from: 28, to: 42 }] },
    // صفحة 344: المؤمنون 43-59
    { page: 344, items: [{ surah: 23, from: 43, to: 59 }] },
    // صفحة 345: المؤمنون 60-74
    { page: 345, items: [{ surah: 23, from: 60, to: 74 }] },
    // صفحة 346: المؤمنون 75-89
    { page: 346, items: [{ surah: 23, from: 75, to: 89 }] },
    // صفحة 347: المؤمنون 90-104
    { page: 347, items: [{ surah: 23, from: 90, to: 104 }] },
    // صفحة 348: المؤمنون 105-118
    { page: 348, items: [{ surah: 23, from: 105, to: 118 }] },
    // صفحة 349: النور 1-10
    { page: 349, items: [{ surah: 24, from: 1, to: 10 }] },
    // صفحة 350: النور 11-20
    { page: 350, items: [{ surah: 24, from: 11, to: 20 }] },
    // صفحة 351: النور 21-27
    { page: 351, items: [{ surah: 24, from: 21, to: 27 }] },
    // صفحة 352: النور 28-31
    { page: 352, items: [{ surah: 24, from: 28, to: 31 }] },
    // صفحة 353: النور 32-36
    { page: 353, items: [{ surah: 24, from: 32, to: 36 }] },
    // صفحة 354: النور 37-43
    { page: 354, items: [{ surah: 24, from: 37, to: 43 }] },
    // صفحة 355: النور 44-51
    { page: 355, items: [{ surah: 24, from: 44, to: 51 }] },
    // صفحة 356: النور 52-58
    { page: 356, items: [{ surah: 24, from: 52, to: 58 }] },
    // صفحة 357: النور 59-61
    { page: 357, items: [{ surah: 24, from: 59, to: 61 }] },
    // صفحة 358: النور 62-64 + الفرقان 1-2
    { page: 358, items: [{ surah: 24, from: 62, to: 64 }, { surah: 25, from: 1, to: 2 }] },
    // صفحة 359: الفرقان 3-11
    { page: 359, items: [{ surah: 25, from: 3, to: 11 }] },
    // صفحة 360: الفرقان 12-20
    { page: 360, items: [{ surah: 25, from: 12, to: 20 }] },
    // صفحة 361: الفرقان 21-32
    { page: 361, items: [{ surah: 25, from: 21, to: 32 }] },
    // صفحة 362: الفرقان 33-43
    { page: 362, items: [{ surah: 25, from: 33, to: 43 }] },
    // صفحة 363: الفرقان 44-55
    { page: 363, items: [{ surah: 25, from: 44, to: 55 }] },
    // صفحة 364: الفرقان 56-67
    { page: 364, items: [{ surah: 25, from: 56, to: 67 }] },
    // صفحة 365: الفرقان 68-77
    { page: 365, items: [{ surah: 25, from: 68, to: 77 }] },
    // صفحة 366: الشعراء 1-19
    { page: 366, items: [{ surah: 26, from: 1, to: 19 }] },
    // صفحة 367: الشعراء 20-39
    { page: 367, items: [{ surah: 26, from: 20, to: 39 }] },
    // صفحة 368: الشعراء 40-60
    { page: 368, items: [{ surah: 26, from: 40, to: 60 }] },
    // صفحة 369: الشعراء 61-83
    { page: 369, items: [{ surah: 26, from: 61, to: 83 }] },
    // صفحة 370: الشعراء 84-111
    { page: 370, items: [{ surah: 26, from: 84, to: 111 }] },
    // صفحة 371: الشعراء 112-136
    { page: 371, items: [{ surah: 26, from: 112, to: 136 }] },
    // صفحة 372: الشعراء 137-159
    { page: 372, items: [{ surah: 26, from: 137, to: 159 }] },
    // صفحة 373: الشعراء 160-183
    { page: 373, items: [{ surah: 26, from: 160, to: 183 }] },
    // صفحة 374: الشعراء 184-206
    { page: 374, items: [{ surah: 26, from: 184, to: 206 }] },
    // صفحة 375: الشعراء 207-227 + النمل 1-13
    { page: 375, items: [{ surah: 26, from: 207, to: 227 }, { surah: 27, from: 1, to: 13 }] },
    // صفحة 376: النمل 14-22
    { page: 376, items: [{ surah: 27, from: 14, to: 22 }] },
    // صفحة 377: النمل 23-35
    { page: 377, items: [{ surah: 27, from: 23, to: 35 }] },
    // صفحة 378: النمل 36-44
    { page: 378, items: [{ surah: 27, from: 36, to: 44 }] },
    // صفحة 379: النمل 45-55
    { page: 379, items: [{ surah: 27, from: 45, to: 55 }] },
    // صفحة 380: النمل 56-63
    { page: 380, items: [{ surah: 27, from: 56, to: 63 }] },
    // صفحة 381: النمل 64-76
    { page: 381, items: [{ surah: 27, from: 64, to: 76 }] },
    // صفحة 382: النمل 77-89
    { page: 382, items: [{ surah: 27, from: 77, to: 89 }] },
    // صفحة 383: النمل 90-93 + القصص 1-11
    { page: 383, items: [{ surah: 27, from: 90, to: 93 }, { surah: 28, from: 1, to: 11 }] },
    // صفحة 384: القصص 12-21
    { page: 384, items: [{ surah: 28, from: 12, to: 21 }] },
    // صفحة 385: القصص 22-28
    { page: 385, items: [{ surah: 28, from: 22, to: 28 }] },
    // صفحة 386: القصص 29-35
    { page: 386, items: [{ surah: 28, from: 29, to: 35 }] },
    // صفحة 387: القصص 36-43
    { page: 387, items: [{ surah: 28, from: 36, to: 43 }] },
    // صفحة 388: القصص 44-50
    { page: 388, items: [{ surah: 28, from: 44, to: 50 }] },
    // صفحة 389: القصص 51-59
    { page: 389, items: [{ surah: 28, from: 51, to: 59 }] },
    // صفحة 390: القصص 60-70
    { page: 390, items: [{ surah: 28, from: 60, to: 70 }] },
    // صفحة 391: القصص 71-77
    { page: 391, items: [{ surah: 28, from: 71, to: 77 }] },
    // صفحة 392: القصص 78-84
    { page: 392, items: [{ surah: 28, from: 78, to: 84 }] },
    // صفحة 393: القصص 85-88 + العنكبوت 1-6
    { page: 393, items: [{ surah: 28, from: 85, to: 88 }, { surah: 29, from: 1, to: 6 }] },
    // صفحة 394: العنكبوت 7-14
    { page: 394, items: [{ surah: 29, from: 7, to: 14 }] },
    // صفحة 395: العنكبوت 15-23
    { page: 395, items: [{ surah: 29, from: 15, to: 23 }] },
    // صفحة 396: العنكبوت 24-30
    { page: 396, items: [{ surah: 29, from: 24, to: 30 }] },
    // صفحة 397: العنكبوت 31-38
    { page: 397, items: [{ surah: 29, from: 31, to: 38 }] },
    // صفحة 398: العنكبوت 39-45
    { page: 398, items: [{ surah: 29, from: 39, to: 45 }] },
    // صفحة 399: العنكبوت 46-52
    { page: 399, items: [{ surah: 29, from: 46, to: 52 }] },
    // صفحة 400: العنكبوت 53-63
    { page: 400, items: [{ surah: 29, from: 53, to: 63 }] },
    // صفحة 401: العنكبوت 64-69 + الروم 1-5
    { page: 401, items: [{ surah: 29, from: 64, to: 69 }, { surah: 30, from: 1, to: 5 }] },
    // صفحة 402: الروم 6-15
    { page: 402, items: [{ surah: 30, from: 6, to: 15 }] },
    // صفحة 403: الروم 16-24
    { page: 403, items: [{ surah: 30, from: 16, to: 24 }] },
    // صفحة 404: الروم 25-32
    { page: 404, items: [{ surah: 30, from: 25, to: 32 }] },
    // صفحة 405: الروم 33-41
    { page: 405, items: [{ surah: 30, from: 33, to: 41 }] },
    // صفحة 406: الروم 42-50
    { page: 406, items: [{ surah: 30, from: 42, to: 50 }] },
    // صفحة 407: الروم 51-60 + لقمان 1-11
    { page: 407, items: [{ surah: 30, from: 51, to: 60 }, { surah: 31, from: 1, to: 11 }] },
    // صفحة 408: لقمان 12-19
    { page: 408, items: [{ surah: 31, from: 12, to: 19 }] },
    // صفحة 409: لقمان 20-28
    { page: 409, items: [{ surah: 31, from: 20, to: 28 }] },
    // صفحة 410: لقمان 29-34 + السجدة 1-10
    { page: 410, items: [{ surah: 31, from: 29, to: 34 }, { surah: 32, from: 1, to: 10 }] },
    // صفحة 411: السجدة 11-20
    { page: 411, items: [{ surah: 32, from: 11, to: 20 }] },
    // صفحة 412: السجدة 21-30 + الأحزاب 1-6
    { page: 412, items: [{ surah: 32, from: 21, to: 30 }, { surah: 33, from: 1, to: 6 }] },
    // صفحة 413: الأحزاب 7-15
    { page: 413, items: [{ surah: 33, from: 7, to: 15 }] },
    // صفحة 414: الأحزاب 16-22
    { page: 414, items: [{ surah: 33, from: 16, to: 22 }] },
    // صفحة 415: الأحزاب 23-30
    { page: 415, items: [{ surah: 33, from: 23, to: 30 }] },
    // صفحة 416: الأحزاب 31-35
    { page: 416, items: [{ surah: 33, from: 31, to: 35 }] },
    // صفحة 417: الأحزاب 36-43
    { page: 417, items: [{ surah: 33, from: 36, to: 43 }] },
    // صفحة 418: الأحزاب 44-50
    { page: 418, items: [{ surah: 33, from: 44, to: 50 }] },
    // صفحة 419: الأحزاب 51-54
    { page: 419, items: [{ surah: 33, from: 51, to: 54 }] },
    // صفحة 420: الأحزاب 55-62
    { page: 420, items: [{ surah: 33, from: 55, to: 62 }] },
    // صفحة 421: الأحزاب 63-68
    { page: 421, items: [{ surah: 33, from: 63, to: 68 }] },
    // صفحة 422: الأحزاب 69-73 + سبأ 1-8
    { page: 422, items: [{ surah: 33, from: 69, to: 73 }, { surah: 34, from: 1, to: 8 }] },
    // صفحة 423: سبأ 9-17
    { page: 423, items: [{ surah: 34, from: 9, to: 17 }] },
    // صفحة 424: سبأ 18-22
    { page: 424, items: [{ surah: 34, from: 18, to: 22 }] },
    // صفحة 425: سبأ 23-29
    { page: 425, items: [{ surah: 34, from: 23, to: 29 }] },
    // صفحة 426: سبأ 30-36
    { page: 426, items: [{ surah: 34, from: 30, to: 36 }] },
    // صفحة 427: سبأ 37-44
    { page: 427, items: [{ surah: 34, from: 37, to: 44 }] },
    // صفحة 428: سبأ 45-54 + فاطر 1-11
    { page: 428, items: [{ surah: 34, from: 45, to: 54 }, { surah: 35, from: 1, to: 11 }] },
    // صفحة 429: فاطر 12-18
    { page: 429, items: [{ surah: 35, from: 12, to: 18 }] },
    // صفحة 430: فاطر 19-30
    { page: 430, items: [{ surah: 35, from: 19, to: 30 }] },
    // صفحة 431: فاطر 31-38
    { page: 431, items: [{ surah: 35, from: 31, to: 38 }] },
    // صفحة 432: فاطر 39-45 + يس 1-11
    { page: 432, items: [{ surah: 35, from: 39, to: 45 }, { surah: 36, from: 1, to: 11 }] },
    // صفحة 433: يس 12-27
    { page: 433, items: [{ surah: 36, from: 12, to: 27 }] },
    // صفحة 434: يس 28-40
    { page: 434, items: [{ surah: 36, from: 28, to: 40 }] },
    // صفحة 435: يس 41-54
    { page: 435, items: [{ surah: 36, from: 41, to: 54 }] },
    // صفحة 436: يس 55-70
    { page: 436, items: [{ surah: 36, from: 55, to: 70 }] },
    // صفحة 437: يس 71-83 + الصافات 1-15
    { page: 437, items: [{ surah: 36, from: 71, to: 83 }, { surah: 37, from: 1, to: 15 }] },
    // صفحة 438: الصافات 16-30
    { page: 438, items: [{ surah: 37, from: 16, to: 30 }] },
    // صفحة 439: الصافات 31-50
    { page: 439, items: [{ surah: 37, from: 31, to: 50 }] },
    // صفحة 440: الصافات 51-68
    { page: 440, items: [{ surah: 37, from: 51, to: 68 }] },
    // صفحة 441: الصافات 69-90
    { page: 441, items: [{ surah: 37, from: 69, to: 90 }] },
    // صفحة 442: الصافات 91-113
    { page: 442, items: [{ surah: 37, from: 91, to: 113 }] },
    // صفحة 443: الصافات 114-136
    { page: 443, items: [{ surah: 37, from: 114, to: 136 }] },
    // صفحة 444: الصافات 137-162
    { page: 444, items: [{ surah: 37, from: 137, to: 162 }] },
    // صفحة 445: الصافات 163-182 + ص 1-11
    { page: 445, items: [{ surah: 37, from: 163, to: 182 }, { surah: 38, from: 1, to: 11 }] },
    // صفحة 446: ص 12-26
    { page: 446, items: [{ surah: 38, from: 12, to: 26 }] },
    // صفحة 447: ص 27-42
    { page: 447, items: [{ surah: 38, from: 27, to: 42 }] },
    // صفحة 448: ص 43-61
    { page: 448, items: [{ surah: 38, from: 43, to: 61 }] },
    // صفحة 449: ص 62-83
    { page: 449, items: [{ surah: 38, from: 62, to: 83 }] },
    // صفحة 450: ص 84-88 + الزمر 1-5
    { page: 450, items: [{ surah: 38, from: 84, to: 88 }, { surah: 39, from: 1, to: 5 }] },
    // صفحة 451: الزمر 6-11
    { page: 451, items: [{ surah: 39, from: 6, to: 11 }] },
    // صفحة 452: الزمر 12-21
    { page: 452, items: [{ surah: 39, from: 12, to: 21 }] },
    // صفحة 453: الزمر 22-31
    { page: 453, items: [{ surah: 39, from: 22, to: 31 }] },
    // صفحة 454: الزمر 32-40
    { page: 454, items: [{ surah: 39, from: 32, to: 40 }] },
    // صفحة 455: الزمر 41-47
    { page: 455, items: [{ surah: 39, from: 41, to: 47 }] },
    // صفحة 456: الزمر 48-56
    { page: 456, items: [{ surah: 39, from: 48, to: 56 }] },
    // صفحة 457: الزمر 57-67
    { page: 457, items: [{ surah: 39, from: 57, to: 67 }] },
    // صفحة 458: الزمر 68-75 + غافر 1-8
    { page: 458, items: [{ surah: 39, from: 68, to: 75 }, { surah: 40, from: 1, to: 8 }] },
    // صفحة 459: غافر 9-16
    { page: 459, items: [{ surah: 40, from: 9, to: 16 }] },
    // صفحة 460: غافر 17-25
    { page: 460, items: [{ surah: 40, from: 17, to: 25 }] },
    // صفحة 461: غافر 26-33
    { page: 461, items: [{ surah: 40, from: 26, to: 33 }] },
    // صفحة 462: غافر 34-40
    { page: 462, items: [{ surah: 40, from: 34, to: 40 }] },
    // صفحة 463: غافر 41-49
    { page: 463, items: [{ surah: 40, from: 41, to: 49 }] },
    // صفحة 464: غافر 50-58
    { page: 464, items: [{ surah: 40, from: 50, to: 58 }] },
    // صفحة 465: غافر 59-67
    { page: 465, items: [{ surah: 40, from: 59, to: 67 }] },
    // صفحة 466: غافر 68-77
    { page: 466, items: [{ surah: 40, from: 68, to: 77 }] },
    // صفحة 467: غافر 78-85 + فصلت 1-11
    { page: 467, items: [{ surah: 40, from: 78, to: 85 }, { surah: 41, from: 1, to: 11 }] },
    // صفحة 468: فصلت 12-20
    { page: 468, items: [{ surah: 41, from: 12, to: 20 }] },
    // صفحة 469: فصلت 21-29
    { page: 469, items: [{ surah: 41, from: 21, to: 29 }] },
    // صفحة 470: فصلت 30-38
    { page: 470, items: [{ surah: 41, from: 30, to: 38 }] },
    // صفحة 471: فصلت 39-46
    { page: 471, items: [{ surah: 41, from: 39, to: 46 }] },
    // صفحة 472: فصلت 47-54 + الشورى 1-11
    { page: 472, items: [{ surah: 41, from: 47, to: 54 }, { surah: 42, from: 1, to: 11 }] },
    // صفحة 473: الشورى 12-22
    { page: 473, items: [{ surah: 42, from: 12, to: 22 }] },
    // صفحة 474: الشورى 23-31
    { page: 474, items: [{ surah: 42, from: 23, to: 31 }] },
    // صفحة 475: الشورى 32-44
    { page: 475, items: [{ surah: 42, from: 32, to: 44 }] },
    // صفحة 476: الشورى 45-53 + الزخرف 1-11
    { page: 476, items: [{ surah: 42, from: 45, to: 53 }, { surah: 43, from: 1, to: 11 }] },
    // صفحة 477: الزخرف 12-22
    { page: 477, items: [{ surah: 43, from: 12, to: 22 }] },
    // صفحة 478: الزخرف 23-33
    { page: 478, items: [{ surah: 43, from: 23, to: 33 }] },
    // صفحة 479: الزخرف 34-47
    { page: 479, items: [{ surah: 43, from: 34, to: 47 }] },
    // صفحة 480: الزخرف 48-60
    { page: 480, items: [{ surah: 43, from: 48, to: 60 }] },
    // صفحة 481: الزخرف 61-73
    { page: 481, items: [{ surah: 43, from: 61, to: 73 }] },
    // صفحة 482: الزخرف 74-89 + الدخان 1-18
    { page: 482, items: [{ surah: 43, from: 74, to: 89 }, { surah: 44, from: 1, to: 18 }] },
    // صفحة 483: الدخان 19-39
    { page: 483, items: [{ surah: 44, from: 19, to: 39 }] },
    // صفحة 484: الدخان 40-59 + الجاثية 1-13
    { page: 484, items: [{ surah: 44, from: 40, to: 59 }, { surah: 45, from: 1, to: 13 }] },
    // صفحة 485: الجاثية 14-22
    { page: 485, items: [{ surah: 45, from: 14, to: 22 }] },
    // صفحة 486: الجاثية 23-32
    { page: 486, items: [{ surah: 45, from: 23, to: 32 }] },
    // صفحة 487: الجاثية 33-37 + الأحقاف 1-9
    { page: 487, items: [{ surah: 45, from: 33, to: 37 }, { surah: 46, from: 1, to: 9 }] },
    // صفحة 488: الأحقاف 10-20
    { page: 488, items: [{ surah: 46, from: 10, to: 20 }] },
    // صفحة 489: الأحقاف 21-28
    { page: 489, items: [{ surah: 46, from: 21, to: 28 }] },
    // صفحة 490: الأحقاف 29-35 + محمد 1-11
    { page: 490, items: [{ surah: 46, from: 29, to: 35 }, { surah: 47, from: 1, to: 11 }] },
    // صفحة 491: محمد 12-19
    { page: 491, items: [{ surah: 47, from: 12, to: 19 }] },
    // صفحة 492: محمد 20-27
    { page: 492, items: [{ surah: 47, from: 20, to: 27 }] },
    // صفحة 493: محمد 28-38 + الفتح 1-9
    { page: 493, items: [{ surah: 47, from: 28, to: 38 }, { surah: 48, from: 1, to: 9 }] },
    // صفحة 494: الفتح 10-17
    { page: 494, items: [{ surah: 48, from: 10, to: 17 }] },
    // صفحة 495: الفتح 18-28
    { page: 495, items: [{ surah: 48, from: 18, to: 28 }] },
    // صفحة 496: الفتح 29 + الحجرات 1-11
    { page: 496, items: [{ surah: 48, from: 29, to: 29 }, { surah: 49, from: 1, to: 11 }] },
    // صفحة 497: الحجرات 12-18 + ق 1-5
    { page: 497, items: [{ surah: 49, from: 12, to: 18 }, { surah: 50, from: 1, to: 5 }] },
    // صفحة 498: ق 6-26
    { page: 498, items: [{ surah: 50, from: 6, to: 26 }] },
    // صفحة 499: ق 27-45 + الذاريات 1-6
    { page: 499, items: [{ surah: 50, from: 27, to: 45 }, { surah: 51, from: 1, to: 6 }] },
    // صفحة 500: الذاريات 7-22
    { page: 500, items: [{ surah: 51, from: 7, to: 22 }] },
    // صفحة 501: الذاريات 23-36
    { page: 501, items: [{ surah: 51, from: 23, to: 36 }] },
    // صفحة 502: الذاريات 37-50
    { page: 502, items: [{ surah: 51, from: 37, to: 50 }] },
    // صفحة 503: الذاريات 51-60 + الطور 1-14
    { page: 503, items: [{ surah: 51, from: 51, to: 60 }, { surah: 52, from: 1, to: 14 }] },
    // صفحة 504: الطور 15-31
    { page: 504, items: [{ surah: 52, from: 15, to: 31 }] },
    // صفحة 505: الطور 32-49 + النجم 1-21
    { page: 505, items: [{ surah: 52, from: 32, to: 49 }, { surah: 53, from: 1, to: 21 }] },
    // صفحة 506: النجم 22-35
    { page: 506, items: [{ surah: 53, from: 22, to: 35 }] },
    // صفحة 507: النجم 36-62
    { page: 507, items: [{ surah: 53, from: 36, to: 62 }] },
    // صفحة 508: القمر 1-22
    { page: 508, items: [{ surah: 54, from: 1, to: 22 }] },
    // صفحة 509: القمر 23-49
    { page: 509, items: [{ surah: 54, from: 23, to: 49 }] },
    // صفحة 510: القمر 50-55 + الرحمن 1-21
    { page: 510, items: [{ surah: 54, from: 50, to: 55 }, { surah: 55, from: 1, to: 21 }] },
    // صفحة 511: الرحمن 22-55
    { page: 511, items: [{ surah: 55, from: 22, to: 55 }] },
    // صفحة 512: الرحمن 56-78 + الواقعة 1-22
    { page: 512, items: [{ surah: 55, from: 56, to: 78 }, { surah: 56, from: 1, to: 22 }] },
    // صفحة 513: الواقعة 23-56
    { page: 513, items: [{ surah: 56, from: 23, to: 56 }] },
    // صفحة 514: الواقعة 57-96
    { page: 514, items: [{ surah: 56, from: 57, to: 96 }] },
    // صفحة 515: الحديد 1-14
    { page: 515, items: [{ surah: 57, from: 1, to: 14 }] },
    // صفحة 516: الحديد 15-23
    { page: 516, items: [{ surah: 57, from: 15, to: 23 }] },
    // صفحة 517: الحديد 24-29 + المجادلة 1-6
    { page: 517, items: [{ surah: 57, from: 24, to: 29 }, { surah: 58, from: 1, to: 6 }] },
    // صفحة 518: المجادلة 7-13
    { page: 518, items: [{ surah: 58, from: 7, to: 13 }] },
    // صفحة 519: المجادلة 14-22 + الحشر 1-10
    { page: 519, items: [{ surah: 58, from: 14, to: 22 }, { surah: 59, from: 1, to: 10 }] },
    // صفحة 520: الحشر 11-24
    { page: 520, items: [{ surah: 59, from: 11, to: 24 }] },
    // صفحة 521: الممتحنة 1-12
    { page: 521, items: [{ surah: 60, from: 1, to: 12 }] },
    // صفحة 522: الممتحنة 13 + الصف 1-13
    { page: 522, items: [{ surah: 60, from: 13, to: 13 }, { surah: 61, from: 1, to: 13 }] },
    // صفحة 523: الصف 14 + الجمعة 1-10
    { page: 523, items: [{ surah: 61, from: 14, to: 14 }, { surah: 62, from: 1, to: 10 }] },
    // صفحة 524: الجمعة 11 + المنافقون 1-11 + التغابن 1-4
    { page: 524, items: [{ surah: 62, from: 11, to: 11 }, { surah: 63, from: 1, to: 11 }, { surah: 64, from: 1, to: 4 }] },
    // صفحة 525: التغابن 5-18
    { page: 525, items: [{ surah: 64, from: 5, to: 18 }] },
    // صفحة 526: الطلاق 1-12
    { page: 526, items: [{ surah: 65, from: 1, to: 12 }] },
    // صفحة 527: التحريم 1-12
    { page: 527, items: [{ surah: 66, from: 1, to: 12 }] },
    // صفحة 528: الملك 1-30
    { page: 528, items: [{ surah: 67, from: 1, to: 30 }] },
    // صفحة 529: القلم 1-52
    { page: 529, items: [{ surah: 68, from: 1, to: 52 }] },
    // صفحة 530: الحاقة 1-52
    { page: 530, items: [{ surah: 69, from: 1, to: 52 }] },
    // صفحة 531: المعارج 1-44
    { page: 531, items: [{ surah: 70, from: 1, to: 44 }] },
    // صفحة 532: نوح 1-28
    { page: 532, items: [{ surah: 71, from: 1, to: 28 }] },
    // صفحة 533: الجن 1-28
    { page: 533, items: [{ surah: 72, from: 1, to: 28 }] },
    // صفحة 534: المزمل 1-20
    { page: 534, items: [{ surah: 73, from: 1, to: 20 }] },
    // صفحة 535: المدثر 1-56
    { page: 535, items: [{ surah: 74, from: 1, to: 56 }] },
    // صفحة 536: القيامة 1-40
    { page: 536, items: [{ surah: 75, from: 1, to: 40 }] },
    // صفحة 537: الإنسان 1-31
    { page: 537, items: [{ surah: 76, from: 1, to: 31 }] },
    // صفحة 538: المرسلات 1-50
    { page: 538, items: [{ surah: 77, from: 1, to: 50 }] },
    // صفحة 539: النبأ 1-40
    { page: 539, items: [{ surah: 78, from: 1, to: 40 }] },
    // صفحة 540: النازعات 1-46
    { page: 540, items: [{ surah: 79, from: 1, to: 46 }] },
    // صفحة 541: عبس 1-42
    { page: 541, items: [{ surah: 80, from: 1, to: 42 }] },
    // صفحة 542: التكوير 1-29
    { page: 542, items: [{ surah: 81, from: 1, to: 29 }] },
    // صفحة 543: الانفطار 1-19 + المطففين 1-15
    { page: 543, items: [{ surah: 82, from: 1, to: 19 }, { surah: 83, from: 1, to: 15 }] },
    // صفحة 544: المطففين 16-36
    { page: 544, items: [{ surah: 83, from: 16, to: 36 }] },
    // صفحة 545: الانشقاق 1-25 + البروج 1-15
    { page: 545, items: [{ surah: 84, from: 1, to: 25 }, { surah: 85, from: 1, to: 15 }] },
    // صفحة 546: البروج 16-22 + الطارق 1-17 + الأعلى 1-14
    { page: 546, items: [{ surah: 85, from: 16, to: 22 }, { surah: 86, from: 1, to: 17 }, { surah: 87, from: 1, to: 14 }] },
    // صفحة 547: الأعلى 15-19 + الغاشية 1-26 + الفجر 1-20
    { page: 547, items: [{ surah: 87, from: 15, to: 19 }, { surah: 88, from: 1, to: 26 }, { surah: 89, from: 1, to: 20 }] },
    // صفحة 548: الفجر 21-30 + البلد 1-20 + الشمس 1-15
    { page: 548, items: [{ surah: 89, from: 21, to: 30 }, { surah: 90, from: 1, to: 20 }, { surah: 91, from: 1, to: 15 }] },
    // صفحة 549: الليل 1-21 + الضحى 1-11 + الشرح 1-8
    { page: 549, items: [{ surah: 92, from: 1, to: 21 }, { surah: 93, from: 1, to: 11 }, { surah: 94, from: 1, to: 8 }] },
    // صفحة 550: التين 1-8 + العلق 1-19
    { page: 550, items: [{ surah: 95, from: 1, to: 8 }, { surah: 96, from: 1, to: 19 }] },
    // صفحة 551: القدر 1-5 + البينة 1-8 + الزلزلة 1-8
    { page: 551, items: [{ surah: 97, from: 1, to: 5 }, { surah: 98, from: 1, to: 8 }, { surah: 99, from: 1, to: 8 }] },
    // صفحة 552: العاديات 1-11 + القارعة 1-11 + التكاثر 1-8
    { page: 552, items: [{ surah: 100, from: 1, to: 11 }, { surah: 101, from: 1, to: 11 }, { surah: 102, from: 1, to: 8 }] },
    // صفحة 553: العصر 1-3 + الهمزة 1-9 + الفيل 1-5 + قريش 1-4
    { page: 553, items: [{ surah: 103, from: 1, to: 3 }, { surah: 104, from: 1, to: 9 }, { surah: 105, from: 1, to: 5 }, { surah: 106, from: 1, to: 4 }] },
    // صفحة 554: الماعون 1-7 + الكوثر 1-3 + الكافرون 1-6
    { page: 554, items: [{ surah: 107, from: 1, to: 7 }, { surah: 108, from: 1, to: 3 }, { surah: 109, from: 1, to: 6 }] },
    // صفحة 555: النصر 1-3 + المسد 1-5 + الإخلاص 1-4
    { page: 555, items: [{ surah: 110, from: 1, to: 3 }, { surah: 111, from: 1, to: 5 }, { surah: 112, from: 1, to: 4 }] },
    // صفحة 556: الفلق 1-5 + الناس 1-6
    { page: 556, items: [{ surah: 113, from: 1, to: 5 }, { surah: 114, from: 1, to: 6 }] }
];

// ===== متغيرات عامة =====
let quranData = [];

// ===== دالة الحصول على بيانات صفحة معينة =====
function getPageData(pageNumber) {
    return mushafPageIndex.find(p => p.page === pageNumber);
}

// ===== دالة استخراج آيات صفحة معينة =====
function getPageVerses(pageNumber) {
    const pageData = getPageData(pageNumber);
    
    if (!pageData) return [];
    
    const verses = [];
    
    for (const section of pageData.items) {
        const sectionVerses = quranData.filter(verse =>
            verse.surah === section.surah &&
            verse.ayah >= section.from &&
            verse.ayah <= section.to
        );
        
        verses.push(...sectionVerses);
    }
    
    return verses;
}

// ===== دالة الحصول على السور في صفحة معينة =====
function getSurahsInPage(pageNumber) {
    const pageData = getPageData(pageNumber);
    
    if (!pageData) return [];
    
    return pageData.items.map(item => item.surah);
}

// ===== دالة الحصول على أول آية في صفحة =====
function getPageStart(pageNumber) {
    const pageData = getPageData(pageNumber);
    
    if (!pageData || pageData.items.length === 0) return null;
    
    const first = pageData.items[0];
    return { surah: first.surah, ayah: first.from };
}

// ===== دالة الحصول على آخر آية في صفحة =====
function getPageEnd(pageNumber) {
    const pageData = getPageData(pageNumber);
    
    if (!pageData || pageData.items.length === 0) return null;
    
    const last = pageData.items[pageData.items.length - 1];
    return { surah: last.surah, ayah: last.to };
}

// ===== دالة الحصول على رقم الصفحة لآية معينة =====
function getPageForVerse(surahNumber, ayahNumber) {
    for (const page of mushafPageIndex) {
        for (const item of page.items) {
            if (item.surah === surahNumber &&
                ayahNumber >= item.from &&
                ayahNumber <= item.to) {
                return page.page;
            }
        }
    }
    return 1;
}

// ===== تحميل القرآن =====
async function loadQuran() {
    try {
        const response = await fetch('quran.json');
        const data = await response.json();
        
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
        
        console.log('تم تحميل القرآن الكريم:', quranData.length, 'آية');
        console.log('عدد الصفحات في الفهرس:', mushafPageIndex.length);
        return true;
    } catch (error) {
        console.error('خطأ في تحميل القرآن:', error);
        return false;
    }
}
