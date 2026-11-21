/**
 * Utility untuk memproses dan mengompres file foto avatar pengguna secara lokal.
 * Menghasilkan data URL JPEG yang terkompresi dan terpotong persegi rapi
 * agar tidak membebani LocalStorage.
 */
export function processAvatarFile(file: File, maxSize: number = 240): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Format file tidak didukung. Harap pilih file gambar (JPG, PNG, atau WebP).'));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      reject(new Error('Ukuran foto terlalu besar. Maksimal ukuran foto adalah 10 MB.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      reject(new Error('Gagal membaca file gambar dari perangkat Anda.'));
    };

    reader.onload = () => {
      const img = new Image();
      img.onerror = () => {
        reject(new Error('Gagal memuat gambar. Pastikan file gambar tidak rusak.'));
      };

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const width = img.naturalWidth || img.width;
          const height = img.naturalHeight || img.height;

          // Hitung potongan bujur sangkar (center-crop)
          const minDim = Math.min(width, height);
          const startX = (width - minDim) / 2;
          const startY = (height - minDim) / 2;

          canvas.width = maxSize;
          canvas.height = maxSize;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(reader.result as string);
            return;
          }

          // Gambar dengan potongan persegi presisi
          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, maxSize, maxSize);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(compressedDataUrl);
        } catch {
          // Fallback jika canvas terhambat
          resolve(reader.result as string);
        }
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}
