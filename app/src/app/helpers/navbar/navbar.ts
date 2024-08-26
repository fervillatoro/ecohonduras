import { SafeHtml } from "@angular/platform-browser";
import { Params } from "@angular/router";

export interface Item {
  title: string,
  new?: boolean,
  icon?: string | SafeHtml,
  route: { href: string, queryParams?: Params }
}