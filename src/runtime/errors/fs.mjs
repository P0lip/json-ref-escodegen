export class FSError extends Error {
  kind = 'FS';

  constructor(message, source) {
    super(message);

    this.source = source;
    this.path = '';
  }

  get footprint() {
    return this.source;
  }
}

export class ReadError extends FSError {}
export class WriteError extends FSError {}
