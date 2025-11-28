export const isImage = (filename: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename);
export const isVideo = (filename: string) => /\.(mp4|webm|ogg|mov)$/i.test(filename);
