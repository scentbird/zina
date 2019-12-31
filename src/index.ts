type ZinaOpts = {
  baseUrl: string
  srcAttr: string
  resizeByAttr: string
  loadingClass: string
  widthQueryKey: string
  heightQueryKey: string
}


function setSrc(node: HTMLImageElement, src: string) {
  const isImgTag = node.tagName === 'IMG'

  if (isImgTag) {
    node.src = src
  }
  else {
    node.style.backgroundImage = `url("${src}")`
  }
}

const defaultOpts = {
  baseUrl: '',
  srcAttr: 'data-zina-src',
  resizeByAttr: 'data-zina-resize-by',
  loadingClass: 'zina-loading',
  widthQueryKey: 'w',
  heightQueryKey: 'h',
}

function Zina(opts: ZinaOpts) {
  this.opts = { ...defaultOpts, ...opts }
}

Zina.prototype.addItem = function(node: HTMLImageElement) {
  if (!node) {
    console.error('Missed node element.')
  }
  else {
    const srcAttr   = node.getAttribute(this.opts.srcAttr)
    const resizeBy  = node.getAttribute(this.opts.resizeByAttr)

    if (!srcAttr) {
      console.error(`Missed node [${this.opts.srcAttr}] attribute.`)
    }
    else if (!resizeBy) {
      console.error(`Missed node [${this.opts.resizeByAttr}] attribute.`)
      setSrc(node, srcAttr)
    }
    else if (resizeBy === 'width' && !node.clientWidth) {
      console.error('Node width is not recognized.', node)
      setSrc(node, srcAttr)
    }
    else if (resizeBy === 'height' && !node.clientHeight) {
      console.error('Node height is not recognized.', node)
      setSrc(node, srcAttr)
    }
    else {
      try {
        const resizeKey   = resizeBy === 'width' ? this.opts.widthQueryKey : this.opts.heightQueryKey
        const resizeValue = resizeBy === 'width' ? node.clientWidth : node.clientHeight

        const [ initialSrc, initialQuery = '' ] = srcAttr.split('?')

        const baseUrl     = /^(\/\/|http)/.test(initialSrc) ? '' : this.opts.baseUrl
        const multiplier  = window.devicePixelRatio || 1
        const resizeQuery = `${resizeKey}=${resizeValue * multiplier}`
        const src         = `${baseUrl}${initialSrc}?${resizeQuery}${initialQuery ? '&' : ''}${initialQuery}`

        const img = new Image()

        img.onload = () => {
          setSrc(node, src)
        }

        img.onerror = (err) => {
          console.error(err)
          setSrc(node, srcAttr)
        }

        img.src = src
      }
      catch (err) {
        setSrc(node, srcAttr)
      }
    }
  }
}

Zina.prototype.removeItem = function(node: HTMLImageElement) {}

Zina.prototype.init = function () {
  const nodes = [].slice.call(document.querySelectorAll(`[${this.opts.srcAttr}]`))

  if (nodes.length) {
    for (let i = 0; i < nodes.length; i++) {
      this.addItem(nodes[i])
    }
  }
  else {
    console.warn('Zina: Nodes not found.')
  }
}

Zina.prototype.reload = function () {}


export default Zina
