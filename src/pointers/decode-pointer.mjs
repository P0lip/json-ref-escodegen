const SLASH = /~1/g;
const TILDE = /~0/g;

export default function (pointer) {
  return pointer.replace(SLASH, '/').replace(TILDE, '~');
}
