const debounce = (action, time) => {
  let timeout = null

  return () => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(action, time)
  }
}


const instances = []

const handleWindowResize = debounce(() => {
  instances.forEach((instance) => {
    instance.reload()
  })
}, 300)

window.addEventListener('resize', handleWindowResize)


class ZinaImage {

  constructor(zina, node) {
    if (!node) {
      throw new Error('Missed node element.')
    }

    this.zina   = zina
    this.node   = node
    this.attrs  = this.getAttrs()
    this.src    = this.getSrc()
    this.bounds = this.getBounds()

    this.setSrc()
  }

  getAttrs() {
    return {
      both: this.node.getAttribute(this.zina.opts.srcAttr),
      width: this.node.getAttribute(this.zina.opts.widthSrcAttr),
      height: this.node.getAttribute(this.zina.opts.heightSrcAttr),
    }
  }

  getSrc() {
    const { both, width, height } = this.attrs

    return both || width || height
  }

  getBounds() {
    return {
      width: this.node.clientWidth,
      height: this.node.clientHeight,
    }
  }

  setSrc() {
    const isImgTag  = this.node.tagName === 'IMG'
    const src       = this.modifySrc()

    if (isImgTag) {
      this.node.src = src
    }
    else {
      this.node.style.backgroundImage = `url("${src}")`
      this.node.style.backgroundSize  = 'contain'
    }
  }

  modifySrc() {
    const multiplier  = window.devicePixelRatio || 1
    const baseUrl     = /^http/.test(this.src) ? '' : this.zina.opts.baseUrl
    let queries = []

    if (this.attrs.both || this.attrs.width) {
      queries.push(`${this.zina.opts.widthQueryKey}=${parseInt(this.bounds.width * multiplier, 10)}`)
    }

    if (this.attrs.both || this.attrs.height) {
      queries.push(`${this.zina.opts.heightQueryKey}=${parseInt(this.bounds.height * multiplier, 10)}`)
    }

    return `${baseUrl}${this.src}?lambdaResize=1&${queries.join('&')}`
  }
}

class Zina {

  constructor(opts) {
    this.opts = {
      baseUrl: '',
      srcAttr: 'data-zina-src',
      widthSrcAttr: 'data-zina-width-src',
      heightSrcAttr: 'data-zina-height-src',
      loadingClass: 'zina-loading',
      widthQueryKey: 'w',
      heightQueryKey: 'h',
      onError: null,
      ...opts,
    }

    this.items = new Map()

    if (!this.opts.baseUrl) {
      throw new Error('"baseUrl" is required.')
    }

    instances.push(this)
  }

  addItem(node) {
    if (node) {
      if (!this.items.has(node)) {
        this.items.set(node, new ZinaImage(this, node))
      }
      else {
        this.handleError('Passed node element already exists.')
      }
    }
    else {
      this.handleError('Missed node element.')
    }
  }

  removeItem(node) {
    this.items.delete(node)
  }

  handleError(err) {
    if (typeof this.opts.onError === 'function') {
      this.opts.onError(err)
    }
    else {
      console.error(err)
    }
  }

  init() {
    const nodes = [
      ...document.querySelectorAll(`[${this.opts.srcAttr}]`),
      ...document.querySelectorAll(`[${this.opts.widthSrcAttr}]`),
      ...document.querySelectorAll(`[${this.opts.heightSrcAttr}]`),
    ]

    if (nodes.length) {
      nodes.forEach((node) => {
        this.addItem(node)
      })
    }
    else {
      console.warn('Zina: Nodes not found.')
    }
  }
}


export default Zina
