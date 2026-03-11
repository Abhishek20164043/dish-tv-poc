/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: DishTV site cleanup.
 * Selectors from captured DOM of https://www.dishtv.in/get-help/quick-help.html
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove popups, overlays, modals, login forms (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      '.logged-in-popup',
      '.social-popup-container',
      '.popup-video-box',
      '#overlay',
      '.user-auth-social-modal',
      '#whatsAppLogo',
      '.whatsapp-bot-logo',
      // New connection page hidden popups/modals
      '.packcomparisoncomponent',
      '.newconnectionpopup',
      '.newconnectionflexipoup',
      // Stepper/steps list (hidden on original page, display:none)
      'ol.cmp-tabs__tablist',
    ]);
  }
  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable content: header, footer, nav chrome
    WebImporter.DOMUtils.remove(element, [
      '#dishtv-Header',
      '#dishtv-Footer',
      '.cmp-experiencefragment--header',
      '.cmp-experiencefragment--footer',
      '.dish-footer',
      'footer',
      'iframe',
      'link',
      'noscript',
    ]);
  }
}
