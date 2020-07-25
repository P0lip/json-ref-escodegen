const SLASH = /\//g;
const TILDE = /~/g;

export default function (pointer) {
  return pointer.replace(SLASH, '~1').replace(TILDE, '~0');
}
