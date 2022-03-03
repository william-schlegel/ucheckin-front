import escapeHtml from 'escape-html';
import { Node, Text } from 'slate';

const serializePlainText = (nodes) => nodes.map((n) => Node.string(n)).join('\n');

const serializeHtml = (node) => {
  // console.log(`node`, node);
  if (Text.isText(node)) {
    let string = escapeHtml(node.text);
    if (node.bold) {
      string = `<strong>${string}</strong>`;
    }
    if (node.italic) {
      string = `<em>${string}</em>`;
    }
    if (node.underline) {
      string = `<u>${string}</u>`;
    }
    if (node.code) {
      string = `<code>${string}</code>`;
    }
    return string;
  }

  const children = node.children.map((n) => serializeHtml(n)).join('');

  switch (node.type) {
    case 'quote':
      return `<blockquote><p>${children}</p></blockquote>`;
    case 'heading-one':
      return `<h1>${children}</h1>`;
    case 'heading-two':
      return `<h2>${children}</h2>`;
    case 'heading':
      return node.level === 1 ? `<h1>${children}</h1>` : `<h2>${children}</h2>`;
    case 'paragraph':
      return `<p>${children}</p>`;
    case 'unordered-list':
      return `<ul>${children}</ul>`;
    case 'list-item':
      return `<li>${children}</li>`;
    case 'list-item-content':
      return children;
    case 'link': {
      // console.log({ node });
      return `<a href="${escapeHtml(node.href)}">${children}</a>`;
    }
    default:
      return children;
  }
};

export { serializeHtml, serializePlainText };
