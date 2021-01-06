# Zina

`Zina` loads an image of the required size, automatically detecting
the pixel density of the user's screen.


#### Initial setup

```js
import Zina from 'zina'

window.zina = new Zina({
  assetsPath: 'https://nest.scentbird.com/frontbird/',
})

window.zina.processAll() // execute script on existing images

window.zina.process(imageNode) // execute script on demand
```


#### Initial html

Containers must be sized for the image. You need to add styles for this.

```html
<img width="100" data-zina-src="image.jpg" />
<img width="100" data-zina-src="https://nest.scentbird.com/frontbird/image.jpg" />
```

After completion of the script zina

```html
<img width="100" data-zina-src="image.png" src="https://nest.scentbird.com/cdn-cgi/image/w=100/frontbird/image.jpg" />
<img width="100" data-zina-src="image.png" src="https://nest.scentbird.com/cdn-cgi/image/w=100/frontbird/image.jpg" />
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
