export interface Token {
  isToken: true;
  type: string;
  line: number;
  col: number;
  text: string;
  value: string;
}
