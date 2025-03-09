export interface Template {
  subject?: string;
  content: string;
}

export interface Message {
  subject?: string;
  content: string;
}

export interface Variable {
  [key: string]: string;
}
