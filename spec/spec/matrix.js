describe('Matrix', function() {
  var matrix

  describe('initialization', function() {
    
    describe('without a source', function() {
      
      beforeEach(function() {
        matrix = new SVG.Matrix
      })

      it('creates a new matrix with default values', function() {
        expect(matrix.a).toBe(1)
        expect(matrix.b).toBe(0)
        expect(matrix.c).toBe(0)
        expect(matrix.d).toBe(1)
        expect(matrix.e).toBe(0)
        expect(matrix.f).toBe(0)
      })

      describe('extract()', function() {
        var extract

        beforeEach(function() {
          extract = matrix.extract()
        })

        it('parses translation values', function() {
          expect(extract.x).toBe(0)
          expect(extract.y).toBe(0)
        })
        it('parses skew values', function() {
          expect(extract.skewX).toBe(0)
          expect(extract.skewY).toBe(0)
        })
        it('parses scale values', function() {
          expect(extract.scaleX).toBe(1)
          expect(extract.scaleY).toBe(1)
        })
        it('parses rotatoin value', function() {
          expect(extract.rotation).toBe(0)
        })
      })

      describe('toString()' , function() {
        it('exports correctly to a string', function() {
          expect(matrix.toString()).toBe('matrix(1,0,0,1,0,0)')
        })
      })
    })

    describe('with an element given', function() {
      var rect

      beforeEach(function() {
        rect = draw.rect(100, 100).rotate(-10).translate(40, 50).scale(2)
        matrix = new SVG.Matrix(rect)
      })

      it('parses the current transform matrix form an element', function() {
        expect(matrix.a).toBe(1.9696155786514282)
        expect(matrix.b).toBe(-0.3472963869571686)
        expect(matrix.c).toBe(0.3472963869571686)
        expect(matrix.d).toBe(1.9696155786514282)
        expect(matrix.e).toBe(-8.373950958251953)
        expect(matrix.f).toBe(7.758301258087158)
      })

      describe('extract()', function() {

        it('parses translation values', function() {
          var extract = new SVG.Matrix(draw.rect(100, 100).translate(40, 50)).extract()
          expect(extract.x).toBe(40)
          expect(extract.y).toBe(50)
        })
        it('parses skewX value', function() {
          var extract = new SVG.Matrix(draw.rect(100, 100).skew(25, 0)).extract()
          expect(approximately(extract.skewX, 0.01)).toBe(25)
        })
        it('parses skewX value', function() {
          var extract = new SVG.Matrix(draw.rect(100, 100).skew(0, 20)).extract()
          expect(approximately(extract.skewY, 0.01)).toBe(20)
        })
        it('parses scale values', function() {
          var extract = new SVG.Matrix(draw.rect(100, 100).scale(2, 3)).extract()
          expect(extract.scaleX).toBe(2)
          expect(extract.scaleY).toBe(3)
        })
        it('parses rotatoin value', function() {
          var extract = new SVG.Matrix(draw.rect(100, 100).rotate(-100)).extract()
          expect(approximately(extract.rotation, 0.01)).toBe(-100)
        })

      })

      describe('toString()' , function() {
        it('exports correctly to a string', function() {
          expect(matrix.toString()).toBe('matrix(1.9696155786514282,-0.3472963869571686,0.3472963869571686,1.9696155786514282,-8.373950958251953,7.758301258087158)')
        })
      })
      
    })

    describe('with a string given', function() {
      it('parses the string value correctly', function() {
        var matrix = new SVG.Matrix('2, 0, 0, 2, 100, 50')

        expect(matrix.a).toBe(2)
        expect(matrix.b).toBe(0)
        expect(matrix.c).toBe(0)
        expect(matrix.d).toBe(2)
        expect(matrix.e).toBe(100)
        expect(matrix.f).toBe(50)
      })
    })

  })

  describe('morph()', function() {
    it('stores a given matrix for morphing', function() {
      var matrix1 = new SVG.Matrix(2, 0, 0, 5, 0, 0)
        , matrix2 = new SVG.Matrix(1, 0, 0, 1, 4, 3)

      matrix1.morph(matrix2)

      expect(matrix1.destination).toEqual(matrix2)
    })
    it('stores a clone, not the given matrix itself', function() {
      var matrix1 = new SVG.Matrix(2, 0, 0, 5, 0, 0)
        , matrix2 = new SVG.Matrix(1, 0, 0, 1, 4, 3)

      matrix1.morph(matrix2)

      expect(matrix1.destination).not.toBe(matrix2)
    })
  })

  describe('at()', function() {
    it('returns a morphed array at a given position', function() {
      var matrix1 = new SVG.Matrix(2, 0, 0, 5, 0, 0)
        , matrix2 = new SVG.Matrix(1, 0, 0, 1, 4, 3)
        , matrix3 = matrix1.morph(matrix2).at(0.5)

      expect(matrix1.toString()).toBe('matrix(2,0,0,5,0,0)')
      expect(matrix2.toString()).toBe('matrix(1,0,0,1,4,3)')
      expect(matrix3.toString()).toBe('matrix(1.5,0,0,3,2,1.5)')
    })
  })
  
  describe('multiply()', function() {
    it('multiplies two matices', function() {
      var matrix1 = new SVG.Matrix(2, 0, 0, 5, 0, 0)
        , matrix2 = new SVG.Matrix(1, 0, 0, 1, 4, 3)
        , matrix3 = matrix1.multiply(matrix2)

      expect(matrix1.toString()).toBe('matrix(2,0,0,5,0,0)')
      expect(matrix2.toString()).toBe('matrix(1,0,0,1,4,3)')
      expect(matrix3.toString()).toBe('matrix(2,0,0,5,8,15)')
    })
    it('accepts matrices in any form', function() {
      var matrix1 = new SVG.Matrix(2, 0, 0, 5, 0, 0)
        , matrix2 = matrix1.multiply('1,0,0,1,4,3')

      expect(matrix1.toString()).toBe('matrix(2,0,0,5,0,0)')
      expect(matrix2.toString()).toBe('matrix(2,0,0,5,8,15)')
    })
  })

  describe('add()', function() {
    it('adds two matices', function() {
      var matrix1 = new SVG.Matrix(2, 0, 0, 5, 0, 0)
        , matrix2 = new SVG.Matrix(1.1, 0, 0, 1.5, 4, 3)
        , matrix3 = matrix1.add(matrix2)

      expect(matrix1.toString()).toBe('matrix(2,0,0,5,0,0)')
      expect(matrix2.toString()).toBe('matrix(1.1,0,0,1.5,4,3)')
      expect(matrix3.toString()).toBe('matrix(2.1,0,0,5.5,4,3)')
    })
    it('accepts two matrices in any form', function() {
      var matrix1 = new SVG.Matrix(2, 0, 0, 5, 0, 0)
        , matrix2 = matrix1.add('1.1,0,0,1.5,4,3')

      expect(matrix1.toString()).toBe('matrix(2,0,0,5,0,0)')
      expect(matrix2.toString()).toBe('matrix(2.1,0,0,5.5,4,3)')
    })
  })

  describe('inverse()', function() {
    it('inverses matrix', function() {
      var matrix1 = new SVG.Matrix(2, 0, 0, 5, 4, 3)
        , matrix2 = matrix1.inverse()

      expect(matrix1.toString()).toBe('matrix(2,0,0,5,4,3)')
      expect(matrix2.toString()).toBe('matrix(0.5,0,0,0.2,-2,-0.6)')
    })
  })

  describe('translate()', function() {
    it('translates matrix by given x and y values', function() {
      var matrix = new SVG.Matrix(1, 0, 0, 1, 4, 3).translate(10, 12.5)

      expect(matrix.e).toBe(14)
      expect(matrix.f).toBe(15.5)
    })
  })

  describe('scale()', function() {
    it('performs a uniformal scale with one value', function() {
      var matrix = new SVG.Matrix(1, 0, 0, 1, 4, 3).scale(3)

      expect(matrix.a).toBe(3)
      expect(matrix.d).toBe(3)
      expect(matrix.e).toBe(4)
      expect(matrix.f).toBe(3)
    })
    it('performs a non-uniformal scale with two values', function() {
      var matrix = new SVG.Matrix(1, 0, 0, 1, 4, 3).scale(2.5, 3.5)

      expect(matrix.a).toBe(2.5)
      expect(matrix.d).toBe(3.5)
      expect(matrix.e).toBe(4)
      expect(matrix.f).toBe(3)
    })
    it('performs a uniformal scale at a given center point with three values', function() {
      var matrix = new SVG.Matrix(1, 0, 0, 1, 4, 3).scale(3, 150, 100)

      expect(matrix.a).toBe(3)
      expect(matrix.d).toBe(3)
      expect(matrix.e).toBe(-2)
      expect(matrix.f).toBe(-197)
    })
    it('performs a non-uniformal scale at a given center point with our values', function() {
      var matrix = new SVG.Matrix(1, 0, 0, 1, 4, 3).scale(3, 2, 150, 100)

      expect(matrix.a).toBe(3)
      expect(matrix.d).toBe(2)
      expect(matrix.e).toBe(-296)
      expect(matrix.f).toBe(-97)
    })
  })

  describe('rotate()', function() {
    
  })

  describe('flip()', function() {
    
  })

  describe('skew()', function() {
    
  })

  describe('skew()', function() {
    
  })

  describe('native()', function() {
    it('returns the node reference', function() {
      expect(new SVG.Matrix().native() instanceof SVGMatrix).toBeTruthy()
    })
  })

})