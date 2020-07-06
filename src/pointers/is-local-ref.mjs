export default function (pointer) {
  return (
    pointer.length > 0 &&
    pointer[0] === '#' &&
    (pointer.length === 1 || pointer[1] === '/')
  );
}
