import { useQuery, useMutation } from '@tanstack/react-query';
import { statementsApi } from '../api/statements.api';

export function useAccountStatements(accountNumber: string) {
  return useQuery({
    queryKey: ['statements', accountNumber],
    queryFn: () => statementsApi.getByAccount(accountNumber),
    enabled: !!accountNumber,
  });
}

export function useDownloadStatement() {
  return useMutation({
    mutationFn: (id: string) => statementsApi.download(id),
    onSuccess: (blob, id) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `statement-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
}
