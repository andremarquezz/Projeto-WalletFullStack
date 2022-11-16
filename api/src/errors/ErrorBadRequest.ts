class ErrorBadRequest extends Error {
  code = 400;

  constructor(message: string) {
    super(message);
  }
}

export default ErrorBadRequest;
