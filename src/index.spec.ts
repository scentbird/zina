import Zina from '../src/index'


const assetsPath = 'https://cdn.amazon.com/assets/'
const FAILURE_SRC = 'FAILURE_SRC'

// @ts-ignore
global.Image = function() {
  this.onload = () => {}
  this.onerror = () => {}
  this.src = null
}

Object.defineProperty(global.Image.prototype, 'src', {
  set(src) {
    if (src) {
      if (new RegExp(FAILURE_SRC).test(src)) {
        setTimeout(() => this.onerror(new Error('mock error')))
      }
      else {
        setTimeout(() => this.onload())
      }
    }
  },
})

const createNode = ({ src, width = 0, height = 0 }) => {
  const node = {
    tagName: 'IMG',
    getAttribute: (key) => node[key],
    'data-zina-src': src,
    src: null,
    clientWidth: width,
    clientHeight: height,
  }

  return node
}

describe('Zina', () => {

  it('"modifySrc" should return correct results', () => {
    const zina = new Zina({ assetsPath })

    expect(zina.modifySrc('/images/image.jpg', 'w', 100)).toBe('https://cdn.amazon.com/cdn-cgi/image/w=100/assets/images/image.jpg')
    expect(zina.modifySrc('/images/image.jpg', 'h', 100)).toBe('https://cdn.amazon.com/cdn-cgi/image/h=100/assets/images/image.jpg')
    expect(zina.modifySrc('https://cdn.amazon.com/assets/images/image.jpg', 'w', 100)).toBe('https://cdn.amazon.com/cdn-cgi/image/w=100/assets/images/image.jpg')
    expect(zina.modifySrc('/images/image.jpg?foo=1&bar=2', 'w', 100)).toBe('https://cdn.amazon.com/cdn-cgi/image/w=100/assets/images/image.jpg?foo=1&bar=2')
    expect(zina.modifySrc('/images/image.jpg', 'w')).toBe('/images/image.jpg')
    expect(zina.modifySrc('/images/image.jpg')).toBe('/images/image.jpg')
    expect(zina.modifySrc('https://cdn.amazon.com/other-cdn-path/images/image.jpg')).toBe('https://cdn.amazon.com/other-cdn-path/images/image.jpg')
  })

  it('should return correct src #1', (done) => {
    const zina = new Zina({ assetsPath })
    const node = createNode({ src: '/images/image.jpg', width: 100 })

    zina.process(node)

    setTimeout(() => {
      expect(node.src).toBe('https://cdn.amazon.com/cdn-cgi/image/w=100/assets/images/image.jpg')
      done()
    }, 0)
  })

  it('should return correct src #2', (done) => {
    const zina = new Zina({ assetsPath })

    const node = createNode({ src: 'https://cdn.amazon.com/assets/images/image.jpg', height: 100 })

    zina.process(node)

    setTimeout(() => {
      expect(node.src).toBe('https://cdn.amazon.com/cdn-cgi/image/h=100/assets/images/image.jpg')
      done()
    }, 0)
  })

  it('should return correct src #3', (done) => {
    const zina = new Zina({ assetsPath })

    const node = createNode({ src: '/images/image.jpg?foo=1&bar=2', width: 100 })

    zina.process(node)

    setTimeout(() => {
      expect(node.src).toBe('https://cdn.amazon.com/cdn-cgi/image/w=100/assets/images/image.jpg?foo=1&bar=2')
      done()
    }, 0)
  })

  it('should return correct src #3', (done) => {
    const zina = new Zina({ assetsPath })

    const node = createNode({ src: '/images/image.jpg' })

    zina.process(node)

    setTimeout(() => {
      expect(node.src).toBe('/images/image.jpg')
      done()
    }, 0)
  })

  it('should return correct src #4', (done) => {
    const zina = new Zina({ assetsPath })

    const node = createNode({ src: FAILURE_SRC, width: 100 })

    zina.process(node)

    setTimeout(() => {
      expect(node.src).toBe(FAILURE_SRC)
      done()
    }, 0)
  })

  it('should return correct src #5', (done) => {
    const zina = new Zina({ assetsPath })

    const node = createNode({ src: 'https://cdn.amazon.com/other-cdn-path/images/image.jpg', height: 100 })

    zina.process(node)

    setTimeout(() => {
      expect(node.src).toBe('https://cdn.amazon.com/other-cdn-path/images/image.jpg')
      done()
    }, 0)
  })

})
