import { text, select, boolean, number } from "@storybook/addon-knobs";

export default { title: 'Components/Card' };

const imgDirections = ['top', 'bottom', 'left', 'right', 'behind'];

export const card = () => {
    const imgDir = select('img-direction', imgDirections, 'top');
    const src = text('img-src', 'https://media.boingboing.net/wp-content/uploads/2018/07/screenshot-22.jpg');
    const alt = text('alt', 'Michael Scott');
    const href = text('href', '');
    const clickable = boolean('clickable', false);
    const collapse = select('collapse', ['xxs', 'xs', 'sm', 'md', 'lg', 'xl'], 'xs');
    const lazy = boolean('lazy', true);
    const threshold = number('threshold', 300);
    const cardTitle = text('card-title', 'Meditation Moment');
    const cardSubtitle = text('card-subtitle', 'Comfort Food');
    const bodyText = text('body text', `"It's never too early for ice cream, Jim. But we didn't have any ice cream, so this is mayonnaise and black olives. It's comfort food, alright?"`);

    return (`<div class="m-xxl" style="height:500px">
                <ks-card img-src="${src}"
                        img-direction="${imgDir}"
                        alt="${alt}"
                        href="${href}"
                        clickable="${clickable}"
                        class="w-30"
                        lazy="${lazy}"
                        threshold="${threshold}"
                        collapse="${collapse}"
                        img-aspect-ratio="3:2"
                        >
                    <ks-card-body card-title="${cardTitle}"
                            card-subtitle="${cardSubtitle}">
                        ${bodyText}
                    </ks-card-body>
                    <ks-card-footer>
                        <ks-button>Get One</ks-button>
                    </ks-card-footer>
                </ks-card>
            </div>`);
};
