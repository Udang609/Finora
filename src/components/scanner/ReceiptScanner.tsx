import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  Image, 
  X, 
  Check, 
  RotateCw, 
  ScanLine,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { Button } from '../common/Button';
import { useFinance } from '../../context/FinanceContext';
import type { Category, TransactionType } from '../../types';

interface ParsedReceipt {
  merchant?: string;
  date?: string;
  total?: number;
  items: ParsedItem[];
  rawText: string;
}

interface ParsedItem {
  name: string;
  price: number;
  quantity?: number;
  category?: Category;
}

interface ReceiptScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transactions: Omit<import('../../types').Transaction, 'id' | 'createdAt'>[]) => void;
}

const EXPENSE_CATEGORIES: Category[] = [
  'Makanan & Minuman',
  'Transportasi',
  'Belanja',
  'Tagihan & Utilitas',
  'Kesehatan',
  'Pendidikan',
  'Keluarga',
  'Lain-lain',
];

function formatIDR(num: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
}

function parseIndonesianReceipt(text: string): ParsedReceipt {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const result: ParsedReceipt = { items: [], rawText: text };

  const merchantPatterns = [
    /^(ALFAMART|ALFA MIDI|INDOMART|INDOMARKET|CIRCLE K|LAWSON|FAMILY MART|SUPERINDO|HERO|GIANT|LOTTE MART|CARREFOUR|TRANS MART|DAISO|MATAHARI|SOGO|METRO|ACE HARDWARE|INFORMAR|GRAND LUCKY|FARMER MARKET|RANCH MARKET|FOODHALL|SEJATI|BOSTON|YAMAYA|DON DON DONKI)/i,
    /^(TOKO|WARUNG|RESTORAN|CAFE|KEDAI|RM\.|RUMAH MAKAN|WARTEG|WARUNG MAKAN)/i,
  ];

  const datePatterns = [
    /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/,
    /(\d{1,2}\s+(JAN|FEB|MAR|APR|MEI|JUN|JUL|AGU|SEP|OKT|NOV|DES)[A-Z]*\s+\d{2,4})/i,
    /(TGL|TANGGAL|DATE)[\s:]*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i,
  ];

  const totalPatterns = [
    /(TOTAL|GRAND TOTAL|JUMLAH|BAYAR|KEMBALI)[\s:]*[Rp\s]*([\d.,]+)/i,
    /(SUB\s*TOTAL|TOTAL\s*BELANJA)[\s:]*[Rp\s]*([\d.,]+)/i,
    /^[\s]*[Rp\s]*([\d.,]{5,})[\s]*$/m,
  ];

  for (const line of lines.slice(0, 10)) {
    for (const pattern of merchantPatterns) {
      const match = line.match(pattern);
      if (match) {
        result.merchant = match[0].replace(/[^\w\s]/g, '').trim();
        break;
      }
    }
    if (result.merchant) break;
  }

  for (const line of lines) {
    for (const pattern of datePatterns) {
      const match = line.match(pattern);
      if (match) {
        result.date = match[1] || match[2] || match[0];
        break;
      }
    }
    if (result.date) break;
  }

  for (const line of lines) {
    for (const pattern of totalPatterns) {
      const match = line.match(pattern);
      if (match) {
        const numStr = (match[2] || match[1] || match[0]).replace(/[Rp\s]/g, '').replace(/\./g, '').replace(/,/g, '.');
        const num = parseFloat(numStr);
        if (!isNaN(num) && num > 0) {
          result.total = Math.round(num);
          break;
        }
      }
    }
    if (result.total) break;
  }

  const itemPattern = /^(.+?)\s+(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)\s*$/;
  const qtyPricePattern = /^(.+?)\s+(\d+)\s*[xX]\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)\s*$/;

  for (const line of lines) {
    if (/^(TOTAL|SUB|DISKON|PPN|TAX|CHANGE|KEMBALI|CASH|TUNAI|DEBIT|KREDIT|QRIS|OVO|GOPAY|DANA|SHOPEEPAY)/i.test(line)) continue;
    if (/^(TERIMA KASIH|THANK YOU|STRUK|RECEIPT|INVOICE|NOTA)/i.test(line)) continue;

    let match = line.match(qtyPricePattern);
    if (match) {
      const name = match[1].trim();
      const qty = parseInt(match[2], 10);
      const price = parseFloat(match[3].replace(/\./g, '').replace(/,/g, '.'));
      if (!isNaN(price) && price > 0 && name.length > 1) {
        result.items.push({ name, price: Math.round(price), quantity: qty });
      }
      continue;
    }

    match = line.match(itemPattern);
    if (match) {
      const name = match[1].trim();
      const price = parseFloat(match[2].replace(/\./g, '').replace(/,/g, '.'));
      if (!isNaN(price) && price > 0 && name.length > 1 && name.length < 50) {
        result.items.push({ name, price: Math.round(price), quantity: 1 });
      }
    }
  }

  result.items.forEach(item => {
    const lowerName = item.name.toLowerCase();
    if (/nasi|ayam|mie|soto|bakso|goreng|sate|rendang|gulai|ikan|sayur|makan|minum|kopi|teh|es|jus|air|snack|cemilan|roti|kue|donat|pizza|burger|kentang|nugget|sosis|bakpao|dimsum|siomay|batagor|cireng|cilok|pentol|baso|bakwan|risol|pastel|tahu|tempe|krupuk|kerupuk|emping|rempeyek|peuyeum|tape|dodol|onde|klepon|getuk|nagasari|lapis|bolu|brownies|cheesecake|tiramisu|pudding|jelly|agar|es krim|ice cream|gelato|yogurt|smoothie|milkshake|boba|bubble tea|thai tea|matcha|latte|cappuccino|americano|espresso|kopi susu|vietnam drip|tubruk|jahe|sereh|bandrek|bajigur|wedang|sarsaparilla|strawberry|melon|alpukat|avocado|durian|mangga|mango|pisang|banana|apel|apple|jeruk|orange|semangka|watermelon|pepaya|papaya|nanas|pineapple|anggur|grape|kelapa|coconut|kelapa muda|es kelapa|es campur|es teler|es doger|es cendol|dawet|bubur|bubur sumsum|bubur ketan|bubur ayam|bubur kacang|bubur candil|kolak|kolak pisang|kolak ubi|kolak labu/i.test(lowerName)) {
      item.category = 'Makanan & Minuman';
    } else if (/bensin|pertamina|shell|total|bp|akr|fuel|parkir|toll|tol|transjakarta|mrt|lrt|kereta|commuter|kjb|gojek|grab|maxim|blue bird|express|taksi|taxi|ojek|angkot|bus|elf|travel|po|primajasa|ludy|rosalia|safari|harapan jaya|antri|antrian|terminal|stasiun|bandara/i.test(lowerName)) {
      item.category = 'Transportasi';
    } else if (/apotek|kimia farma|guardian|century|watsons|sociolla|beauty|skincare|makeup|vitamin|suplemen|obat|vitamin c|vitamin d|vitamin b|vitamin e|probiotik|yakult|vitacimin|energen|milo|bear brand|indomilk|ultra milk|greenfields|frisian flag|dancow|bendera|ancora|royal auspicious|morinaga|pediasure|ensure|nutren|glucerna|diabetasol|nutramil|sustagen|resource|benecol|nestle/i.test(lowerName)) {
      item.category = 'Kesehatan';
    } else if (/listrik|pdam|pamsimas|telkom|indihome|first media|biznet|myrepublic|oxygen|cbn|linknet|iconnet|neunet|fastnet|wifi|internet|pulsa|paket data|paket internet|telepon/i.test(lowerName)) {
      item.category = 'Tagihan & Utilitas';
    } else {
      item.category = 'Belanja';
    }
  });

  return result;
}

export const ReceiptScanner: React.FC<ReceiptScannerProps> = ({ isOpen, onClose, onSave }) => {
  const { showToast } = useFinance();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [step, setStep] = useState<'camera' | 'preview' | 'processing' | 'review'>('camera');
  const [imageData, setImageData] = useState<string>('');
  const [parsedData, setParsedData] = useState<ParsedReceipt | null>(null);
  const [editedItems, setEditedItems] = useState<ParsedItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [cameraReady, setCameraReady] = useState(false);
  const workerRef = useRef<any>(null);

  useEffect(() => {
    const initWorker = async () => {
      try {
        const { createWorker } = await import('tesseract.js');
        workerRef.current = await createWorker('ind');
      } catch (err) {
        console.error('Tesseract init error:', err);
        setError('Gagal memuat mesin OCR. Coba refresh halaman.');
      }
    };
    initWorker();
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    if (step !== 'camera' || !videoRef.current) return;
    let mounted = true;
    navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
    })
      .then(stream => {
        if (mounted && videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraReady(true);
        }
      })
      .catch(err => {
        console.error('Camera error:', err);
        setError('Tidak bisa mengakses kamera. Izinkan akses kamera di browser.');
      });
    return () => { mounted = false; };
  }, [step]);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setImageData(dataUrl);
    stopCamera();
    setStep('preview');
  }, [stopCamera]);

  const processImage = useCallback(async () => {
    if (!imageData || !workerRef.current) return;
    setStep('processing');
    setIsProcessing(true);
    setError('');

    try {
      const { data: { text } } = await workerRef.current.recognize(imageData);
      const parsed = parseIndonesianReceipt(text);
      setParsedData(parsed);
      setEditedItems(parsed.items.map(item => ({ ...item })));
      setStep('review');
    } catch (err) {
      console.error('OCR error:', err);
      setError('Gagal membaca struk. Coba foto yang lebih jelas atau ketik manual.');
      setStep('preview');
    } finally {
      setIsProcessing(false);
    }
  }, [imageData]);

  const retakePhoto = useCallback(() => {
    setImageData('');
    setParsedData(null);
    setEditedItems([]);
    setStep('camera');
  }, []);

  const updateItem = useCallback((index: number, field: keyof ParsedItem, value: any) => {
    setEditedItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  }, []);

  const addItem = useCallback(() => {
    setEditedItems(prev => [...prev, { name: '', price: 0, quantity: 1, category: 'Lain-lain' }]);
  }, []);

  const removeItem = useCallback((index: number) => {
    setEditedItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSave = useCallback(() => {
    const validItems = editedItems.filter(item => item.name.trim() && item.price > 0);
    if (validItems.length === 0) {
      showToast('Minimal satu item dengan nama dan harga harus diisi.', 'error');
      return;
    }

    const merchant = parsedData?.merchant || 'Struk Scan';
    const date = parsedData?.date ? new Date(parsedData.date.replace(/[-/]/g, '-')).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0];

    const transactions = validItems.map(item => ({
      title: `${merchant} - ${item.name}`,
      type: 'expense' as TransactionType,
      amount: item.price * (item.quantity || 1),
      category: item.category || 'Lain-lain',
      date,
      notes: `Scan struk: ${merchant}${parsedData?.rawText ? ` | ${parsedData.rawText.substring(0, 100)}` : ''}`,
    }));

    onSave(transactions);
    onClose();
    showToast(`${transactions.length} transaksi dari struk berhasil disimpan.`, 'success');
  }, [editedItems, parsedData, onSave, onClose, showToast]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-white rounded-2xl shadow-soft-lg border border-finora-border overflow-hidden flex flex-col transform transition-all animate-in slide-in-from-bottom-4 duration-200" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-finora-border px-4 py-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-finora-textPrimary flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-finora-primary" />
            Scan Struk
          </h2>
          <div className="flex items-center gap-2">
            {step === 'review' && (
              <Button type="button" variant="ghost" size="sm" onClick={handleSave}>
                <Check className="w-3.5 h-3.5" />
                Simpan ({editedItems.filter(i => i.name && i.price > 0).length})
              </Button>
            )}
            <Button type="button" variant="ghost" size="sm" onClick={() => { stopCamera(); onClose(); }}>
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="hidden md:flex px-4 py-2 bg-slate-50 border-b border-finora-border">
          <div className="flex items-center gap-1 w-full">
            {['camera', 'preview', 'processing', 'review'].map((s, i) => (
              <React.Fragment key={s}>
                <div className={`flex-1 h-1.5 rounded transition-colors ${
                  ['camera', 'preview', 'processing', 'review'].indexOf(step) >= i 
                    ? 'bg-finora-primary' 
                    : 'bg-slate-200'
                }`} />
                {i < 3 && <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  ['camera', 'preview', 'processing', 'review'].indexOf(step) > i 
                    ? 'bg-finora-primary text-white' 
                    : ['camera', 'preview', 'processing', 'review'].indexOf(step) === i 
                      ? 'bg-finora-primary text-white ring-2 ring-white ring-offset-2' 
                      : 'bg-slate-200 text-slate-500'
                }`}>
                  {i + 1}
                </div>}
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center justify-between mt-1 px-1 text-[10px] text-slate-500">
            <span>Kamera</span>
            <span>Pratinjau</span>
            <span>Proses</span>
            <span>Review</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-finora-red flex-shrink-0 mt-0.5" />
              <p className="text-sm text-finora-red">{error}</p>
            </div>
          )}

          {/* Step 1: Camera */}
          {step === 'camera' && (
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
                <video 
                  ref={videoRef} 
                  className="w-full h-full object-cover" 
                  playsInline 
                  autoPlay 
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-3/4 h-3/4 border-2 border-finora-primary/50 rounded-lg relative">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-finora-primary rounded-full" />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-finora-primary rounded-full" />
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-finora-primary rounded-full" />
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-finora-primary rounded-full" />
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-slate-500">Arahkan kamera ke struk belanja</p>
              <Button 
                type="button" 
                variant="primary" 
                size="lg" 
                className="w-full"
                leftIcon={<Camera className="w-4 h-4" />}
                onClick={capturePhoto}
                disabled={!cameraReady}
              >
                Ambil Foto
              </Button>
              <p className="text-center text-xs text-slate-400">Atau pilih dari galeri</p>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                id="gallery-input"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      setImageData(reader.result as string);
                      setStep('preview');
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <Button type="button" variant="outline" size="md" className="w-full" onClick={() => document.getElementById('gallery-input')?.click()}>
                <Image className="w-4 h-4" />
                Pilih dari Galeri
              </Button>
            </div>
          )}

          {/* Step 2: Preview */}
          {step === 'preview' && imageData && (
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
                <img src={imageData} alt="Struk" className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" size="lg" className="flex-1" onClick={retakePhoto} leftIcon={<RotateCw className="w-4 h-4" />}>
                  Ulangi
                </Button>
                <Button type="button" variant="primary" size="lg" className="flex-1" onClick={processImage} disabled={isProcessing} leftIcon={<ScanLine className="w-4 h-4" />}>
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Proses OCR'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Processing */}
          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-12 h-12 text-finora-primary animate-spin" />
              <p className="text-base font-medium text-finora-textPrimary">Memproses gambar struk...</p>
              <p className="text-sm text-slate-500 text-center px-4">Membaca teks dengan OCR & mengekstrak item belanja</p>
              <div className="w-full max-w-xs h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-finora-primary rounded-full animate-pulse" style={{ width: '100%' }} />
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 'review' && parsedData && (
            <div className="space-y-4">
              {/* Merchant & Date */}
              <div className="bg-white rounded-xl border border-finora-border p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-finora-lightBlue text-finora-primary flex items-center justify-center">
                    <ScanLine className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">Merchant</p>
                    <input
                      type="text"
                      value={parsedData.merchant || ''}
                      onChange={(e) => setParsedData(prev => prev ? { ...prev, merchant: e.target.value } : null)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-finora-border bg-white focus:outline-none focus:ring-2 focus:ring-finora-primary"
                      placeholder="Nama toko"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-finora-lightBlue text-finora-primary flex items-center justify-center">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">Tanggal</p>
                    <input
                      type="date"
                      value={parsedData.date ? new Date(parsedData.date.replace(/[-/]/g, '-')).toISOString().split('T')[0] : ''}
                      onChange={(e) => setParsedData(prev => prev ? { ...prev, date: e.target.value } : null)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-finora-border bg-white focus:outline-none focus:ring-2 focus:ring-finora-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-white rounded-xl border border-finora-border overflow-hidden">
                <div className="px-4 py-3 border-b border-finora-border flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-finora-textPrimary flex items-center gap-2">
                    <ScanLine className="w-4 h-4 text-finora-primary" />
                    Item Terdeteksi ({editedItems.filter(i => i.name && i.price > 0).length})
                  </h3>
                  <Button type="button" variant="ghost" size="sm" onClick={addItem} leftIcon={<Check className="w-3.5 h-3.5" />}>
                    Tambah
                  </Button>
                </div>
                <div className="divide-y divide-finora-border max-h-[400px] overflow-auto">
                  {editedItems.map((item, index) => (
                    <div key={index} className="p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-500 w-6 text-center">{index + 1}</span>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem(index, 'name', e.target.value)}
                          placeholder="Nama item"
                          className="flex-1 px-3 py-2 text-sm rounded-lg border border-finora-border focus:outline-none focus:ring-2 focus:ring-finora-primary"
                        />
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)} className="text-finora-red hover:bg-red-50">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 pl-8">
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-0.5">Harga</label>
                          <input
                            type="number"
                            inputMode="numeric"
                            value={item.price}
                            onChange={(e) => updateItem(index, 'price', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-finora-border focus:outline-none focus:ring-2 focus:ring-finora-primary"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-0.5">Qty</label>
                          <input
                            type="number"
                            inputMode="numeric"
                            value={item.quantity || 1}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-finora-border focus:outline-none focus:ring-2 focus:ring-finora-primary"
                            min="1"
                            max="99"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-0.5">Kategori</label>
                          <select
                            value={item.category || 'Lain-lain'}
                            onChange={(e) => updateItem(index, 'category', e.target.value as Category)}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-finora-border focus:outline-none focus:ring-2 focus:ring-finora-primary bg-white"
                          >
                            {EXPENSE_CATEGORIES.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="pl-8 text-right text-sm font-medium text-finora-textPrimary">
                        Subtotal: {formatIDR(item.price * (item.quantity || 1))}
                      </div>
                    </div>
                  ))}
                  {editedItems.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                      <ScanLine className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                      <p>Tidak ada item terdeteksi. Tambah manual di bawah.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="bg-slate-50 rounded-xl border border-finora-border p-4 text-right">
                <p className="text-sm text-slate-500">Total yang akan dicatat</p>
                <p className="text-2xl font-bold text-finora-textPrimary">
                  {formatIDR(editedItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0))}
                </p>
              </div>

              {/* Save Button */}
              <Button 
                type="button" 
                variant="primary" 
                size="lg" 
                className="w-full"
                leftIcon={<Check className="w-5 h-5" />}
                onClick={handleSave}
              >
                Simpan {editedItems.filter(i => i.name && i.price > 0).length} Transaksi
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};