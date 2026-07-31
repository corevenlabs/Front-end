import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const palette = ['#60a5fa', '#22d3ee', '#a855f7', '#3b82f6'];

function buildImageTarget(image, count) {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 256;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;
    const u = (Math.atan2(z, x) / (Math.PI * 2) + 1.3) % 1;
    const v = Math.acos(y) / Math.PI;
    const px = Math.min(canvas.width - 1, Math.floor(u * canvas.width));
    const py = Math.min(canvas.height - 1, Math.floor(v * canvas.height));
    const offset = (py * canvas.width + px) * 4;
    const land = pixels[offset] < 115;
    const blend = (Math.sin(u * Math.PI * 2) + 1) * .5;
    const coreR = THREE.MathUtils.lerp(.23, .66, blend);
    const coreG = THREE.MathUtils.lerp(.51, .33, blend);
    const coreB = THREE.MathUtils.lerp(.96, .97, blend);
    const i3 = i * 3;
    const globeRadius = land ? 1.72 + Math.random() * .035 : 1.65;
    positions[i3] = x * globeRadius;
    positions[i3 + 1] = y * globeRadius;
    positions[i3 + 2] = z * globeRadius;
    if (land) { colors[i3] = coreR; colors[i3 + 1] = coreG; colors[i3 + 2] = coreB; }
    else { colors[i3] = .012 + blend * .018; colors[i3 + 1] = .018; colors[i3 + 2] = .12 + blend * .045; }
  }
  return { positions, colors };
}

function buildThemedGlobeTarget(image, count, mode) {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 256;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const map = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;
    const u = (Math.atan2(z, x) / (Math.PI * 2) + 1.3) % 1;
    const v = Math.acos(y) / Math.PI;
    const px = Math.min(511, Math.floor(u * 512));
    const py = Math.min(255, Math.floor(v * 256));
    const land = map[(py * 512 + px) * 4] < 115;
    const coastline = [[4,0],[-4,0],[0,4],[0,-4]].some(([dx,dy]) => {
      const sampleX = Math.max(0, Math.min(511, px + dx));
      const sampleY = Math.max(0, Math.min(255, py + dy));
      return (map[(sampleY * 512 + sampleX) * 4] < 115) !== land;
    });
    const active = coastline;
    const blend = (Math.sin(u * Math.PI * 2) + 1) * .5;
    const coreR = THREE.MathUtils.lerp(.23, .66, blend);
    const coreG = THREE.MathUtils.lerp(.51, .33, blend);
    const coreB = THREE.MathUtils.lerp(.96, .97, blend);
    const landStrength = mode === 1 ? .28 : .72;
    const radius = active ? 1.76 : (land ? 1.7 : 1.65);
    const i3 = i * 3;
    positions[i3] = x * radius; positions[i3 + 1] = y * radius; positions[i3 + 2] = z * radius;
    if (active) {
      colors[i3] = Math.min(1, coreR * 1.28);
      colors[i3 + 1] = Math.min(1, coreG * 1.28);
      colors[i3 + 2] = 1;
    } else if (land) {
      colors[i3] = coreR * landStrength;
      colors[i3 + 1] = coreG * landStrength;
      colors[i3 + 2] = coreB * landStrength;
    } else {
      colors[i3] = .01 + blend * .02;
      colors[i3 + 1] = .015;
      colors[i3 + 2] = .11 + blend * .05;
    }
  }
  return { positions, colors };
}

function pointOnRect(t, width, height) {
  const perimeter = 2 * (width + height);
  let d = t * perimeter;
  if (d < width) return [-width / 2 + d, height / 2];
  d -= width;
  if (d < height) return [width / 2, height / 2 - d];
  d -= height;
  if (d < width) return [width / 2 - d, -height / 2];
  return [-width / 2, -height / 2 + (d - width)];
}

function pointOnHex(t, radius) {
  const segment = Math.floor(t * 6) % 6;
  const local = t * 6 - Math.floor(t * 6);
  const a1 = segment * Math.PI / 3;
  const a2 = (segment + 1) * Math.PI / 3;
  return [
    THREE.MathUtils.lerp(Math.cos(a1) * radius, Math.cos(a2) * radius, local),
    THREE.MathUtils.lerp(Math.sin(a1) * radius, Math.sin(a2) * radius, local)
  ];
}

function buildTarget(mode, count) {
  const target = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const i3 = i * 3;
    const r = Math.random();
    let x = 0;
    let y = 0;
    if (mode === 0) {
      if (r < .62) [x, y] = pointOnRect(Math.random(), 3.1, 2.05);
      else if (r < .7) { x = -1.25 + Math.random() * 2.5; y = .67; }
      else {
        const row = Math.floor(Math.random() * 5);
        x = -.95 + Math.random() * (1.1 + row % 3 * .28);
        y = .38 - row * .25;
      }
    } else if (mode === 1) {
      if (r < .28) {
        const ring = i % 3;
        [x, y] = pointOnHex(Math.random(), .48 + ring * .13);
        target[i3 + 2] = (ring - 1) * .13;
      } else if (r < .7) {
        const node = i % 6;
        const nodeAngle = node / 6 * Math.PI * 2;
        const local = pointOnHex(Math.random(), .25 + (i % 2) * .035);
        x = Math.cos(nodeAngle) * 1.72 + local[0];
        y = Math.sin(nodeAngle) * 1.05 + local[1];
      } else {
        const nodeAngle = (i % 6) / 6 * Math.PI * 2;
        const distance = .65 + Math.random() * .82;
        x = Math.cos(nodeAngle) * distance + (Math.random() - .5) * .018;
        y = Math.sin(nodeAngle) * distance * .62 + (Math.random() - .5) * .018;
      }
    } else {
      if (r < .62) [x, y] = pointOnRect(Math.random(), 3.2, 1.95);
      else if (r < .8) {
        const p = pointOnRect(Math.random(), .65, .52);
        x = p[0] - .72; y = p[1] + .08;
      } else {
        const band = Math.floor(Math.random() * 3);
        const angle = -.8 + Math.random() * 1.6;
        const radius = .35 + band * .22;
        x = .55 + Math.cos(angle) * radius;
        y = .05 + Math.sin(angle) * radius;
      }
    }
    target[i3] = x + (Math.random() - .5) * .035;
    target[i3 + 1] = y + (Math.random() - .5) * .035;
    if (mode !== 1 || target[i3 + 2] === 0) target[i3 + 2] = (Math.random() - .5) * .38;
  }
  return target;
}

function buildParticleFieldTarget(count, aspect) {
  const positions = new Float32Array(count * 3);
  /* Overscan prevents empty edges while the globe finishes dispersing. */
  const halfHeight = 3.25;
  const halfWidth = halfHeight * Math.max(aspect, .78);

  for (let i = 0; i < count; i += 1) {
    const i3 = i * 3;
    const x = (Math.random() * 2 - 1) * halfWidth;
    const y = (Math.random() * 2 - 1) * halfHeight;
    const wave = Math.sin(x * 1.35) * .13 + Math.cos(y * 1.8) * .1;
    positions[i3] = x;
    positions[i3 + 1] = y + wave;
    positions[i3 + 2] = (Math.random() - .5) * 1.4;
  }

  return positions;
}

export default function HeroParticles({ mode, expanded = false }) {
  const mountRef = useRef(null);
  const targetRef = useRef(null);
  const imageTargetRef = useRef(null);
  const themedTargetsRef = useRef({});
  const backgroundTargetRef = useRef(null);
  const modeRef = useRef(mode);
  const expandedRef = useRef(expanded);

  useEffect(() => {
    const mount = mountRef.current;
    const count = window.innerWidth < 760 ? 3500 : 12000;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
    camera.position.z = 6;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    mount.appendChild(renderer.domElement);
    const geometry = new THREE.BufferGeometry();
    const positions = buildTarget(0, count);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const color = new THREE.Color(palette[i % palette.length]);
      colors[i * 3] = color.r; colors[i * 3 + 1] = color.g; colors[i * 3 + 2] = color.b;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({ size: window.innerWidth < 760 ? .027 : .023, vertexColors: true, transparent: true, opacity: .96, blending: THREE.AdditiveBlending, depthWrite: false });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    targetRef.current = { values: buildTarget(0, count), colorValues: colors.slice(), count };
    backgroundTargetRef.current = {
      values: buildParticleFieldTarget(count, window.innerWidth / Math.max(window.innerHeight, 1)),
      colorValues: colors.slice()
    };
    const image = new Image();
    image.onload = () => {
      imageTargetRef.current = buildImageTarget(image, count);
      themedTargetsRef.current[1] = buildThemedGlobeTarget(image, count, 1);
      themedTargetsRef.current[2] = buildThemedGlobeTarget(image, count, 2);
      const selected = modeRef.current === 0
        ? themedTargetsRef.current[1]
        : (modeRef.current === 1 ? imageTargetRef.current : themedTargetsRef.current[2]);
      backgroundTargetRef.current.colorValues = themedTargetsRef.current[2].colors;
      if (expandedRef.current) {
        targetRef.current.values = backgroundTargetRef.current.values;
        targetRef.current.colorValues = backgroundTargetRef.current.colorValues;
      } else if (selected) {
        targetRef.current.values = selected.positions;
        targetRef.current.colorValues = selected.colors;
      }
    };
    image.src = '/image/earth-land-mask.jpg';
    let frame;
    let fieldResizeTimer;
    const resizeCanvas = () => {
      const { width, height } = mount.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix();
    };
    const refreshParticleField = () => {
      backgroundTargetRef.current.values = buildParticleFieldTarget(count, camera.aspect);
      if (expandedRef.current) targetRef.current.values = backgroundTargetRef.current.values;
    };
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      clearTimeout(fieldResizeTimer);
      fieldResizeTimer = setTimeout(refreshParticleField, 140);
    });
    const animate = (time) => {
      const current = geometry.attributes.position.array;
      const target = targetRef.current.values;
      for (let i = 0; i < current.length; i += 1) current[i] += (target[i] - current[i]) * .065;
      geometry.attributes.position.needsUpdate = true;
      const currentColors = geometry.attributes.color.array;
      const targetColors = targetRef.current.colorValues;
      for (let i = 0; i < currentColors.length; i += 1) currentColors[i] += (targetColors[i] - currentColors[i]) * .055;
      geometry.attributes.color.needsUpdate = true;
      if (expandedRef.current) points.rotation.y += (0 - points.rotation.y) * .055;
      else if (!reduceMotion) points.rotation.y += .0012;
      const targetRotationX = expandedRef.current ? 0 : -.12;
      points.rotation.x += (targetRotationX - points.rotation.x) * .04;
      if (expandedRef.current && !reduceMotion) {
        points.rotation.z += .00016;
        points.position.x += (Math.sin(time * .00022) * .2 - points.position.x) * .018;
        points.position.y += (Math.cos(time * .00017) * .13 - points.position.y) * .018;
      } else {
        points.rotation.z += (0 - points.rotation.z) * .04;
        points.position.x += (0 - points.position.x) * .04;
        points.position.y += (0 - points.position.y) * .04;
      }
      const targetPointSize = expandedRef.current ? .023 : (modeRef.current === 0 ? .014 : .023);
      material.size += (targetPointSize - material.size) * .06;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    resizeCanvas();
    refreshParticleField();
    resizeObserver.observe(mount);
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(fieldResizeTimer);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  useEffect(() => {
    modeRef.current = mode;
    if (!targetRef.current) return;
    if (expandedRef.current && backgroundTargetRef.current) {
      targetRef.current.values = backgroundTargetRef.current.values;
      targetRef.current.colorValues = backgroundTargetRef.current.colorValues;
      return;
    }
    if (mode === 1 && imageTargetRef.current) {
      targetRef.current.values = imageTargetRef.current.positions;
      targetRef.current.colorValues = imageTargetRef.current.colors;
      return;
    }
    if (mode === 0 || mode === 2) {
      const themedGlobe = themedTargetsRef.current[mode === 0 ? 1 : 2];
      if (themedGlobe) { targetRef.current.values = themedGlobe.positions; targetRef.current.colorValues = themedGlobe.colors; }
      return;
    }
    targetRef.current.values = buildTarget(mode, targetRef.current.count);
    const targetColors = new Float32Array(targetRef.current.count * 3);
    for (let i = 0; i < targetRef.current.count; i += 1) {
      const color = new THREE.Color(palette[(i + mode) % palette.length]);
      targetColors[i * 3] = color.r; targetColors[i * 3 + 1] = color.g; targetColors[i * 3 + 2] = color.b;
    }
    targetRef.current.colorValues = targetColors;
  }, [mode]);

  useEffect(() => {
    expandedRef.current = expanded;
    if (!targetRef.current || !backgroundTargetRef.current) return;
    if (expanded) {
      targetRef.current.values = backgroundTargetRef.current.values;
      targetRef.current.colorValues = backgroundTargetRef.current.colorValues;
      return;
    }

    const globe = modeRef.current === 0
      ? themedTargetsRef.current[1]
      : (modeRef.current === 1 ? imageTargetRef.current : themedTargetsRef.current[2]);
    if (globe) {
      targetRef.current.values = globe.positions;
      targetRef.current.colorValues = globe.colors;
    }
  }, [expanded]);

  return <div ref={mountRef} className="hero-particles" aria-hidden="true" />;
}
