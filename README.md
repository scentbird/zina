# Zina


#### Initial setup

```js
import Zina from 'zina'

window.zina = new Zina({
  baseUrl: 'https://cdn.domain.com/',
  srcAttr: 'data-zina-src',
  resizeByAttr: 'data-zina-resize-by',
  fallbackSrcAttr: 'data-zina-fallback-src',
  loadingClass: 'zina-loading',
  widthQueryKey: 'w',
  heightQueryKey: 'h',
})

window.zina.processAll() // execute script on existing images

window.zina.process(someImageNode) // execute script on demand
```


#### Initial html

Containers must be sized for the image. You need to add styles for this.

```html
// image
<div class="container">
  <img width="100" data-zina-src="image.png" />
</div>

// backgound image
<div class="container" style="width: 100px;" data-zina-src="image.png"></div>
```

After completion of the script zina

```html
// image
<div class="container">
  <img width="100" data-zina-src="image.png" src="https://site.com/image.png?w=100" />
</div>

// backgound image
<div class="container" data-zina-src="image.png" style="width: 100px; background-size: contain; backgound-image: url(https://site.com/image.png?w=100);"></div>
```


#### Dynamic nodes

```js html
const open = () => {
  const node = document.getElementById('dynamicElement')

  node.style.display = "block"
  window.zina.process(node) // add elem to zina
}

const close = () => {
  const node = document.getElementById('dynamicElement')

  node.style.display = "none"
}

<div id="dynamicElement" style="dispaly:none;">
  <img data-zina-src="image.png" />
</div>

<div onclick="open()">open</div>
<div onclick="close()">close</div>
```


#### React dynamic nodes

You can add a zina class to a component in any way: global object, context, props. The choice is yours.

```jsx harmony
const Image = ({ src }) => {
  const imgRef = useRef(null)

  useEffect(() => {
    if (imgRef.current) {
      zina.process(imgRef.current)
    }
  }, [])

  return (
    <div className={s.container}>
      <img ref={imgRef} data-zina-src={src} />
    </div>
  )
}
```
