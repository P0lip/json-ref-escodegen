export default function (value) {
  const type = typeof value;

  return (
    type === 'string' ||
    type === 'number' ||
    type === 'boolean' ||
    type === 'bigint' ||
    type === 'object'
  );
}
