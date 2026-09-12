/**
 * MiDaTeX PRO - Core Engine & Interactive UI Logic
 * Vanguard UI, KaTeX Typesetting, PDF.js Multi-Page OCR & Self-Healing Multi-Key Gemini Engine
 */

// Application State
const state = {
  mode: localStorage.getItem('math2latex_mode') || 'standard', // 'standard' | 'pro'
  activeEngine: localStorage.getItem('math2latex_engine') || 'gemini',
  currentImageBase64: null,
  currentFileName: 'de_toan',
  cropper: null,
  activeTab: 'code', // 'code', 'preview', 'split'
  fontSize: 16.5,
  isConverting: false,
  theme: localStorage.getItem('math2latex_theme') || 'dark',
  mobileView: 'source', // 'source' | 'code' | 'preview'

  // PDF.js State for Pro Mode
  pdfDoc: null,
  pdfTotalPages: 0,
  pdfCurrentPage: 1,
  pdfPageRendering: false,
  pdfPendingPage: null,
  pdfScale: 2.2,
  pdfFile: null
};

// Application Elements Map
let el = {};

document.addEventListener('DOMContentLoaded', () => {
  initElements();
  loadSettings();
  setupEventListeners();
  applyModeUI();
  initMobileView();
  updateWorkspaceView();
  updateApiStatusIndicator();
  renderMathToolbarSymbols();
  renderLatexPreview();
  initTheme();
  initPageAds();
});

function initElements() {
  el = {
    // Mode Switcher
    modeStandardBtn: document.getElementById('modeStandardBtn'),
    modeProBtn: document.getElementById('modeProBtn'),
    leftPanelTitle: document.getElementById('leftPanelTitle'),
    pasteHintChip: document.getElementById('pasteHintChip'),
    docTypeSelect: document.getElementById('docTypeSelect'),
    apiStatusDot: document.getElementById('apiStatusDot'),

    // Mobile View Navigation
    mobileViewNav: document.getElementById('mobileViewNav'),
    mobileNavSourceBtn: document.getElementById('mobileNavSourceBtn'),
    mobileNavCodeBtn: document.getElementById('mobileNavCodeBtn'),
    mobileNavPreviewBtn: document.getElementById('mobileNavPreviewBtn'),
    mobileCodeBadge: document.getElementById('mobileCodeBadge'),
    leftPanel: document.getElementById('leftPanel'),
    rightPanel: document.getElementById('rightPanel'),

    // Dropzone & File Input
    dropZone: document.getElementById('dropZone'),
    fileInput: document.getElementById('fileInput'),
    uploadPrompt: document.getElementById('uploadPrompt'),
    uploadPromptText: document.getElementById('uploadPromptText'),
    uploadPromptSub: document.getElementById('uploadPromptSub'),
    uploadMainIcon: document.getElementById('uploadMainIcon'),

    // Standard Image Preview & Tools
    imagePreviewContainer: document.getElementById('imagePreviewContainer'),
    previewImg: document.getElementById('previewImg'),
    quickCropBtn: document.getElementById('quickCropBtn'),
    quickRotateBtn: document.getElementById('quickRotateBtn'),
    quickDeleteBtn: document.getElementById('quickDeleteBtn'),
    imageToolsBar: document.getElementById('imageToolsBar'),
    cropToggleBtn: document.getElementById('cropToggleBtn'),
    rotateBtn: document.getElementById('rotateBtn'),
    clearImageBtn: document.getElementById('clearImageBtn'),
    samplePresetsContainer: document.getElementById('samplePresetsContainer'),
    customNotes: document.getElementById('customNotes'),

    // Dedicated Crop Modal Elements
    cropModal: document.getElementById('cropModal'),
    cropModalImg: document.getElementById('cropModalImg'),
    closeCropModalBtn: document.getElementById('closeCropModalBtn'),
    cropCancelModalBtn: document.getElementById('cropCancelModalBtn'),
    cropConfirmModalBtn: document.getElementById('cropConfirmModalBtn'),
    cropZoomInBtn: document.getElementById('cropZoomInBtn'),
    cropZoomOutBtn: document.getElementById('cropZoomOutBtn'),
    cropRotateLeftBtn: document.getElementById('cropRotateLeftBtn'),
    cropRotateRightBtn: document.getElementById('cropRotateRightBtn'),
    cropResetBtn: document.getElementById('cropResetBtn'),

    // Pro PDF Viewer & Controls
    pdfViewerContainer: document.getElementById('pdfViewerContainer'),
    pdfFileName: document.getElementById('pdfFileName'),
    pdfPageStats: document.getElementById('pdfPageStats'),
    removePdfBtn: document.getElementById('removePdfBtn'),
    pdfPrevPageBtn: document.getElementById('pdfPrevPageBtn'),
    pdfNextPageBtn: document.getElementById('pdfNextPageBtn'),
    pdfPageInput: document.getElementById('pdfPageInput'),
    pdfTotalPagesLabel: document.getElementById('pdfTotalPagesLabel'),
    pdfCanvas: document.getElementById('pdfCanvas'),
    convertCurrentPageBtn: document.getElementById('convertCurrentPageBtn'),
    convertAllPdfBtn: document.getElementById('convertAllPdfBtn'),

    // Main Convert Trigger (Standard Mode)
    convertBtn: document.getElementById('convertBtn'),
    convertBtnText: document.getElementById('convertBtnText'),
    convertBtnIcon: document.getElementById('convertBtnIcon'),
    convertSpinner: document.getElementById('convertSpinner'),

    // Progress Bar
    progressContainer: document.getElementById('progressContainer'),
    progressStatus: document.getElementById('progressStatus'),
    progressPercent: document.getElementById('progressPercent'),
    progressBar: document.getElementById('progressBar'),
    progressIcon: document.getElementById('progressIcon'),
    step1: document.getElementById('step1'),
    step2: document.getElementById('step2'),
    step3: document.getElementById('step3'),
    step4: document.getElementById('step4'),

    // Quick Insert Toolbar
    quickInsertToolbar: document.getElementById('quickInsertToolbar'),

    // Code & Preview Tabs
    tabCodeBtn: document.getElementById('tabCodeBtn'),
    tabPreviewBtn: document.getElementById('tabPreviewBtn'),
    tabSplitBtn: document.getElementById('tabSplitBtn'),
    codeViewContainer: document.getElementById('codeViewContainer'),
    previewViewContainer: document.getElementById('previewViewContainer'),
    workspaceArea: document.getElementById('workspaceArea'),
    latexEditor: document.getElementById('latexEditor'),
    renderOutput: document.getElementById('renderOutput'),
    charCount: document.getElementById('charCount'),
    texFileNameInput: document.getElementById('texFileNameInput'),

    // Export & Action Buttons
    copyLatexBtn: document.getElementById('copyLatexBtn'),
    copyBtnText: document.getElementById('copyBtnText'),
    downloadTexBtn: document.getElementById('downloadTexBtn'),
    openOverleafBtn: document.getElementById('openOverleafBtn'),
    clearCodeBtn: document.getElementById('clearCodeBtn'),
    zoomInBtn: document.getElementById('zoomInBtn'),
    zoomOutBtn: document.getElementById('zoomOutBtn'),
    printPreviewBtn: document.getElementById('printPreviewBtn'),
    overleafForm: document.getElementById('overleafForm'),
    overleafSnipInput: document.getElementById('overleafSnipInput'),

    // Settings Modal
    openSettingsBtn: document.getElementById('openSettingsBtn'),
    closeSettingsBtn: document.getElementById('closeSettingsBtn'),
    settingsModal: document.getElementById('settingsModal'),
    saveSettingsBtn: document.getElementById('saveSettingsBtn'),
    geminiKeysContainer: document.getElementById('geminiKeysContainer'),
    addApiKeyBtn: document.getElementById('addApiKeyBtn'),
    geminiModelSelect: document.getElementById('geminiModelSelect'),


    // Guide Modal
    openGuideBtn: document.getElementById('openGuideBtn'),
    closeGuideBtn: document.getElementById('closeGuideBtn'),
    guideModal: document.getElementById('guideModal'),
    guideGotItBtn: document.getElementById('guideGotItBtn'),

    // Pro Google Ads Modal (Phương án 2)
    proAdModal: document.getElementById('proAdModal'),
    closeProAdModalBtn: document.getElementById('closeProAdModalBtn'),
    cancelProAdBtn: document.getElementById('cancelProAdBtn'),
    confirmProUnlockBtn: document.getElementById('confirmProUnlockBtn'),
    proAdCountdownText: document.getElementById('proAdCountdownText'),
    proAdCountdownIcon: document.getElementById('proAdCountdownIcon'),
    proAdFallback: document.getElementById('proAdFallback'),

    // Toast
    toastContainer: document.getElementById('toastContainer'),

    // Theme Toggle
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    themeIcon: document.getElementById('themeIcon')
  };
}

// ==========================================================================
// Mode Switcher (Standard vs Pro)
// ==========================================================================
function setMode(mode) {
  state.mode = mode;
  localStorage.setItem('math2latex_mode', mode);
  applyModeUI();
  showToast(`Đã chuyển sang chế độ ${mode === 'pro' ? 'Pro (Hỗ trợ PDF & Tài liệu)' : 'Standard (Ảnh đề toán)'}`, 'info');
}

function applyModeUI() {
  const isPro = state.mode === 'pro';
  setFilePickerEnabled(!(isPro && state.pdfDoc));

  if (isPro) {
    el.modeProBtn?.classList.add('active');
    el.modeStandardBtn?.classList.remove('active');
    if (el.fileInput) el.fileInput.accept = '.pdf,image/*';
    if (el.leftPanelTitle) el.leftPanelTitle.textContent = 'Nạp tài liệu & đề thi (PDF / Ảnh)';
    if (el.uploadMainIcon) el.uploadMainIcon.className = 'fa-solid fa-file-pdf text-xl text-pen';
    if (el.uploadPromptText) {
      el.uploadPromptText.innerHTML = 'Kéo &amp; thả tệp <strong class="text-pen font-bold">PDF</strong> hoặc ảnh đề thi vào đây, hoặc <span class="text-gold underline decoration-gold/40 underline-offset-4 group-hover:decoration-gold">chọn tệp</span>';
    }
    if (el.uploadPromptSub) {
      el.uploadPromptSub.textContent = 'Hỗ trợ tệp PDF nhiều trang & ảnh độ phân giải cao';
    }

    if (state.pdfDoc) {
      el.pdfViewerContainer?.classList.remove('hidden');
      el.pdfViewerContainer?.classList.add('flex');
      el.uploadPrompt?.classList.add('hidden');
      el.imagePreviewContainer?.classList.add('hidden');
      el.imageToolsBar?.classList.add('hidden');
      el.convertBtn?.classList.add('hidden');
    }
  } else {
    el.modeStandardBtn?.classList.add('active');
    el.modeProBtn?.classList.remove('active');
    if (el.fileInput) el.fileInput.accept = 'image/*';
    if (el.leftPanelTitle) el.leftPanelTitle.textContent = 'Nạp ảnh đề toán';
    if (el.uploadMainIcon) el.uploadMainIcon.className = 'fa-solid fa-cloud-arrow-up text-xl text-gold';
    if (el.uploadPromptText) {
      el.uploadPromptText.innerHTML = 'Kéo &amp; thả ảnh đề thi vào đây, hoặc <span class="text-gold underline decoration-gold/40 underline-offset-4 group-hover:decoration-gold">chọn tệp</span>';
    }
    if (el.uploadPromptSub) {
      el.uploadPromptSub.textContent = 'PNG, JPG, JPEG, WEBP — kể cả ảnh chụp màn hình';
    }

    el.pdfViewerContainer?.classList.add('hidden');
    el.pdfViewerContainer?.classList.remove('flex');
    el.convertBtn?.classList.remove('hidden');

    if (state.currentImageBase64) {
      el.imagePreviewContainer?.classList.remove('hidden');
      el.imageToolsBar?.classList.remove('hidden');
      el.uploadPrompt?.classList.add('hidden');
    } else {
      el.uploadPrompt?.classList.remove('hidden');
    }
  }
}

// ==========================================================================
// Google AdSense Management (Page Banners & Pro Unlock Modal)
// ==========================================================================
let proAdTimer = null;

function initPageAds() {
  try {
    // Kích hoạt nạp quảng cáo cho các banner trên trang (Header & Footer)
    const ads = document.querySelectorAll('ins.adsbygoogle:not([data-ad-status])');
    ads.forEach(() => {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    });
  } catch (err) {
    console.warn('[MiDaTeX Ads] Lỗi nạp banner quảng cáo trang:', err);
  }
}

function handleProModeClick() {
  if (state.mode === 'pro') {
    showToast('Bạn đang ở chế độ Pro (Hỗ trợ PDF & Tài liệu)', 'info');
    return;
  }
  openProAdModal();
}

function openProAdModal() {
  if (!el.proAdModal) {
    setMode('pro');
    return;
  }

  el.proAdModal.classList.remove('hidden');
  el.proAdModal.classList.add('flex');

  // Nạp quảng cáo bên trong modal nếu chưa nạp
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (err) {
    console.warn('[MiDaTeX Ads] Lỗi nạp quảng cáo trong modal:', err);
  }

  // Tự động ẩn Fallback placeholder nếu thẻ quảng cáo thực tế đã tải thành công
  setTimeout(() => {
    const ins = el.proAdModal?.querySelector('ins.adsbygoogle');
    if (ins && (ins.getAttribute('data-ad-status') === 'filled' || ins.querySelector('iframe'))) {
      if (el.proAdFallback) el.proAdFallback.style.display = 'none';
    }
  }, 1200);

  // Đếm ngược 5 giây mở khóa
  let countdown = 5;
  if (el.confirmProUnlockBtn) {
    el.confirmProUnlockBtn.disabled = true;
    el.confirmProUnlockBtn.className = 'btn-pro-unlock-disabled text-xs py-2 px-4 rounded-lg flex items-center gap-2 font-semibold';
  }
  if (el.proAdCountdownText) el.proAdCountdownText.textContent = `Chờ ${countdown}s...`;
  if (el.proAdCountdownIcon) el.proAdCountdownIcon.className = 'fa-solid fa-lock text-xs';

  clearInterval(proAdTimer);
  proAdTimer = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      if (el.proAdCountdownText) el.proAdCountdownText.textContent = `Chờ ${countdown}s...`;
    } else {
      clearInterval(proAdTimer);
      if (el.confirmProUnlockBtn) {
        el.confirmProUnlockBtn.disabled = false;
        el.confirmProUnlockBtn.className = 'btn-pro-unlock-active text-xs py-2 px-4 rounded-lg flex items-center gap-2 font-bold shadow-md animate-pulse';
      }
      if (el.proAdCountdownText) el.proAdCountdownText.textContent = 'Mở Khóa Chế Độ Pro Ngay';
      if (el.proAdCountdownIcon) el.proAdCountdownIcon.className = 'fa-solid fa-unlock text-xs text-board-950';
    }
  }, 1000);
}

function closeProAdModal() {
  clearInterval(proAdTimer);
  if (el.proAdModal) {
    el.proAdModal.classList.add('hidden');
    el.proAdModal.classList.remove('flex');
  }
}

function unlockProMode() {
  closeProAdModal();
  sessionStorage.setItem('midatex_pro_unlocked', 'true');
  setMode('pro');
  showToast('🎉 Đã mở khóa và kích hoạt thành công chế độ Pro!', 'success');
}

// The upload input is layered over the drop zone. Disable it while a PDF is
// open so it cannot intercept clicks intended for the PDF controls beneath it.
function setFilePickerEnabled(isEnabled) {
  const fileInput = el.fileInput;
  if (!fileInput) return;

  fileInput.disabled = !isEnabled;
  fileInput.classList.toggle('is-inactive', !isEnabled);
  fileInput.tabIndex = isEnabled ? 0 : -1;
  fileInput.setAttribute('aria-hidden', String(!isEnabled));
}

// ==========================================================================
// Mobile Segmented View Controller (< 1024px)
// ==========================================================================
function initMobileView() {
  if (window.innerWidth < 1024) {
    setMobileView(state.mobileView || 'source');
  }
}

function setMobileView(view) {
  state.mobileView = view;
  const isMobile = window.innerWidth < 1024;

  [el.mobileNavSourceBtn, el.mobileNavCodeBtn, el.mobileNavPreviewBtn].forEach(b => b?.classList.remove('active'));

  if (view === 'source') {
    el.mobileNavSourceBtn?.classList.add('active');
    if (isMobile) {
      el.leftPanel?.classList.remove('hidden');
      el.rightPanel?.classList.add('hidden');
    }
  } else if (view === 'code') {
    el.mobileNavCodeBtn?.classList.add('active');
    if (isMobile) {
      el.leftPanel?.classList.add('hidden');
      el.rightPanel?.classList.remove('hidden');
    }
    switchTab('code');
  } else if (view === 'preview') {
    el.mobileNavPreviewBtn?.classList.add('active');
    if (isMobile) {
      el.leftPanel?.classList.add('hidden');
      el.rightPanel?.classList.remove('hidden');
    }
    switchTab('preview');
  }
}

function handleWindowResize() {
  if (window.innerWidth >= 1024) {
    el.leftPanel?.classList.remove('hidden');
    el.rightPanel?.classList.remove('hidden');
  } else {
    setMobileView(state.mobileView || 'source');
  }
}

// ==========================================================================
// Settings Modal & Dynamic Multi-API Key Management
// ==========================================================================
function loadSettings() {
  let keys = [];
  try {
    const raw = localStorage.getItem('math2latex_gemini_keys');
    if (raw) {
      keys = JSON.parse(raw);
    }
  } catch (_) {}

  // Fallback to legacy single key if array is empty
  if (!Array.isArray(keys) || keys.length === 0) {
    const legacyKey = localStorage.getItem('math2latex_gemini_key');
    const legacyBackup = localStorage.getItem('math2latex_gemini_backup_key');
    if (legacyKey) keys.push(legacyKey);
    if (legacyBackup && legacyBackup !== legacyKey) keys.push(legacyBackup);
  }

  // Ensure default backup key exists if nothing configured
  if (keys.length === 0) {
    keys.push('');
  }

  renderApiKeyInputs(keys);

  let savedModel = localStorage.getItem('math2latex_gemini_model');
  if (!savedModel || savedModel === 'gemini-3.7-flash') {
    savedModel = 'gemini-3.8-flash';
    localStorage.setItem('math2latex_gemini_model', 'gemini-3.8-flash');
  }
  if (el.geminiModelSelect) el.geminiModelSelect.value = savedModel;
}

function renderApiKeyInputs(keysArray) {
  if (!el.geminiKeysContainer) return;
  el.geminiKeysContainer.innerHTML = '';

  const list = keysArray.length > 0 ? keysArray : [''];
  list.forEach((keyVal, idx) => {
    addApiKeyRow(keyVal, idx, list.length);
  });
}

function addApiKeyRow(value = '', index = 0, totalCount = 1) {
  if (!el.geminiKeysContainer) return;

  const row = document.createElement('div');
  row.className = 'api-key-row flex items-center gap-2 p-1.5 rounded-lg';

  const isPrimary = index === 0;
  const badgeClass = isPrimary ? 'key-badge key-badge-primary text-[10px]' : 'key-badge key-badge-backup text-[10px]';
  const badgeFull = isPrimary ? 'Key #1 (Chính)' : `Key #${index + 1} (Dự phòng)`;
  const badgeShort = `#${index + 1}`;

  row.innerHTML = `
    <span class="${badgeClass}"><span class="sm:hidden">${badgeShort}</span><span class="hidden sm:inline">${badgeFull}</span></span>
    <div class="relative flex-1">
      <input type="password" class="gemini-key-input field font-mono pr-8 text-xs py-1.5" placeholder="${isPrimary ? 'AIzaSy... (Khóa chính)' : 'AIzaSy... hoặc AQ.Ab8... (Khóa dự phòng)'}" value="${value || ''}">
      <button type="button" class="toggle-pwd-btn absolute right-2 top-1/2 -translate-y-1/2 text-chalk-faint hover:text-gold text-xs transition-colors" title="Hiện/Ẩn Key">
        <i class="fa-solid fa-eye-slash"></i>
      </button>
    </div>
    <button type="button" class="delete-key-btn icon-btn text-xs text-pen hover:text-pen-600 ${totalCount <= 1 && isPrimary ? 'opacity-30 cursor-not-allowed pointer-events-none' : ''}" title="Xóa API Key này">
      <i class="fa-regular fa-trash-can"></i>
    </button>
  `;

  // Password visibility toggle
  const pwdInput = row.querySelector('.gemini-key-input');
  const toggleBtn = row.querySelector('.toggle-pwd-btn');
  toggleBtn?.addEventListener('click', () => {
    if (pwdInput.type === 'password') {
      pwdInput.type = 'text';
      toggleBtn.innerHTML = '<i class="fa-solid fa-eye text-gold"></i>';
    } else {
      pwdInput.type = 'password';
      toggleBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    }
  });

  // Delete row button
  const delBtn = row.querySelector('.delete-key-btn');
  delBtn?.addEventListener('click', () => {
    row.remove();
    reindexApiKeyRows();
  });

  el.geminiKeysContainer.appendChild(row);
}

function reindexApiKeyRows() {
  if (!el.geminiKeysContainer) return;
  const rows = el.geminiKeysContainer.querySelectorAll('.api-key-row');
  
  if (rows.length === 0) {
    addApiKeyRow('', 0, 1);
    return;
  }

  rows.forEach((r, idx) => {
    const isPrimary = idx === 0;
    const badge = r.querySelector('.key-badge');
    const delBtn = r.querySelector('.delete-key-btn');

    if (badge) {
      badge.className = isPrimary ? 'key-badge key-badge-primary text-[10px]' : 'key-badge key-badge-backup text-[10px]';
      const label = isPrimary ? 'Key #1 (Chính)' : `Key #${idx + 1} (Dự phòng)`;
      badge.innerHTML = `<span class="sm:hidden">#${idx + 1}</span><span class="hidden sm:inline">${label}</span>`;
    }

    if (delBtn) {
      if (rows.length === 1) {
        delBtn.classList.add('opacity-30', 'cursor-not-allowed', 'pointer-events-none');
      } else {
        delBtn.classList.remove('opacity-30', 'cursor-not-allowed', 'pointer-events-none');
      }
    }
  });
}

function getSavedApiKeys() {
  if (!el.geminiKeysContainer) return [];
  const inputs = el.geminiKeysContainer.querySelectorAll('.gemini-key-input');
  const keys = [];
  inputs.forEach(inp => {
    const val = inp.value.trim();
    if (val) keys.push(val);
  });
  return keys;
}

function saveSettings() {
  const keys = getSavedApiKeys();
  const geminiModel = el.geminiModelSelect?.value || 'gemini-3.8-flash';

  localStorage.setItem('math2latex_gemini_keys', JSON.stringify(keys));
  localStorage.setItem('math2latex_gemini_key', keys[0] || '');
  localStorage.setItem('math2latex_gemini_backup_key', keys[1] || '');
  localStorage.setItem('math2latex_gemini_model', geminiModel);

  updateApiStatusIndicator();
  el.settingsModal?.classList.add('hidden');
  showToast(`Đã lưu cấu hình với ${keys.length} API Key sẵn sàng!`, 'success');
}

function updateApiStatusIndicator() {
  const keys = getSavedApiKeys();
  const legacyKey = localStorage.getItem('math2latex_gemini_key') || '';
  const hasKey = keys.length > 0 || legacyKey.length > 5;

  if (el.apiStatusDot) {
    if (hasKey) {
      el.apiStatusDot.className = 'w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30';
      el.apiStatusDot.title = `Đã cấu hình ${keys.length || 1} Gemini API Key`;
    } else {
      el.apiStatusDot.className = 'w-2 h-2 rounded-full bg-amber-400 ring-2 ring-amber-400/30';
      el.apiStatusDot.title = 'Chưa cấu hình Gemini API Key';
    }
  }
}

// ==========================================================================
// Setup Event Listeners
// ==========================================================================
function setupEventListeners() {
  // Mobile Navigation Switcher
  el.mobileNavSourceBtn?.addEventListener('click', () => setMobileView('source'));
  el.mobileNavCodeBtn?.addEventListener('click', () => setMobileView('code'));
  el.mobileNavPreviewBtn?.addEventListener('click', () => setMobileView('preview'));
  window.addEventListener('resize', handleWindowResize);

  // Mode Switcher
  el.modeStandardBtn?.addEventListener('click', () => setMode('standard'));
  el.modeProBtn?.addEventListener('click', handleProModeClick);

  // File Upload Handlers
  el.fileInput?.addEventListener('change', handleFileSelect);

  // Drag & Drop Handling
  ['dragenter', 'dragover'].forEach(eventName => {
    el.dropZone?.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      el.dropZone.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    el.dropZone?.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      el.dropZone.classList.remove('drag-over');
    });
  });

  el.dropZone?.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processSelectedFile(files[0]);
    }
  });

  // Global Clipboard Paste (Ctrl + V)
  window.addEventListener('paste', (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (let item of items) {
      if (item.kind === 'file') {
        const blob = item.getAsFile();
        if (blob) {
          processSelectedFile(blob);
          showToast('Đã dán ảnh từ Clipboard!', 'success');
          break;
        }
      }
    }
  });

  // Image Manipulation Tools & Modal
  el.cropToggleBtn?.addEventListener('click', openCropModal);
  el.quickCropBtn?.addEventListener('click', openCropModal);
  el.closeCropModalBtn?.addEventListener('click', closeCropModal);
  el.cropCancelModalBtn?.addEventListener('click', closeCropModal);
  el.cropConfirmModalBtn?.addEventListener('click', applyCropModal);
  el.cropModal?.addEventListener('click', (e) => {
    if (e.target === el.cropModal) closeCropModal();
  });

  el.cropZoomInBtn?.addEventListener('click', () => state.cropper?.zoom(0.1));
  el.cropZoomOutBtn?.addEventListener('click', () => state.cropper?.zoom(-0.1));
  el.cropRotateLeftBtn?.addEventListener('click', () => state.cropper?.rotate(-90));
  el.cropRotateRightBtn?.addEventListener('click', () => state.cropper?.rotate(90));
  el.cropResetBtn?.addEventListener('click', () => state.cropper?.reset());

  window.addEventListener('keydown', (e) => {
    const isProAdModalOpen = el.proAdModal && !el.proAdModal.classList.contains('hidden');
    if (isProAdModalOpen) {
      if (e.key === 'Escape') {
        closeProAdModal();
        return;
      }
    }
    const isCropModalOpen = el.cropModal && !el.cropModal.classList.contains('hidden');
    if (isCropModalOpen) {
      if (e.key === 'Escape') {
        closeCropModal();
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        applyCropModal();
      }
    } else {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isTyping = activeTag === 'input' || activeTag === 'textarea' || document.activeElement?.isContentEditable;
      if (!isTyping && state.currentImageBase64) {
        if (e.key === 'c' || e.key === 'C') {
          e.preventDefault();
          openCropModal();
        } else if (e.key === 'r' || e.key === 'R') {
          e.preventDefault();
          rotateImage();
        }
      }
    }
  });

  el.rotateBtn?.addEventListener('click', rotateImage);
  el.quickRotateBtn?.addEventListener('click', rotateImage);
  el.clearImageBtn?.addEventListener('click', clearLoadedMedia);
  el.quickDeleteBtn?.addEventListener('click', clearLoadedMedia);

  // PDF Viewer Navigation (Pro mode)
  el.removePdfBtn?.addEventListener('click', clearLoadedMedia);
  el.pdfPrevPageBtn?.addEventListener('click', () => {
    if (state.pdfDoc && state.pdfCurrentPage > 1) {
      state.pdfCurrentPage--;
      renderPdfPage(state.pdfCurrentPage);
    }
  });
  el.pdfNextPageBtn?.addEventListener('click', () => {
    if (state.pdfDoc && state.pdfCurrentPage < state.pdfTotalPages) {
      state.pdfCurrentPage++;
      renderPdfPage(state.pdfCurrentPage);
    }
  });
  el.pdfPageInput?.addEventListener('change', (e) => {
    let val = parseInt(e.target.value, 10);
    if (state.pdfDoc && !isNaN(val)) {
      val = Math.max(1, Math.min(state.pdfTotalPages, val));
      state.pdfCurrentPage = val;
      renderPdfPage(val);
    }
  });

  // Pro PDF Conversion Triggers
  el.convertCurrentPageBtn?.addEventListener('click', handleConvertPdfCurrentPage);
  el.convertAllPdfBtn?.addEventListener('click', handleConvertPdfAllPages);

  // Math Toolbar Fast Insertion Buttons
  document.querySelectorAll('.math-tool-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const latex = btn.dataset.latex;
      if (latex) insertLatexAtCursor(latex);
    });
  });

  // Convert Trigger (Standard mode)
  el.convertBtn?.addEventListener('click', handleConvert);

  // Tab View Switcher
  el.tabCodeBtn?.addEventListener('click', () => switchTab('code'));
  el.tabPreviewBtn?.addEventListener('click', () => switchTab('preview'));
  el.tabSplitBtn?.addEventListener('click', () => switchTab('split'));

  // Live Editor Event
  el.latexEditor?.addEventListener('input', () => {
    updateEditorStats();
    renderLatexPreview();
  });

  // Filename input
  el.texFileNameInput?.addEventListener('input', (e) => {
    state.currentFileName = e.target.value.trim() || 'de_toan';
  });

  // Export Actions
  el.copyLatexBtn?.addEventListener('click', copyLatexCode);
  el.downloadTexBtn?.addEventListener('click', downloadTexFile);
  el.openOverleafBtn?.addEventListener('click', openInOverleaf);
  el.clearCodeBtn?.addEventListener('click', () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ mã LaTeX?')) {
      el.latexEditor.value = '';
      updateEditorStats();
      renderLatexPreview();
    }
  });

  // Zoom & Print Controls
  el.zoomInBtn?.addEventListener('click', () => {
    state.fontSize = Math.min(26, state.fontSize + 2);
    el.renderOutput.style.fontSize = `${state.fontSize}px`;
  });
  el.zoomOutBtn?.addEventListener('click', () => {
    state.fontSize = Math.max(13, state.fontSize - 2);
    el.renderOutput.style.fontSize = `${state.fontSize}px`;
  });
  el.printPreviewBtn?.addEventListener('click', () => window.print());


  // Settings Modal Handlers
  el.openSettingsBtn?.addEventListener('click', () => el.settingsModal?.classList.remove('hidden'));
  el.closeSettingsBtn?.addEventListener('click', () => el.settingsModal?.classList.add('hidden'));
  el.settingsModal?.addEventListener('click', (e) => {
    if (e.target === el.settingsModal) el.settingsModal?.classList.add('hidden');
  });
  el.saveSettingsBtn?.addEventListener('click', saveSettings);
  el.addApiKeyBtn?.addEventListener('click', () => {
    const count = el.geminiKeysContainer?.querySelectorAll('.api-key-row').length || 0;
    addApiKeyRow('', count, count + 1);
    reindexApiKeyRows();
  });

  // Guide Modal Handlers
  el.openGuideBtn?.addEventListener('click', () => el.guideModal?.classList.remove('hidden'));
  el.closeGuideBtn?.addEventListener('click', () => el.guideModal?.classList.add('hidden'));
  el.guideGotItBtn?.addEventListener('click', () => el.guideModal?.classList.add('hidden'));
  el.guideModal?.addEventListener('click', (e) => {
    if (e.target === el.guideModal) el.guideModal?.classList.add('hidden');
  });

  // Pro Google Ads Modal Handlers (Phương án 2)
  el.closeProAdModalBtn?.addEventListener('click', closeProAdModal);
  el.cancelProAdBtn?.addEventListener('click', closeProAdModal);
  el.confirmProUnlockBtn?.addEventListener('click', unlockProMode);
  el.proAdModal?.addEventListener('click', (e) => {
    if (e.target === el.proAdModal) closeProAdModal();
  });

  // Theme Toggle
  el.themeToggleBtn?.addEventListener('click', toggleTheme);
}

// Render Math Symbols in Toolbar using KaTeX
function renderMathToolbarSymbols() {
  if (window.renderMathInElement && el.quickInsertToolbar) {
    try {
      window.renderMathInElement(el.quickInsertToolbar, {
        delimiters: [
          { left: '$', right: '$', display: false }
        ],
        macros: KATEX_MATH_MACROS,
        throwOnError: false
      });
    } catch (e) {
      console.warn('Toolbar KaTeX notice:', e);
    }
  }
}

// ==========================================================================
// Theme Toggle (Light / Dark Mode)
// ==========================================================================
function initTheme() {
  applyTheme(state.theme);
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('math2latex_theme', state.theme);
  applyTheme(state.theme);
}

function applyTheme(theme) {
  const html = document.documentElement;
  if (theme === 'dark') {
    html.classList.add('dark');
    if (el.themeIcon) el.themeIcon.className = 'fa-solid fa-moon text-sm';
  } else {
    html.classList.remove('dark');
    if (el.themeIcon) el.themeIcon.className = 'fa-solid fa-sun text-sm';
  }
}

// ==========================================================================
// File Selection & Media Processing (Image & PDF)
// ==========================================================================
function handleFileSelect(e) {
  const files = e.target.files;
  if (files && files.length > 0) {
    processSelectedFile(files[0]);
  }
}

function processSelectedFile(file) {
  // Extract filename
  const rawName = file.name || 'de_toan';
  const cleanName = rawName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
  state.currentFileName = cleanName || 'de_toan';
  if (el.texFileNameInput) el.texFileNameInput.value = state.currentFileName;

  if (file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf')) {
    // Switch to Pro mode automatically if user dropped a PDF
    if (state.mode !== 'pro') {
      setMode('pro');
    }
    loadPdfDocument(file);
  } else if (file.type.startsWith('image/')) {
    processImageFile(file);
  } else {
    showToast('Vui lòng chọn tệp hình ảnh (PNG, JPG, WEBP) hoặc tệp PDF!', 'error');
  }
}

function processImageFile(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    setImageSrc(event.target.result);
  };
  reader.readAsDataURL(file);
}

function setImageSrc(dataUrl, showNotice = true) {
  state.currentImageBase64 = dataUrl;
  state.pdfDoc = null;
  state.pdfFile = null;
  setFilePickerEnabled(false);

  el.previewImg.src = dataUrl;
  el.uploadPrompt?.classList.add('hidden');
  el.pdfViewerContainer?.classList.add('hidden');
  el.pdfViewerContainer?.classList.remove('flex');
  el.imagePreviewContainer?.classList.remove('hidden');
  el.imageToolsBar?.classList.remove('hidden');
  el.convertBtn?.classList.remove('hidden');

  if (state.cropper) {
    try { state.cropper.destroy(); } catch (_) {}
    state.cropper = null;
  }
  if (showNotice) {
    showToast('Đã nạp ảnh bài toán.', 'info');
  }
}

// ==========================================================================
// PDF.js Integration for Pro Mode
// ==========================================================================
async function loadPdfDocument(file) {
  state.pdfFile = file;
  state.currentImageBase64 = null;

  if (typeof pdfjsLib === 'undefined') {
    showToast('Thư viện PDF.js đang được tải, vui lòng thử lại sau giây lát!', 'error');
    return;
  }

  showToast('Đang tải và dựng cấu trúc tài liệu PDF...', 'info');

  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    state.pdfDoc = pdf;
    state.pdfTotalPages = pdf.numPages;
    state.pdfCurrentPage = 1;
    setFilePickerEnabled(false);

    if (el.pdfFileName) el.pdfFileName.textContent = file.name;
    if (el.pdfPageStats) el.pdfPageStats.textContent = `Tổng số ${pdf.numPages} trang`;
    if (el.pdfPageInput) {
      el.pdfPageInput.max = pdf.numPages;
      el.pdfPageInput.value = 1;
    }
    if (el.pdfTotalPagesLabel) el.pdfTotalPagesLabel.textContent = `/ ${pdf.numPages}`;

    // Switch view to PDF inspector
    el.uploadPrompt?.classList.add('hidden');
    el.imagePreviewContainer?.classList.add('hidden');
    el.imageToolsBar?.classList.add('hidden');
    el.convertBtn?.classList.add('hidden');
    el.pdfViewerContainer?.classList.remove('hidden');
    el.pdfViewerContainer?.classList.add('flex');

    await renderPdfPage(1);
    showToast(`Đã nạp tệp PDF: ${file.name} (${pdf.numPages} trang)`, 'success');
  } catch (err) {
    console.error('Error loading PDF:', err);
    showToast(`Không thể đọc tệp PDF: ${err.message}`, 'error');
  }
}

async function renderPdfPage(pageNum) {
  if (!state.pdfDoc) return;

  if (state.pdfPageRendering) {
    state.pdfPendingPage = pageNum;
    return;
  }

  state.pdfPageRendering = true;
  if (el.pdfPageInput) el.pdfPageInput.value = pageNum;

  try {
    const page = await state.pdfDoc.getPage(pageNum);
    const canvas = el.pdfCanvas;
    const ctx = canvas.getContext('2d');

    const viewport = page.getViewport({ scale: state.pdfScale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };

    await page.render(renderContext).promise;
    state.pdfPageRendering = false;

    if (state.pdfPendingPage !== null) {
      const next = state.pdfPendingPage;
      state.pdfPendingPage = null;
      renderPdfPage(next);
    }
  } catch (err) {
    console.error('Error rendering PDF page:', err);
    state.pdfPageRendering = false;
  }
}

// Convert a single PDF page to high-res data URL
async function getPdfPageDataUrl(pageNum, scale = 2.4) {
  if (!state.pdfDoc) throw new Error('Chưa có tệp PDF nào được nạp!');
  const page = await state.pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale: scale });

  const offCanvas = document.createElement('canvas');
  offCanvas.width = viewport.width;
  offCanvas.height = viewport.height;
  const ctx = offCanvas.getContext('2d');

  await page.render({ canvasContext: ctx, viewport: viewport }).promise;
  return offCanvas.toDataURL('image/jpeg', 0.95);
}

// ==========================================================================
// Image Manipulation (Modal-based High-Precision Crop & Rotate)
// ==========================================================================
function openCropModal() {
  if (!state.currentImageBase64) {
    showToast('Vui lòng tải hoặc dán ảnh đề toán trước khi cắt!', 'error');
    return;
  }

  if (typeof Cropper === 'undefined') {
    showToast('Thư viện cắt ảnh chưa sẵn sàng, vui lòng thử lại sau giây lát!', 'error');
    return;
  }

  // Destroy previous cropper instance cleanly if any
  if (state.cropper) {
    try { state.cropper.destroy(); } catch (_) {}
    state.cropper = null;
  }

  const modal = el.cropModal;
  const cropImg = el.cropModalImg;
  if (!modal || !cropImg) return;

  modal.classList.remove('hidden');

  const initCropper = () => {
    if (state.cropper) {
      try { state.cropper.destroy(); } catch (_) {}
    }
    try {
      state.cropper = new Cropper(cropImg, {
        viewMode: 1,
        dragMode: 'crop',
        initialAspectRatio: NaN,
        autoCropArea: 0.88,
        responsive: true,
        restore: false,
        guides: true,
        center: true,
        highlight: true,
        cropBoxMovable: true,
        cropBoxResizable: true,
        background: true,
        checkCrossOrigin: false,
        touchDragZoom: true,
        minCropBoxWidth: 20,
        minCropBoxHeight: 20
      });
    } catch (err) {
      console.error('Cropper init error:', err);
      showToast('Lỗi khi mở công cụ cắt ảnh: ' + (err.message || ''), 'error');
    }
  };

  cropImg.onload = () => {
    initCropper();
  };

  cropImg.src = state.currentImageBase64;
  if (cropImg.complete && cropImg.naturalWidth > 0) {
    initCropper();
  }
}

function closeCropModal() {
  if (state.cropper) {
    try { state.cropper.destroy(); } catch (_) {}
    state.cropper = null;
  }
  if (el.cropModalImg) {
    el.cropModalImg.onload = null;
    el.cropModalImg.src = '';
  }
  el.cropModal?.classList.add('hidden');
}

function applyCropModal() {
  if (!state.cropper) {
    closeCropModal();
    return;
  }

  try {
    const croppedCanvas = state.cropper.getCroppedCanvas({
      maxWidth: 4096,
      maxHeight: 4096,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high'
    });

    if (!croppedCanvas) {
      showToast('Không thể tạo vùng cắt. Hãy thử khoanh lại vùng chọn!', 'error');
      return;
    }

    const croppedDataUrl = croppedCanvas.toDataURL('image/jpeg', 0.95);
    closeCropModal();
    setImageSrc(croppedDataUrl, false);
    showToast('Đã cắt vùng chọn bài toán thành công!', 'success');
  } catch (err) {
    console.error('Crop execution error:', err);
    showToast('Lỗi khi áp dụng cắt ảnh: ' + (err.message || ''), 'error');
  }
}

function rotateImage() {
  if (!state.currentImageBase64) return;
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.height;
    canvas.height = img.width;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((90 * Math.PI) / 180);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    setImageSrc(canvas.toDataURL('image/jpeg', 0.95), false);
    showToast('Đã xoay ảnh 90°!', 'info');
  };
  img.src = state.currentImageBase64;
}

function clearLoadedMedia() {
  if (state.cropper) {
    try { state.cropper.destroy(); } catch (_) {}
    state.cropper = null;
  }
  closeCropModal();
  state.currentImageBase64 = null;
  state.pdfDoc = null;
  state.pdfFile = null;
  setFilePickerEnabled(true);

  el.previewImg.src = '';
  el.fileInput.value = '';
  el.uploadPrompt?.classList.remove('hidden');
  el.imagePreviewContainer?.classList.add('hidden');
  el.imageToolsBar?.classList.add('hidden');
  el.pdfViewerContainer?.classList.add('hidden');
  el.pdfViewerContainer?.classList.remove('flex');
  el.convertBtn?.classList.remove('hidden');

  if (progressRAF) {
    cancelAnimationFrame(progressRAF);
    progressRAF = null;
  }
  el.progressContainer?.classList.add('hidden');
  el.progressContainer?.classList.remove('flex');
}

// ==========================================================================
// Progress Bar Controller — Elapsed-time asymptotic curve
// ==========================================================================
let progressRAF = null;
let progressStartTime = 0;

/**
 * Asymptotic progress curve based on real elapsed time.
 * Fast at first, slows logarithmically — never self-reaches 95%.
 *   t = elapsed seconds
 *   Curve: p = ceiling * (1 - e^(-t/tau))
 *   ceiling=94, tau=12 → 5s≈30%  10s≈56%  15s≈71%  20s≈81%  30s≈88%  60s≈93%
 */
function calcProgress(elapsedSec) {
  const ceiling = 94;
  const tau = 12;
  return ceiling * (1 - Math.exp(-elapsedSec / tau));
}

function getProgressPhase(percent) {
  if (percent < 15) return { step: 1, text: 'Đang chuẩn bị & gửi dữ liệu tới AI...' };
  if (percent < 35) return { step: 1, text: 'Đang tải ảnh lên Gemini Vision...' };
  if (percent < 55) return { step: 2, text: 'AI đang phân tích hình ảnh & nhận diện ký hiệu toán...' };
  if (percent < 72) return { step: 2, text: 'AI đang bóc tách công thức & cấu trúc đề...' };
  if (percent < 85) return { step: 3, text: 'Đang biên dịch sang cú pháp LaTeX...' };
  return { step: 3, text: 'Đang chờ AI hoàn tất biên dịch LaTeX...' };
}

function startProgress() {
  if (progressRAF) {
    cancelAnimationFrame(progressRAF);
    progressRAF = null;
  }

  progressStartTime = Date.now();

  el.progressContainer?.classList.remove('hidden');
  el.progressContainer?.classList.add('flex');

  if (el.progressBar) {
    el.progressBar.style.width = '0%';
    el.progressBar.style.transition = 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    el.progressBar.className = 'h-full rounded-full bg-gradient-to-r from-gold via-pen-400 to-gold transition-all duration-300 relative progress-bar-animated';
  }

  if (el.progressIcon) {
    el.progressIcon.className = 'fa-solid fa-circle-notch fa-spin text-gold text-sm';
  }

  updateProgressUI(2, 'Đang chuẩn bị & gửi dữ liệu tới AI...', 1);

  function tick() {
    const elapsed = (Date.now() - progressStartTime) / 1000;
    const percent = calcProgress(elapsed);
    const phase = getProgressPhase(percent);
    updateProgressUI(percent, phase.text, phase.step);
    progressRAF = requestAnimationFrame(tick);
  }

  progressRAF = requestAnimationFrame(tick);
}

function updateProgressUI(percent, statusText, stepNumber = 1) {
  const clamped = Math.min(100, Math.max(0, Math.round(percent)));
  if (el.progressBar) el.progressBar.style.width = `${clamped}%`;
  if (el.progressPercent) el.progressPercent.textContent = `${clamped}%`;
  if (el.progressStatus && statusText) el.progressStatus.textContent = statusText;

  const steps = [el.step1, el.step2, el.step3, el.step4];
  steps.forEach((stepEl, idx) => {
    if (!stepEl) return;
    if (idx + 1 <= stepNumber) {
      stepEl.classList.remove('text-chalk-faint');
      stepEl.classList.add('text-gold', 'font-semibold');
    } else {
      stepEl.classList.remove('text-gold', 'font-semibold', 'text-emerald-400');
      stepEl.classList.add('text-chalk-faint');
    }
  });
}

function finishProgress(success = true, message = '') {
  if (progressRAF) {
    cancelAnimationFrame(progressRAF);
    progressRAF = null;
  }

  if (success) {
    // Smooth ease-out transition to 100%
    if (el.progressBar) el.progressBar.style.transition = 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    updateProgressUI(100, message || 'Chuyển đổi hoàn tất!', 4);
    if (el.progressBar) el.progressBar.className = 'h-full rounded-full progress-success transition-all duration-300 relative';
    if (el.progressIcon) el.progressIcon.className = 'fa-solid fa-circle-check text-emerald-400 text-sm';
    if (el.step4) {
      el.step4.classList.remove('text-chalk-faint');
      el.step4.classList.add('text-emerald-400', 'font-semibold');
    }

    setTimeout(() => {
      if (!state.isConverting && el.progressContainer) {
        el.progressContainer.classList.add('hidden');
        el.progressContainer.classList.remove('flex');
      }
    }, 2800);
  } else {
    if (el.progressBar) el.progressBar.className = 'h-full rounded-full progress-error transition-all duration-300 relative';
    if (el.progressIcon) el.progressIcon.className = 'fa-solid fa-triangle-exclamation text-rose-400 text-sm';
    if (el.progressStatus) el.progressStatus.textContent = message || 'Chuyển đổi thất bại!';
    if (el.progressPercent) el.progressPercent.textContent = 'Lỗi';

    setTimeout(() => {
      if (!state.isConverting && el.progressContainer) {
        el.progressContainer.classList.add('hidden');
        el.progressContainer.classList.remove('flex');
      }
    }, 4500);
  }
}

// ==========================================================================
// Convert Request Execution (Standard & Pro Modes)
// ==========================================================================
async function callConvertApi(base64Image, isFullDoc = true, customNotes = '') {
  let keys = getSavedApiKeys();
  const legacyKey = localStorage.getItem('math2latex_gemini_key') || '';
  if (legacyKey && !keys.includes(legacyKey)) {
    keys.unshift(legacyKey);
  }
  const primaryKey = keys[0] || legacyKey || '';
  const geminiModel = localStorage.getItem('math2latex_gemini_model') || 'gemini-3.8-flash';

  const response = await fetch('/api/convert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageBase64: base64Image,
      isFullDocument: isFullDoc,
      customNotes: customNotes,
      apiKey: primaryKey,
      apiKeys: keys,
      geminiModel: geminiModel
    })
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Lỗi không xác định khi chuyển đổi.');
  }

  if (data.fallbackNotice) {
    showToast(data.fallbackNotice, 'info');
  }

  return data.latex;
}

// Convert Single Image (Standard Mode)
async function handleConvert() {
  if (!state.currentImageBase64) {
    showToast('Vui lòng tải hoặc dán ảnh đề toán trước khi chuyển đổi!', 'error');
    return;
  }

  if (state.isConverting) return;
  state.isConverting = true;
  setConvertingState(true);
  startProgress();

  const isFullDocument = el.docTypeSelect?.value === 'full';
  const customNotes = el.customNotes?.value.trim() || '';

  try {
    const resultLatex = await callConvertApi(state.currentImageBase64, isFullDocument, customNotes);

    el.latexEditor.value = resultLatex;
    updateEditorStats();
    renderLatexPreview();

    finishProgress(true, 'Chuyển đổi sang LaTeX hoàn tất 100%!');
    showToast('Chuyển đổi sang LaTeX thành công!', 'success');
    if (window.innerWidth < 1024) {
      setMobileView('preview');
    }
  } catch (error) {
    console.error('Conversion error:', error);
    finishProgress(false, error.message || 'Chuyển đổi thất bại');
    showToast(`Lỗi: ${error.message}`, 'error');
    if (error.message.includes('API Key') || error.message.includes('GEMINI_API_KEY')) {
      el.settingsModal?.classList.remove('hidden');
    }
  } finally {
    state.isConverting = false;
    setConvertingState(false);
  }
}

// Convert Current PDF Page (Pro Mode)
async function handleConvertPdfCurrentPage() {
  if (!state.pdfDoc) {
    showToast('Chưa có tệp PDF nào được nạp!', 'error');
    return;
  }

  if (state.isConverting) return;
  state.isConverting = true;
  setConvertingState(true);
  startProgress('gemini');

  const isFullDocument = el.docTypeSelect?.value === 'full';
  const customNotes = el.customNotes?.value.trim() || '';

  try {
    updateProgressUI(20, `Đang kết xuất trang ${state.pdfCurrentPage} chất lượng cao...`, 1);
    const pageImageBase64 = await getPdfPageDataUrl(state.pdfCurrentPage, 2.4);

    updateProgressUI(40, `Đang gửi trang ${state.pdfCurrentPage} tới AI OCR...`, 2);
    const resultLatex = await callConvertApi(pageImageBase64, isFullDocument, customNotes);

    el.latexEditor.value = resultLatex;
    updateEditorStats();
    renderLatexPreview();

    finishProgress(true, `Đã chuyển đổi thành công trang ${state.pdfCurrentPage}!`);
    showToast(`Chuyển đổi trang ${state.pdfCurrentPage} hoàn tất!`, 'success');
    if (window.innerWidth < 1024) {
      setMobileView('preview');
    }
  } catch (error) {
    console.error('PDF Conversion error:', error);
    finishProgress(false, error.message || 'Chuyển đổi thất bại');
    showToast(`Lỗi: ${error.message}`, 'error');
  } finally {
    state.isConverting = false;
    setConvertingState(false);
  }
}

// Convert ALL PDF Pages Sequentially (Pro Mode Batch)
async function handleConvertPdfAllPages() {
  if (!state.pdfDoc) {
    showToast('Chưa có tệp PDF nào được nạp!', 'error');
    return;
  }

  const total = state.pdfTotalPages;
  if (!confirm(`Bạn có muốn chuyển đổi toàn bộ ${total} trang PDF sang một tài liệu LaTeX hoàn chỉnh không?`)) {
    return;
  }

  if (state.isConverting) return;
  state.isConverting = true;
  setConvertingState(true);
  startProgress('gemini');

  const isFullDocument = el.docTypeSelect?.value === 'full';
  const customNotes = el.customNotes?.value.trim() || '';
  const pageLatexResults = [];

  try {
    for (let p = 1; p <= total; p++) {
      const percent = Math.round(((p - 1) / total) * 90) + 5;
      updateProgressUI(percent, `Đang xử lý trang ${p}/${total}...`, 2);

      const pageImageBase64 = await getPdfPageDataUrl(p, 2.4);
      const pageLatex = await callConvertApi(pageImageBase64, false, customNotes); // get snippets for each page

      pageLatexResults.push({ page: p, latex: pageLatex });

      // Live update intermediate progress
      if (pageLatexResults.length > 0) {
        let combinedDraft = pageLatexResults.map(item => `% ==================== TRANG ${item.page} ====================\n${item.latex}`).join('\n\n\\newpage\n\n');
        el.latexEditor.value = combinedDraft;
        updateEditorStats();
      }
    }

    let finalCombinedLatex = '';
    const bodyContent = pageLatexResults.map(item => `\\section*{Trang ${item.page}}\n${item.latex}`).join('\n\n\\newpage\n\n');

    if (isFullDocument) {
      finalCombinedLatex = `\\documentclass[12pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[vietnamese]{babel}
\\usepackage{amsmath,amssymb,amsfonts,mathrsfs}
\\usepackage{geometry}
\\usepackage{graphicx,tikz}
\\usepackage{enumitem}
\\geometry{a4paper, top=2cm, bottom=2cm, left=2cm, right=2cm}

\\begin{document}

${bodyContent}

\\end{document}`;
    } else {
      finalCombinedLatex = bodyContent;
    }

    el.latexEditor.value = finalCombinedLatex;
    updateEditorStats();
    renderLatexPreview();

    finishProgress(true, `Hoàn thành chuyển đổi toàn bộ ${total} trang PDF!`);
    showToast(`Đã chuyển đổi thành công cả ${total} trang PDF sang LaTeX!`, 'success');
    if (window.innerWidth < 1024) {
      setMobileView('preview');
    }
  } catch (error) {
    console.error('Batch PDF error:', error);
    finishProgress(false, error.message || 'Chuyển đổi thất bại');
    showToast(`Lỗi tại trang: ${error.message}`, 'error');
  } finally {
    state.isConverting = false;
    setConvertingState(false);
  }
}


function setConvertingState(isLoading) {
  if (isLoading) {
    if (el.convertBtn) el.convertBtn.disabled = true;
    if (el.convertBtnText) el.convertBtnText.textContent = 'Đang nhận diện & tạo LaTeX...';
    if (el.convertBtnIcon) el.convertBtnIcon.classList.add('hidden');
    if (el.convertSpinner) el.convertSpinner.classList.remove('hidden');

    if (el.convertCurrentPageBtn) el.convertCurrentPageBtn.disabled = true;
    if (el.convertAllPdfBtn) el.convertAllPdfBtn.disabled = true;
  } else {
    if (el.convertBtn) el.convertBtn.disabled = false;
    if (el.convertBtnText) el.convertBtnText.textContent = 'Chuyển Đổi Thành LaTeX Ngay';
    if (el.convertBtnIcon) el.convertBtnIcon.classList.remove('hidden');
    if (el.convertSpinner) el.convertSpinner.classList.add('hidden');

    if (el.convertCurrentPageBtn) el.convertCurrentPageBtn.disabled = false;
    if (el.convertAllPdfBtn) el.convertAllPdfBtn.disabled = false;
  }
}

// ==========================================================================
// Tabs & Workspace View
// ==========================================================================
function switchTab(tab) {
  state.activeTab = tab;
  [el.tabCodeBtn, el.tabPreviewBtn, el.tabSplitBtn].forEach(btn => btn?.classList.remove('active'));

  if (tab === 'code') {
    el.tabCodeBtn?.classList.add('active');
    el.codeViewContainer?.classList.remove('hidden');
    el.previewViewContainer?.classList.add('hidden');
    if (el.workspaceArea) el.workspaceArea.className = 'flex-1 grid grid-cols-1 gap-3 min-h-[320px] sm:min-h-[480px]';
    if (window.innerWidth < 1024) {
      [el.mobileNavSourceBtn, el.mobileNavCodeBtn, el.mobileNavPreviewBtn].forEach(b => b?.classList.remove('active'));
      el.mobileNavCodeBtn?.classList.add('active');
      state.mobileView = 'code';
    }
  } else if (tab === 'preview') {
    el.tabPreviewBtn?.classList.add('active');
    el.codeViewContainer?.classList.add('hidden');
    el.previewViewContainer?.classList.remove('hidden');
    el.previewViewContainer?.classList.add('flex');
    if (el.workspaceArea) el.workspaceArea.className = 'flex-1 grid grid-cols-1 gap-3 min-h-[320px] sm:min-h-[480px]';
    if (window.innerWidth < 1024) {
      [el.mobileNavSourceBtn, el.mobileNavCodeBtn, el.mobileNavPreviewBtn].forEach(b => b?.classList.remove('active'));
      el.mobileNavPreviewBtn?.classList.add('active');
      state.mobileView = 'preview';
    }
    renderLatexPreview();
  } else if (tab === 'split') {
    el.tabSplitBtn?.classList.add('active');
    el.codeViewContainer?.classList.remove('hidden');
    el.previewViewContainer?.classList.remove('hidden');
    el.previewViewContainer?.classList.add('flex');
    if (el.workspaceArea) el.workspaceArea.className = 'flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 min-h-[320px] sm:min-h-[480px]';
    renderLatexPreview();
  }
}

function updateWorkspaceView() {
  switchTab(state.activeTab);
}

function updateEditorStats() {
  const text = el.latexEditor?.value || '';
  const charCount = text.length;
  const lineCount = text ? text.split('\n').length : 0;
  if (el.charCount) el.charCount.textContent = `${charCount} ký tự | ${lineCount} dòng`;

  if (el.mobileCodeBadge) {
    if (text.trim().length > 0) {
      el.mobileCodeBadge.classList.remove('hidden');
    } else {
      el.mobileCodeBadge.classList.add('hidden');
    }
  }
}

function insertLatexAtCursor(snippet) {
  const editor = el.latexEditor;
  if (!editor) return;
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const text = editor.value;

  editor.value = text.substring(0, start) + snippet + text.substring(end);
  editor.selectionStart = editor.selectionEnd = start + snippet.length;
  editor.focus();

  updateEditorStats();
  renderLatexPreview();
}

// ==========================================================================
// Elite KaTeX & Vietnamese Math Exam Live Preview Engine
// ==========================================================================

const KATEX_MATH_MACROS = {
  '\\heva': '\\begin{cases} #1 \\end{cases}',
  '\\hoac': '\\left[\\begin{array}{l} #1 \\end{array}\\right.',
  '\\degree': '^\\circ',
  '\\dotEX': '.',
  '\\R': '\\mathbb{R}',
  '\\N': '\\mathbb{N}',
  '\\Z': '\\mathbb{Z}',
  '\\Q': '\\mathbb{Q}',
  '\\C': '\\mathbb{C}',
  '\\d': '\\mathrm{d}',
  '\\e': '\\mathrm{e}',
  '\\i': '\\mathrm{i}',
  '\\dx': '\\,\\mathrm{d}x',
  '\\dt': '\\,\\mathrm{d}t',
  '\\dy': '\\,\\mathrm{d}y',
  '\\dz': '\\,\\mathrm{d}z',
  '\\dfrac': '\\frac',
  '\\cfrac': '\\frac',
  '\\vec': '\\mathbf',
  '\\vect': '\\overrightarrow{#1}',
  '\\widecheck': '#1',
  '\\widehat': '#1',
  '\\overparen': '#1',
  '\\parallel': '\\mathrel{/\\!/}',
  '\\perp': '\\bot',
  '\\arcsin': '\\operatorname{arcsin}',
  '\\arccos': '\\operatorname{arccos}',
  '\\arctan': '\\operatorname{arctan}',
  '\\arccot': '\\operatorname{arccot}',
  '\\cot': '\\operatorname{cot}',
  '\\tan': '\\operatorname{tan}',
  '\\tg': '\\operatorname{tan}',
  '\\ctg': '\\operatorname{cot}',
  '\\gcd': '\\operatorname{gcd}',
  '\\lcm': '\\operatorname{lcm}'
};

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Intelligent LaTeX parser specifically designed for Vietnamese Math Exam structure
 */
function parseLatexToHtml(latex, context = null) {
  if (!latex || !latex.trim()) return '';

  const isTopLevel = !context;
  const ctx = context || { mathStore: [], tikzStore: [] };

  let text = latex;

  // 1. Extract Body (between \begin{document} and \end{document} if present)
  if (isTopLevel) {
    const docMatch = text.match(/\\begin\{document\}([\s\S]*?)\\end\{document\}/i);
    if (docMatch) {
      text = docMatch[1];
    } else {
      text = text.replace(/^\\documentclass[\s\S]*?(?=\\section|\\begin|\\textbf|Câu|[^\\]*\b[a-zA-Z])/i, '');
    }
    // Strip comments
    text = text.replace(/(^|[^\\])%.*$/gm, '$1');
  }

  function saveMath(content, isDisplay = false) {
    const id = ctx.mathStore.length;
    ctx.mathStore.push({ content: content.trim(), isDisplay });
    return `___MATH_BLOCK_${id}___`;
  }

  function saveTikz(tikzCode) {
    const id = ctx.tikzStore.length;
    ctx.tikzStore.push(tikzCode);
    return `___TIKZ_BLOCK_${id}___`;
  }

  // 2. Protect TikZ Environments
  text = text.replace(/\\begin\{tikzpicture\}(?:\[[\s\S]*?\])?([\s\S]*?)\\end\{tikzpicture\}/gi, (fullMatch) => {
    return saveTikz(fullMatch);
  });

  // 3. Protect Math display environments
  const displayEnvs = ['align\\*?', 'gather\\*?', 'equation\\*?', 'multline\\*?'];
  displayEnvs.forEach(env => {
    const reg = new RegExp(`\\\\begin\\{${env}\\}([\\s\\S]*?)\\\\end\\{${env}\\}`, 'gi');
    text = text.replace(reg, (match) => saveMath(match, true));
  });

  // Protect standard display math $$...$$ and \[...\]
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, inner) => saveMath(inner, true));
  text = text.replace(/\\\[([\s\S]*?)\\\]/g, (match, inner) => saveMath(inner, true));

  // Protect inline math $...$ and \(...\)
  text = text.replace(/(?<!\\)\$((?:\\\$|[^\$])+)\$/g, (match, inner) => saveMath(inner, false));
  text = text.replace(/\\\(([\s\S]*?)\\\)/g, (match, inner) => saveMath(inner, false));

  // 4. Parse \begin{minipage} side-by-side structures
  text = text.replace(/(\\begin\{minipage\}(?:\[.*?\])?\{([0-9.]+)\\(?:textwidth|linewidth|columnwidth)\}[\s\S]*?\\end\{minipage\}(?:\s*%?\s*\\hfill\s*%?\s*\\begin\{minipage\}(?:\[.*?\])?\{([0-9.]+)\\(?:textwidth|linewidth|columnwidth)\}[\s\S]*?\\end\{minipage\})?)/gi, (fullMatch) => {
    const minipages = [];
    const mpRegex = /\\begin\{minipage\}(?:\[.*?\])?\{([0-9.]+)\\(?:textwidth|linewidth|columnwidth)\}([\s\S]*?)\\end\{minipage\}/gi;
    let m;
    while ((m = mpRegex.exec(fullMatch)) !== null) {
      const widthPercent = Math.round(parseFloat(m[1]) * 100) || 50;
      minipages.push({ width: widthPercent, content: m[2].trim() });
    }

    if (minipages.length >= 2) {
      return `<div class="exam-row flex flex-col md:flex-row gap-4 items-start my-3">` +
        minipages.map(mp => `<div class="exam-col flex-1 min-w-0" style="flex: 0 0 ${mp.width}%; max-width: 100%;">${parseLatexToHtml(mp.content, ctx)}</div>`).join('') +
        `</div>`;
    } else if (minipages.length === 1) {
      return `<div class="exam-col my-2" style="max-width: ${minipages[0].width}%;">${parseLatexToHtml(minipages[0].content, ctx)}</div>`;
    }
    return fullMatch;
  });

  // 5. Parse \begin{tasks}(N) ... \end{tasks}
  text = text.replace(/\\begin\{tasks\}(?:\[.*?\])?(?:\((\d+)\))?([\s\S]*?)\\end\{tasks\}/gi, (match, colCountStr, body) => {
    const cols = parseInt(colCountStr, 10) || 4;
    const taskItems = body.split(/\\task\s*/).filter(item => item.trim().length > 0);

    const itemsHtml = taskItems.map(item => {
      let parsedItem = item.trim();
      parsedItem = parsedItem.replace(/^\\textbf\{([A-D]\.?)\}/i, '<strong class="text-pen mr-1">$1</strong>');
      parsedItem = parsedItem.replace(/^([A-D]\.)\s*/i, '<strong class="text-pen mr-1">$1</strong>');
      return `<div class="choice-item">${parsedItem}</div>`;
    }).join('');

    return `<div class="choice-grid choice-grid-${cols}">${itemsHtml}</div>`;
  });

  // 6. Parse \begin{tabular}{...} ... \end{tabular}
  text = text.replace(/\\begin\{tabular\}(?:\{[^\}]*\})?([\s\S]*?)\\end\{tabular\}/gi, (match, body) => {
    const rawRows = body.split(/\\\\/).map(r => r.trim()).filter(r => r.length > 0);
    const tableRows = rawRows.map(row => {
      let cleanRow = row
        .replace(/\\hline/g, '')
        .replace(/\\toprule/g, '')
        .replace(/\\midrule/g, '')
        .replace(/\\bottomrule/g, '')
        .replace(/\\cline\{[^\}]*\}/g, '')
        .trim();
      if (!cleanRow) return '';
      const cells = cleanRow.split('&').map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).filter(r => r.length > 0).join('');

    return `<div class="latex-table-container my-3"><table class="latex-table"><tbody>${tableRows}</tbody></table></div>`;
  });

  // 7. Parse \begin{center} ... \end{center}
  text = text.replace(/\\begin\{center\}([\s\S]*?)\\end\{center\}/gi, (match, content) => {
    return `<div class="text-center my-3">${content.trim()}</div>`;
  });

  // 8. Parse \begin{enumerate} and \begin{itemize}
  text = text.replace(/\\begin\{enumerate\}(?:\[.*?\])?([\s\S]*?)\\end\{enumerate\}/gi, (match, content) => {
    const items = content.split(/\\item\s*/).filter(i => i.trim().length > 0);
    return `<ol class="exam-list exam-enum">${items.map(i => `<li>${i.trim()}</li>`).join('')}</ol>`;
  });
  text = text.replace(/\\begin\{itemize\}(?:\[.*?\])?([\s\S]*?)\\end\{itemize\}/gi, (match, content) => {
    const items = content.split(/\\item\s*/).filter(i => i.trim().length > 0);
    return `<ul class="exam-list exam-item">${items.map(i => `<li>${i.trim()}</li>`).join('')}</ul>`;
  });

  // 9. Headers & Sectioning
  text = text.replace(/\\section\*?\{([^}]+)\}/g, '<h2 class="exam-section-title">$1</h2>');
  text = text.replace(/\\subsection\*?\{([^}]+)\}/g, '<h3 class="exam-subsection-title">$1</h3>');
  text = text.replace(/\\subsubsection\*?\{([^}]+)\}/g, '<h4 class="font-bold text-sm text-pen-600 mt-2 mb-1">$1</h4>');

  // Question headers (Câu 1., Câu 2:, Bài 1., Phần I...)
  text = text.replace(/\\textbf\{(Câu\s*\d+[^}]*)\}/gi, '<strong class="text-pen font-bold mr-1">$1</strong>');
  text = text.replace(/\\textbf\{(Bài\s*\d+[^}]*)\}/gi, '<strong class="text-pen font-bold mr-1">$1</strong>');
  text = text.replace(/\\textbf\{(Phần\s+[IVX\d]+[^}]*)\}/gi, '<strong class="text-pen font-bold block text-base my-2">$1</strong>');

  // 10. Standard LaTeX Typography & Formatting
  text = text
    .replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
    .replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>')
    .replace(/\\underline\{([^}]+)\}/g, '<u>$1</u>')
    .replace(/\\emph\{([^}]+)\}/g, '<em>$1</em>')
    .replace(/\\textsf\{([^}]+)\}/g, '<span class="font-sans">$1</span>')
    .replace(/\\texttt\{([^}]+)\}/g, '<code class="font-mono text-xs bg-black/5 px-1 py-0.5 rounded">$1</code>')
    .replace(/\\textcolor\{([^}]+)\}\{([^}]+)\}/g, '<span style="color: $1">$2</span>')
    .replace(/\\noindent/g, '')
    .replace(/\\centering/g, '')
    .replace(/\\vspace\*?\{[^}]*\}/g, '<div class="h-2"></div>')
    .replace(/\\hspace\*?\{[^}]*\}/g, '&nbsp;&nbsp;')
    .replace(/\\quad/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
    .replace(/\\qquad/g, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
    .replace(/~/g, '&nbsp;')
    .replace(/\\hrule/g, '<hr class="my-3 border-paper-line">')
    .replace(/\\rule\{[^}]*\}\{[^}]*\}/g, '<hr class="my-3 border-paper-line">')
    .replace(/\\newpage|\\clearpage/g, '<div class="page-break-line my-6 text-center text-xs text-pen/60 font-mono flex items-center gap-3"><div class="flex-1 border-b border-dashed border-pen/30"></div><span><i class="fa-solid fa-file-lines"></i> Trang Mới</span><div class="flex-1 border-b border-dashed border-pen/30"></div></div>')
    .replace(/\\%/g, '%')
    .replace(/\\&/g, '&')
    .replace(/\\_/g, '_')
    .replace(/\\#/g, '#')
    .replace(/\\\$/g, '$');

  // Paragraph & Line-break Formatting
  const paragraphs = text.split(/\n\s*\n+/);
  text = paragraphs.map(p => {
    let clean = p.trim();
    if (!clean) return '';
    clean = clean.replace(/\\\\/g, '<br>').replace(/\n/g, '<br>');
    return `<div class="mb-2.5">${clean}</div>`;
  }).filter(p => p.length > 0).join('');

  // 11. Only Top Level restores TikZ and Math blocks
  if (isTopLevel) {
    // Restore TikZ blocks
    text = text.replace(/___TIKZ_BLOCK_(\d+)___/g, (match, idStr) => {
      const id = parseInt(idStr, 10);
      const tikzCode = ctx.tikzStore[id] || '';

      let typeName = 'Hình vẽ TikZ';
      let iconClass = 'fa-solid fa-bezier-curve';

      if (/tkzTab|\\tkzTabInit/i.test(tikzCode) || (/f'\(x\)/i.test(tikzCode) && /f\(x\)/i.test(tikzCode))) {
        typeName = 'Bảng biến thiên (TikZ)';
        iconClass = 'fa-solid fa-table-cells';
      } else if (/plot|domain|axis|tikzpicture.*scale/i.test(tikzCode) && /->|node.*x|node.*y/i.test(tikzCode)) {
        typeName = 'Đồ thị hàm số (TikZ)';
        iconClass = 'fa-solid fa-chart-line';
      } else if (/dashed|coordinate|\\draw.*node/i.test(tikzCode)) {
        typeName = 'Hình học phẳng / Không gian (TikZ)';
        iconClass = 'fa-solid fa-shapes';
      }

      return `
        <div class="tikz-figure-box my-3">
          <div class="flex items-center justify-between gap-2 pb-2 border-b border-paper-line">
            <span class="tikz-badge">
              <i class="${iconClass}"></i> ${typeName}
            </span>
            <button type="button" class="tikz-toggle-btn" data-tikz-id="${id}">
              <i class="fa-solid fa-code"></i> Xem mã TikZ
            </button>
          </div>
          <div class="tikz-visual-card">
            <div class="w-10 h-10 rounded-full bg-pen/10 flex items-center justify-center text-pen text-base mb-1.5">
              <i class="${iconClass}"></i>
            </div>
            <div class="text-xs font-semibold text-paper-ink">${typeName}</div>
            <div class="text-[11px] text-paper-ink/60 mt-0.5">Mã nguồn TikZ chuẩn LaTeX (Sẵn sàng biên dịch trên Overleaf)</div>
          </div>
          <div class="tikz-code-drawer hidden mt-2 pt-2 border-t border-dashed border-paper-line" id="tikz_drawer_${id}">
            <pre class="font-mono text-[11px] p-2.5 rounded bg-black/5 overflow-x-auto whitespace-pre leading-relaxed text-paper-ink">${escapeHtml(tikzCode)}</pre>
          </div>
        </div>
      `;
    });

    // Restore Math blocks
    text = text.replace(/___MATH_BLOCK_(\d+)___/g, (match, idStr) => {
      const id = parseInt(idStr, 10);
      const item = ctx.mathStore[id];
      if (!item) return '';
      if (item.isDisplay) {
        return `$$${item.content}$$`;
      } else {
        return `$${item.content}$`;
      }
    });
  }

  return text;
}

/**
 * Executes KaTeX typesetting on a target container with custom Vietnamese macros
 */
function renderMathWithKaTeX(container) {
  if (!container || !window.renderMathInElement) return;

  try {
    window.renderMathInElement(container, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\(', right: '\\)', display: false }
      ],
      macros: KATEX_MATH_MACROS,
      throwOnError: false,
      errorColor: '#C0392B'
    });
  } catch (err) {
    console.warn('KaTeX typeset warning:', err);
  }
}

/**
 * Attaches interactive toggle handlers for TikZ cards
 */
function attachPreviewInteractions(container) {
  if (!container) return;
  const toggleBtns = container.querySelectorAll('.tikz-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-tikz-id');
      const drawer = container.querySelector(`#tikz_drawer_${id}`);
      if (drawer) {
        const isHidden = drawer.classList.contains('hidden');
        if (isHidden) {
          drawer.classList.remove('hidden');
          btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Ẩn mã TikZ';
        } else {
          drawer.classList.add('hidden');
          btn.innerHTML = '<i class="fa-solid fa-code"></i> Xem mã TikZ';
        }
      }
    });
  });
}

/**
 * Top-level Preview Renderer — invoked when LaTeX changes or on mode switch
 */
function renderLatexPreview() {
  if (!el.renderOutput) return;
  const rawLatex = el.latexEditor?.value.trim() || '';
  if (!rawLatex) {
    el.renderOutput.innerHTML = `
      <div class="text-paper-ink/40 text-center italic mt-16 flex flex-col items-center gap-2">
        <i class="fa-solid fa-file-circle-question text-3xl text-paper-ink/20"></i>
        <span>Chưa có nội dung hiển thị. Hãy chuyển đổi ảnh/PDF hoặc nhập mã LaTeX ở khung soạn thảo.</span>
      </div>
    `;
    return;
  }

  try {
    const html = parseLatexToHtml(rawLatex);
    el.renderOutput.innerHTML = html;
    attachPreviewInteractions(el.renderOutput);
    renderMathWithKaTeX(el.renderOutput);
  } catch (err) {
    console.error('Error rendering LaTeX preview:', err);
    el.renderOutput.innerHTML = `
      <div class="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs leading-relaxed">
        <div class="font-bold flex items-center gap-2 mb-1 text-sm">
          <i class="fa-solid fa-triangle-exclamation text-pen"></i> Lỗi kết xuất xem trước
        </div>
        <p>${escapeHtml(err.message)}</p>
      </div>
    `;
  }
}

// ==========================================================================
// Copy & Custom Filename Export
// ==========================================================================
async function copyLatexCode() {
  const code = el.latexEditor?.value || '';
  if (!code) {
    showToast('Chưa có mã LaTeX để sao chép!', 'error');
    return;
  }

  try {
    await navigator.clipboard.writeText(code);
    if (el.copyBtnText) el.copyBtnText.textContent = 'Đã chép!';
    showToast('Đã sao chép toàn bộ mã LaTeX vào Clipboard!', 'success');
    setTimeout(() => {
      if (el.copyBtnText) el.copyBtnText.textContent = 'Sao chép';
    }, 2000);
  } catch (err) {
    showToast('Vui lòng bấm Ctrl+C trong khung soạn thảo để sao chép.', 'error');
  }
}

function downloadTexFile() {
  const latex = el.latexEditor?.value || '';
  if (!latex) {
    showToast('Không có mã LaTeX để tải về!', 'error');
    return;
  }

  let fileName = (el.texFileNameInput?.value.trim() || state.currentFileName || 'de_toan');
  if (!fileName.endsWith('.tex')) fileName += '.tex';

  const blob = new Blob([latex], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(`Đã tải tệp ${fileName} về máy thành công!`, 'success');
}

function openInOverleaf() {
  const latex = el.latexEditor?.value || '';
  if (!latex) {
    showToast('Vui lòng tạo hoặc dán mã LaTeX trước khi mở Overleaf!', 'error');
    return;
  }

  let fullLatex = latex;
  if (!latex.includes('\\documentclass')) {
    fullLatex = `\\documentclass[12pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[vietnamese]{babel}
\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage{geometry}
\\geometry{a4paper, top=2cm, bottom=2cm, left=2cm, right=2cm}

\\begin{document}
${latex}
\\end{document}`;
  }

  if (el.overleafSnipInput) el.overleafSnipInput.value = fullLatex;
  el.overleafForm?.submit();
  showToast('Đang mở dự án mới trên Overleaf...', 'info');
}

// Toast Notifications System
function showToast(message, type = 'info') {
  if (!el.toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'fa-solid fa-circle-info';
  if (type === 'success') icon = 'fa-solid fa-circle-check';
  if (type === 'error') icon = 'fa-solid fa-circle-exclamation';

  toast.innerHTML = `<i class="${icon}"></i><span>${message}</span>`;
  el.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
