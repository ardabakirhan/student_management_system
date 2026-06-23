export const mockData = {
  users: [
    { id: 1, name: "Admin Kullanıcı", email: "admin@rezonans.com", password: "Admin123!", role: "admin" },
    { id: 2, name: "Selin Arslan", email: "selin@rezonans.com", password: "Teacher123!", role: "teacher", branch: "Piyano" },
    { id: 3, name: "Burak Koç", email: "burak@rezonans.com", password: "Teacher123!", role: "teacher", branch: "Satranç" },
    { id: 4, name: "Zeynep Şen", email: "zeynep@rezonans.com", password: "Teacher123!", role: "teacher", branch: "Kara Kalem" },
    { id: 5, name: "Can Yıldız", email: "can@rezonans.com", password: "Teacher123!", role: "teacher", branch: "Klasik Bale" },
    { id: 6, name: "Fatma Yılmaz", email: "fatma@rezonans.com", password: "Veli123!", role: "veli", studentId: 1 },
    { id: 7, name: "Mehmet Kaya", email: "mehmet@rezonans.com", password: "Veli123!", role: "veli", studentId: 2 },
    { id: 8, name: "Ahmet Yılmaz", email: "ahmet@rezonans.com", password: "Student123!", role: "student", studentId: 1 }
  ],
  students: [
    { id: 1, name: "Ahmet Yılmaz", branch: "Piyano", category: "Müzik", program: "Bireysel", ageGroup: "10-14", status: "Aktif", veliId: 6 },
    { id: 2, name: "Elif Kaya", branch: "Sulu Boya", category: "Resim", program: "Grup", ageGroup: "7-10", status: "Aktif", veliId: 7 },
    { id: 3, name: "Mert Demir", branch: "Satranç", category: "Akıl Oyunları", program: "Grup", ageGroup: "8-12", status: "Aktif", veliId: null },
    { id: 4, name: "Sude Kılıç", branch: "Klasik Bale", category: "Modern Dans", program: "Bireysel", ageGroup: "6-9", status: "Aktif", veliId: null }
  ],
  teachers: [
    { id: 1, name: "Selin Arslan", branch: "Piyano", category: "Müzik" },
    { id: 2, name: "Burak Koç", branch: "Satranç", category: "Akıl Oyunları" },
    { id: 3, name: "Zeynep Şen", branch: "Kara Kalem", category: "Resim" },
    { id: 4, name: "Can Yıldız", branch: "Klasik Bale", category: "Modern Dans" }
  ],
  branches: {
    müzik: [
      { id: "piyano", name: "Piyano", desc: "Klasik ve çağdaş piyano eğitimi; teknik egzersizler, repertuvar çalışması ve müzikal ifade.", programs: ["Grup", "Bireysel"], ageGroups: ["5-8", "9-14", "15+"] },
      { id: "keman", name: "Keman", desc: "Temel yay tekniği, entonasyon ve orkestra becerileri.", programs: ["Grup", "Bireysel"], ageGroups: ["6-10", "11-17"] },
      { id: "gitar", name: "Gitar", desc: "Akustik ve klasik gitar teknikleri; akor, melodi ve doğaçlama.", programs: ["Grup", "Bireysel"], ageGroups: ["8-14", "15+"] },
      { id: "yanflut", name: "Yan Flüt", desc: "Nefes teknikleri, ses üretimi ve müzikal ifade çalışmaları.", programs: ["Bireysel"], ageGroups: ["7-12", "13+"] }
    ],
    resim: [
      { id: "suluboya", name: "Sulu Boya", desc: "Renk teorisi, fırça teknikleri ve sulu boya uygulamaları.", programs: ["Grup", "Bireysel"], ageGroups: ["5-8", "9-14"] },
      { id: "akrilik", name: "Akrilik", desc: "Katmanlı boyama, doku oluşturma ve kompozisyon.", programs: ["Grup"], ageGroups: ["10-16", "17+"] },
      { id: "karakalem", name: "Kara Kalem", desc: "Form, oran, gölgeleme ve perspektif çalışmaları.", programs: ["Grup", "Bireysel"], ageGroups: ["7-12", "13+"] },
      { id: "seramik", name: "Seramik", desc: "El ile şekillendirme, çark ve fırın teknikleri.", programs: ["Grup"], ageGroups: ["6-12", "13+"] }
    ],
    dans: [
      { id: "bale", name: "Klasik Bale", desc: "Temel bale pozisyonları, barre çalışması ve sahne performansı.", programs: ["Grup", "Bireysel"], ageGroups: ["4-7", "8-12"] },
      { id: "modern", name: "Modern Dans", desc: "Çağdaş hareket dili, koreografi ve sahne bilinci.", programs: ["Grup"], ageGroups: ["10-16", "17+"] },
      { id: "dunyadanslari", name: "Dünya Dansları", desc: "Latin, flamenko ve Orta Doğu dans gelenekleri.", programs: ["Grup"], ageGroups: ["12+"] }
    ],
    akiloyunlari: [
      { id: "satranc", name: "Satranç", desc: "Açılış stratejileri, taktik ve pozisyonel anlayış; turnuva hazırlığı.", programs: ["Grup", "Bireysel"], ageGroups: ["5-9", "10-15"] },
      { id: "mentalaritmetik", name: "Mental Aritmetik", desc: "Abakus destekli hızlı hesaplama ve bellek güçlendirme.", programs: ["Grup"], ageGroups: ["6-12"] },
      { id: "akiloyunlari", name: "Akıl Oyunları", desc: "Küre, Equilibrio ve diğer 3D bulmacalar ile uzamsal zekâ.", programs: ["Grup"], ageGroups: ["5-10", "11+"] }
    ]
  },
  weeklySchedule: [
    { id: 1, day: "Pazartesi", time: "10:00", lesson: "Piyano – Bireysel", teacher: "Selin Arslan", room: "Müzik Odası 1" },
    { id: 2, day: "Salı", time: "14:00", lesson: "Satranç – Grup", teacher: "Burak Koç", room: "Akıl Oyunları Salonu" },
    { id: 3, day: "Çarşamba", time: "11:00", lesson: "Kara Kalem – Grup", teacher: "Zeynep Şen", room: "Resim Atölyesi" },
    { id: 4, day: "Perşembe", time: "15:30", lesson: "Klasik Bale – Grup", teacher: "Can Yıldız", room: "Dans Salonu" },
    { id: 5, day: "Cuma", time: "13:00", lesson: "Piyano – Grup", teacher: "Selin Arslan", room: "Müzik Odası 2" }
  ],
  paymentHistory: [
    { id: 1, studentId: 1, studentName: "Ahmet Yılmaz", date: "02.05.2026", amount: 2800, status: "Ödendi" },
    { id: 2, studentId: 2, studentName: "Elif Kaya", date: "01.05.2026", amount: 2800, status: "Ödendi" },
    { id: 3, studentId: 3, studentName: "Mert Demir", date: "28.04.2026", amount: 2800, status: "Bekliyor" },
    { id: 4, studentId: 4, studentName: "Sude Kılıç", date: "03.05.2026", amount: 3200, status: "Ödendi" }
  ],
  attendanceRecords: [
    { id: 1, studentId: 1, studentName: "Ahmet Yılmaz", lesson: "Piyano", date: "12.05.2026", status: "Derse Geldi" },
    { id: 2, studentId: 2, studentName: "Elif Kaya", lesson: "Sulu Boya", date: "12.05.2026", status: "Derse Gelmedi" },
    { id: 3, studentId: 3, studentName: "Mert Demir", lesson: "Satranç", date: "12.05.2026", status: "Derse Geldi" },
    { id: 4, studentId: 4, studentName: "Sude Kılıç", lesson: "Klasik Bale", date: "12.05.2026", status: "Derse Geldi" }
  ],
  evaluations: [
    {
      id: 1,
      studentId: 1,
      studentName: "Ahmet Yılmaz",
      teacherId: 2,
      teacherName: "Selin Arslan",
      month: "Mayıs 2026",
      content: "Ahmet bu ay piyano etüdlerinde büyük ilerleme kaydetti. Sol el koordinasyonu belirgin şekilde güçlendi; dinamik kontrol üzerinde çalışmaya devam ediyoruz.",
      createdAt: "2026-05-10"
    },
    {
      id: 2,
      studentId: 2,
      studentName: "Elif Kaya",
      teacherId: 4,
      teacherName: "Zeynep Şen",
      month: "Mayıs 2026",
      content: "Elif'in sulu boya tekniği gelişiyor; fırça kontrolü ve renk geçişlerinde belirgin ilerleme gözlemlendi. Renk teorisini kavraması çok hızlı oldu.",
      createdAt: "2026-05-11"
    }
  ],
  messages: [
    {
      id: 1,
      fromId: 6,
      fromName: "Fatma Yılmaz",
      fromRole: "veli",
      toId: 2,
      toName: "Selin Arslan",
      channel: "direct",
      subject: "Ders saati değişikliği",
      body: "Merhaba, Ahmet'in Pazartesi dersini 11:00'e almak mümkün mü?",
      createdAt: "2026-05-14",
      read: false
    },
    {
      id: 2,
      fromId: 7,
      fromName: "Mehmet Kaya",
      fromRole: "veli",
      toId: null,
      toName: "Yönetim",
      channel: "admin",
      subject: "Hafta sonu grup seansı önerisi",
      body: "Hafta sonu grup seansları eklenmesini öneririm; çalışan veliler için çok daha erişilebilir olur.",
      createdAt: "2026-05-13",
      read: true
    }
  ],
  demoRequests: [],
  announcements: [
    {
      id: 1,
      title: "Yaz Atölyesi 2026 Kayıtları Açıldı",
      body: "Yaz dönemine özel resim, dans ve müzik atölyeleri için kayıtlar başlamıştır. Erken kayıt avantajını kaçırmayın.",
      date: "2026-05-01"
    },
    {
      id: 2,
      title: "Satranç Turnuvası – Haziran 2026",
      body: "Kurumumuz öğrencilerine özel iç turnuva 15 Haziran'da gerçekleşecektir. Kayıtlar için idare ile iletişime geçiniz.",
      date: "2026-05-08"
    },
    {
      id: 3,
      title: "Bahar Konseri",
      body: "Müzik bölümü öğrencilerimizin yıl sonu bahar konseri 30 Mayıs Cumartesi salonumuzda gerçekleşecektir.",
      date: "2026-05-15"
    }
  ],
  products: [
    { id: 1, name: "Upright Piyano", category: "Müzik Aletleri", description: "Yarı kuyruk ses kalitesiyle ev kullanımına uygun dik piyano; akustik ve sessiz çalış modları." },
    { id: 2, name: "4/4 Keman Seti", category: "Müzik Aletleri", description: "Yay, reçine ve taşıma çantası dahil tam donanımlı öğrenci kemani." },
    { id: 3, name: "Piyano Yedek Tel Seti", category: "Yedek Parça", description: "Standart ölçülü, uzun ömürlü piyano tel takımı." },
    { id: 4, name: "Keman Yayı – Brezilya Ahşabı", category: "Yedek Parça", description: "Brezilya ahşabı ve doğal yay kılından üretilmiş profesyonel yay." },
    { id: 5, name: "Ayarlanabilir Piyano Taburesi", category: "Aksesuar", description: "Yükseklik ayarlı, döner, yastıklı piyano taburesi." }
  ]
};