export function acaToParams(params: any, ACA : string | undefined) {
  if (ACA) {
    params = Object.assign(params, {
      ACA: ACA,
      redirect: false
    })
  }
  return params;
}