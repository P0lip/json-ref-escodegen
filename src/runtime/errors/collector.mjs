function isCallExceededError(error) {
  return (
    error.message === 'too much recursion' ||
    error.message === 'Maximum call stack size exceeded' ||
    error instanceof RangeError
  );
}

function markAsCircular() {
  // todo: implement
}

function hasMatchingError(errors, err) {
  for (const error of errors) {
    if (error.footprint === err.footprint) return true;
  }

  return false;
}

export function collectPotentialError(errors, path, invoke) {
  try {
    invoke();
  } catch (err) {
    if (typeof err !== 'object' || err === null) return;

    if (isCallExceededError(err)) {
      return void markAsCircular();
    } else if (err.footprint === null || !hasMatchingError(errors, err)) {
      errors.push(err);
    }

    err.path = path;
  }
}
