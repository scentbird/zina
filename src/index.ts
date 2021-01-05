const srcAttr = 'data-zina-src'

const setSrc = (node: HTMLImageElement, src: string) => {
  const isImgTag = node.tagName === 'IMG'

  if (isImgTag) {
    node.src = src
  }
  else {
    node.style.backgroundImage = `url("${src}")`
  }
}

const loadImage = (src: string, onLoad: Function, onError: Function) => {
  const img = new Image()

  img.onload = () => onLoad()
  img.onerror = () => onError()

  img.src = src
}

type Opts = {
  assetsPath: string
}

function Zina(opts: Opts) {
  this.opts = opts

  if (typeof this.opts.assetsPath !== 'string') {
    throw new Error('"assetsPath" is required.')
  }

  this.opts.assetsPath = this.opts.assetsPath.replace(/\/$/, '')
}

Zina.prototype.process = function (node: HTMLImageElement) {
  if (!node) {
    console.error('Missed node element.')
  }
  else {
    const src = node.getAttribute(srcAttr)

    if (!src) {
      console.error(`Missed node [${srcAttr}] attribute.`, node)
    }
    if (!node.clientWidth && !node.clientHeight) {
      console.error('Node width and height are not recognized.', node)
      setSrc(node, src)
    }
    else {
      try {
        const resizeKey = node.clientWidth ? 'w' : 'h'
        const resizeValue = node.clientWidth ? node.clientWidth : node.clientHeight

        let [ path, query = '' ] = src.replace(this.opts.assetsPath, '').replace(/^\//, '').split('?')

        const multiplier = window.devicePixelRatio || 1
        const value = Math.ceil(resizeValue * multiplier)
        const options = `${resizeKey}=${value}`

        const modifiedSrc = `${this.opts.assetsPath}/cdn-cgi/image/${options}/${path}${query ? `?${query}` : ''}`

        loadImage(
          modifiedSrc,
          () => setSrc(node, modifiedSrc),
          () => setSrc(node, src)
        )
      }
      catch (err) {
        console.error(err)
        setSrc(node, src)
      }
    }
  }
}

Zina.prototype.processAll = function () {
  const nodes = [].slice.call(document.querySelectorAll(`[${this.opts.srcAttr}]`))

  if (nodes.length) {
    for (let i = 0; i < nodes.length; i++) {
      this.process(nodes[i])
    }
  }
  else {
    console.warn('Zina: Nodes not found.')
  }
}


export default Zina
