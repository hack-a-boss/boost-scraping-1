// procesar ese HTML usando un módulo que nos permita tratarlo como un árbol de DOM
// usando este árbol de DOM virtual vamos a extraer las partes del HTML que nos interesen
// vamos a guardar el resultado en un JSON

const axios = require("axios");
const { JSDOM } = require("jsdom");
const fs = require("fs/promises");

const MAX_HEADLINES_PER_SOURCE = 10;

const sources = [
  {
    url: "https://elpais.com",
    title: "El País",
    selector: ".c_t a",
  },
  {
    url: "https://www.eldiario.es",
    title: "El Diario",
    selector: ".ni-title a",
  },
  {
    url: "https://www.laopinioncoruna.es",
    title: "La Opinión Coruña",
    selector: ".new__headline[itemprop=url]",
  },
  {
    url: "https://www.marca.com",
    title: "Marca",
    selector: "h2 > a",
    extraRequestParams: {
      responseType: "arraybuffer",
    },
  },
  {
    url: "https://www.xataka.com",
    title: "Xataka",
    selector: "h2 > a",
  },
];

async function extractHeadlines({ url, selector, extraRequestParams }) {
  const { data } = await axios.get(url, {
    ...extraRequestParams,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
    },
  });

  const dom = new JSDOM(data);

  const headlines = dom.window.document.querySelectorAll(selector);

  const links = [...headlines]
    .slice(0, MAX_HEADLINES_PER_SOURCE)
    .map((headline) => {
      const link = headline.getAttribute("href");
      return {
        title: headline.textContent.trim(),
        url: link.startsWith("http") ? link : `${url}${link}`,
      };
    });

  return links;
}

async function main() {
  try {
    const data = await Promise.all(
      sources.map(async (source) => {
        return {
          url: source.url,
          title: source.title,
          links: await extractHeadlines(source),
        };
      })
    );

    await fs.writeFile("./links.json", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = main;
