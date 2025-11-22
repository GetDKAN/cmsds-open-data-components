// Mock for @civicactions/data-catalog-services
// This package is imported by DrupalPage but not in package.json dependencies

export const useDrupalEntity = (rootUrl, uuid, entityType, bundle, options) => {
  // Return mock entity data for Storybook stories
  return {
    entity: {
      attributes: {
        title: 'Sample Drupal Page Title',
        body: {
          processed: '<p>This is sample content from a Drupal entity. The DrupalPage component fetches content from a Drupal backend using the useDrupalEntity hook.</p><p>In a real implementation, this would display HTML content rendered by Drupal, including formatted text, images, and other rich content.</p>'
        }
      }
    }
  };
};

export default {
  useDrupalEntity
};
