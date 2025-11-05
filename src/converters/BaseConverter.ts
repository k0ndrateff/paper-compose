export abstract class BaseConverter<TInput, TReturn> {
  abstract convert(node: TInput): TReturn;
}
