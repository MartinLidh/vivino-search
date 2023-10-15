import { Wine } from '../types/types';
import { showWine } from '../libs/toastr/toastr';

console.log('Wine searcher content script loaded!');

// Inject CSS
const toastrCSS = document.createElement('link');
toastrCSS.href = chrome.runtime.getURL('libs/toastr/toastr.css');
toastrCSS.rel = 'stylesheet';
document.head.appendChild(toastrCSS);

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.action === 'handleVivinoHtml') {
    const data = parseVivinoHtml(message.html);
    const bestMatch: Wine = data[0];
    if (!bestMatch) return;
    showWine(bestMatch);
  }
  return false;
});

function parseVivinoHtml(html: string): Wine[] {
  const toNumber = (numberString: string): number => {
    const str = numberString.replace(/[^0-9,.]+/g, '').replace(',', '.');
    return parseFloat(str);
  };

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Extract @id URL from JSON-LD script
  const ldJsonScripts = doc.querySelectorAll(
    "script[type='application/ld+json']",
  );
  let link: string | undefined;
  ldJsonScripts.forEach((script) => {
    const jsonData = JSON.parse(script.textContent || '[]');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jsonData.forEach((data: any) => {
      if (data['@id']) {
        link = data['@id'];
      }
    });
  });

  const CARDS_SELECTOR = '.card.card-lg';
  const NAME_SELECTOR = '.wine-card__name';
  const COUNTRY_SELECTOR = '.wine-card__region [data-item-type="country"]';
  const REGION_SELECTOR = '.wine-card__region .link-color-alt-grey';
  const AVERAGE_RATING_SELECTOR = '.average__number';
  const RATINGS_SELECTOR = '.average__stars .text-micro';
  const RATING_REPLACEMENT = 'ratings';
  const THUMB_SELECTOR = 'figure';
  const THUMB_REGEX = /"(.*)"/;
  const PRICE_SELECTOR = '.wine-price-value';

  return Array.from(doc.querySelectorAll(CARDS_SELECTOR)).map((e) => {
    const nameElement = e.querySelector(NAME_SELECTOR);
    const thumbElement = e.querySelector(THUMB_SELECTOR);
    const countryElement = e.querySelector(COUNTRY_SELECTOR);
    const regionElement = e.querySelector(REGION_SELECTOR);
    const averageRatingElement = e.querySelector(AVERAGE_RATING_SELECTOR);
    const ratingsElement = e.querySelector(RATINGS_SELECTOR);
    const priceElement = e.querySelector(PRICE_SELECTOR);

    const name = nameElement ? nameElement.textContent?.trim() : undefined;
    const thumb = thumbElement
      ? 'https:' + thumbElement.style.backgroundImage.match(THUMB_REGEX)?.[1]
      : undefined;
    const country = countryElement
      ? countryElement.textContent?.trim()
      : undefined;
    const region = regionElement
      ? regionElement.textContent?.trim()
      : undefined;
    const average_rating = averageRatingElement
      ? toNumber(averageRatingElement.textContent?.trim() ?? '0')
      : undefined;
    const ratings = ratingsElement
      ? Number(
          ratingsElement.textContent?.replace(RATING_REPLACEMENT, '').trim(),
        )
      : undefined;
    const price = priceElement
      ? toNumber(priceElement.textContent?.trim() ?? '0')
      : undefined;

    return {
      name,
      link,
      thumb,
      country,
      region,
      average_rating,
      ratings,
      price,
    };
  });
}
