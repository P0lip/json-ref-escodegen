export default function (obj, key) {
  const desc = Reflect.getOwnPropertyDescriptor(obj, key);
  return desc !== void 0 && 'get' in desc;
}
