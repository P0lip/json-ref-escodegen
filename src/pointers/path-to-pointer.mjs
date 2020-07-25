import encodePointer from './encode-pointer.mjs';

export default function (path) {
  if (path.length === 0) {
    return '#';
  }

  return `#/${path.map(encodePointer).join('/')}`;
}
