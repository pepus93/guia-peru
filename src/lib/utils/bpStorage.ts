const key = (flightId: string, travelerId: string) => `bp_img_${flightId}_${travelerId}`;

export function getBpImage(flightId: string, travelerId: string): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(key(flightId, travelerId));
}

export function setBpImage(flightId: string, travelerId: string, dataUrl: string) {
  localStorage.setItem(key(flightId, travelerId), dataUrl);
}

export function removeBpImage(flightId: string, travelerId: string) {
  localStorage.removeItem(key(flightId, travelerId));
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
