// src/components/Portfolio.jsx
import React, { useEffect, useRef, useState } from 'react';
import { localizedContent, portfolioProjects } from '../data/siteContent';
import '../styles/Portfolio.css';

// Класс Renderer для управления WebGL анимацией фона
class Renderer {
  #vertexSrc = "#version 300 es\nprecision highp float;\nin vec4 position;\nvoid main(){gl_Position=position;}";
  #fragmtSrc = "#version 300 es\nprecision highp float;\nout vec4 O;\nuniform float time;\nuniform vec2 resolution;\nvoid main() {\n\tvec2 uv=gl_FragCoord.xy/resolution;\n\tO=vec4(uv,sin(time)*.5+.5,1);\n}";
  #vertices = [-1, 1, -1, -1, 1, 1, 1, -1];
  constructor(canvas, scale) {
    this.canvas = canvas;
    this.scale = scale;
    this.gl = canvas.getContext("webgl2");
    if (!this.gl) {
      throw new Error("WebGL2 is unavailable");
    }
    this.gl.viewport(0, 0, canvas.width * scale, canvas.height * scale);
    this.shaderSource = this.#fragmtSrc;
    this.mouseCoords = [0, 0];
    this.pointerCoords = [0, 0];
    this.nbrOfPointers = 0;
  }
  get defaultSource() {
    return this.#fragmtSrc;
  }
  updateShader(source) {
    this.reset();
    this.shaderSource = source;
    this.setup();
    this.init();
  }
  updateMouse(coords) {
    this.mouseCoords = coords;
  }
  updatePointerCoords(coords) {
    this.pointerCoords = coords;
  }
  updatePointerCount(nbr) {
    this.nbrOfPointers = nbr;
  }
  updateScale(scale) {
    this.scale = scale;
    this.gl.viewport(0, 0, this.canvas.width * scale, this.canvas.height * scale);
  }
  compile(shader, source) {
    const gl = this.gl;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      this.canvas.dispatchEvent(
        new CustomEvent("shader-error", { detail: gl.getShaderInfoLog(shader) })
      );
    }
  }
  test(source) {
    let result = null;
    const gl = this.gl;
    const shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      result = gl.getShaderInfoLog(shader);
    }
    if (gl.getShaderParameter(shader, gl.DELETE_STATUS)) {
      gl.deleteShader(shader);
    }
    return result;
  }
  reset() {
    const { gl, program, vs, fs } = this;
    if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) return;
    if (gl.getShaderParameter(vs, gl.DELETE_STATUS)) {
      gl.detachShader(program, vs);
      gl.deleteShader(vs);
    }
    if (gl.getShaderParameter(fs, gl.DELETE_STATUS)) {
      gl.detachShader(program, fs);
      gl.deleteShader(fs);
    }
    gl.deleteProgram(program);
  }
  setup() {
    const gl = this.gl;
    this.vs = gl.createShader(gl.VERTEX_SHADER);
    this.fs = gl.createShader(gl.FRAGMENT_SHADER);
    this.compile(this.vs, this.#vertexSrc);
    this.compile(this.fs, this.shaderSource);
    this.program = gl.createProgram();
    gl.attachShader(this.program, this.vs);
    gl.attachShader(this.program, this.fs);
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(this.program));
    }
  }
  init() {
    const { gl, program } = this;
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.#vertices), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    program.resolution = gl.getUniformLocation(program, "resolution");
    program.time = gl.getUniformLocation(program, "time");
    program.touch = gl.getUniformLocation(program, "touch");
    program.pointerCount = gl.getUniformLocation(program, "pointerCount");
    program.pointers = gl.getUniformLocation(program, "pointers");
  }
  render(now = 0) {
    const { gl, program, buffer, canvas, mouseCoords, pointerCoords, nbrOfPointers } = this;
    if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) return;
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.uniform2f(program.resolution, canvas.width, canvas.height);
    gl.uniform1f(program.time, now * 1e-3);
    gl.uniform2f(program.touch, ...mouseCoords);
    gl.uniform1i(program.pointerCount, nbrOfPointers);
    gl.uniform2fv(program.pointers, pointerCoords);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

// Шейдер для анимации фона
const shaderSource = `#version 300 es
/*********
* made by Matthias Hurrle (@atzedent)
*/   
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
#define FC gl_FragCoord.xy
#define R resolution
#define MN min(R.x,R.y)
#define T (time+660.)
#define S smoothstep
#define N normalize
#define rot(a) mat2(cos((a)-vec4(0,11,33,0)))
float rnd(vec2 p) {
	p=fract(p*vec2(12.9898,78.233));
	p+=dot(p,p+34.56);
	return fract(p.x*p.y);
}
float noise(vec2 p) {
	vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f), k=vec2(1,0);
	float
	a=rnd(i),
	b=rnd(i+k),
	c=rnd(i+k.yx),
	d=rnd(i+1.);
	return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p) {
	float t=.0, a=1., h=.0; mat2 m=mat2(1.,-1.2,.2,1.2);
	for (float i=.0; i<5.; i++) {
		t+=a*noise(p);
		p*=2.*m;
		a*=.5;
		h+=a;
	}
	return t/h;
}
void main() {
	vec2 uv=(FC-.5*R)/R.y, k=vec2(0,T*.015); 
	vec3 col=vec3(1);
  uv.x+=.25;
	uv*=vec2(2,1);
	float n=fbm(uv*.28+vec2(-T*.01,0));
	n=noise(uv*3.+n*2.);
	col.r-=fbm(uv+k+n);
	col.g-=fbm(uv*1.003+k+n+.003);
	col.b-=fbm(uv*1.006+k+n+.006);
	col=mix(col,vec3(1),dot(col,vec3(.21,.71,.07)));
	col=mix(vec3(.08),col,min(time*.1,1.));
	col=clamp(col,.08,1.);
	O=vec4(col,1);
}`;

const getProjectDescription = (project, locale) => (
  project.description?.[locale] || project.description?.ru || ''
);

// Компонент Portfolio
const Portfolio = ({ locale = 'ru' }) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [webglFallback, setWebglFallback] = useState(false);

  const content = localizedContent[locale]?.portfolio || localizedContent.ru.portfolio;
  const projectCount = portfolioProjects.length;

  useEffect(() => {
    const updateDimensions = () => setIsMobile(window.innerWidth <= 900);
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const scrollCarousel = (direction) => {
    setCurrentIndex((prevIndex) => {
      const delta = direction === 'next' ? 1 : -1;
      return (prevIndex + delta + projectCount) % projectCount;
    });
  };

  // Определяем видимые элементы (3 окна на десктопе, 1 окно на мобильных)
  const getVisibleSites = () => {
    const visibleSites = [];

    if (isMobile) {
      // На мобильных показываем только одно окно (текущее)
      const index = currentIndex;
      visibleSites.push({ ...portfolioProjects[index], position: 0 });
    } else {
      // На десктопе показываем 3 окна: текущее (центр), предыдущее (слева), следующее (справа)
      for (let i = -1; i <= 1; i++) {
        const index = (currentIndex + i + projectCount) % projectCount;
        visibleSites.push({ ...portfolioProjects[index], position: i });
      }
    }

    return visibleSites;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.max(1, window.devicePixelRatio);
    let renderer;

    try {
      renderer = new Renderer(canvas, dpr);
      renderer.setup();
      renderer.init();
      renderer.updateShader(shaderSource);
    } catch (error) {
      setWebglFallback(true);
      return undefined;
    }

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      renderer.updateScale(dpr);
    };

    window.addEventListener('resize', resize);
    resize();

    const loop = (now) => {
      renderer.render(now);
      animationFrameRef.current = requestAnimationFrame(loop);
    };
    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      renderer.reset();
    };
  }, []);

  return (
    <div className="portfolio-page">
      <div className="portfolio-container">
        <canvas ref={canvasRef} className="portfolio-canvas" />
        <div className="portfolio-content">
          <h1 className="portfolio-title fade-in">{content.title}</h1>
          {webglFallback && (
            <p className="portfolio-fallback">{content.fallback}</p>
          )}
          <div className="carousel-container">
            <button
              type="button"
              className="carousel-arrow carousel-arrow-left"
              aria-label={content.previousLabel}
              onClick={() => scrollCarousel('prev')}
            >
              <span aria-hidden="true">‹</span>
            </button>
            <div className="carousel-wrapper">
              <div className="carousel">
                {getVisibleSites().map((site, index) => (
                  <article
                    className={`portfolio-card ${site.position === 0 ? 'center' : ''}`}
                    key={`${site.title}-${site.position}-${index}`}
                  >
                    <a
                      className="portfolio-card-link"
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={site.preview}
                        alt={site.alt}
                        className="portfolio-preview fade-in"
                      />
                      <h2>{site.title}</h2>
                      <p>{getProjectDescription(site, locale)}</p>
                      <span>{content.openLabel}</span>
                    </a>
                  </article>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="carousel-arrow carousel-arrow-right"
              aria-label={content.nextLabel}
              onClick={() => scrollCarousel('next')}
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
