import DOMPurify from 'dompurify';
import truncate from 'lodash.truncate';

export function truncateText(textString: string, textLength: number = 240): string {
  if (!textString) {
    return '';
  }

  let cleanedText = textString;
  if(cleanedText.split('</p>').length > 1) {
    cleanedText = cleanedText.split('</p>')[0];
  }

  if(cleanedText.split('<br/>').length > 1) {
    cleanedText = cleanedText.split('<br/>')[0];
  }

  cleanedText = truncate(cleanedText, {
    'length': textLength,
    'separator': ' '}
  );

  return DOMPurify.sanitize(cleanedText, {ALLOWED_TAGS: []});
}