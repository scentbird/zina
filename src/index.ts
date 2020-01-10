type ZinaOpts = {
  baseUrl: string
  srcAttr: string
  fallbackSrcAttr: string
  resizeByAttr: string
  loadingClass: string
  widthQueryKey: string
  heightQueryKey: string
}


const setSrc = (node: HTMLImageElement, src: string) => {
  const isImgTag = node.tagName === 'IMG'

  if (isImgTag) {
    node.src = src
  }
  else {
    node.style.backgroundImage = `url("${src}")`
  }
}

const loadImage = (src: string, onLoad?: Function, onError?: Function) => {
  const img = new Image()

  img.onload = () => onLoad()
  img.onerror = () => onError()

  img.src = src
}

const defaultOpts = {
  baseUrl: '',
  srcAttr: 'data-zina-src',
  resizeByAttr: 'data-zina-resize-by',
  fallbackSrcAttr: 'data-zina-fallback-src',
  loadingClass: 'zina-loading',
  widthQueryKey: 'w',
  heightQueryKey: 'h',
}

function Zina(opts: ZinaOpts) {
  this.opts = { ...defaultOpts, ...opts }
}

Zina.prototype.process = function(node: HTMLImageElement) {
  if (!node) {
    console.error('Missed node element.')
  }
  else {
    const src           = node.getAttribute(this.opts.srcAttr)
    const fallbackSrc   = node.getAttribute(this.opts.fallbackSrcAttr)
    const resizeBy      = node.getAttribute(this.opts.resizeByAttr)

    if (!src) {
      console.error(`Missed node [${this.opts.srcAttr}] attribute.`)
    }
    else if (!resizeBy) {
      console.error(`Missed node [${this.opts.resizeByAttr}] attribute.`)
      setSrc(node, src)
    }
    else if (resizeBy === 'width' && !node.clientWidth) {
      console.error('Node width is not recognized.', node)
      setSrc(node, src)
    }
    else if (resizeBy === 'height' && !node.clientHeight) {
      console.error('Node height is not recognized.', node)
      setSrc(node, src)
    }
    else {
      const onError = () => {
        if (fallbackSrc) {
          loadImage(
            src,
            () => setSrc(node, src),
            () => setSrc(node, fallbackSrc)
          )
        }
        else {
          setSrc(node, src)
        }
      }

      try {
        const resizeKey   = resizeBy === 'width' ? this.opts.widthQueryKey : this.opts.heightQueryKey
        const resizeValue = resizeBy === 'width' ? node.clientWidth : node.clientHeight

        const [ imagePath, initialQuery = '' ] = src.split('?')

        const baseUrl     = /^(\/\/|http)/.test(imagePath) ? '' : this.opts.baseUrl
        const multiplier  = window.devicePixelRatio || 1
        const resizeQuery = `${resizeKey}=${resizeValue * multiplier}`
        const modifiedSrc = `${baseUrl.replace(/\/$/, '')}/${imagePath.replace(/^\//, '')}?${resizeQuery}${initialQuery ? '&' : ''}${initialQuery}`

        loadImage(
          modifiedSrc,
          () => setSrc(node, modifiedSrc),
          () => onError()
        )
      }
      catch (err) {
        console.error(err)
        onError()
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
