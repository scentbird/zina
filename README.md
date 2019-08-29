# Zina


#### Initial setup

```js
import Zina from 'zina'

window.zina = new Zina({
  baseUrl: 'https://cdn.domain.com/',
  srcAttr: 'data-zina-src',
  widthQueryKey: 'w',
  heightQueryKey: 'h',
  loadingClass:  'zina-loading',
  onError: (err) => {
    console.error(err)
  },
})

window.zina.init() // execute script on existing images
```


#### Initial html

Containers must be sized for the image. You need to add styles for this.

```html
// image
<div class="container">
  <img data-zina-src="image.png" />
</div>

// backgound image
<div class="container" data-zina-src="image.png"></div>
```

After completion of the script zina

```html
// image
<div class="container">
  <img data-zina-src="image.png" src="https://site.com/image.png?w=100&h=50" />
</div>

// backgound image
<div class="container" data-zina-src="image.png" style="background-size: contain; backgound-image: url(https://site.com/image.png?w=100&h=50);"></div>
```


#### Dynamic nodes

```js html
const open = () => {
  const node = document.getElementById('dynamicElement')

  node.style.display = "block"
  window.zina.addItem(node) // add elem to zina
}

const close = () => {
  const node = document.getElementById('dynamicElement')

  node.style.display = "none"
  window.zina.removeItem(node) // remove elem from zina
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
  const [ node, setNode ] = useState(null)

  useEffect(() => {
    if (!node) {
      zina.setElement(imgRef.current)
      setNode(imgRef.current)
    }
    else {
      return () => {
        zina.removeElement(node)
      }
    }
  }, [ node ])

  return (
    <div className={s.container}>
      <img ref={imgRef} data-zina-src={src} />
    </div>
  )
}
```

