var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-promo.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll(".cmp-carousel__item");
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector(".cmp-teaser__image img, .cmp-image__image, img");
      const link = slide.querySelector(".cmp-teaser__link, a");
      const title = slide.querySelector(".cmp-teaser__title, h2, h3");
      const desc = slide.querySelector(".cmp-teaser__description, .cmp-teaser__content p");
      const imgCell = [];
      if (img) {
        imgCell.push(img);
      }
      const textCell = [];
      if (title) {
        textCell.push(title);
      }
      if (desc) {
        textCell.push(desc);
      }
      if (link) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = link.textContent.trim() || "Learn More";
        p.appendChild(a);
        textCell.push(p);
      }
      if (imgCell.length > 0 || textCell.length > 0) {
        cells.push([imgCell, textCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-recharge.js
  function parse2(element, { document }) {
    const bgImg = element.querySelector(".cmp-teaser__image img, .cmp-image__image, img");
    const heading = element.querySelector(".cmp-text h1, .cmp-text h2, h1, h2, .cmp-text p");
    const descriptions = element.querySelectorAll(".cmp-text p");
    const cta = element.querySelector(".cmp-button, a.cmp-button, button.cmp-button");
    const cells = [];
    if (bgImg) {
      cells.push([bgImg]);
    }
    const contentCell = [];
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      contentCell.push(h2);
    }
    descriptions.forEach((desc) => {
      const text = desc.textContent.trim();
      if (text && (!heading || text !== heading.textContent.trim())) {
        const p = document.createElement("p");
        p.textContent = text;
        contentCell.push(p);
      }
    });
    if (cta) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = cta.href || "#";
      a.textContent = cta.textContent.trim() || "PROCEED";
      p.appendChild(a);
      contentCell.push(p);
    }
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-recharge", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-pack.js
  function parse3(element, { document }) {
    const items = element.querySelectorAll(".cmp-accordion__item");
    const cells = [];
    items.forEach((item) => {
      const title = item.querySelector(".cmp-accordion__title");
      const panel = item.querySelector(".cmp-accordion__panel");
      if (!panel) return;
      const img = panel.querySelector("img");
      const descTexts = panel.querySelectorAll(".cmp-text p");
      const cta = panel.querySelector("a");
      const imgCell = [];
      if (img) {
        imgCell.push(img);
      }
      const textCell = [];
      if (title) {
        const h3 = document.createElement("h3");
        h3.textContent = title.textContent.trim();
        textCell.push(h3);
      }
      descTexts.forEach((desc) => {
        const text = desc.textContent.trim();
        if (text) {
          const p = document.createElement("p");
          p.textContent = text;
          textCell.push(p);
        }
      });
      if (cta) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = cta.href;
        a.textContent = cta.textContent.trim() || "Know More";
        p.appendChild(a);
        textCell.push(p);
      }
      if (imgCell.length > 0 || textCell.length > 0) {
        cells.push([imgCell, textCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-pack", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-nav.js
  function parse4(element, { document }) {
    const items = element.querySelectorAll(".cmp-accordion__item");
    const cells = [];
    items.forEach((item) => {
      const titleEl = item.querySelector(".cmp-accordion__title");
      const title = titleEl ? titleEl.textContent.trim() : "";
      const panel = item.querySelector(".cmp-accordion__panel");
      if (!panel) return;
      const contentFrag = document.createDocumentFragment();
      const texts = panel.querySelectorAll(".cmp-text p");
      texts.forEach((t) => {
        const text = t.textContent.trim();
        if (text) {
          const p = document.createElement("p");
          p.textContent = text;
          contentFrag.appendChild(p);
        }
      });
      const img = panel.querySelector("img");
      if (img) {
        const p = document.createElement("p");
        p.appendChild(img);
        contentFrag.appendChild(p);
      }
      const cta = panel.querySelector("a");
      if (cta) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = cta.href;
        a.textContent = cta.textContent.trim();
        p.appendChild(a);
        contentFrag.appendChild(p);
      }
      if (title || contentFrag.childNodes.length > 0) {
        cells.push([title, contentFrag]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-nav", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-app.js
  function parse5(element, { document }) {
    const mainImg = element.querySelector(":scope > img, .container--manageyouraccounthomepage > img, img");
    const headingEl = element.querySelector(".text--manageyouraccounthomepage .cmp-text p, .cmp-text p");
    const accentText = element.querySelector(".orange-colour-text");
    const slideTexts = element.querySelectorAll(".text--manageyouraccmobile .cmp-text p");
    const slideImages = element.querySelectorAll(".image--manageyouraccmobile img, .cmp-carousel__item img");
    const imgCell = [];
    if (mainImg) {
      imgCell.push(mainImg);
    }
    const firstSlideImg = element.querySelector(".cmp-carousel__item img");
    if (firstSlideImg && firstSlideImg !== mainImg) {
      imgCell.push(firstSlideImg);
    }
    const textCell = [];
    const h2 = document.createElement("h2");
    if (headingEl) {
      h2.textContent = headingEl.textContent.trim();
    }
    if (accentText) {
      h2.textContent += " " + accentText.textContent.trim();
    }
    if (h2.textContent.trim()) {
      textCell.push(h2);
    }
    const addedTexts = /* @__PURE__ */ new Set();
    slideTexts.forEach((st) => {
      const text = st.textContent.trim();
      if (text && !addedTexts.has(text)) {
        addedTexts.add(text);
        const li = document.createElement("li");
        li.textContent = text;
        textCell.push(li);
      }
    });
    const cells = [];
    cells.push([imgCell, textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-app", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-promo.js
  function parse6(element, { document }) {
    const bgImg = element.querySelector(".cmp-teaser__image img, .cmp-image__image, img");
    const ctaLink = element.querySelector(".cmp-teaser__link, a");
    const title = element.querySelector(".cmp-teaser__title, h1, h2, h3");
    const desc = element.querySelector(".cmp-teaser__description");
    const cells = [];
    if (bgImg) {
      cells.push([bgImg]);
    }
    const contentCell = [];
    if (title) {
      contentCell.push(title);
    }
    if (desc) {
      contentCell.push(desc);
    }
    if (ctaLink) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = ctaLink.href;
      a.textContent = ctaLink.textContent.trim() || "Learn More";
      p.appendChild(a);
      contentCell.push(p);
    }
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-channel.js
  function parse7(element, { document }) {
    const headings = element.querySelectorAll(".cmp-text h1");
    const tabLinks = element.querySelectorAll(".grid-carousel-homepage__links li a, .cmp-channnelguide__filter-link a");
    const tabPanels = element.querySelectorAll('.ui-tabs-panel, [id*="timeline-slider"], [id*="popular-slider"]');
    const channelGuideLink = element.querySelector('.grid-carousel-homepage__channelguidelink, a[href*="channel-guide"]');
    const cells = [];
    if (tabLinks.length > 0) {
      tabLinks.forEach((tabLink, index) => {
        const tabLabel = tabLink.textContent.trim();
        const contentFrag = document.createDocumentFragment();
        if (index === 0 && headings.length > 0) {
          headings.forEach((h) => {
            const heading = document.createElement("h2");
            heading.textContent = h.textContent.trim();
            contentFrag.appendChild(heading);
          });
        }
        const panel = tabPanels[index];
        if (panel) {
          const programCards = panel.querySelectorAll(".grid-carousel-program-container");
          programCards.forEach((card) => {
            const showImg = card.querySelector(".slider-left-image, img:first-of-type");
            const logoImg = card.querySelector(".grid-carousel__program-logo");
            const programName = card.querySelector(".grid-carousel__program-name");
            const programTiming = card.querySelector(".grid-carousel__program-timing");
            const cardP = document.createElement("p");
            if (showImg) {
              cardP.appendChild(showImg);
            }
            if (programName) {
              const strong = document.createElement("strong");
              strong.textContent = programName.textContent.trim();
              cardP.appendChild(strong);
            }
            if (programTiming) {
              const span = document.createElement("span");
              span.textContent = " " + programTiming.textContent.trim();
              cardP.appendChild(span);
            }
            contentFrag.appendChild(cardP);
          });
        }
        if (channelGuideLink && index === tabLinks.length - 1) {
          const p = document.createElement("p");
          const a = document.createElement("a");
          a.href = channelGuideLink.href;
          a.textContent = channelGuideLink.textContent.trim() || "CHANNEL GUIDE";
          p.appendChild(a);
          contentFrag.appendChild(p);
        }
        cells.push([tabLabel, contentFrag]);
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-channel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-pricing.js
  function parse8(element, { document }) {
    const productCards = element.querySelectorAll(".getconnection-select-product");
    const cells = [];
    productCards.forEach((card) => {
      const productImg = card.querySelector(".product-image, .cmp-new-connection-box-image");
      const productName = card.querySelector(".product-name");
      const price = card.querySelector(".cmp-new-connection-product-price");
      const desc = card.querySelector(".cmp-new-connection-product-desc");
      const features = card.querySelectorAll(".key-feature p");
      const middleFeatures = card.querySelectorAll(".middle-line .text");
      const imgCell = [];
      if (productImg) {
        imgCell.push(productImg);
      }
      const textCell = [];
      if (productName) {
        const h3 = document.createElement("h3");
        h3.textContent = productName.textContent.trim();
        textCell.push(h3);
      }
      if (price) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = price.textContent.trim();
        p.appendChild(strong);
        textCell.push(p);
      }
      if (desc) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        textCell.push(p);
      }
      if (features.length > 0) {
        const ul = document.createElement("ul");
        features.forEach((feat) => {
          const text = feat.textContent.trim();
          if (text) {
            const li = document.createElement("li");
            li.textContent = text;
            ul.appendChild(li);
          }
        });
        textCell.push(ul);
      }
      if (middleFeatures.length > 0) {
        middleFeatures.forEach((feat) => {
          const text = feat.textContent.trim();
          if (text) {
            const p = document.createElement("p");
            p.textContent = text;
            textCell.push(p);
          }
        });
      }
      if (imgCell.length > 0 || textCell.length > 0) {
        cells.push([imgCell, textCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-pricing", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse9(element, { document }) {
    const items = element.querySelectorAll(".cmp-accordion__item");
    const cells = [];
    items.forEach((item) => {
      const titleEl = item.querySelector(".cmp-accordion__title");
      const question = titleEl ? titleEl.textContent.trim() : "";
      const panel = item.querySelector(".cmp-accordion__panel");
      if (!panel) return;
      const answerFrag = document.createDocumentFragment();
      const paragraphs = panel.querySelectorAll(".cmp-text p");
      const lists = panel.querySelectorAll(".cmp-text ul, .cmp-text ol");
      if (paragraphs.length > 0) {
        paragraphs.forEach((p) => {
          answerFrag.appendChild(p.cloneNode(true));
        });
      }
      if (lists.length > 0) {
        lists.forEach((list) => {
          answerFrag.appendChild(list.cloneNode(true));
        });
      }
      if (answerFrag.childNodes.length === 0) {
        const text = panel.textContent.trim();
        if (text) {
          const p = document.createElement("p");
          p.textContent = text;
          answerFrag.appendChild(p);
        }
      }
      if (question || answerFrag.childNodes.length > 0) {
        cells.push([question, answerFrag]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/dishtv-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".logged-in-popup",
        ".social-popup-container",
        ".popup-video-box",
        "#overlay",
        ".user-auth-social-modal",
        "#whatsAppLogo",
        ".whatsapp-bot-logo"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#dishtv-Header",
        "#dishtv-Footer",
        ".cmp-experiencefragment--header",
        ".cmp-experiencefragment--footer",
        ".dish-footer",
        "footer",
        "iframe",
        "link",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/dishtv-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      for (const section of reversedSections) {
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (section.id !== sections[0].id) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-promo": parse,
    "hero-recharge": parse2,
    "cards-pack": parse3,
    "accordion-nav": parse4,
    "columns-app": parse5,
    "hero-promo": parse6,
    "tabs-channel": parse7,
    "cards-pricing": parse8,
    "accordion-faq": parse9
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    urls: [
      "https://www.dishtv.in/"
    ],
    description: "DishTV homepage with hero carousel, product showcases, recharge options, and promotional content",
    blocks: [
      {
        name: "carousel-promo",
        instances: [".container--bannercontainer", ".carousel--homepagealexacarousel"]
      },
      {
        name: "hero-recharge",
        instances: [".container--bannerrechargecontainer"]
      },
      {
        name: "cards-pack",
        instances: [".container--yourguide-container"]
      },
      {
        name: "accordion-nav",
        instances: [".container--yourguide-container .accordion"]
      },
      {
        name: "columns-app",
        instances: [".container--manageyouraccounthomepage"]
      },
      {
        name: "hero-promo",
        instances: ["#spectacular-banner"]
      },
      {
        name: "tabs-channel",
        instances: ["#grid-carousel-homepage-container"]
      },
      {
        name: "cards-pricing",
        instances: [".container--select-product-container"]
      },
      {
        name: "accordion-faq",
        instances: [".container--investorFAQ"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Banner Carousel with Recharge Form",
        selector: ".container--bannercontainer",
        style: null,
        blocks: ["carousel-promo", "hero-recharge"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Your Guide to Creating a Pack",
        selector: ".container--yourguide-container",
        style: null,
        blocks: ["cards-pack", "accordion-nav"],
        defaultContent: [".your-guide-set-container .cmp-text"]
      },
      {
        id: "section-3",
        name: "Manage Your Account",
        selector: ".container--manageyouraccounthomepage",
        style: "grey",
        blocks: ["columns-app"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "See the World Come Alive",
        selector: "#spectacular-banner",
        style: null,
        blocks: ["hero-promo"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "OTT Content Carousel",
        selector: ".carousel--homepagealexacarousel",
        style: null,
        blocks: ["carousel-promo"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Snack on the Content You Love",
        selector: "#grid-carousel-homepage-container",
        style: null,
        blocks: ["tabs-channel"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Dish HD Entertainment Starts Here",
        selector: ".container--select-product-container",
        style: null,
        blocks: ["cards-pricing"],
        defaultContent: []
      },
      {
        id: "section-8",
        name: "Frequently Asked Questions",
        selector: ".container--investorFAQ",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: []
      }
    ]
  };
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
