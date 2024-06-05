export const detectMimeType = (bytes: Uint8Array): string | undefined => {
  const length = 4;

  if (bytes.length >= length) {
    const signatureArr = new Array(length);

    for (let index = 0; index < length; index++) {
      signatureArr[index] = bytes[index].toString(16);
    }

    const signature = signatureArr.join('').toUpperCase();

    switch (signature) {
      case '89504E47':
        return 'image/png';
      case '47494638':
        return 'image/gif';
      case 'FFD8FFDB':
      case 'FFD8FFE0':
        return 'image/jpeg';
      default:
        return;
    }
  }
};
