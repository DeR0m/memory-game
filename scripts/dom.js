export function createElement(tag, props, ...children) {
  const el = document.createElement(tag);

  if (
    props != null &&
    (typeof props !== 'object' || Array.isArray(props) || props instanceof Node)
  ) {
    children.unshift(props);
    props = {};
  }

  applyProps(el, props);
  append(el, children);
  return el;
}

function applyProps(el, props) {
  for (const key in props) {
    const value = props[key];
    if (value == null || value === false) continue;

    if (key === 'class' || key === 'className') {
      el.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(el.style, value);
    } else if (key === 'dataset' && typeof value === 'object') {
      Object.assign(el.dataset, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (value === true) {
      el.setAttribute(key, '');
    } else {
      el.setAttribute(key, value);
    }
  }
}

export function append(parent, children) {
  for (const child of children) {
    if (child == null || child === false || child === true) continue;
    if (Array.isArray(child)) {
      append(parent, child);
    } else if (child instanceof Node) {
      parent.appendChild(child);
    } else {
      parent.appendChild(document.createTextNode(String(child)));
    }
  }
}

export function fragment(...children) {
  const frag = document.createDocumentFragment();
  append(frag, children);
  return frag;
}

export function clear(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

export function mount(parent, ...children) {
  append(parent, children);
  return parent;
}