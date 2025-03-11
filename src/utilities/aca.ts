export function acaToParams(params: any, ACA : string) {
  if (ACA) {
    params = Object.assign(params, {
      ACA: ACA,
      redirect: false
    })
  }
  return params;
}