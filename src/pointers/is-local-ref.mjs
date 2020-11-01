export default function (pointer) {
  return (
    typeof pointer === 'string' &&
    pointer.length > 0 &&
    pointer[0] === '#' &&
    (pointer.length === 1 || pointer[1] === '/')
  );
}
