import decodePointer from './decode-pointer.mjs';

export default function (pointer) {
  if (pointer.length < 2) {
    return null;
  }

  return pointer.slice(2).split('/').map(decodePointer);
}
