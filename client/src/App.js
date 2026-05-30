import React, { useState, useRef, useCallback } from 'react';

const styles = {
  container: {
    maxWidth: 800,
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    color: '#fff',
  },
  header: {
    textAlign: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 700,
    background: 'linear-gradient(90deg, #00d2ff, #3a7bd5)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: 8,
  },
  subtitle: {
    color: '#8892b0',
    fontSize: 16,
  },
  dropZone: {
    border: '2px dashed #3a7bd5',
    borderRadius: 16,
    padding: '40px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s',
    background: 'rgba(58, 123, 213, 0.05)',
    marginBottom: 20,
  },
  dropZoneActive: {
    border: '2px dashed #00d2ff',
    background: 'rgba(0, 210, 255, 0.1)',
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  uploadText: {
    color: '#8892b0',
    fontSize: 16,
  },
  preview: {
    width: '100%',
    maxHeight: 400,
    objectFit: 'contain',
    borderRadius: 12,
    marginBottom: 20,
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  button: {
    background: 'linear-gradient(90deg, #00d2ff, #3a7bd5)',
    border: 'none',
    color: '#fff',
    padding: '12px 32px',
    fontSize: 16,
    fontWeight: 600,
    borderRadius: 8,
    cursor: 'pointer',
    display: 'block',
    margin: '0 auto 20px',
    transition: 'transform 0.2s, opacity 0.2s',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  loading: {
    textAlign: 'center',
    padding: 20,
    color: '#00d2ff',
  },
  spinner: {
    display: 'inline-block',
    width: 24,
    height: 24,
    border: '3px solid rgba(0,210,255,0.3)',
    borderTop: '3px solid #00d2ff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: 10,
    verticalAlign: 'middle',
  },
  section: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 16,
    color: '#00d2ff',
  },
  colorRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: 12,
    border: '2px solid rgba(255,255,255,0.2)',
    flexShrink: 0,
  },
  colorLabel: {
    flex: 1,
    fontSize: 14,
  },
  colorPercent: {
    fontWeight: 700,
    color: '#00d2ff',
    marginLeft: 8,
  },
  bar: {
    height: 6,
    borderRadius: 3,
    background: 'rgba(0,210,255,0.2)',
    marginTop: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
    background: 'linear-gradient(90deg, #00d2ff, #3a7bd5)',
    transition: 'width 0.8s ease',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },
  infoItem: {
    background: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
    padding: '12px 16px',
  },
  infoLabel: {
    fontSize: 12,
    color: '#8892b0',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 600,
  },
  tag: {
    display: 'inline-block',
    background: 'rgba(0,210,255,0.15)',
    color: '#00d2ff',
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 13,
    margin: '0 6px 8px 0',
  },
  edgePreview: {
    maxWidth: '100%',
    borderRadius: 8,
    marginTop: 12,
    border: '1px solid rgba(255,255,255,0.1)',
  },
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
      default: h = 0;
    }
  }
  return [h * 360, s * 100, l * 100];
}

function getColorName(r, g, b) {
  const [h, s, l] = rgbToHsl(r, g, b);
  if (l < 15) return '黑色';
  if (l > 85) return '白色';
  if (s < 15) return l > 50 ? '浅灰' : '深灰';
  if (h < 15 || h >= 345) return '红色';
  if (h < 45) return '橙色';
  if (h < 70) return '黄色';
  if (h < 160) return '绿色';
  if (h < 200) return '青色';
  if (h < 260) return '蓝色';
  if (h < 290) return '紫色';
  if (h < 345) return '粉色';
  return '红色';
}

function classifyScene(colors, brightness, contrast, edges) {
  const tags = [];
  const [avgH, avgS, avgL] = colors.length > 0
    ? rgbToHsl(colors[0].r, colors[0].g, colors[0].b)
    : [0, 0, 50];

  if (brightness > 180) tags.push('明亮场景');
  else if (brightness < 80) tags.push('暗色场景');
  else tags.push('中等亮度');

  if (contrast > 60) tags.push('高对比度');
  else if (contrast < 30) tags.push('低对比度');

  if (edges > 0.3) tags.push('细节丰富');
  else if (edges < 0.1) tags.push('平滑/模糊');

  const hasGreen = colors.some(c => {
    const [h] = rgbToHsl(c.r, c.g, c.b);
    return h > 70 && h < 160 && c.percentage > 15;
  });
  if (hasGreen) tags.push('可能含植物/自然');

  const hasBlue = colors.some(c => {
    const [h, s, l] = rgbToHsl(c.r, c.g, c.b);
    return h > 190 && h < 260 && s > 30 && l > 30 && c.percentage > 15;
  });
  if (hasBlue) tags.push('可能含天空/水');

  const hasSkinTone = colors.some(c => {
    const [h, s] = rgbToHsl(c.r, c.g, c.b);
    return h > 10 && h < 45 && s > 20 && s < 70 && c.percentage > 10;
  });
  if (hasSkinTone) tags.push('可能含人像/肤色');

  if (avgS < 20) tags.push('低饱和度/灰调');
  else if (avgS > 70) tags.push('高饱和度/鲜艳');

  const darkRatio = colors.filter(c => {
    const [, , l] = rgbToHsl(c.r, c.g, c.b);
    return l < 30;
  }).reduce((s, c) => s + c.percentage, 0);
  if (darkRatio > 50) tags.push('暗色调为主');

  const lightRatio = colors.filter(c => {
    const [, , l] = rgbToHsl(c.r, c.g, c.b);
    return l > 70;
  }).reduce((s, c) => s + c.percentage, 0);
  if (lightRatio > 50) tags.push('亮色调为主');

  return tags;
}

function analyzeImage(canvas) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  // Color quantization
  const colorMap = {};
  let totalBrightness = 0;
  const brightnessArr = [];
  const pixelCount = w * h;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    // Quantize to reduce color space
    const qr = Math.round(r / 32) * 32;
    const qg = Math.round(g / 32) * 32;
    const qb = Math.round(b / 32) * 32;
    const key = `${qr},${qg},${qb}`;
    colorMap[key] = (colorMap[key] || 0) + 1;

    const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
    totalBrightness += brightness;
    brightnessArr.push(brightness);
  }

  // Sort colors by frequency
  const sortedColors = Object.entries(colorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([key, count]) => {
      const [r, g, b] = key.split(',').map(Number);
      return { r, g, b, percentage: (count / pixelCount * 100).toFixed(1) };
    });

  // Brightness stats
  const avgBrightness = totalBrightness / pixelCount;
  const sortedBrightness = brightnessArr.sort((a, b) => a - b);
  const medianBrightness = sortedBrightness[Math.floor(sortedBrightness.length / 2)];

  // Contrast (standard deviation of brightness)
  let variance = 0;
  for (const b of brightnessArr) {
    variance += (b - avgBrightness) ** 2;
  }
  const contrast = Math.sqrt(variance / pixelCount);

  // Edge detection (simplified Sobel)
  let edgeSum = 0;
  const edgeCanvas = document.createElement('canvas');
  edgeCanvas.width = w;
  edgeCanvas.height = h;
  const edgeCtx = edgeCanvas.getContext('2d');
  const edgeData = edgeCtx.createImageData(w, h);

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = (y * w + x) * 4;
      const idxL = (y * w + x - 1) * 4;
      const idxR = (y * w + x + 1) * 4;
      const idxU = ((y - 1) * w + x) * 4;
      const idxD = ((y + 1) * w + x) * 4;

      const grayC = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      const grayL = (data[idxL] + data[idxL + 1] + data[idxL + 2]) / 3;
      const grayR = (data[idxR] + data[idxR + 1] + data[idxR + 2]) / 3;
      const grayU = (data[idxU] + data[idxU + 1] + data[idxU + 2]) / 3;
      const grayD = (data[idxD] + data[idxD + 1] + data[idxD + 2]) / 3;

      const gx = grayR - grayL;
      const gy = grayD - grayU;
      const mag = Math.min(255, Math.sqrt(gx * gx + gy * gy));
      edgeSum += mag;

      const ei = (y * w + x) * 4;
      edgeData.data[ei] = edgeData.data[ei + 1] = edgeData.data[ei + 2] = mag;
      edgeData.data[ei + 3] = 255;
    }
  }
  edgeCtx.putImageData(edgeData, 0, 0);
  const edgeDensity = edgeSum / (pixelCount * 255);

  // Saturation analysis
  let totalSat = 0;
  for (let i = 0; i < data.length; i += 4) {
    const [, s] = rgbToHsl(data[i], data[i + 1], data[i + 2]);
    totalSat += s;
  }
  const avgSaturation = totalSat / pixelCount;

  // Warm/cool analysis
  let warmPixels = 0, coolPixels = 0;
  for (let i = 0; i < data.length; i += 4) {
    const [h] = rgbToHsl(data[i], data[i + 1], data[i + 2]);
    if ((h < 60 || h > 300)) warmPixels++;
    else coolPixels++;
  }
  const warmRatio = warmPixels / pixelCount;

  const sceneTags = classifyScene(sortedColors, avgBrightness, contrast, edgeDensity);

  return {
    colors: sortedColors,
    brightness: { avg: avgBrightness.toFixed(0), median: medianBrightness.toFixed(0) },
    contrast: contrast.toFixed(0),
    edgeDensity: (edgeDensity * 100).toFixed(1),
    edgeDataUrl: edgeCanvas.toDataURL(),
    dimensions: `${w} x ${h}`,
    pixels: pixelCount.toLocaleString(),
    avgSaturation: avgSaturation.toFixed(0),
    warmRatio: (warmRatio * 100).toFixed(0),
    sceneTags,
  };
}

function App() {
  const [imagePreview, setImagePreview] = useState(null);
  const [results, setResults] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setResults(null);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const classify = useCallback(() => {
    const img = new Image();
    img.onload = () => {
      setAnalyzing(true);
      const canvas = canvasRef.current;
      // Limit size for performance
      const maxDim = 400;
      const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      setTimeout(() => {
        const result = analyzeImage(canvas);
        setResults(result);
        setAnalyzing(false);
      }, 50);
    };
    img.src = imagePreview;
  }, [imagePreview]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>AI 图像识别</h1>
        <p style={styles.subtitle}>
          本地图像特征分析 · 颜色/亮度/边缘/场景识别
        </p>
      </header>

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <span style={{
          ...styles.section,
          display: 'inline-block',
          background: 'rgba(0,210,255,0.1)',
          color: '#00d2ff',
          padding: '8px 16px',
          fontSize: 14,
        }}>
          本地计算，无需下载模型
        </span>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div
        style={{ ...styles.dropZone, ...(dragActive ? styles.dropZoneActive : {}) }}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
      >
        <div style={styles.uploadIcon}>📷</div>
        <p style={styles.uploadText}>拖拽图片到此处，或点击上传</p>
        <p style={{ color: '#555', fontSize: 13, marginTop: 8 }}>支持 JPG、PNG、GIF、WebP</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {imagePreview && (
        <div style={{ textAlign: 'center' }}>
          <img src={imagePreview} alt="Preview" style={styles.preview} />
          <button
            style={{ ...styles.button, ...(analyzing ? styles.buttonDisabled : {}) }}
            onClick={classify}
            disabled={analyzing}
          >
            {analyzing ? '分析中...' : '🔍 开始分析'}
          </button>
        </div>
      )}

      {analyzing && (
        <div style={styles.loading}>
          <span style={styles.spinner}></span>
          正在分析图像特征...
        </div>
      )}

      {results && (
        <>
          {/* Scene Tags */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>场景标签</div>
            <div>
              {results.sceneTags.map((tag, i) => (
                <span key={i} style={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Image Info */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>图像信息</div>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>尺寸</div>
                <div style={styles.infoValue}>{results.dimensions}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>像素数</div>
                <div style={styles.infoValue}>{results.pixels}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>平均亮度</div>
                <div style={styles.infoValue}>{results.brightness.avg}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>对比度</div>
                <div style={styles.infoValue}>{results.contrast}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>边缘密度</div>
                <div style={styles.infoValue}>{results.edgeDensity}%</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>平均饱和度</div>
                <div style={styles.infoValue}>{results.avgSaturation}%</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>暖色调占比</div>
                <div style={styles.infoValue}>{results.warmRatio}%</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>冷色调占比</div>
                <div style={styles.infoValue}>{100 - results.warmRatio}%</div>
              </div>
            </div>
          </div>

          {/* Dominant Colors */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>主要颜色</div>
            {results.colors.map((c, i) => (
              <div key={i} style={styles.colorRow}>
                <div style={{
                  ...styles.colorSwatch,
                  background: `rgb(${c.r},${c.g},${c.b})`,
                }} />
                <span style={styles.colorLabel}>
                  {getColorName(c.r, c.g, c.b)} ({c.r}, {c.g}, {c.b})
                </span>
                <span style={styles.colorPercent}>{c.percentage}%</span>
              </div>
            ))}
          </div>

          {/* Edge Detection */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>边缘检测</div>
            <p style={{ color: '#8892b0', fontSize: 14, marginBottom: 12 }}>
              边缘密度: {results.edgeDensity}% - {parseFloat(results.edgeDensity) > 20 ? '细节丰富' : parseFloat(results.edgeDensity) > 10 ? '中等细节' : '平滑/简单'}
            </p>
            <img src={results.edgeDataUrl} alt="Edge detection" style={styles.edgePreview} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
