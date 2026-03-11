var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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

  // tools/importer/import-new-connection-page.js
  var import_new_connection_page_exports = {};
  __export(import_new_connection_page_exports, {
    default: () => import_new_connection_page_default
  });

  // tools/importer/parsers/cards-pricing.js
  function parse(element, { document: document2 }) {
    const productCards = element.querySelectorAll(".getconnection-select-product");
    const cells = [];
    productCards.forEach((card) => {
      const imgCell = [];
      const blurbImg = card.querySelector(".blurb-text, img.blurb-text, .blurb-text-image");
      if (blurbImg) {
        const img = document2.createElement("img");
        img.src = blurbImg.src || blurbImg.getAttribute("src");
        img.alt = "blurb";
        imgCell.push(img);
      }
      const cardBgImg = card.querySelector(".card-bg-image, img.card-bg-image");
      if (cardBgImg) {
        const img = document2.createElement("img");
        img.src = cardBgImg.src || cardBgImg.getAttribute("src");
        img.alt = "card-bg";
        imgCell.push(img);
      }
      const addonImg = card.querySelector(".product-addon-image, img.product-addon-image");
      const fallbackImg = card.querySelector(".product-image, img.product-image");
      const visibleProductImg = addonImg || fallbackImg;
      if (visibleProductImg) {
        const img = document2.createElement("img");
        img.src = visibleProductImg.src || visibleProductImg.getAttribute("src");
        img.alt = "Product Image";
        imgCell.push(img);
      }
      if (addonImg) {
        const withOduImage = addonImg.getAttribute("data-with-odu-image");
        if (withOduImage) {
          const img = document2.createElement("img");
          const base = "https://www.dishtv.in";
          img.src = withOduImage.startsWith("/") ? base + withOduImage : withOduImage;
          img.alt = "Product Image With Antenna";
          imgCell.push(img);
        }
      }
      const textCell = [];
      const productName = card.querySelector(".product-name");
      if (productName) {
        const h3 = document2.createElement("h3");
        h3.textContent = productName.textContent.trim();
        textCell.push(h3);
      }
      const price = card.querySelector(".cmp-new-connection-product-price");
      if (price) {
        const p = document2.createElement("p");
        const strong = document2.createElement("strong");
        strong.textContent = price.textContent.trim();
        p.appendChild(strong);
        textCell.push(p);
      }
      const desc = card.querySelector(".cmp-new-connection-product-desc");
      if (desc) {
        const p = document2.createElement("p");
        const em = document2.createElement("em");
        em.textContent = desc.textContent.trim();
        p.appendChild(em);
        textCell.push(p);
      }
      const features = card.querySelectorAll(".key-feature");
      if (features.length > 0) {
        const h4 = document2.createElement("h4");
        h4.textContent = "KEY FEATURES";
        textCell.push(h4);
        const ul = document2.createElement("ul");
        features.forEach((feat) => {
          const text = feat.querySelector("p")?.textContent?.trim();
          if (text) {
            const li = document2.createElement("li");
            const icon = feat.querySelector("img");
            if (icon) {
              const img = document2.createElement("img");
              img.src = icon.src || icon.getAttribute("src");
              img.alt = icon.alt || "feature-icon";
              li.appendChild(img);
              li.appendChild(document2.createTextNode(" "));
            }
            li.appendChild(document2.createTextNode(text));
            ul.appendChild(li);
          }
        });
        textCell.push(ul);
      }
      const badges = card.querySelectorAll(".middle-line");
      if (badges.length > 0) {
        const badgeContainer = document2.createElement("p");
        badgeContainer.setAttribute("data-type", "badges");
        badges.forEach((badge, i) => {
          const icon = badge.querySelector("img");
          const text = badge.querySelector(".text")?.textContent?.trim();
          if (text) {
            if (i > 0) badgeContainer.appendChild(document2.createElement("br"));
            if (icon) {
              const img = document2.createElement("img");
              img.src = icon.src || icon.getAttribute("src");
              img.alt = text;
              badgeContainer.appendChild(img);
              badgeContainer.appendChild(document2.createTextNode(" "));
            }
            badgeContainer.appendChild(document2.createTextNode(text));
          }
        });
        textCell.push(badgeContainer);
      }
      if (price) {
        const withoutPrice = price.getAttribute("data-without-odu-price") || "";
        const withPrice = price.getAttribute("data-with-odu-price") || "";
        if (withoutPrice && withPrice) {
          const dataP = document2.createElement("p");
          dataP.textContent = `antenna-data: without=${withoutPrice}|with=${withPrice}`;
          textCell.push(dataP);
        }
      }
      const selectP = document2.createElement("p");
      const selectA = document2.createElement("a");
      selectA.href = "#";
      selectA.textContent = "Select";
      selectP.appendChild(selectA);
      textCell.push(selectP);
      if (imgCell.length > 0 || textCell.length > 0) {
        cells.push([imgCell, textCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-pricing", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse2(element, { document: document2 }) {
    const items = element.querySelectorAll(".cmp-accordion__item");
    const cells = [];
    items.forEach((item) => {
      const titleEl = item.querySelector(".cmp-accordion__title");
      const question = titleEl ? titleEl.textContent.trim() : "";
      const panel = item.querySelector(".cmp-accordion__panel");
      if (!panel) return;
      const answerFrag = document2.createDocumentFragment();
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
          const p = document2.createElement("p");
          p.textContent = text;
          answerFrag.appendChild(p);
        }
      }
      if (question || answerFrag.childNodes.length > 0) {
        cells.push([question, answerFrag]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
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
        ".whatsapp-bot-logo",
        // New connection page hidden popups/modals
        ".packcomparisoncomponent",
        ".newconnectionpopup",
        ".newconnectionflexipoup",
        // Stepper/steps list (hidden on original page, display:none)
        "ol.cmp-tabs__tablist"
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
    const doc = element.ownerDocument || document;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;
    if (hookName === TransformHook2.beforeTransform) {
      const reversedSections = [...sections].reverse();
      for (const section of reversedSections) {
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.id !== sections[0].id) {
          const hr = doc.createElement("hr");
          sectionEl.before(hr);
        }
        if (section.heading) {
          const heading = doc.createElement("h2");
          heading.textContent = section.heading;
          sectionEl.before(heading);
        }
      }
    }
    if (hookName === TransformHook2.afterTransform) {
      for (const section of sections) {
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          const hrs = element.querySelectorAll("hr");
        }
      }
    }
  }

  // tools/importer/import-new-connection-page.js
  var parsers = {
    "cards-pricing": parse,
    "accordion-faq": parse2
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "new-connection-page",
    urls: [
      "https://www.dishtv.in/new-dth-connection.html"
    ],
    description: "DishTV new DTH connection page for new customer registration and setup with product plans and FAQs",
    blocks: [
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
        name: "Product Plans",
        selector: ".revampedncproducts",
        style: null,
        blocks: ["cards-pricing"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "CTA Missed Call",
        selector: ".text--viewcomparison",
        style: null,
        blocks: [],
        defaultContent: [".text--viewcomparison .cmp-text"]
      },
      {
        id: "section-3",
        name: "Frequently Asked Questions",
        selector: ".container--investorFAQ",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: [".container--investorFAQ .cmp-text"],
        heading: "FAQs"
      }
    ]
  };
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
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
    const enhancedPayload = {
      ...payload,
      template: PAGE_TEMPLATE
    };
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  var import_new_connection_page_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_new_connection_page_exports);
})();
