console.log('Wine searcher background script loaded!');

const BASE_URL: string = 'https://www.vivino.com';
const SEARCH_PATH: string = '/search/wines?q=';

chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
    id: 'searchWine',
    title: 'Search Vivino',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'searchWine' && tab.id !== undefined) {
    {
      if (tab.id) {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });

        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['libs/toastr/toastr.js']
        });
      }
    }

    const name = encodeURIComponent(info.selectionText);
    try {
      const response = await fetch(`${BASE_URL}${SEARCH_PATH}${name}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch, status ${response.status}`);
      }
      const html = await response.text();
      await chrome.tabs.sendMessage(tab.id, {
        action: 'handleVivinoHtml',
        html: html,
      });
    } catch (error) {
      console.error('Error fetching wine data:', error);
      return [];
    }
  }
});
