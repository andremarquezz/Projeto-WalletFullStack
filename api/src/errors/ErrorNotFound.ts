class ErrorNotFound extends Error {
  code = 404;

  constructor(message: string) {
    super(message);
  }
}

export default ErrorNotFound;
