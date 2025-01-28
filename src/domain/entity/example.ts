export type Hello = {
  id: number;
  name: string;
  tag: boolean;
};

export type HelloWorld = {
  id: number;
  hello: Hello;
};
