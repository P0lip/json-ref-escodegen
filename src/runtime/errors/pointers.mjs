export class PointerError extends Error {
  kind = 'POINTER';

  constructor(message) {
    super(message);

    this.path = '';
  }
}

export class InvalidPointerError extends PointerError {
  get footprint() {
    return null;
  }
}

export class MissingPointerError extends PointerError {
  get footprint() {
    return this.message;
  }
}
