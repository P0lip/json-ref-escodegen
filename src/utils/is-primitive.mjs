export default function (value) {
  if (value === null) {
    return true;
  }

  const type = typeof value;

  return (
    type === 'string' ||
    type === 'number' ||
    type === 'bigint' ||
    type === 'boolean' ||
    type === 'symbol' ||
    type === 'undefined'
  );
}
