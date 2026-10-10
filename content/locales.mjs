export const contentUpdated = '2026-10-10';

export const uiKeys = ["practice","history","print","theme","system","paper","mint","sand","night","ink","time","next","mistakes","restart","pause","resume","ready","paused","incorrect","complete","again","daily","bests","app","appText","download","local","size","sheets","refresh","printNow","sheet","name","paperTime","preview","noscript"];

export const loadingLabels = {
  en: 'Loading practice…', 'zh-Hans': '正在加载练习…', 'zh-Hant': '正在載入練習…',
  ja: '練習を読み込み中…', ko: '연습 불러오는 중…', de: 'Übung wird geladen…',
  fr: 'Chargement de l’exercice…', es: 'Cargando la práctica…'
};

export const retryLabels = {
  en: ['Loading is taking longer than expected.', 'Reload'],
  'zh-Hans': ['加载时间较长，可以重新尝试。', '重新加载'],
  'zh-Hant': ['載入時間較長，可以重新嘗試。', '重新載入'],
  ja: ['読み込みに時間がかかっています。', '再読み込み'],
  ko: ['불러오는 데 시간이 걸리고 있습니다.', '다시 불러오기'],
  de: ['Das Laden dauert länger als erwartet.', 'Neu laden'],
  fr: ['Le chargement prend plus de temps que prévu.', 'Recharger'],
  es: ['La carga está tardando más de lo esperado.', 'Recargar']
};

export const locales = {
  en: {
    brand: 'Schulte Grid', title: 'Schulte Grid Online | Free Timer & Printable Tables',
    description: 'Try free Schulte grids online from 3x3 to 6x6 with a timer and printable A4 worksheets. The web demo does not save history; use the app to keep training progress.',
    intro: 'Free online Schulte tables with a timer and printable worksheets. Demo only; no saved training history.',
    nav: ['Practice', 'Help', 'Support', 'Privacy', 'Language'],
    heading: 'Online Schulte grid practice',
    overview: 'A Schulte grid is a square table of shuffled numbers. Find them in ascending order, from 1 to 9, 16, 25, or 36. Try 3x3, 4x4, 5x5, and 6x6 tables, a timer, and printable practice sheets for free, without an account or download. This website is a demo and does not save training history. Use the Apple app for ongoing training records and daily goals.',
    faq: [
      ['How does the online Schulte grid timer work?', 'The timer starts when you correctly select 1 and stops at the last number. Wrong selections count as mistakes and do not advance the sequence. Pausing hides the numbers and excludes the pause from your time. Compare results within the same grid size.'],
      ['Which Schulte table size should I choose?', '3x3 has 9 numbers and 4x4 has 16. The classic 5x5 table has 25 numbers; 6x6 has 36. Start with a smaller table, then choose a larger one when you want a longer visual search exercise.'],
      ['Can I print free Schulte grids or save them as PDF?', 'Yes. Open Print, choose a grid size and 1 to 20 worksheets, then print. Every sheet uses a different arrangement on white A4 paper, even in dark mode. Choose Save as PDF in your browser print dialog for a PDF download.'],
      ['Does the website save my training results?', 'No. Only the current round is shown in page memory. Starting a new round, refreshing, or leaving the page discards it. Training history, preferences, and goals are not saved in browser storage or on a server. Previously saved web records are removed when this version opens.'],
      ['How is the website different from the Schulte Grid app?', 'The website offers quick practice and printable worksheets. The iPhone, iPad, and Mac app saves the latest 100 training results locally and provides daily goals and progress. The app does not currently provide iCloud synchronization. Schulte grids are a practice exercise, not a medical assessment or a guarantee of cognitive improvement.']
    ],
    faqHeading: 'Schulte grid questions', links: ['What is a Schulte grid?', 'Printable Schulte tables', 'Schulte Grid for Apple devices'],
    ui: ["Practice","History","Print","Theme","System","Classic paper","Soft mint","Warm sand","Night focus","Ink","Time","Next","Mistakes","New round","Pause","Resume","Ready","Paused","Next: {n}","Round complete","Practice again","Daily practice","Best by size","Schulte Grid app","Keep your training history, daily goals, and progress in the iPhone, iPad, and Mac app.","Get the app","Demo only. This round is not saved and is discarded when you start again, refresh, or leave.","Grid","Worksheets","New sheets","Print / PDF","Sheet","Name","Time","A4 preview","Enable JavaScript to play and generate worksheets. The guides below remain available."]
  },
  'zh-Hans': {
    brand: '舒尔特方格', title: '舒尔特方格在线训练 | 免费计时与 A4 打印练习纸',
    description: '免费体验 3×3 到 6×6 舒尔特方格在线训练、计时和 A4 打印练习纸，可保存 PDF。网页版不保存训练历史，使用 App 可保留记录和每日练习进度。',
    intro: '免费体验舒尔特方格计时训练和打印练习纸。仅体验，不保存训练历史。',
    nav: ['在线练习', '帮助', '支持', '隐私', '语言'],
    heading: '舒尔特方格在线训练',
    overview: '舒尔特方格是将数字随机排列在正方形表格中的视觉搜索练习。按升序找到数字，从 1 到 9、16、25 或 36。网页版免费体验 3×3、4×4、5×5、6×6 方格、计时和打印练习纸，无需注册或下载。网站不保存训练历史；需要持续记录和每日目标时，可以使用 Apple App。',
    faq: [
      ['在线舒尔特方格如何计时？', '正确点中 1 后开始计时，找到最后一个数字后结束。错点会记录为错误，但不会推进数字顺序。暂停时数字会隐藏，暂停时间不计入成绩。建议比较相同方格大小的成绩。'],
      ['舒尔特方格选哪种大小？', '3×3 有 9 个数字，4×4 有 16 个数字，经典 5×5 有 25 个数字，6×6 有 36 个数字。可以先从小方格开始，需要更长的视觉搜索练习时再选择大方格。'],
      ['可以免费打印舒尔特方格或下载 PDF 吗？', '可以。在“打印”中选择方格大小和 1 到 20 份练习纸，再打开打印窗口。每份数字排列都不同，深色模式下也始终是白底 A4。在浏览器打印窗口选择“另存为 PDF”，即可保存 PDF 文件。'],
      ['网站会保存我的训练结果吗？', '不会。仅在页面内存中展示当前这一轮结果，开始新一轮、刷新或离开页面后即丢弃。不把训练历史、偏好或目标保存到浏览器存储或服务器。打开新版网站时，会清除旧网页版曾保存的记录。'],
      ['网页版与舒尔特方格 App 有什么区别？', '网页版用于快速体验和打印练习纸；iPhone、iPad 和 Mac App 在设备本地保存最近 100 次训练成绩，并提供每日目标和进度。App 目前尚未提供 iCloud 同步。舒尔特方格是一种练习工具，不是医疗评估，也不保证提高智力。']
    ],
    faqHeading: '舒尔特方格常见问题', links: ['什么是舒尔特方格？（英文）', '打印练习指南（英文）', 'Apple 设备上的舒尔特方格（英文）'],
    ui: ["练习","历史记录","打印","主题","跟随系统","经典纸张","柔和薄荷","暖沙","夜间专注","水墨","用时","下一个","错误","新一轮","暂停","继续","准备就绪","已暂停","下一个：{n}","本轮完成","再练一轮","每日练习","各难度最佳","舒尔特方格 App","在 iPhone、iPad 和 Mac App 中保存训练历史，设置每日目标并查看练习进度。","下载 App","仅体验，不保存历史。本轮结果在开始新一轮、刷新或离开页面后丢弃。","方格","练习纸份数","重新生成","打印 / PDF","练习纸","姓名","用时","A4 预览","启用 JavaScript 后即可在线练习和生成练习纸，下方指南仍可阅读。"]
  },
  'zh-Hant': {
    brand: '舒爾特方格', title: '舒爾特方格線上練習 | 免費計時與 A4 列印練習紙',
    description: '免費體驗 3×3 到 6×6 舒爾特方格線上練習、計時與 A4 列印練習紙，可儲存 PDF。網頁版不儲存訓練歷史，使用 App 可保留紀錄與每日練習進度。',
    intro: '免費體驗舒爾特方格計時練習與列印練習紙。僅供體驗，不儲存訓練歷史。',
    nav: ['線上練習', '說明', '支援', '隱私', '語言'],
    heading: '舒爾特方格線上練習',
    overview: '舒爾特方格是將數字隨機排列在正方形表格中的視覺搜尋練習。依序找出數字，從 1 到 9、16、25 或 36。網頁版免費體驗 3×3、4×4、5×5、6×6 方格、計時與列印練習紙，無須註冊或下載。網站不儲存訓練歷史；需要持續紀錄與每日目標時，可以使用 Apple App。',
    faq: [
      ['線上舒爾特方格如何計時？', '正確點選 1 後開始計時，找到最後一個數字後結束。錯誤點選會記錄為錯誤，但不會推進數字順序。暫停時數字會隱藏，暫停時間不計入成績。建議比較相同方格大小的成績。'],
      ['舒爾特方格要選哪種大小？', '3×3 有 9 個數字，4×4 有 16 個數字，經典 5×5 有 25 個數字，6×6 有 36 個數字。可先從小方格開始，需要較長的視覺搜尋練習時再選大方格。'],
      ['可以免費列印舒爾特方格或下載 PDF 嗎？', '可以。在「列印」中選擇方格大小與 1 到 20 份練習紙，再開啟列印視窗。每份數字排列皆不同，深色模式下也始終是白底 A4。在瀏覽器列印視窗選擇「另存為 PDF」，即可儲存 PDF。'],
      ['網站會儲存我的訓練結果嗎？', '不會。僅在頁面記憶體中顯示目前這一輪結果，開始新一輪、重新整理或離開頁面後即丟棄。不將訓練歷史、偏好或目標儲存到瀏覽器儲存空間或伺服器。開啟新版網站時，會清除舊網頁版曾儲存的紀錄。'],
      ['網頁版與舒爾特方格 App 有何不同？', '網頁版用於快速體驗與列印練習紙；iPhone、iPad 和 Mac App 在裝置本機儲存最近 100 次訓練成績，並提供每日目標與進度。App 目前尚未提供 iCloud 同步。舒爾特方格是一種練習工具，不是醫療評估，也不保證提高智力。']
    ],
    faqHeading: '舒爾特方格常見問題', links: ['什麼是舒爾特方格？（英文）', '列印練習指南（英文）', 'Apple 裝置上的舒爾特方格（英文）'],
    ui: ["練習","歷史紀錄","列印","主題","跟隨系統","經典紙張","柔和薄荷","暖沙","夜間專注","水墨","用時","下一個","錯誤","新一輪","暫停","繼續","準備就緒","已暫停","下一個：{n}","本輪完成","再練一輪","每日練習","各難度最佳","舒爾特方格 App","在 iPhone、iPad 和 Mac App 中儲存訓練歷史、設定每日目標並查看練習進度。","下載 App","僅供體驗，不儲存歷史。本輪結果在開始新一輪、重新整理或離開頁面後丟棄。","方格","練習紙份數","重新產生","列印 / PDF","練習紙","姓名","用時","A4 預覽","啟用 JavaScript 後即可線上練習與產生練習紙，下方指南仍可閱讀。"]
  },
  ja: {
    brand: 'シュルテグリッド', title: 'シュルテグリッド オンライン | 無料タイマー・印刷シート',
    description: '3×3〜6×6のシュルテ表を無料体験。タイマーとA4印刷・PDF保存に対応。ウェブ版は履歴を保存しません。継続的な記録と毎日の目標にはアプリを利用できます。',
    intro: '無料のシュルテ表タイマーと印刷シート。体験用で、練習履歴は保存しません。',
    nav: ['練習', 'ヘルプ', 'サポート', 'プライバシー', '言語'],
    heading: 'オンラインでシュルテグリッドを練習',
    overview: 'シュルテグリッドは、数字をランダムに配置した正方形の表です。1から9、16、25、36まで順に探します。3×3、4×4、5×5、6×6の表、タイマー、印刷シートを登録やダウンロードなしで無料体験できます。ウェブ版は履歴を保存しません。継続的な記録と毎日の目標にはAppleアプリを利用できます。',
    faq: [
      ['オンラインのタイマーはいつ動きますか？', '1を正しく選ぶと計測が始まり、最後の数字で終了します。間違いは記録されますが、順序は進みません。一時停止中は数字が隠れ、停止時間は成績に含まれません。同じ表サイズで結果を比べましょう。'],
      ['どのサイズのシュルテ表を選べばよいですか？', '3×3は9個、4×4は16個、標準の5×5は25個、6×6は36個の数字があります。小さい表から始め、より長い視覚探索の練習をしたいときに大きい表を選べます。'],
      ['無料で印刷やPDF保存はできますか？', 'はい。「印刷」でサイズと1〜20枚を選んで印刷画面を開きます。各シートの配置は異なり、ダークモードでも白いA4用紙になります。ブラウザの印刷画面で「PDFとして保存」を選ぶとPDFを保存できます。'],
      ['ウェブ版は練習結果を保存しますか？', 'いいえ。現在の1回分だけをページのメモリに表示します。新しい練習、再読み込み、ページ移動で結果は破棄されます。履歴、設定、目標をブラウザやサーバーに保存しません。新版を開くと旧版が保存したウェブの記録を削除します。'],
      ['ウェブ版とアプリの違いは何ですか？', 'ウェブ版は短い体験と印刷用です。iPhone、iPad、Macアプリは直近100回の成績を端末内に保存し、毎日の目標と進捗を提供します。現在iCloud同期には対応していません。シュルテ表は練習用で、医療評価や知能向上を保証するものではありません。']
    ],
    faqHeading: 'シュルテグリッドのよくある質問', links: ['シュルテ表とは（英語）', '印刷ガイド（英語）', 'Apple向けアプリ（英語）'],
    ui: ["練習","履歴","印刷","テーマ","システム","クラシック紙","ソフトミント","暖かい砂","夜の集中","墨","時間","次","ミス","新しい練習","一時停止","再開","準備完了","一時停止中","次：{n}","練習完了","もう一度","毎日の練習","サイズ別ベスト","シュルテグリッド App","iPhone、iPad、Macアプリで履歴を保存し、毎日の目標と進捗を確認できます。","アプリを入手","体験用です。結果は保存せず、新しい練習、再読み込み、ページ移動で破棄されます。","表","シート枚数","作り直す","印刷 / PDF","シート","名前","時間","A4プレビュー","練習とシート作成にはJavaScriptを有効にしてください。下のガイドは読めます。"]
  },
  ko: {
    brand: '슐트 그리드', title: '슐트 그리드 온라인 | 무료 타이머와 인쇄 연습지',
    description: '3×3부터 6×6까지 슐트 표를 무료로 체험하고 타이머와 A4 인쇄·PDF 저장을 이용하세요. 웹은 기록을 저장하지 않습니다. 지속적인 기록과 일일 목표는 앱에서 이용하세요.',
    intro: '무료 슐트 표 타이머와 인쇄 연습지. 체험용이며 훈련 기록은 저장하지 않습니다.',
    nav: ['연습', '도움말', '지원', '개인정보', '언어'],
    heading: '온라인 슐트 그리드 연습',
    overview: '슐트 그리드는 숫자가 무작위로 배치된 정사각형 표입니다. 1부터 9, 16, 25 또는 36까지 순서대로 찾습니다. 가입이나 다운로드 없이 3×3, 4×4, 5×5, 6×6 표, 타이머와 인쇄 연습지를 무료로 체험할 수 있습니다. 웹은 훈련 기록을 저장하지 않습니다. 지속적인 기록과 일일 목표는 Apple 앱에서 이용하세요.',
    faq: [
      ['온라인 타이머는 어떻게 작동하나요?', '1을 올바르게 선택하면 시작되고 마지막 숫자에서 멈춥니다. 잘못 누르면 실수로 기록되며 순서는 진행되지 않습니다. 일시 정지 중에는 숫자를 숨기고 정지 시간은 기록에서 제외합니다. 같은 크기의 표끼리 결과를 비교하세요.'],
      ['어떤 크기의 슐트 표를 선택하면 되나요?', '3×3에는 9개, 4×4에는 16개, 기본 5×5에는 25개, 6×6에는 36개 숫자가 있습니다. 작은 표부터 시작하고 더 긴 시각 탐색 연습을 원할 때 큰 표를 선택하세요.'],
      ['무료 인쇄나 PDF 저장이 가능한가요?', '네. 인쇄에서 크기와 1~20장을 선택한 후 인쇄 창을 엽니다. 각 장의 배열은 다르며 다크 모드에서도 흰색 A4 용지를 사용합니다. 브라우저 인쇄 창에서 PDF로 저장을 선택하면 PDF 파일을 저장할 수 있습니다.'],
      ['웹사이트에서 훈련 결과를 저장하나요?', '아니요. 현재 한 번의 결과만 페이지 메모리에 표시합니다. 새 연습, 새로고침, 페이지 이동 시 버립니다. 기록, 설정, 목표를 브라우저 저장소나 서버에 저장하지 않습니다. 새 버전을 열면 이전 웹 버전이 저장한 기록을 삭제합니다.'],
      ['웹사이트와 앱은 어떻게 다른가요?', '웹은 간단한 체험과 인쇄용입니다. iPhone, iPad, Mac 앱은 최근 100회의 결과를 기기에 저장하고 일일 목표와 진행 상황을 제공합니다. 현재 iCloud 동기화는 제공하지 않습니다. 슐트 표는 연습 도구이며 의료 평가나 지능 향상을 보장하지 않습니다.']
    ],
    faqHeading: '슐트 그리드 자주 묻는 질문', links: ['슐트 표 소개 (영어)', '인쇄 가이드 (영어)', 'Apple 기기용 앱 (영어)'],
    ui: ["연습","기록","인쇄","테마","시스템","클래식 종이","소프트 민트","따뜻한 모래","야간 집중","먹","시간","다음","실수","새 연습","일시 정지","계속","준비 완료","일시 정지됨","다음: {n}","연습 완료","다시 연습","일일 연습","크기별 최고","슐트 그리드 App","iPhone, iPad, Mac 앱에서 훈련 기록을 저장하고 일일 목표와 진행 상황을 확인하세요.","앱 다운로드","체험용이며 기록을 저장하지 않습니다. 새 연습, 새로고침, 페이지 이동 시 결과를 버립니다.","표","연습지 수","새 연습지","인쇄 / PDF","연습지","이름","시간","A4 미리보기","연습과 연습지 생성에는 JavaScript를 활성화하세요. 아래 가이드는 읽을 수 있습니다."]
  },
  de: {
    brand: 'Schulte Grid', title: 'Schulte-Tabelle online | Kostenloser Timer & Druckvorlagen',
    description: 'Schulte-Tabellen von 3x3 bis 6x6 kostenlos ausprobieren, mit Timer und A4-Druck/PDF. Die Web-Demo speichert keinen Verlauf. Nutze die App für dauerhafte Trainingsdaten.',
    intro: 'Kostenlose Schulte-Tabellen mit Timer und Druckvorlagen. Nur zum Ausprobieren, ohne gespeicherten Verlauf.',
    nav: ['Üben', 'Hilfe', 'Support', 'Datenschutz', 'Sprache'],
    heading: 'Schulte-Tabellen online üben',
    overview: 'Eine Schulte-Tabelle ist ein quadratisches Raster mit zufällig angeordneten Zahlen. Suche sie aufsteigend von 1 bis 9, 16, 25 oder 36. Probiere 3x3, 4x4, 5x5 und 6x6 mit Timer und Druckvorlagen kostenlos aus, ohne Anmeldung oder Installation. Die Website speichert keinen Verlauf. Die Apple-App bietet dauerhafte Trainingsdaten und Tagesziele.',
    faq: [
      ['Wie funktioniert der Timer?', 'Der Timer startet bei der richtigen Auswahl von 1 und endet bei der letzten Zahl. Falsche Klicks zählen als Fehler und ändern die Reihenfolge nicht. Beim Pausieren werden die Zahlen verborgen und die Pause nicht mitgezählt. Vergleiche Ergebnisse derselben Rastergröße.'],
      ['Welche Rastergröße eignet sich?', '3x3 enthält 9 Zahlen, 4x4 enthält 16, die klassische 5x5-Tabelle enthält 25 und 6x6 enthält 36. Beginne mit einem kleineren Raster und wähle ein größeres für eine längere Übung zur visuellen Suche.'],
      ['Kann ich kostenlos drucken oder als PDF speichern?', 'Ja. Wähle unter Drucken eine Rastergröße und 1 bis 20 Blätter. Jedes Blatt hat eine andere Anordnung auf weißem A4-Papier, auch im Dunkelmodus. Wähle im Druckdialog des Browsers Als PDF speichern.'],
      ['Speichert die Website meine Trainingsergebnisse?', 'Nein. Nur die aktuelle Runde wird im Seitenspeicher angezeigt. Eine neue Runde, Neuladen oder Verlassen der Seite verwirft sie. Verlauf, Einstellungen und Ziele werden weder im Browserspeicher noch auf einem Server gespeichert. Beim Öffnen dieser Version werden gespeicherte Web-Daten der alten Version entfernt.'],
      ['Wie unterscheidet sich die Website von der App?', 'Die Website dient zum Ausprobieren und Drucken. Die App für iPhone, iPad und Mac speichert die letzten 100 Ergebnisse lokal und bietet Tagesziele und Fortschritt. iCloud-Synchronisierung ist derzeit nicht verfügbar. Schulte-Tabellen sind eine Übung, keine medizinische Bewertung oder Garantie für höhere Intelligenz.']
    ],
    faqHeading: 'Fragen zu Schulte-Tabellen', links: ['Was ist eine Schulte-Tabelle? (Englisch)', 'Druckanleitung (Englisch)', 'App für Apple-Geräte (Englisch)'],
    ui: ["Üben","Verlauf","Drucken","Thema","System","Klassisches Papier","Sanfte Minze","Warmer Sand","Nachtfokus","Tusche","Zeit","Nächste","Fehler","Neue Runde","Pause","Fortsetzen","Bereit","Pausiert","Nächste: {n}","Runde beendet","Erneut üben","Tägliche Übung","Bestzeit je Größe","Schulte Grid App","Behalte Trainingsverlauf, Tagesziele und Fortschritt in der App für iPhone, iPad und Mac.","App laden","Nur zum Ausprobieren. Diese Runde wird nicht gespeichert und bei einer neuen Runde, beim Neuladen oder Verlassen verworfen.","Raster","Übungsblätter","Neue Blätter","Drucken / PDF","Blatt","Name","Zeit","A4-Vorschau","Aktiviere JavaScript zum Üben und Erstellen von Blättern. Die Anleitungen unten bleiben verfügbar."]
  },
  fr: {
    brand: 'Grille de Schulte', title: 'Grille de Schulte en ligne | Chronomètre gratuit et fiches',
    description: 'Essayez gratuitement les grilles de Schulte de 3x3 à 6x6 avec chronomètre et fiches A4/PDF. Le site ne garde pas d’historique. Utilisez l’app pour conserver vos progrès.',
    intro: 'Grilles de Schulte gratuites avec chronomètre et fiches imprimables. Démo sans historique enregistré.',
    nav: ['Pratiquer', 'Aide', 'Support', 'Confidentialité', 'Langue'],
    heading: 'Pratiquer la grille de Schulte en ligne',
    overview: 'Une grille de Schulte est un tableau carré de nombres mélangés. Cherchez-les dans l’ordre, de 1 à 9, 16, 25 ou 36. Essayez gratuitement les grilles 3x3, 4x4, 5x5 et 6x6, le chronomètre et les fiches imprimables, sans inscription ni téléchargement. Le site ne conserve pas l’historique. L’app Apple permet de garder vos résultats et vos objectifs quotidiens.',
    faq: [
      ['Comment fonctionne le chronomètre ?', 'Il démarre à la sélection correcte de 1 et s’arrête au dernier nombre. Les erreurs sont comptées sans avancer la séquence. La pause masque les nombres et sa durée est exclue du résultat. Comparez des grilles de même taille.'],
      ['Quelle taille de grille choisir ?', '3x3 contient 9 nombres, 4x4 en contient 16, la grille classique 5x5 en contient 25 et 6x6 en contient 36. Commencez petit, puis choisissez une grille plus grande pour un exercice de recherche visuelle plus long.'],
      ['Puis-je imprimer gratuitement ou enregistrer un PDF ?', 'Oui. Dans Imprimer, choisissez la taille et 1 à 20 fiches. Chaque fiche a une disposition différente sur du papier A4 blanc, même en mode sombre. Choisissez Enregistrer au format PDF dans la fenêtre d’impression du navigateur.'],
      ['Le site enregistre-t-il mes résultats ?', 'Non. Seule la séance en cours est affichée en mémoire. Une nouvelle séance, un rechargement ou une sortie de page la supprime. Aucun historique, réglage ou objectif n’est enregistré dans le navigateur ou sur un serveur. Cette version supprime les anciennes données web lors de son ouverture.'],
      ['Quelle différence entre le site et l’app ?', 'Le site sert à essayer et à imprimer. L’app iPhone, iPad et Mac conserve les 100 derniers résultats sur l’appareil et propose des objectifs quotidiens et un suivi. La synchronisation iCloud n’est pas disponible actuellement. Les grilles sont un exercice, pas une évaluation médicale ni une garantie d’amélioration de l’intelligence.']
    ],
    faqHeading: 'Questions sur les grilles de Schulte', links: ['Qu’est-ce qu’une grille de Schulte ? (anglais)', 'Guide d’impression (anglais)', 'App pour appareils Apple (anglais)'],
    ui: ["Pratiquer","Historique","Imprimer","Thème","Système","Papier classique","Menthe douce","Sable chaud","Focus nocturne","Encre","Temps","Suivant","Erreurs","Nouvelle grille","Pause","Reprendre","Prêt","En pause","Suivant : {n}","Séance terminée","Recommencer","Pratique quotidienne","Records par taille","App Schulte Grid","Conservez votre historique, vos objectifs quotidiens et vos progrès dans l’app iPhone, iPad et Mac.","Obtenir l’app","Démo uniquement. La séance n’est pas enregistrée et disparaît quand vous recommencez, rechargez ou quittez la page.","Grille","Fiches","Nouvelles fiches","Imprimer / PDF","Fiche","Nom","Temps","Aperçu A4","Activez JavaScript pour pratiquer et créer des fiches. Les guides ci-dessous restent disponibles."]
  },
  es: {
    brand: 'Cuadrícula de Schulte', title: 'Tabla de Schulte online | Cronómetro gratis e impresión',
    description: 'Prueba tablas de Schulte gratis de 3x3 a 6x6 con cronómetro e impresión A4/PDF. La demo web no guarda historial. Usa la app para conservar resultados y objetivos diarios.',
    intro: 'Tablas de Schulte gratis con cronómetro y hojas imprimibles. Solo una demo, sin guardar historial.',
    nav: ['Practicar', 'Ayuda', 'Soporte', 'Privacidad', 'Idioma'],
    heading: 'Practicar tablas de Schulte online',
    overview: 'Una tabla de Schulte es una cuadrícula con números mezclados. Encuéntralos en orden ascendente, del 1 al 9, 16, 25 o 36. Prueba gratis las tablas de 3x3, 4x4, 5x5 y 6x6, el cronómetro y las hojas imprimibles sin registro ni descarga. La web no guarda historial. La app de Apple permite conservar resultados y objetivos diarios.',
    faq: [
      ['¿Cómo funciona el cronómetro?', 'Empieza al seleccionar correctamente el 1 y termina en el último número. Los errores se cuentan sin avanzar la secuencia. La pausa oculta los números y su duración no se incluye en el resultado. Compara tablas del mismo tamaño.'],
      ['¿Qué tamaño de tabla debo elegir?', '3x3 tiene 9 números, 4x4 tiene 16, la tabla clásica 5x5 tiene 25 y 6x6 tiene 36. Empieza con una tabla pequeña y elige una mayor cuando quieras una búsqueda visual más larga.'],
      ['¿Puedo imprimir gratis o guardar un PDF?', 'Sí. En Imprimir, elige el tamaño y entre 1 y 20 hojas. Cada hoja tiene una disposición diferente sobre A4 blanco, incluso en modo oscuro. Elige Guardar como PDF en la ventana de impresión del navegador.'],
      ['¿La web guarda mis resultados de entrenamiento?', 'No. Solo se muestra la ronda actual en la memoria de la página. Se descarta al iniciar otra, recargar o salir. No se guardan historial, ajustes ni objetivos en el navegador ni en un servidor. Esta versión elimina los datos guardados por la web anterior al abrirse.'],
      ['¿En qué se diferencian la web y la app?', 'La web sirve para probar e imprimir. La app para iPhone, iPad y Mac guarda localmente los últimos 100 resultados y ofrece objetivos diarios y progreso. Actualmente no ofrece sincronización con iCloud. Las tablas son un ejercicio, no una evaluación médica ni una garantía de mejorar la inteligencia.']
    ],
    faqHeading: 'Preguntas sobre las tablas de Schulte', links: ['¿Qué es una tabla de Schulte? (inglés)', 'Guía de impresión (inglés)', 'App para dispositivos Apple (inglés)'],
    ui: ["Practicar","Historial","Imprimir","Tema","Sistema","Papel clásico","Menta suave","Arena cálida","Enfoque nocturno","Tinta","Tiempo","Siguiente","Errores","Nueva ronda","Pausar","Continuar","Listo","En pausa","Siguiente: {n}","Ronda terminada","Practicar otra vez","Práctica diaria","Mejores por tamaño","App Schulte Grid","Conserva tu historial, objetivos diarios y progreso en la app para iPhone, iPad y Mac.","Obtener la app","Solo una demo. La ronda no se guarda y se descarta al empezar otra, recargar o salir.","Tabla","Hojas","Nuevas hojas","Imprimir / PDF","Hoja","Nombre","Tiempo","Vista previa A4","Activa JavaScript para practicar y crear hojas. Las guías siguen disponibles."]
  }
};
