const fileInput = document.getElementById("fileInput");
const pdfInput = document.getElementById("pdfInput");
const sheetSelect = document.getElementById("sheetSelect");
const exportMode = document.getElementById("exportMode");
const resolutionSelect = document.getElementById("resolution");
const exportButton = document.getElementById("exportButton");
const statusLabel = document.getElementById("status");
const previewCanvas = document.getElementById("previewCanvas");
const renderStage = document.getElementById("renderStage");
const resolutionWarning = document.getElementById("resolutionWarning");
const sheetHelper = document.getElementById("sheetHelper");
const tabs = Array.from(document.querySelectorAll(".tab"));
const xlsxPanel = document.getElementById("xlsxPanel");
const pdfPanel = document.getElementById("pdfPanel");

const tableStyle = {
  fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif',
  fontSize: 12,
  paddingX: 8,
  paddingY: 6,
  headerFill: "#f1f5f9",
  gridColor: "#c7d2de",
  textColor: "#1f2a37",
  minColWidth: 64,
  maxColWidth: 280,
};

const pxPerPt = 96 / 72;
const maxImageSize = 30000;
const maxCanvasDimension = 16000;
const maxRenderScale = 90;
const resolutionPresets = {
  xlsx: [30, 45, 60, 75, 90],
  pdf: [10, 15, 20, 25, 30],
};

if (window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions) {
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = "lib/pdf.worker.min.js";
}

let workbook = null;
let currentSheetName = "";
let currentRawSheetData = null;
let currentMode = "pdf";
let pdfBuffer = null;
let pdfFileName = "";

const setStatus = (message) => {
  statusLabel.textContent = message;
};

const setControlsEnabled = ({ xlsxReady, pdfReady }) => {
  const isXlsx = currentMode === "xlsx";
  sheetSelect.disabled = !xlsxReady || !isXlsx || exportMode.value === "separate";
  exportMode.disabled = !xlsxReady || !isXlsx;
  resolutionSelect.disabled = !(isXlsx ? xlsxReady : pdfReady);
  exportButton.disabled = !(isXlsx ? xlsxReady : pdfReady);
};

const updateResolutionWarning = () => {
  const value = Number(resolutionSelect.value || 0);
  if (!resolutionWarning) return;
  if (value >= 60) {
    resolutionWarning.textContent =
      "High resolution can be slow and memory-heavy. Expect larger files.";
  } else if (value >= 45) {
    resolutionWarning.textContent =
      "Higher resolution may increase export time and file size.";
  } else {
    resolutionWarning.textContent = "";
  }
};

const updateResolutionOptions = (mode) => {
  const presets = resolutionPresets[mode] || resolutionPresets.xlsx;
  const current = Number(resolutionSelect.value) || presets[0];
  resolutionSelect.innerHTML = "";
  presets.forEach((value, index) => {
    const option = document.createElement("option");
    option.value = String(value);
    option.textContent = `${value}x`;
    if (index === 0) {
      option.selected = true;
    }
    resolutionSelect.appendChild(option);
  });
  if (presets.includes(current)) {
    resolutionSelect.value = String(current);
  }
  updateResolutionWarning();
};

const updateExportModeUI = () => {
  const isSeparate = exportMode.value === "separate";
  if (currentMode === "xlsx") {
    sheetSelect.disabled = isSeparate || !workbook;
  }
  if (sheetHelper) {
    sheetHelper.textContent = isSeparate
      ? "All sheets will be exported; no selection needed."
      : "Choose a sheet to export.";
  }
};

const setMode = (mode) => {
  currentMode = mode;
  const isXlsx = mode === "xlsx";
  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.mode === mode);
  });
  if (xlsxPanel) xlsxPanel.classList.toggle("hidden", !isXlsx);
  if (pdfPanel) pdfPanel.classList.toggle("hidden", isXlsx);
  updateResolutionOptions(mode);
  updateExportModeUI();
  setControlsEnabled({ xlsxReady: !!workbook, pdfReady: !!pdfBuffer });
  renderPreview();
};

const sanitizeName = (name) =>
  name.replace(/[^a-z0-9_-]+/gi, "_").replace(/_+/g, "_");

const emptySheetData = () => ({
  cells: [],
  merges: [],
  colWidths: [],
  rowHeights: [],
});

const indexedPalette = [
  "000000",
  "FFFFFF",
  "FF0000",
  "00FF00",
  "0000FF",
  "FFFF00",
  "FF00FF",
  "00FFFF",
  "000000",
  "FFFFFF",
  "FF0000",
  "00FF00",
  "0000FF",
  "FFFF00",
  "FF00FF",
  "00FFFF",
  "800000",
  "008000",
  "000080",
  "808000",
  "800080",
  "008080",
  "C0C0C0",
  "808080",
  "9999FF",
  "993366",
  "FFFFCC",
  "CCFFFF",
  "660066",
  "FF8080",
  "0066CC",
  "CCCCFF",
  "000080",
  "FF00FF",
  "FFFF00",
  "00FFFF",
  "800080",
  "800000",
  "008080",
  "0000FF",
  "00CCFF",
  "CCFFFF",
  "CCFFCC",
  "FFFF99",
  "99CCFF",
  "FF99CC",
  "CC99FF",
  "FFCC99",
  "3366FF",
  "33CCCC",
  "99CC00",
  "FFCC00",
  "FF9900",
  "FF6600",
  "666699",
  "969696",
  "003366",
  "339966",
  "003300",
  "333300",
  "993300",
  "993366",
  "333399",
  "333333",
];

const themePalette = [
  "FFFFFF",
  "000000",
  "1F497D",
  "4F81BD",
  "C0504D",
  "9BBB59",
  "8064A2",
  "4BACC6",
  "F79646",
  "0000FF",
  "800080",
  "00B050",
];

const applyTint = (hex, tint) => {
  if (tint == null || tint === 0) return hex;
  const num = parseInt(hex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  const mix = tint > 0 ? 255 : 0;
  const factor = Math.abs(tint);
  const channel = (value) => Math.round(value + (mix - value) * factor);
  const toHex = (value) => value.toString(16).padStart(2, "0");
  return `${toHex(channel(r))}${toHex(channel(g))}${toHex(channel(b))}`;
};

const normalizeColor = (value) => {
  if (!value) return null;
  const rgb = value.rgb || value;
  if (rgb) {
    const cleaned = rgb.length === 8 ? rgb.slice(2) : rgb;
    if (cleaned.length === 6) {
      return `#${cleaned.toLowerCase()}`;
    }
    if (cleaned.length === 3) {
      return `#${cleaned.toLowerCase()}`;
    }
  }
  if (value.indexed != null) {
    const indexed = indexedPalette[value.indexed] || "000000";
    return `#${indexed.toLowerCase()}`;
  }
  if (value.theme != null) {
    const base = themePalette[value.theme] || "000000";
    const tinted = applyTint(base, value.tint || 0);
    return `#${tinted.toLowerCase()}`;
  }
  return null;
};

const getCellFont = (cell) => {
  const font = (cell && cell.style && cell.style.font) || {};
  const name = font.name || "IBM Plex Sans";
  const size = font.sz || tableStyle.fontSize;
  const weight = font.bold ? "bold " : "";
  const style = font.italic ? "italic " : "";
  return {
    fontString: `${style}${weight}${size}px ${name}`,
    size,
    color: normalizeColor(font.color) || tableStyle.textColor,
    name,
    bold: !!font.bold,
    italic: !!font.italic,
  };
};

const getCellFill = (cell) => {
  const fill = cell && cell.style && cell.style.fill;
  if (!fill) return null;
  if (fill.patternType && fill.patternType !== "solid") {
    return null;
  }
  return normalizeColor(fill.fgColor) || normalizeColor(fill.bgColor);
};

const getCellAlignment = (cell) => {
  const alignment = cell && cell.style && cell.style.alignment;
  return {
    horizontal: alignment && alignment.horizontal,
    vertical: alignment && alignment.vertical,
  };
};

const getCellBorder = (cell) => {
  return (cell && cell.style && cell.style.border) || null;
};

const colSpecToPx = (spec) => {
  if (!spec) return null;
  if (spec.wpx) return spec.wpx;
  if (spec.wch) return Math.floor(spec.wch * 7 + 5);
  if (spec.width) return Math.floor(spec.width * 7 + 5);
  return null;
};

const rowSpecToPx = (spec) => {
  if (!spec) return null;
  if (spec.hpx) return spec.hpx;
  if (spec.hpt) return spec.hpt * pxPerPt;
  if (spec.height) return spec.height * pxPerPt;
  return null;
};

const getSheetRange = (sheet) => {
  if (!sheet) return null;
  if (sheet["!ref"]) {
    try {
      return XLSX.utils.decode_range(sheet["!ref"]);
    } catch (error) {
      return null;
    }
  }

  const keys = Object.keys(sheet).filter((key) => key[0] !== "!");
  if (!keys.length) return null;

  let minRow = Infinity;
  let minCol = Infinity;
  let maxRow = -1;
  let maxCol = -1;
  keys.forEach((key) => {
    try {
      const cell = XLSX.utils.decode_cell(key);
      minRow = Math.min(minRow, cell.r);
      minCol = Math.min(minCol, cell.c);
      maxRow = Math.max(maxRow, cell.r);
      maxCol = Math.max(maxCol, cell.c);
    } catch (error) {
      return;
    }
  });

  if (maxRow < 0 || maxCol < 0) return null;
  return { s: { r: minRow, c: minCol }, e: { r: maxRow, c: maxCol } };
};

const extractSheetData = (sheet) => {
  const range = getSheetRange(sheet);
  if (!sheet || !range) {
    return emptySheetData();
  }
  const rowCount = range.e.r - range.s.r + 1;
  const colCount = range.e.c - range.s.c + 1;

  const cells = Array.from({ length: rowCount }, (_, rowIndex) => {
    const row = [];
    for (let colIndex = 0; colIndex < colCount; colIndex += 1) {
      const address = XLSX.utils.encode_cell({
        r: rowIndex + range.s.r,
        c: colIndex + range.s.c,
      });
      const cell = sheet[address];
      let text = "";
      let hasValue = false;
      let hasStyle = false;
      const hasCell = !!cell;
      if (cell) {
        if (cell.w != null) {
          text = String(cell.w);
          hasValue = true;
        } else if (cell.v != null) {
          text = String(cell.v);
          hasValue = true;
        } else if (cell.f) {
          hasValue = true;
        }
        if (cell.t && cell.t !== "z") {
          hasValue = true;
        }
        hasStyle = !!(cell.s && Object.keys(cell.s).length);
      }
      row.push({
        text,
        style: cell && cell.s ? cell.s : {},
        row: rowIndex,
        col: colIndex,
        hasValue,
        hasStyle,
        hasCell,
      });
    }
    return row;
  });

  const merges = (sheet["!merges"] || [])
    .map((merge) => ({
      s: { r: merge.s.r - range.s.r, c: merge.s.c - range.s.c },
      e: { r: merge.e.r - range.s.r, c: merge.e.c - range.s.c },
    }))
    .filter(
      (merge) =>
        merge.s.r >= 0 &&
        merge.s.c >= 0 &&
        merge.e.r < rowCount &&
        merge.e.c < colCount
    );

  const colWidths = Array.from({ length: colCount }, (_, index) => {
    const spec = sheet["!cols"] ? sheet["!cols"][index + range.s.c] : null;
    return colSpecToPx(spec);
  });

  const rowHeights = Array.from({ length: rowCount }, (_, index) => {
    const spec = sheet["!rows"] ? sheet["!rows"][index + range.s.r] : null;
    return rowSpecToPx(spec);
  });

  return { cells, merges, colWidths, rowHeights };
};


const buildMergeMaps = (merges) => {
  const mergeStarts = new Map();
  const mergeSkips = new Set();

  merges.forEach((merge) => {
    const startKey = `${merge.s.r}:${merge.s.c}`;
    mergeStarts.set(startKey, merge);
    for (let r = merge.s.r; r <= merge.e.r; r += 1) {
      for (let c = merge.s.c; c <= merge.e.c; c += 1) {
        if (r === merge.s.r && c === merge.s.c) continue;
        mergeSkips.add(`${r}:${c}`);
      }
    }
  });

  return { mergeStarts, mergeSkips };
};

const buildDefaultColWidths = (sheetData) => {
  const colCount = sheetData.cells.length ? sheetData.cells[0].length : 0;
  return Array.from({ length: colCount }, (_, index) =>
    sheetData.colWidths[index] || tableStyle.minColWidth
  );
};

const buildDefaultRowHeights = (sheetData) => {
  return sheetData.cells.map((row, rowIndex) => {
    const preset = sheetData.rowHeights[rowIndex];
    if (preset) return preset;
    let maxSize = tableStyle.fontSize;
    row.forEach((cell) => {
      const font = getCellFont(cell);
      maxSize = Math.max(maxSize, font.size);
    });
    return maxSize + tableStyle.paddingY * 2;
  });
};

const getBorderStyle = (borderSide) => {
  if (!borderSide) return null;
  const color = normalizeColor(borderSide.color) || tableStyle.gridColor;
  return `1px solid ${color}`;
};

const applyCellStyles = (td, cell) => {
  const font = getCellFont(cell);
  const fill = getCellFill(cell);
  const alignment = getCellAlignment(cell);
  const border = getCellBorder(cell);

  td.style.backgroundColor = fill || "transparent";
  td.style.color = font.color;
  td.style.fontFamily = font.name;
  td.style.fontSize = `${font.size}px`;
  td.style.fontWeight = font.bold ? "600" : "400";
  td.style.fontStyle = font.italic ? "italic" : "normal";
  td.style.textAlign = alignment.horizontal || "left";
  td.style.verticalAlign = alignment.vertical || "middle";
  td.style.padding = `${tableStyle.paddingY}px ${tableStyle.paddingX}px`;
  td.style.whiteSpace = alignment.wrapText ? "normal" : "nowrap";
  td.style.boxSizing = "border-box";

  if (border) {
    const top = getBorderStyle(border.top);
    const right = getBorderStyle(border.right);
    const bottom = getBorderStyle(border.bottom);
    const left = getBorderStyle(border.left);
    if (top) td.style.borderTop = top;
    if (right) td.style.borderRight = right;
    if (bottom) td.style.borderBottom = bottom;
    if (left) td.style.borderLeft = left;
  } else {
    td.style.border = `1px solid ${tableStyle.gridColor}`;
  }
};

const getTableDimensions = (sheetData) => {
  const colWidths = buildDefaultColWidths(sheetData);
  const rowHeights = buildDefaultRowHeights(sheetData);
  const width = colWidths.reduce((sum, value) => sum + value, 0);
  const height = rowHeights.reduce((sum, value) => sum + value, 0);
  return { width, height, colWidths, rowHeights };
};

const buildTableElement = (sheetData) => {
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.tableLayout = "fixed";
  table.style.fontFamily = tableStyle.fontFamily;

  const { colWidths, rowHeights } = getTableDimensions(sheetData);
  const { mergeStarts, mergeSkips } = buildMergeMaps(sheetData.merges);

  const colGroup = document.createElement("colgroup");
  colWidths.forEach((width) => {
    const col = document.createElement("col");
    col.style.width = `${width}px`;
    colGroup.appendChild(col);
  });
  table.appendChild(colGroup);

  sheetData.cells.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");
    tr.style.height = `${rowHeights[rowIndex]}px`;
    row.forEach((cell, colIndex) => {
      const key = `${rowIndex}:${colIndex}`;
      if (mergeSkips.has(key)) {
        return;
      }
      const merge = mergeStarts.get(key);
      const td = document.createElement("td");
      if (merge) {
        td.rowSpan = merge.e.r - merge.s.r + 1;
        td.colSpan = merge.e.c - merge.s.c + 1;
      }
      td.textContent = cell.text || "";
      applyCellStyles(td, cell);
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });

  return table;
};

const sliceSheetData = (sheetData, maxRows) => {
  const rows = sheetData.cells.length;
  if (rows <= maxRows) {
    return sheetData;
  }
  const rowIndexes = [0];
  for (let i = 1; i < Math.min(rows, maxRows); i += 1) {
    rowIndexes.push(i);
  }

  const rowMap = new Map(rowIndexes.map((row, index) => [row, index]));
  const cells = rowIndexes.map((row) => sheetData.cells[row]);
  const merges = sheetData.merges
    .filter((merge) => rowMap.has(merge.s.r) && rowMap.has(merge.e.r))
    .map((merge) => ({
      s: { r: rowMap.get(merge.s.r), c: merge.s.c },
      e: { r: rowMap.get(merge.e.r), c: merge.e.c },
    }));

  return {
    cells,
    merges,
    colWidths: sheetData.colWidths,
    rowHeights: sheetData.rowHeights,
  };
};

const renderTableToCanvas = async (sheetData, baseScale = 6) => {
  if (!window.html2canvas) {
    throw new Error("html2canvas failed to load.");
  }
  if (!renderStage) {
    throw new Error("Render stage not found.");
  }

  const dimensions = getTableDimensions(sheetData);
  const widthScale = dimensions.width ? maxImageSize / dimensions.width : 1;
  const heightScale = dimensions.height ? maxImageSize / dimensions.height : 1;
  const scale = Math.min(baseScale, widthScale, heightScale, maxRenderScale);

  renderStage.innerHTML = "";
  const table = buildTableElement(sheetData);
  renderStage.appendChild(table);

  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  const canvas = await window.html2canvas(table, {
    backgroundColor: "#ffffff",
    scale,
  });

  renderStage.innerHTML = "";
  return canvas;
};

const scaleCanvasToMax = (canvas, maxPx) => {
  const ratio = Math.min(1, maxPx / canvas.width, maxPx / canvas.height);
  if (ratio === 1) {
    return canvas;
  }
  const scaled = document.createElement("canvas");
  scaled.width = Math.max(1, Math.floor(canvas.width * ratio));
  scaled.height = Math.max(1, Math.floor(canvas.height * ratio));
  const ctx = scaled.getContext("2d");
  ctx.drawImage(canvas, 0, 0, scaled.width, scaled.height);
  return scaled;
};

let previewToken = 0;
const renderPreview = async () => {
  const token = (previewToken += 1);
  const ctx = previewCanvas.getContext("2d");
  ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
  if (currentMode !== "xlsx") {
    return;
  }
  const effectiveData = currentRawSheetData || emptySheetData();
  if (!effectiveData || !effectiveData.cells.length) {
    return;
  }

  const previewRows = 40;
  const previewData = sliceSheetData(effectiveData, previewRows);
  try {
    const tableCanvas = await renderTableToCanvas(previewData, 1.2);
    if (token !== previewToken) return;
    const fitScale = Math.min(
      previewCanvas.width / tableCanvas.width,
      previewCanvas.height / tableCanvas.height
    );
    const drawWidth = tableCanvas.width * fitScale;
    const drawHeight = tableCanvas.height * fitScale;
    const offsetX = (previewCanvas.width - drawWidth) / 2;
    const offsetY = (previewCanvas.height - drawHeight) / 2;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
    ctx.drawImage(tableCanvas, offsetX, offsetY, drawWidth, drawHeight);
  } catch (error) {
    console.error(error);
  }
};

const dataUrlToBytes = (dataUrl) => {
  if (!dataUrl.startsWith("data:image/png")) {
    throw new Error("Canvas did not produce a PNG data URL.");
  }
  const base64 = dataUrl.split(",")[1] || "";
  if (!base64) {
    throw new Error("PNG data URL is empty.");
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const canvasToPngBytes = (canvas) =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        try {
          const dataUrl = canvas.toDataURL("image/png");
          const bytes = dataUrlToBytes(dataUrl);
          resolve(bytes);
          return;
        } catch (error) {
          reject(new Error("Failed to create PNG blob."));
          return;
        }
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const bytes = new Uint8Array(reader.result);
        const isPng =
          bytes.length >= 8 &&
          bytes[0] === 0x89 &&
          bytes[1] === 0x50 &&
          bytes[2] === 0x4e &&
          bytes[3] === 0x47;
        if (!isPng) {
          reject(new Error("The input is not a PNG file."));
          return;
        }
        resolve(bytes);
      };
      reader.onerror = () => reject(new Error("Failed to read PNG blob."));
      reader.readAsArrayBuffer(blob);
    }, "image/png");
  });

const createPdfFromCanvas = async (canvas) => {
  const pdfDoc = await PDFLib.PDFDocument.create();
  const pngBytes = await canvasToPngBytes(canvas);
  const pngImage = await pdfDoc.embedPng(pngBytes);
  const pageWidth = canvas.width / pxPerPt;
  const pageHeight = canvas.height / pxPerPt;
  const page = pdfDoc.addPage([pageWidth, pageHeight]);
  page.drawImage(pngImage, {
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
  });
  return pdfDoc.save();
};

const appendCanvasPage = async (pdfDoc, canvas) => {
  const pngBytes = await canvasToPngBytes(canvas);
  const pngImage = await pdfDoc.embedPng(pngBytes);
  const pageWidth = canvas.width / pxPerPt;
  const pageHeight = canvas.height / pxPerPt;
  const page = pdfDoc.addPage([pageWidth, pageHeight]);
  page.drawImage(pngImage, {
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
  });
};

const downscaleCanvas = (canvas, ratio) => {
  const scaled = document.createElement("canvas");
  scaled.width = Math.max(1, Math.floor(canvas.width * ratio));
  scaled.height = Math.max(1, Math.floor(canvas.height * ratio));
  const ctx = scaled.getContext("2d");
  ctx.drawImage(canvas, 0, 0, scaled.width, scaled.height);
  return scaled;
};

const appendCanvasPageWithRetry = async (pdfDoc, canvas) => {
  let attempt = 0;
  let current = canvas;
  while (attempt < 3) {
    try {
      await appendCanvasPage(pdfDoc, current);
      return;
    } catch (error) {
      const message = error && error.message ? error.message : "";
      if (!message.includes("PNG")) {
        throw error;
      }
      attempt += 1;
      current = downscaleCanvas(current, 0.7);
    }
  }
  throw new Error("Failed to embed PNG after retries.");
};

const buildPdfFromPdfBuffer = async (buffer) => {
  if (!window.pdfjsLib) {
    throw new Error("pdf.js failed to load.");
  }
  const requestedScale = Number(resolutionSelect.value) || 30;
  const loadingTask = window.pdfjsLib.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;
  if (!pdf.numPages) {
    throw new Error("PDF has no pages.");
  }
  const pdfDoc = await PDFLib.PDFDocument.create();

  for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
    setStatus(`Rendering page ${pageIndex} of ${pdf.numPages}...`);
    const page = await pdf.getPage(pageIndex);
    const baseViewport = page.getViewport({ scale: 1 });
    const maxScale = Math.min(
      maxCanvasDimension / baseViewport.width,
      maxCanvasDimension / baseViewport.height
    );
    const scale = Math.min(requestedScale, maxScale);
    if (scale < requestedScale) {
      setStatus(
        `Rendering page ${pageIndex} of ${pdf.numPages} at ${scale.toFixed(
          1
        )}x (scaled down to fit memory)...`
      );
    }
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    if (!canvas.width || !canvas.height) {
      throw new Error("Rendered PDF page has zero size.");
    }
    const ctx = canvas.getContext("2d");
    await page.render({ canvasContext: ctx, viewport }).promise;
    const scaledCanvas = scaleCanvasToMax(canvas, maxImageSize);
    await appendCanvasPageWithRetry(pdfDoc, scaledCanvas);
  }

  return pdfDoc.save();
};

const downloadBlob = (bytes, filename) => {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
};

const buildPdfForSheet = async (sheetName, sheetData) => {
  const requestedScale = Number(resolutionSelect.value) || 6;
  const tableCanvas = await renderTableToCanvas(sheetData, requestedScale);
  const scaledCanvas = scaleCanvasToMax(tableCanvas, maxImageSize);
  return createPdfFromCanvas(scaledCanvas);
};

const updateSheetSelect = (sheetNames) => {
  sheetSelect.innerHTML = "";
  sheetNames.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    sheetSelect.appendChild(option);
  });
  currentSheetName = sheetNames[0] || "";
};

const loadSheetData = (name) => {
  if (!workbook || !name) {
    currentRawSheetData = emptySheetData();
    renderPreview();
    return;
  }
  const sheet = workbook.Sheets[name];
  currentRawSheetData = extractSheetData(sheet);
  currentSheetName = name;
  renderPreview();
};

fileInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  if (!window.XLSX) {
    setStatus("XLSX parser failed to load. Check your network and reload.");
    return;
  }
  setStatus("Reading workbook...");
  try {
    const arrayBuffer = await file.arrayBuffer();
    workbook = XLSX.read(arrayBuffer, {
      type: "array",
      cellStyles: true,
      cellNF: true,
      cellDates: true,
    });
    updateSheetSelect(workbook.SheetNames);
    loadSheetData(sheetSelect.value);
    setControlsEnabled({ xlsxReady: true, pdfReady: !!pdfBuffer });
    updateExportModeUI();
    setStatus("Workbook loaded.");
  } catch (error) {
    console.error(error);
    const message = error && error.message ? error.message : String(error || "");
    setStatus(`Failed to read the XLSX file. ${message}`.trim());
    setControlsEnabled({ xlsxReady: false, pdfReady: !!pdfBuffer });
  }
});

pdfInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  setStatus("Reading PDF...");
  try {
    pdfBuffer = await file.arrayBuffer();
    pdfFileName = file.name || "document.pdf";
    setControlsEnabled({ xlsxReady: !!workbook, pdfReady: true });
    setStatus("PDF loaded.");
  } catch (error) {
    console.error(error);
    const message = error && error.message ? error.message : String(error || "");
    setStatus(`Failed to read the PDF file. ${message}`.trim());
    setControlsEnabled({ xlsxReady: !!workbook, pdfReady: false });
  }
});

sheetSelect.addEventListener("change", (event) => {
  loadSheetData(event.target.value);
});

resolutionSelect.addEventListener("change", () => {
  updateResolutionWarning();
});

exportMode.addEventListener("change", () => {
  updateExportModeUI();
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setMode(tab.dataset.mode);
  });
});

exportButton.addEventListener("click", async () => {
  if (!window.PDFLib || !window.html2canvas) {
    setStatus("PDF tools failed to load. Please reload the page.");
    return;
  }
  if (currentMode === "xlsx" && !workbook) {
    setStatus("Please load a workbook first.");
    return;
  }
  if (currentMode === "pdf" && !pdfBuffer) {
    setStatus("Please load a PDF first.");
    return;
  }
  setStatus("Generating PDF...");
  exportButton.disabled = true;

  try {
    if (currentMode === "xlsx") {
      if (exportMode.value === "separate") {
        for (const name of workbook.SheetNames) {
          const sheet = workbook.Sheets[name];
          const rawData = extractSheetData(sheet);
          const bytes = await buildPdfForSheet(name, rawData);
          const filename = `${sanitizeName(name)}.pdf`;
          downloadBlob(bytes, filename);
        }
      } else {
        const data = currentRawSheetData || emptySheetData();
        const bytes = await buildPdfForSheet(currentSheetName, data);
        const filename = `${sanitizeName(currentSheetName || "sheet")}.pdf`;
        downloadBlob(bytes, filename);
      }
      setStatus("PDF ready.");
    } else {
      const flattened = await buildPdfFromPdfBuffer(pdfBuffer);
      const base = pdfFileName ? pdfFileName.replace(/\.pdf$/i, "") : "document";
      const filename = `${sanitizeName(base)}-flattened.pdf`;
      downloadBlob(flattened, filename);
      setStatus("PDF ready.");
    }
  } catch (error) {
    console.error(error);
    const message = error && error.message ? error.message : "";
    if (message.includes("PNG")) {
      setStatus(
        "PDF generation failed while embedding PNG. Try a lower resolution."
      );
    } else {
      setStatus("PDF generation failed.");
    }
  } finally {
    exportButton.disabled = false;
  }
});

renderPreview();
updateResolutionWarning();
updateExportModeUI();
setMode("pdf");
setControlsEnabled({ xlsxReady: false, pdfReady: false });
