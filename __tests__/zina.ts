import Zina, { defaultOpts } from '../src/index'


const FAILURE_SRC = 'FAILURE_SRC'

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

const createNode = ({ srcAttr, fallbackSrcAttr }: { srcAttr: string, fallbackSrcAttr?: string }) => {
  const node = {
    tagName: 'IMG',
    getAttribute: (key) => node[key],
    [defaultOpts.srcAttr]: srcAttr,
    [defaultOpts.fallbackSrcAttr]: fallbackSrcAttr,
    [defaultOpts.resizeByAttr]: 'width',
    src: null,
    clientWidth: 100,
    clientHeight: 200,
  }

  return node
}


describe('Zina', () => {

  it('should return correct src #1', (done) => {
    const zina = new Zina()
    const node = createNode({
      srcAttr: '/assets/image.png',
    })

    zina.process(node)

    setTimeout(() => {
      expect(node.src).toBe('/assets/image.png?w=100')
      done()
    }, 1000)
  })

  it('should return correct src #2', (done) => {
    const zina = new Zina()
    const node = createNode({
      srcAttr: 'https://cdn.amazon.com/assets/image.png',
    })

    zina.process(node)

    setTimeout(() => {
      expect(node.src).toBe('https://cdn.amazon.com/assets/image.png?w=100')
      done()
    }, 1000)
  })

  it('should return correct src #3', (done) => {
    const zina = new Zina({
      baseUrl: 'https://cdn.amazon.com/',
    })
    const node = createNode({
      srcAttr: '/assets/image.png?w=300&qlty=10',
    })

    zina.process(node)

    setTimeout(() => {
      expect(node.src).toBe('https://cdn.amazon.com/assets/image.png?w=100&qlty=10')
      done()
    }, 1000)
  })

  it('should return correct src #3', (done) => {
    const zina = new Zina({
      baseUrl: 'https://cdn.amazon.com/',
    })
    const node = createNode({
      srcAttr: FAILURE_SRC,
      fallbackSrcAttr: 'https://cdn.amazon.com/assets/fallback.png',
    })

    zina.process(node)

    setTimeout(() => {
      expect(node.src).toBe('https://cdn.amazon.com/assets/fallback.png')
      done()
    }, 1000)
  })

})
