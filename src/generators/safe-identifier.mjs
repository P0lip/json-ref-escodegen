import { identifier } from '../builders.mjs';

export default function (name) {
  return identifier(`_${name}`);
}
