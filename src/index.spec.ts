import Zina from '../src/index'


const assetsPath = 'https://cdn.amazon.com/'
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

  it('should return correct src #1', (done) => {
    const zina = new Zina({ assetsPath })
    const node = createNode({ src: '/assets/image.png', width: 100 })

    zina.process(node)

    setTimeout(() => {
      expect(node.src).toBe('https://cdn.amazon.com/cdn-cgi/image/w=100/assets/image.png')
      done()
    }, 1000)
  })

  it('should return correct src #2', (done) => {
    const zina = new Zina({ assetsPath })

    const node = createNode({ src: 'https://cdn.amazon.com/assets/image.png', height: 100 })

    zina.process(node)

    setTimeout(() => {
      expect(node.src).toBe('https://cdn.amazon.com/cdn-cgi/image/h=100/assets/image.png')
      done()
    }, 1000)
  })

  it('should return correct src #3', (done) => {
    const zina = new Zina({ assetsPath })

    const node = createNode({ src: '/assets/image.png?foo=1&bar=2', width: 100 })

    zina.process(node)

    setTimeout(() => {
      expect(node.src).toBe('https://cdn.amazon.com/cdn-cgi/image/w=100/assets/image.png?foo=1&bar=2')
      done()
    }, 1000)
  })

  it('should return correct src #3', (done) => {
    const zina = new Zina({ assetsPath })

    const node = createNode({ src: '/assets/image.png' })

    zina.process(node)

    setTimeout(() => {
      expect(node.src).toBe('/assets/image.png')
      done()
    }, 1000)
  })

  it('should return correct src #4', (done) => {
    const zina = new Zina({ assetsPath })

    const node = createNode({ src: FAILURE_SRC, width: 100 })

    zina.process(node)

    setTimeout(() => {
      expect(node.src).toBe(FAILURE_SRC)
      done()
    }, 1000)
  })

})
