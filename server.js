import express from 'express';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up Multer for handling file uploads (stored in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

/**
 * Comprehensive System Prompt Builder for Vietnamese & International Math Exam / Document Extraction
 * Enforces strict question ordering, exact spatial layout matching, TikZ accuracy, and full LaTeX packages.
 */
function buildSystemPrompt(isFullDocument = true, customNotes = '') {
  const outputFormat = isFullDocument
    ? `- Tạo TOÀN BỘ TÀI LIỆU LATEX HOÀN CHỈNH (.tex) bắt đầu bằng \\documentclass[12pt,a4paper]{article} và kết thúc bằng \\end{document}.
- Luôn khai báo đầy đủ các gói: inputenc (utf8), babel (vietnamese), amsmath, amssymb, amsfonts, mathrsfs, mathtools, geometry, graphicx, tikz, tkz-tab, pgfplots, enumitem, tasks, multicol, booktabs, tabularx, array.
- geometry: \\geometry{a4paper, top=1.5cm, bottom=1.5cm, left=1.8cm, right=1.8cm}.`
    : `- Chỉ trả về ĐOẠN MÃ LATEX NỘI DUNG (Snippet), KHÔNG kèm \\documentclass, preamble hay \\begin{document}...\\end{document}.`;

  return `Bạn là chuyên gia chuyển đổi hình ảnh/PDF đề thi Toán học Việt Nam sang mã nguồn LaTeX chuẩn đẹp, chuyên nghiệp với độ chuẩn xác 100% về cả NỘI DUNG TOÁN HỌC lẫn BỐ CỤC KHÔNG GIAN (LAYOUT).

======================================================================
1. NGUYÊN TẮC BẢO TOÀN VỊ TRÍ & THỨ TỰ (BẮT BUỘC - TUYỆT ĐỐI TUÂN THỦ):
======================================================================
- GIỮ NGUYÊN 100% THỨ TỰ CÁC CÂU HỎI VÀ NỘI DUNG từ trên xuống dưới, theo đúng thứ tự đọc của ảnh/PDF gốc.
- TUYỆT ĐỐI KHÔNG ĐƯỢC đảo lộn thứ tự câu hỏi, không đổi chỗ các bài toán, không tự ý sắp xếp lại theo độ khó hay theo chuyên đề.
- KHÔNG ĐƯỢC BỎ SÓT bất kỳ câu hỏi, đoạn dẫn, bảng số liệu, hình vẽ hay chú thích nào.
- Giữ nguyên cách đánh số nguyên bản trong ảnh: "Câu 1.", "Câu 2.", "Bài 1", "Bài 2", "Phần I", "Phần II", "[1]", "(1)"...

======================================================================
2. TÁI TẠO BỐ CỤC (LAYOUT) Y HỆT ẢNH HOẶC PDF GỐC:
======================================================================
- TIÊU ĐỀ ĐỀ THI (HEADER):
  + Nếu ảnh có khung tiêu đề 2 bên (Trường/Sở GD bên trái, Tên kỳ thi/Mã đề/Thời gian bên phải): Bắt buộc dùng 2 minipage hoặc bảng tabular để tái hiện y hệt 2 cột đầu đề.
  + Ví dụ:
    \\noindent\\begin{minipage}[t]{0.45\\textwidth}
    \\textbf{SỞ GD\\&ĐT ...}\\\\
    \\textbf{TRƯỜNG THPT ...}
    \\end{minipage}\\hfill
    \\begin{minipage}[t]{0.50\\textwidth}
    \\textbf{ĐỀ THI HỌC KỲ / THỬ TỐT NGHIỆP THPT}\\\\
    \\textit{Môn: Toán -- Thời gian: 90 phút}
    \\end{minipage}
    \\vspace{0.3cm}
    \\hrule
    \\vspace{0.5cm}

- BỐ CỤC CÂU HỎI CÓ HÌNH VẼ / BẢNG BIẾN THIÊN BÊN CẠNH:
  + Nếu hình vẽ/bảng biến thiên nằm BÊN PHẢI văn bản câu hỏi: BẮT BUỘC dùng cấu trúc minipage song song để chữ bên trái và hình bên phải:
    \\noindent\\begin{minipage}[t]{0.60\\textwidth}
    \\textbf{Câu X.} Nội dung câu hỏi...
    \\begin{tasks}(2)
    \\task \\textbf{A.} ...
    \\task \\textbf{B.} ...
    \\task \\textbf{C.} ...
    \\task \\textbf{D.} ...
    \\end{tasks}
    \\end{minipage}%
    \\hfill
    \\begin{minipage}[t]{0.38\\textwidth}
    \\vspace{0pt}
    \\centering
    \\begin{tikzpicture}[scale=...]
    ...
    \\end{tikzpicture}
    \\end{minipage}
  + Nếu hình vẽ nằm DƯỚI câu hỏi: Đặt hình vẽ căn giữa ngay bên dưới: \\begin{center}\\begin{tikzpicture}...\\end{tikzpicture}\\end{center}.

- BỐ CỤC CÁC ĐÁP ÁN TRẮC NGHIỆM (A, B, C, D):
  + Nhìn chính xác cách chia dòng của 4 đáp án trong ảnh:
    * 4 đáp án nằm trên 1 dòng: Dùng \\begin{tasks}(4) \\task \\textbf{A.} ... \\task \\textbf{B.} ... \\task \\textbf{C.} ... \\task \\textbf{D.} ... \\end{tasks}
    * 4 đáp án chia làm 2 dòng (2 cột): Dùng \\begin{tasks}(2) ... \\end{tasks}
    * 4 đáp án xếp dọc (4 dòng): Dùng \\begin{tasks}(1) ... \\end{tasks}
  + Luôn in đậm nhãn đáp án: \\textbf{A.}, \\textbf{B.}, \\textbf{C.}, \\textbf{D.}

- ĐỀ THI 2 CỘT (TWO COLUMNS):
  + Nếu ảnh là trang đề thi chia làm 2 cột dọc: Dùng môi trường \\begin{multicols}{2} ... \\end{multicols}.

======================================================================
3. QUY CHUẨN VẼ HÌNH TIKZ & BẢNG BIẾN THIÊN (ĐẸP & CHUẨN XÁC):
======================================================================
- ĐỒ THỊ HÀM SỐ:
  + Vẽ hệ trục Oxy có mũi tên ->, đánh dấu các điểm cắt trục toạ độ, cực trị, tiệm cận (đường đứt nét dashed).
  + Vẽ đường cong hàm số mượt mà bằng \\draw[thick, smooth, samples=100, domain=...] plot (\\x, {công thức});
- BẢNG BIẾN THIÊN:
  + Dựng bảng bằng \\begin{tikzpicture} hoặc tkz-tab hoặc tabular, khoảng cách các cột rộng rãi (>= 2cm), có vạch kép || ở điểm không xác định, mũi tên biến thiên rõ ràng.
- HÌNH HỌC KHÔNG GIAN / HÌNH PHẲNG:
  + Nét khuất dùng nét đứt \\draw[dashed], nét nhìn thấy dùng \\draw[thick].
  + Ký hiệu góc vuông, đỉnh, tên điểm rõ ràng.

======================================================================
4. KÝ HIỆU TOÁN HỌC VIỆT NAM CHUẨN:
======================================================================
- Vector: \\vec{a}, \\overrightarrow{AB}.
- Tập hợp: \\mathbb{R}, \\mathbb{N}, \\mathbb{Z}, \\mathbb{Q}, \\mathbb{C}, \\varnothing.
- Phân số: Luôn dùng \\dfrac{a}{b} cho công thức hiển thị đẹp.
- Hệ phương trình/tuyển: \\begin{cases} ... \\end{cases} hoặc \\left[\\begin{array}{l} ... \\end{array}\\right.
- Tích phân / Đạo hàm: \\int_{a}^{b} f(x)\\,\\mathrm{d}x, f'(x), y''.
- Chữ tiếng Việt trong công thức toán phải đặt trong \\text{...} (ví dụ: $V_{\\text{chóp}}$, $\\text{đpcm}$).

======================================================================
5. ĐỊNH DẠNG ĐẦU RA:
======================================================================
${outputFormat}
- Chỉ trả về MÃ LATEX THUẦN TÚY. KHÔNG bọc trong markdown fences (\`\`\`latex ... \`\`\`).
- KHÔNG thêm bất kỳ câu chào, nhận xét hay giải thích nào trước hoặc sau mã LaTeX.
${customNotes ? `\nLƯU Ý ĐẶC BIỆT TỪ NGƯỜI DÙNG: ${customNotes}` : ''}`;
}

/**
 * Robust LaTeX extractor — handles all Gemini response variations:
 * 1. Response wrapped in ```latex / ```tex / ``` code fences
 * 2. Multiple code blocks (joins them)
 * 3. Raw LaTeX without fences
 * 4. LaTeX mixed with explanation text
 */
function extractLatexFromResponse(rawText) {
  if (!rawText || !rawText.trim()) return '';

  let text = rawText.trim();

  // Strategy 1: Extract content from markdown code fences
  // Matches ```latex, ```tex, ```LaTeX, ``` (with or without language tag)
  const codeFenceRegex = /```(?:latex|tex|LaTeX|Latex)?\s*\n?([\s\S]*?)```/gi;
  const fenceMatches = [...text.matchAll(codeFenceRegex)];

  if (fenceMatches.length > 0) {
    // Join all code blocks (some models split across multiple fences)
    const extracted = fenceMatches.map(m => m[1].trim()).join('\n\n');
    if (extracted.length > 50) {
      return extracted;
    }
  }

  // Strategy 2: Extract from \documentclass to \end{document}
  const docMatch = text.match(/(\\documentclass[\s\S]*\\end\{document\})/i);
  if (docMatch) {
    return docMatch[1].trim();
  }

  // Strategy 3: Strip any remaining code fence markers and surrounding text
  text = text.replace(/^```[a-zA-Z]*\s*/gm, '').replace(/^```\s*$/gm, '');

  // Remove common Gemini explanation patterns before/after LaTeX
  text = text.replace(/^(Here is|Here's|Đây là|Dưới đây|Below is|The following)[^\n]*\n+/i, '');
  text = text.replace(/\n+(Note:|Lưu ý:|Explanation:|Giải thích:)[^\n]*/gi, '');

  return text.trim();
}

/**
 * Gemini Vision API handler with Self-Healing Multi-Key & Multi-Model Instant Fallback
 */
async function callGeminiVision(apiKeys, base64Image, mimeType, isFullDocument = true, customNotes = '', requestedModel = 'gemini-3.8-flash') {
  let rawKeys = [];
  if (Array.isArray(apiKeys)) {
    rawKeys = apiKeys;
  } else if (typeof apiKeys === 'string') {
    rawKeys = apiKeys.split(/[,;\n]+/).map(k => k.trim());
  }

  // Include environment backup keys if configured in .env
  if (process.env.GEMINI_BACKUP_KEY) {
    rawKeys.push(...process.env.GEMINI_BACKUP_KEY.split(/[,;\n]+/).map(k => k.trim()));
  }
  if (process.env.GEMINI_API_KEY) {
    rawKeys.push(...process.env.GEMINI_API_KEY.split(/[,;\n]+/).map(k => k.trim()));
  }

  const keysList = rawKeys
    .map(key => typeof key === 'string' ? key.trim() : '')
    .filter((key, index, keys) => key.length > 10 && keys.indexOf(key) === index);

  if (keysList.length === 0) {
    throw new Error('Chưa có Gemini API Key hợp lệ! Hãy bấm vào biểu tượng Cài đặt (⚙) ở góc phải để nhập Gemini API Key miễn phí từ Google AI Studio (aistudio.google.com).');
  }

  // Candidate models priority list: gemini-3.8-flash -> gemini-3.7-flash -> gemini-3.1-pro -> fallbacks
  const candidateModels = [
    requestedModel,
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.1-pro',
    'gemini-2.5-pro',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-pro',
    'gemini-1.5-flash'
  ].filter((v, i, a) => v && a.indexOf(v) === i);

  const promptText = buildSystemPrompt(isFullDocument, customNotes);

  const payload = {
    contents: [
      {
        parts: [
          { text: promptText },
          {
            inlineData: {
              mimeType: mimeType || 'image/jpeg',
              data: base64Image
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      topP: 0.95,
      maxOutputTokens: 65536
    }
  };

  let lastError = null;
  let hasSwitchedKey = false;
  let hasSwitchedModel = false;
  const startTime = Date.now();

  modelLoop:
  for (let modelIdx = 0; modelIdx < candidateModels.length; modelIdx++) {
    const modelName = candidateModels[modelIdx];
    const cleanModel = modelName.replace(/^models\//, '');

    for (let keyIdx = 0; keyIdx < keysList.length; keyIdx++) {
      const currentKey = keysList[keyIdx];
      const keyPreview = `${currentKey.substring(0, 6)}...${currentKey.slice(-4)}`;

      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${currentKey}`;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorText = await response.text();
          let parsed;
          try { parsed = JSON.parse(errorText); } catch (_) {}
          const msg = parsed?.error?.message || `Gemini API Error (${response.status}): ${errorText}`;

          const isOverloadedOrUnavailable = response.status === 503 ||
            response.status === 408 ||
            response.status === 500 ||
            response.status === 502 ||
            response.status === 504 ||
            /\bUNAVAILABLE\b|high demand|overloaded|temporarily/i.test(msg);

          if (isOverloadedOrUnavailable) {
            console.warn(`[Gemini OCR] Model "${cleanModel}" đang quá tải (HTTP ${response.status}).`);
            lastError = new Error(msg);
            if (keyIdx < keysList.length - 1) {
              continue;
            } else {
              hasSwitchedModel = true;
              continue modelLoop;
            }
          }

          const isRateLimitOrQuota = response.status === 429 || 
                                     msg.includes('RESOURCE_EXHAUSTED') || 
                                     msg.includes('quota') || 
                                     msg.includes('Quota exceeded') || 
                                     msg.includes('Rate limit') || 
                                     msg.includes('Too Many Requests');

          if (isRateLimitOrQuota) {
            console.warn(`[Gemini OCR] ⚠️ Model "${cleanModel}" với API Key #${keyIdx + 1} (${keyPreview}) bị giới hạn Quota / Rate Limit (HTTP ${response.status}).`);
            if (keyIdx < keysList.length - 1) {
              const nextKeyPreview = `${keysList[keyIdx + 1].substring(0, 6)}...${keysList[keyIdx + 1].slice(-4)}`;
              console.log(`[Gemini OCR] 🔄 Thử API Key dự phòng #${keyIdx + 2} (${nextKeyPreview}) cho model "${cleanModel}"...`);
              hasSwitchedKey = true;
              continue;
            } else {
              console.warn(`[Gemini OCR] 🔄 Tất cả Key đều đạt hạn mức cho "${cleanModel}". Đang chuyển sang model dự phòng tiếp theo...`);
              hasSwitchedModel = true;
              lastError = new Error(`Model ${cleanModel} hết quota: ${msg}`);
              continue modelLoop;
            }
          }

          const isModelUnavailable = response.status === 404 ||
            (response.status === 400 && (msg.includes('not found') || msg.includes('not supported') || msg.includes('does not exist') || msg.includes('invalid') || msg.includes('unsupported'))) ||
            msg.includes('no longer available') ||
            msg.includes('not found') ||
            msg.includes('is not supported');

          if (isModelUnavailable) {
            console.warn(`[Gemini OCR] Model "${cleanModel}" không khả dụng (${msg}). Tự động chuyển sang model kế tiếp...`);
            hasSwitchedModel = true;
            lastError = new Error(msg);
            continue modelLoop;
          }

          throw new Error(msg);
        }

        const data = await response.json();

        // Check for blocked/empty responses
        const candidate = data?.candidates?.[0];
        const finishReason = candidate?.finishReason;
        const rawText = candidate?.content?.parts?.[0]?.text || '';

        if (!rawText && finishReason === 'SAFETY') {
          throw new Error('Gemini đã từ chối xử lý ảnh do chính sách an toàn. Vui lòng thử ảnh khác hoặc đổi model.');
        }

        if (!rawText) {
          const blockReason = data?.promptFeedback?.blockReason;
          if (blockReason) {
            throw new Error(`Gemini đã chặn yêu cầu (${blockReason}). Vui lòng thử ảnh khác.`);
          }
          console.warn(`[Gemini OCR] Kết quả rỗng từ model "${cleanModel}". Đang thử model tiếp theo...`);
          lastError = new Error('Gemini trả về kết quả rỗng. Đang thử model khác...');
          hasSwitchedModel = true;
          continue modelLoop;
        }

        // Robust LaTeX extraction — handle all Gemini output variations
        let cleanLatex = extractLatexFromResponse(rawText);

        // Warn if output appears truncated (has \documentclass but no \end{document})
        if (cleanLatex.includes('\\documentclass') && !cleanLatex.includes('\\end{document}')) {
          console.warn('[Gemini OCR] Output appears truncated (missing \\end{document}). Appending closure.');
          cleanLatex += '\n\n\\end{document}';
        }

        const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`[Gemini OCR] ✅ Hoàn thành bằng model "${cleanModel}" trong ${elapsedSec}s (${cleanLatex.length} ký tự)`);

        return {
          latex: cleanLatex.trim(),
          usedModel: cleanModel,
          usedKeyIndex: keyIdx,
          switchedKey: hasSwitchedKey || keyIdx > 0,
          switchedModel: hasSwitchedModel || cleanModel !== requestedModel.replace(/^models\//, ''),
          usedKeyPreview: keyPreview,
          elapsedSeconds: parseFloat(elapsedSec)
        };
      } catch (err) {
        lastError = err;
        const msg = err.message || '';
        const isRateLimit = msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota') || msg.includes('Rate limit') || msg.includes('429');
        if (isRateLimit) {
          if (keyIdx < keysList.length - 1) {
            hasSwitchedKey = true;
            continue;
          } else {
            hasSwitchedModel = true;
            continue modelLoop;
          }
        }
        if (msg.includes('no longer available') || msg.includes('not found') || msg.includes('not supported') || msg.includes('high demand') || msg.includes('503')) {
          hasSwitchedModel = true;
          continue modelLoop;
        }
        throw err;
      }
    }
  }

  throw lastError || new Error('Không thể kết nối với Gemini API. Tất cả Model và API Key đều bị giới hạn hạn ngạch hoặc không khả dụng.');
}

/**
 * API Route: Convert Image / PDF to LaTeX (Dual path for Localhost & Vercel)
 */
app.post(['/api/convert', '/convert'], upload.single('image'), async (req, res) => {
  try {
    let base64Image = '';
    let mimeType = 'image/jpeg';

    if (req.file) {
      base64Image = req.file.buffer.toString('base64');
      mimeType = req.file.mimetype || 'image/jpeg';
    } else if (req.body.imageBase64) {
      const match = req.body.imageBase64.match(/^data:(image\/[a-zA-Z+]+|application\/pdf);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        base64Image = match[2];
      } else {
        base64Image = req.body.imageBase64;
      }
    }

    if (!base64Image) {
      return res.status(400).json({ success: false, error: 'Vui lòng cung cấp hình ảnh hoặc tệp đề toán (Upload hoặc Base64)!' });
    }

    const isFullDocument = req.body.isFullDocument !== 'false' && req.body.isFullDocument !== false;
    const customNotes = req.body.customNotes || '';

    let candidateKeys = [];
    if (req.body.apiKeys) {
      if (Array.isArray(req.body.apiKeys)) {
        candidateKeys.push(...req.body.apiKeys);
      } else if (typeof req.body.apiKeys === 'string') {
        candidateKeys.push(...req.body.apiKeys.split(/[,;\n]+/).map(k => k.trim()));
      }
    }
    if (req.body.apiKey) candidateKeys.push(req.body.apiKey);
    if (req.body.backupApiKey) candidateKeys.push(req.body.backupApiKey);
    if (process.env.GEMINI_API_KEY) candidateKeys.push(process.env.GEMINI_API_KEY);
    if (process.env.GEMINI_BACKUP_KEY) candidateKeys.push(process.env.GEMINI_BACKUP_KEY);

    candidateKeys = candidateKeys.filter((v, i, a) => v && a.indexOf(v) === i);
    const geminiModel = req.body.geminiModel || process.env.GEMINI_MODEL || 'gemini-3.8-flash';

    if (candidateKeys.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Chưa có Gemini API Key! Hãy nhập API Key miễn phí từ Google AI Studio (aistudio.google.com) ở mục Cài đặt, hoặc cấu hình GEMINI_API_KEY trong file .env.'
      });
    }

    const result = await callGeminiVision(candidateKeys, base64Image, mimeType, isFullDocument, customNotes, geminiModel);
    const latexResult = result.latex;
    const switchedKey = result.switchedKey;
    const switchedModel = result.switchedModel;
    let fallbackNotice = null;

    if (switchedModel && switchedKey) {
      fallbackNotice = `Đã tự động chuyển sang model "${result.usedModel}" và API Key #${result.usedKeyIndex + 1} (${result.usedKeyPreview}) do giới hạn hệ thống!`;
    } else if (switchedModel) {
      fallbackNotice = `Đã tự động chuyển sang model dự phòng "${result.usedModel}"!`;
    } else if (switchedKey) {
      fallbackNotice = `Đã tự động chuyển sang API Key #${result.usedKeyIndex + 1} (${result.usedKeyPreview}) do Key trước bị giới hạn hạn ngạch (Rate Limit)!`;
    }

    return res.json({
      success: true,
      latex: latexResult,
      engine: 'gemini',
      usedModel: result.usedModel,
      switchedKey: switchedKey,
      switchedModel: switchedModel,
      fallbackNotice: fallbackNotice,
      elapsedSeconds: result.elapsedSeconds,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error converting image to LaTeX:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Đã xảy ra lỗi khi chuyển đổi ảnh sang LaTeX.'
    });
  }
});

/**
 * API Route: Export LaTeX to .tex file download
 */
app.post(['/api/export-tex', '/export-tex'], (req, res) => {
  try {
    const { latex, filename = 'de_toan.tex' } = req.body;
    if (!latex) {
      return res.status(400).send('Không có nội dung LaTeX để xuất.');
    }

    const safeFilename = filename.endsWith('.tex') ? filename : `${filename}.tex`;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(safeFilename)}"`);
    return res.send(latex);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/**
 * Health check & App status
 */
app.get(['/api/status', '/status'], (req, res) => {
  res.json({
    status: 'online',
    app: 'Math2LaTeX Studio PRO',
    version: '1.0.0',
    defaultModel: 'gemini-3.8-flash',
    hasEnvKey: !!process.env.GEMINI_API_KEY
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Math2LaTeX Studio PRO đang chạy tại: http://localhost:${PORT}`);
    console.log(`💡 Mở trình duyệt và truy cập http://localhost:${PORT}`);
    console.log(`=======================================================`);
  });
}

export default app;
