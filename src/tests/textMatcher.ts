export const textMatcher = (element : any, text : string) => {
  const hasText = (element : any, text : string) => element.textContent === text;
  const childrenDontHaveText = Array.from(element.children).every((child) => !hasText(child, text))
  
  return hasText(element, text) && childrenDontHaveText;
}