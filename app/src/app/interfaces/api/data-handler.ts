/**
 * Manejo de solciitud y obtención de datos desde el servidor
 */
export interface DataHandler<Data> {
  isLoading:     boolean,
  isObtained: boolean,
  isFinished: boolean,
  data:       Data | null,

  error?: {
    code?: string,
    msg:   string
  },

  pagination?: {
    
    /**
     * @deprecated En su lugar usar pages
     */
    maxPage?: number,

    pages: number,
    currentPage: number,
    totalCount: number
  }
};