/* eslint-disable */

function debounce(action, time) {
  let timeout = null

  return function () {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(action, time)
  }
}


const instances = []

const handleWindowResize = debounce(function () {
  for (let i = 0; i < instances.length; i++) {
    instances[i].reload();
  }
}, 300)

window.addEventListener('resize', handleWindowResize)


function ZinaImage(zina, node) {
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

ZinaImage.prototype.getAttrs = function () {
  return {
    both: this.node.getAttribute(this.zina.opts.srcAttr),
    width: this.node.getAttribute(this.zina.opts.widthSrcAttr),
    height: this.node.getAttribute(this.zina.opts.heightSrcAttr),
  }
}

ZinaImage.prototype.getSrc = function () {
  const { both, width, height } = this.attrs

  return both || width || height
}

ZinaImage.prototype.getBounds = function () {
  return {
    width: this.node.clientWidth,
    height: this.node.clientHeight,
  }
}

ZinaImage.prototype.setSrc = function () {
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

ZinaImage.prototype.modifySrc = function () {
  const multiplier  = window.devicePixelRatio || 1
  const baseUrl     = /^http/.test(this.src) ? '' : this.zina.opts.baseUrl

  let src = `${baseUrl}${this.src}?lambdaResize=1`
  let queries = []

  if ((this.attrs.both || this.attrs.width) && this.bounds.width) {
    queries.push(`${this.zina.opts.widthQueryKey}=${parseInt(this.bounds.width * multiplier, 10)}`)
  }

  if ((this.attrs.both || this.attrs.height) && this.bounds.height) {
    queries.push(`${this.zina.opts.heightQueryKey}=${parseInt(this.bounds.height * multiplier, 10)}`)
  }

  if (queries.length) {
    src += `&${queries.join('&')}`
  }

  return src
}


function Zina(opts) {
  this.opts = {
    baseUrl: '',
    srcAttr: 'data-zina-src',
    widthSrcAttr: 'data-zina-width-src',
    heightSrcAttr: 'data-zina-height-src',
    loadingClass: 'zina-loading',
    widthQueryKey: 'w',
    heightQueryKey: 'h',
    onError: null,
  }
  this.items = new Map()

  const keys = Object.keys(opts)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]

    if (opts.hasOwnProperty(key)) {
      this.opts[key] = opts[key]
    }
  }

  if (!this.opts.baseUrl) {
    throw new Error('"baseUrl" is required.')
  }

  instances.push(this)
}

Zina.prototype.addItem = function (node) {
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

Zina.prototype.removeItem = function (node) {
  this.items.delete(node)
}

Zina.prototype.handleError = function (err) {
  if (typeof this.opts.onError === 'function') {
    this.opts.onError(err)
  }
  else {
    console.error(err)
  }
}

Zina.prototype.init = function () {
  const nodes1  = [].slice.call(document.querySelectorAll(`[${this.opts.srcAttr}]`))
  const nodes2  = [].slice.call(document.querySelectorAll(`[${this.opts.widthSrcAttr}]`))
  const nodes3  = [].slice.call(document.querySelectorAll(`[${this.opts.heightSrcAttr}]`))
  const nodes   = [].concat(nodes1, nodes2, nodes3)

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
