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

  // tools/importer/import-quick-help-page.js
  var import_quick_help_page_exports = {};
  __export(import_quick_help_page_exports, {
    default: () => import_quick_help_page_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    const img = element.querySelector(".cmp-teaser__image img, .cmp-image__image, img");
    const heading = element.querySelector("h1.cmp-teaser__title, h1, h2");
    const cells = [];
    if (img) {
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      imgFrag.appendChild(img.cloneNode(true));
      cells.push([imgFrag]);
    } else {
      cells.push([""]);
    }
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(" field:text "));
    if (heading) {
      textFrag.appendChild(heading.cloneNode(true));
    }
    cells.push([textFrag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-selfhelp.js
  function parse2(element, { document }) {
    const teasers = element.querySelectorAll(".teaser--selfhelp-teaser");
    const cells = [];
    teasers.forEach((teaser) => {
      const img = teaser.querySelector(".cmp-teaser__image img, .cmp-image__image, img");
      const title = teaser.querySelector("h1.cmp-teaser__title, h2.cmp-teaser__title, .cmp-teaser__title");
      const pretitle = teaser.querySelector(".cmp-teaser__pretitle");
      const desc = teaser.querySelector(".cmp-teaser__description");
      const cta = teaser.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a");
      const itemLabel = "card";
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      if (img) {
        imgFrag.appendChild(img.cloneNode(true));
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      if (pretitle) {
        const pPre = document.createElement("p");
        pPre.textContent = pretitle.textContent.trim();
        textFrag.appendChild(pPre);
      }
      if (title) {
        textFrag.appendChild(title.cloneNode(true));
      }
      if (desc) {
        const descClone = desc.cloneNode(true);
        while (descClone.firstChild) {
          textFrag.appendChild(descClone.firstChild);
        }
      }
      if (cta) {
        const p = document.createElement("p");
        const link = cta.cloneNode(true);
        p.appendChild(link);
        textFrag.appendChild(p);
      }
      cells.push([itemLabel, imgFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-selfhelp", cells });
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

  // tools/importer/import-quick-help-page.js
  var parsers = {
    "hero-banner": parse,
    "cards-selfhelp": parse2
  };
  var PAGE_TEMPLATE = {
    name: "quick-help-page",
    description: "DishTV quick help page with support options and self-service tools",
    urls: [
      "https://www.dishtv.in/get-help/quick-help.html"
    ],
    blocks: [
      {
        name: "hero-banner",
        instances: [".cmp-teaser--contact-us-banner"]
      },
      {
        name: "cards-selfhelp",
        instances: [".container--selfhelp-teaser-container"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Sub-navigation bar",
        selector: "#quick-help-navbar",
        style: null,
        blocks: [],
        defaultContent: [".cmp-navbarlist--secondary-navbar-list .external-container"]
      },
      {
        id: "section-2",
        name: "Hero banner",
        selector: ".cmp-teaser--contact-us-banner",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Self-help cards grid",
        selector: ".container--selfhelp-teaser-container",
        style: "dark",
        blocks: ["cards-selfhelp"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
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
  var import_quick_help_page_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
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
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
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
  return __toCommonJS(import_quick_help_page_exports);
})();
