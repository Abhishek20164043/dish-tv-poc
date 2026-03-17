const MOBILE_APP_COUNT = 5;

export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  const cols = [...row.children];
  const imgCol = cols.find((col) => col.querySelector('picture'));
  const textCol = cols.find((col) => col.querySelector('ul'));
  if (!imgCol || !textCol) return;

  // Extract heading and list
  const heading = textCol.querySelector('h2');
  const listItems = [...textCol.querySelectorAll('ul li')];

  // Split into MOBILE APP and WEB groups
  const mobileItems = listItems.slice(0, MOBILE_APP_COUNT);
  const webItems = listItems.slice(MOBILE_APP_COUNT);

  // Build new structure
  block.textContent = '';

  // Image column
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'columns-app-img-col';
  const pic = imgCol.querySelector('picture');
  if (pic) imageWrapper.append(pic);
  block.append(imageWrapper);

  // Content column
  const contentCol = document.createElement('div');
  contentCol.className = 'columns-app-content';

  // Heading - wrap "with ease" in accent span for orange styling
  if (heading) {
    heading.innerHTML = heading.innerHTML.replace(
      /with ease/i,
      '<span class="columns-app-accent">with ease</span>',
    );
    contentCol.append(heading);
  }

  // Tab bar
  const tabBar = document.createElement('div');
  tabBar.className = 'columns-app-tabs';
  tabBar.setAttribute('role', 'tablist');

  const tabs = ['MOBILE APP', 'WEB'];
  const panels = [];

  tabs.forEach((tabName, i) => {
    const tabBtn = document.createElement('button');
    tabBtn.className = 'columns-app-tab';
    tabBtn.textContent = tabName;
    tabBtn.setAttribute('role', 'tab');
    tabBtn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    if (i === 0) tabBtn.classList.add('active');

    // Create panel
    const panel = document.createElement('div');
    panel.className = 'columns-app-panel';
    panel.setAttribute('role', 'tabpanel');
    if (i !== 0) panel.setAttribute('aria-hidden', 'true');

    const items = i === 0 ? mobileItems : webItems;
    const featureList = document.createElement('ul');
    featureList.className = 'columns-app-features';

    items.forEach((item, j) => {
      const li = document.createElement('li');
      li.className = 'columns-app-feature';
      if (j === 0) li.classList.add('active');
      li.textContent = item.textContent.trim();

      li.addEventListener('click', () => {
        featureList.querySelectorAll('.columns-app-feature.active').forEach((el) => {
          el.classList.remove('active');
        });
        li.classList.add('active');
      });

      featureList.append(li);
    });

    panel.append(featureList);
    panels.push(panel);

    tabBtn.addEventListener('click', () => {
      // Deactivate all tabs and panels
      tabBar.querySelectorAll('.columns-app-tab').forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach((p) => p.setAttribute('aria-hidden', 'true'));

      // Activate clicked tab and panel
      tabBtn.classList.add('active');
      tabBtn.setAttribute('aria-selected', 'true');
      panels[i].removeAttribute('aria-hidden');
    });

    tabBar.append(tabBtn);
  });

  contentCol.append(tabBar);
  panels.forEach((p) => contentCol.append(p));
  block.append(contentCol);
}
