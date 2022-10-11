class CustomError extends Error {
  error: number;
  constructor(error: number, message: string) {
    super(message);
    this.error = error;
  }
}

export default CustomError;
