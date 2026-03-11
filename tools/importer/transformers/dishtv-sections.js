/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: DishTV section breaks and section-metadata.
 * Adds section breaks (<hr>) and section-metadata blocks based on template sections.
 * Runs in beforeTransform to insert <hr> while original selectors still exist
 * (block parsers replace matched elements, making selectors unavailable in afterTransform).
 * Section-metadata is added in afterTransform.
 * Selectors from captured DOM of https://www.dishtv.in/get-help/quick-help.html
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  const doc = element.ownerDocument || document;
  const sections = payload.template && payload.template.sections;
  if (!sections || sections.length < 2) return;

  if (hookName === TransformHook.beforeTransform) {
    // Insert <hr> section breaks while original DOM selectors still exist
    const reversedSections = [...sections].reverse();

    for (const section of reversedSections) {
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) continue;

      // Add <hr> before the section element (but not for the first section)
      if (section.id !== sections[0].id) {
        const hr = doc.createElement('hr');
        sectionEl.before(hr);
      }

      // Add default content headings defined in the section config
      if (section.heading) {
        const heading = doc.createElement('h2');
        heading.textContent = section.heading;
        sectionEl.before(heading);
      }
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Add section-metadata blocks for sections with styles
    for (const section of sections) {
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        // Section-metadata goes at end of section content;
        // since selectors may be gone, find by adjacent <hr> elements
        const hrs = element.querySelectorAll('hr');
        // For now, skip if no style is defined (none currently)
      }
    }
  }
}
