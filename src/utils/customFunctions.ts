export const downloadFileFromUrl = (url: string, filename?: string) => {
  if (!url) return;

  const link = document.createElement('a');
  link.href = url;
  link.rel = 'noopener noreferrer';

  if (filename) {
    link.download = filename;
  }

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
