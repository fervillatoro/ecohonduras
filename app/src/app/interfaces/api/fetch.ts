export interface Fetch {
  route:   string,
  auth?:   boolean,
  params?: any,
  page?:   number,
  files?:  File[]
};