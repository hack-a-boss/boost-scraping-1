/* global document */

const list = document.querySelector("ul.sources");

function writeSource(source) {
  const fragment = document.createDocumentFragment();

  const h2 = document.createElement("h2");
  h2.textContent = source.title;

  fragment.append(h2);

  const ul = document.createElement("ul");

  for (const link of source.links) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = link.title;
    a.setAttribute("href", link.url);

    li.append(a);
    ul.append(li);
  }

  fragment.append(ul);

  const fragmentLi = document.createElement("li");
  fragmentLi.append(fragment);

  list.append(fragmentLi);
}

async function main() {
  try {
    const response = await fetch("/links");

    const sources = await response.json();

    for (const source of sources) {
      writeSource(source);
    }
  } catch (error) {
    console.error(error);
  }
}

main();
