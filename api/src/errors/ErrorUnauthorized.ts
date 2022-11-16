class ErrorUnauthorized extends Error {
  code = 401;

  constructor(message: string) {
    super(message);
  }
}

export default ErrorUnauthorized;
