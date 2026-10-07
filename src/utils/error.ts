/** Extrai uma mensagem legível de erros do axios/Error. */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const data = (error as { response?: { data?: { message?: string } } }).response?.data;
    if (data?.message) return data.message;
  }
  if (error instanceof Error) return error.message;
  return 'Ocorreu um erro inesperado';
}
