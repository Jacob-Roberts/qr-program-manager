export type Result<TResult> = SuccessType<TResult> | FailureType;

type SuccessType<TResult> = {
  data: TResult;
  ok: true;
};

type FailureType = {
  error: Error;
  ok: false;
};

export function OkResult<TData>(data: TData): SuccessType<TData> {
  return {
    data: data,
    ok: true,
  };
}

export function FailResult(err: Error): FailureType {
  return {
    error: err,
    ok: false,
  };
}
