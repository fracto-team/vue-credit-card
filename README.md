# @fracto/vue-credit-card

Credit card component for vue

## Features
Note: Localization supports only `Turkish` & `German` & `English` for now.
- [x] Localization (i18n) (All translations are welcome)
- [x] Card Preview
- [x] Hide sensitive information
- [x] Card input mask
- [x] Easily customizable
- [x] Validator

## Getting Started

### Import

#### Common

```javascript
import VueCreditCard from '@fracto/vue-credit-card';
/* Globally use */
Vue.use(VueCreditCard);
/* Local Component */
export default {
    components: {VueCreditCard}
}
```

#### Browser
```html
<link rel="stylesheet" href="https://unpkg.com/@fracto/vue-credit-card/dist/VueCreditCard.css">
<div id="app">
    <vue-credit-card></vue-credit-card>
</div>
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/@fracto/vue-credit-card/dist/VueCreditCard.umd.js"></script>
<script>
    Vue.component('vue-credit-card', VueCreditCard);
    var app = new Vue({
        el: '#app',
    });
</script>
```

### Usage

```html
<vue-credit-card :preview-enabled="true" v-model="creditCardForm" :card-types="myCustomCardTypes">
</vue-credit-card>
```
Prop `preview-enabled` enables or disabled Card preview.

Prop `card-types` allows you to change or add new card types. Example usage:
```html
<div id="app">
<vue-credit-card :preview-enabled="true" :card-types="cardTypes">
</vue-credit-card>
</div>
<script src="https://unpkg.com/vue@2.6.11/dist/vue.js"></script>
<script src="https://unpkg.com/@fracto/vue-credit-card/dist/VueCreditCard.umd.js"></script>
<script>
    Vue.component('vue-credit-card', VueCreditCard);
    var app = new Vue({
        el: '#app',
        data: {
            cardTypes: [
                {regEx: /^4[0-9]{5}/ig, name: 'visa', icon: require('../assets/visa_icon.png')},
                {regEx: /^5[1-5][0-9]{4}/ig, name: 'mastercard', icon: require('../assets/master_icon.png')},
            ]
        },
    });
</script>
```

The variable `creditCardForm` is a `model` which formatted like this: 
```json
{
    "holder": "Orkun ÇAKILKAYA",
    "number": 9792030000000000,
    "month": 12,
    "year": 23,
    "cvv": 456
}
```

#### Localization

Available locales are `de`, `en` & `tr`

```html
<div id="app">
<vue-credit-card :preview-enabled="true" :card-types="cardTypes">
</vue-credit-card>
</div>
<script src="https://unpkg.com/vue@2.6.11/dist/vue.js"></script>
<script src="https://unpkg.com/@fracto/vue-credit-card/dist/VueCreditCard.umd.js"></script>
<script>
    VueCreditCard.i18n.locale = 'tr'; // Changes locale to Turkish (default is English)
    Vue.component('vue-credit-card', VueCreditCard);
    var app = new Vue({
        el: '#app',
    });
</script>
```

#### Validation

There a 2 difference worker concerning how validation would interact with user input:
`true`, `false
`

```html
<div id="app">
  <vue-credit-card></vue-credit-card>
</div>

<script>
  VueCreditCard.validate.setWork('false'); // default true
  Vue.component('vue-credit-card', VueCreditCard);
  new Vue({
    el: '#app',
  });
</script>
```

### Preview

![VueCreditCard Preview](.github/preview.png?raw=true&v=2 "VueCreditCard Preview")
