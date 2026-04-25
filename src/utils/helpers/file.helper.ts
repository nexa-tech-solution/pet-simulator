export const MAX_IMAGE_FILE_SIZE = 2 * 1024 * 1024;

export const readImageFile = (file: File, onLoad: (imageUrl: string) => void, onError: (message: string) => void) => {
  if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type)) {
    onError('Choose a PNG, JPG, WEBP, or GIF image.');
    return;
  }

  if (file.size > MAX_IMAGE_FILE_SIZE) {
    onError('Image must be smaller than 2 MB.');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === 'string') onLoad(reader.result);
  };
  reader.readAsDataURL(file);
};
