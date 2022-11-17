class ErrorInternalServer extends Error {
  code = 500;

  constructor(message: string) {
    super(message);
  }
}

export default ErrorInternalServer;
