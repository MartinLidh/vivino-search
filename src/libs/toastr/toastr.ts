import {Wine} from "../../types/types";

class ToastMessage {
    data: Wine;
    element?: HTMLDivElement;

    constructor(data: Wine) {
        this.data = data;
        this.show();
    }

    show(): void {
        this.element = document.createElement("div");
        this.element.classList.add("toast-message", "top-right");

        let ratingsHTML = this.data.ratings ? `<p>Ratings: ${this.data.ratings}</p>` : "";

        this.element.innerHTML = `
        <h2>Best Match:</h2>
        <a href="${this.data.link}" target="_blank" class="toast-link">
            <img src="${this.data.thumb}" alt="${this.data.name}" class="toast-image">
            <h3 class="underline">${this.data.name}</h3>
        </a>
        <p>Country: ${this.data.country}</p>
        <p>Region: ${this.data.region}</p>
        <p>Average Rating: ${this.data.average_rating || 'N/A'}</p>
        ${ratingsHTML}
        <button class="toast-close">Close</button>
    `;

        this.element.querySelector('.toast-link')!.addEventListener('click', () => {
            this.close();
        });

        this.element.querySelector('.toast-close')!.addEventListener('click', () => {
            this.close();
        });

        document.body.appendChild(this.element);

        setTimeout(() => {
            this.element!.classList.add("shown");
        }, 50);
    }

    close(): void {
        this.element!.classList.remove("shown");
        setTimeout(() => {
            this.element!.remove();
        }, 500);
    }
}

export function showWine(data: Wine): void {
    new ToastMessage(data);
}
