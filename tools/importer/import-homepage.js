/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselPromoParser from './parsers/carousel-promo.js';
import heroRechargeParser from './parsers/hero-recharge.js';
import cardsPackParser from './parsers/cards-pack.js';
import accordionNavParser from './parsers/accordion-nav.js';
import columnsAppParser from './parsers/columns-app.js';
import heroPromoParser from './parsers/hero-promo.js';
import tabsChannelParser from './parsers/tabs-channel.js';
import cardsPricingParser from './parsers/cards-pricing.js';
import accordionFaqParser from './parsers/accordion-faq.js';

// TRANSFORMER IMPORTS
import dishtvCleanupTransformer from './transformers/dishtv-cleanup.js';
import dishtvSectionsTransformer from './transformers/dishtv-sections.js';

// PARSER REGISTRY
const parsers = {
  'carousel-promo': carouselPromoParser,
  'hero-recharge': heroRechargeParser,
  'cards-pack': cardsPackParser,
  'accordion-nav': accordionNavParser,
  'columns-app': columnsAppParser,
  'hero-promo': heroPromoParser,
  'tabs-channel': tabsChannelParser,
  'cards-pricing': cardsPricingParser,
  'accordion-faq': accordionFaqParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  dishtvCleanupTransformer,
  dishtvSectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  urls: [
    'https://www.dishtv.in/',
  ],
  description: 'DishTV homepage with hero carousel, product showcases, recharge options, and promotional content',
  blocks: [
    {
      name: 'carousel-promo',
      instances: ['.container--bannercontainer', '.carousel--homepagealexacarousel'],
    },
    {
      name: 'hero-recharge',
      instances: ['.container--bannerrechargecontainer'],
    },
    {
      name: 'cards-pack',
      instances: ['.container--yourguide-container'],
    },
    {
      name: 'accordion-nav',
      instances: ['.container--yourguide-container .accordion'],
    },
    {
      name: 'columns-app',
      instances: ['.container--manageyouraccounthomepage'],
    },
    {
      name: 'hero-promo',
      instances: ['#spectacular-banner'],
    },
    {
      name: 'tabs-channel',
      instances: ['#grid-carousel-homepage-container'],
    },
    {
      name: 'cards-pricing',
      instances: ['.container--select-product-container'],
    },
    {
      name: 'accordion-faq',
      instances: ['.container--investorFAQ'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner Carousel with Recharge Form',
      selector: '.container--bannercontainer',
      style: null,
      blocks: ['carousel-promo', 'hero-recharge'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Your Guide to Creating a Pack',
      selector: '.container--yourguide-container',
      style: null,
      blocks: ['cards-pack', 'accordion-nav'],
      defaultContent: ['.your-guide-set-container .cmp-text'],
    },
    {
      id: 'section-3',
      name: 'Manage Your Account',
      selector: '.container--manageyouraccounthomepage',
      style: 'grey',
      blocks: ['columns-app'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'See the World Come Alive',
      selector: '#spectacular-banner',
      style: null,
      blocks: ['hero-promo'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'OTT Content Carousel',
      selector: '.carousel--homepagealexacarousel',
      style: null,
      blocks: ['carousel-promo'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Snack on the Content You Love',
      selector: '#grid-carousel-homepage-container',
      style: null,
      blocks: ['tabs-channel'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'Dish HD Entertainment Starts Here',
      selector: '.container--select-product-container',
      style: null,
      blocks: ['cards-pricing'],
      defaultContent: [],
    },
    {
      id: 'section-8',
      name: 'Frequently Asked Questions',
      selector: '.container--investorFAQ',
      style: null,
      blocks: ['accordion-faq'],
      defaultContent: [],
    },
  ],
};

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
