class ErrorConflict extends Error {
  code = 409;

  constructor(message: string) {
    super(message);
  }
}

export default ErrorConflict;
