export interface Result<Data> {
  OK:   boolean,
  data: Data,
  pages: number,
  total_count: number,
  error: { code: string, msg: string }
};