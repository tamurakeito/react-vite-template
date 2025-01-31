export interface Hello {
  id: number;
  name: string;
  tag: boolean;
}

export interface HelloWorld {
  id: number;
  hello: Hello;
}
