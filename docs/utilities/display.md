# Display

Kickstand UI's display utility classes provide a way for you to easily adjust layouts.

## Classes

| Class                                             | CSS Rule                           |
| ------------------------------------------------- | ---------------------------------- |
| `display-block`                                   | `display: block;`                  |
| `display-inline`                                  | `display: inline;`                 |
| `display-inline-block`                            | `display: inline-block;`           |
| `display-flex` [more info](/layout/flex-box.html) | `display: flex;`                   |
| `display-inline-flex`                             | `display: inline-flex;`            |


<div class="my-xl">
    <div class="bg-light p-lg my-md display-block">display-block</div>
    <div class="bg-light p-lg my-md display-inline">display-inline</div>
    <div class="bg-light p-lg my-md display-inline-block">display-inline-block</div>
    <div class="bg-light p-lg my-md display-flex">display-flex</div>
    <div class="bg-light p-lg my-md display-inline-flex">display-inline-flex</div>
</div>

```html
<div class="bg-light p-lg my-md display-block">display-block</div>
<div class="bg-light p-lg my-md display-inline">display-inline</div>
<div class="bg-light p-lg my-md display-inline-block">display-inline-block</div>
<div class="bg-light p-lg my-md display-flex">display-flex</div>
<div class="bg-light p-lg my-md display-inline-flex">display-inline-flex</div>
```

## Responsive Classes

You can also change the layout based on the user's screen size using the responsive variations of each class. By prefixing the class with the desired screen size (`xxs`-`xl`), you can adjust the behavior.

<div class="my-xl">
    <div class="bg-light p-lg my-md display-inline md:display-block">Display <code>inline</code> then <code>block</code> on <code>md</code> screen</div>
</div>

```html
<div class="display-inline md:display-block">Display <code>inline</code> then <code>block</code> on <code>md</code> screen</div>
```