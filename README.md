# @fracto/vue-credit-card

Credit card component for vue

## Features
Note: Localization supports only `Turkish` for now.
- [ ] Localization (i18n) (Needs translations for other languages)
- [x] Card Preview
- [x] Hide sensitive information
- [x] Card input mask
- [x] Easily customizable
- [ ] Validator

## Getting Started

### Import

```javascript
import VueCreditCard from '@fracto/vue-credit-card';
/* Globally use */
Vue.use(VueCreditCard);
/* Local Component */
export default {
    components: {VueCreditCard}
}
```

### Usage

```html
<vue-credit-card :preview-enabled="true" v-model="creditCardForm">
</vue-credit-card>
```

The variable `creditCardForm` returns
```json
{
    "cardHolder": "",
    "cardNumber": 1234000012340000,
    "cvv": 123,
    "expiryMonth": 12,
    "expiryYear": 23
}
```

### Preview

![VueCreditCard Preview](.github/preview.png?raw=true&v=1 "VueCreditCard Preview")
