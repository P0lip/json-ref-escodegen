import { InvalidPointerError } from '../runtime/errors/pointers.mjs';

const result = {
  pointer: '#',
  source: '',
};

export default function ($ref) {
  if ($ref.length === 0) {
    throw new InvalidPointerError('Pointer cannot be empty');
  }

  const index = $ref.indexOf('#');
  if (index === -1) {
    result.source = $ref;
    result.pointer = '#';
  } else if (index === 0) {
    result.source = '';
    result.pointer = $ref;
  } else {
    result.source = $ref.slice(0, index);
    result.pointer = $ref.slice(index);
  }

  if (result.pointer.length > 1 && result.pointer[1] !== '/') {
    throw new InvalidPointerError(
      'Pointer pointing at other property than root needs to start with #/',
    );
  }

  return result;
}
