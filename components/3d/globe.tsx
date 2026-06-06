"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import { Suspense, useRef, type RefObject } from "react";
import * as THREE from "three";
import type { StopData } from "@/lib/content";

const ACCENT = "#00cc44";
const GREEN_GLOW = "#00e64d";
const RADIUS = 1.6;

function latLngToVec3(
  lat: number,
  lng: number,
  r: number
): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return [
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ];
}

function lngToYRotation(lng: number): number {
  return (-(lng + 90) * Math.PI) / 180;
}

function latToXTilt(lat: number): number {
  return (lat * Math.PI) / 180 * 0.3;
}

function generateStarPositions(): Float32Array {
  const count = 2500;
  const pos = new Float32Array(count * 3);
  let s = 1;
  for (let i = 0; i < count; i++) {
    s = (s * 16807) % 2147483647;
    const r1 = s / 2147483647;
    s = (s * 16807) % 2147483647;
    const r2 = s / 2147483647;
    s = (s * 16807) % 2147483647;
    const r3 = s / 2147483647;
    const theta = r1 * Math.PI * 2;
    const phi = Math.acos(2 * r2 - 1);
    const r = 18 + r3 * 40;
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
  }
  return pos;
}

function generateGraticulePositions(): Float32Array {
  const positions: number[] = [];
  const latLines = [-60, -30, 0, 30, 60];
  for (const lat of latLines) {
    const phi = ((90 - lat) * Math.PI) / 180;
    for (let i = 0; i <= 72; i++) {
      const t1 = (i / 72) * Math.PI * 2;
      const t2 = ((i + 1) / 72) * Math.PI * 2;
      positions.push(
        -RADIUS * 1.002 * Math.sin(phi) * Math.cos(t1),
        RADIUS * 1.002 * Math.cos(phi),
        RADIUS * 1.002 * Math.sin(phi) * Math.sin(t1),
        -RADIUS * 1.002 * Math.sin(phi) * Math.cos(t2),
        RADIUS * 1.002 * Math.cos(phi),
        RADIUS * 1.002 * Math.sin(phi) * Math.sin(t2)
      );
    }
  }
  const lngLines = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150];
  for (const lng of lngLines) {
    const t = ((lng + 180) * Math.PI) / 180;
    for (let i = 0; i <= 36; i++) {
      const phi1 = (i / 36) * Math.PI;
      const phi2 = ((i + 1) / 36) * Math.PI;
      positions.push(
        -RADIUS * 1.002 * Math.sin(phi1) * Math.cos(t),
        RADIUS * 1.002 * Math.cos(phi1),
        RADIUS * 1.002 * Math.sin(phi1) * Math.sin(t),
        -RADIUS * 1.002 * Math.sin(phi2) * Math.cos(t),
        RADIUS * 1.002 * Math.cos(phi2),
        RADIUS * 1.002 * Math.sin(phi2) * Math.sin(t)
      );
    }
  }
  return new Float32Array(positions);
}

type GlobeProps = {
  stops: StopData[];
  activeTitle: string | null;
  onSelect: (stop: StopData) => void;
  progressRef: RefObject<number>;
  activeStop: number;
  totalStops: number;
};

const starPositions = generateStarPositions();
const graticulePositions = generateGraticulePositions();

const earthVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const earthFragmentShader = `
  uniform sampler2D dayMap;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    float texelSize = 1.0 / 2048.0;
    float lum = dot(texture2D(dayMap, vUv).rgb, vec3(0.299, 0.587, 0.114));
    float lumR = dot(texture2D(dayMap, vUv + vec2(texelSize, 0.0)).rgb, vec3(0.299, 0.587, 0.114));
    float lumL = dot(texture2D(dayMap, vUv + vec2(-texelSize, 0.0)).rgb, vec3(0.299, 0.587, 0.114));
    float lumU = dot(texture2D(dayMap, vUv + vec2(0.0, texelSize)).rgb, vec3(0.299, 0.587, 0.114));
    float lumD = dot(texture2D(dayMap, vUv + vec2(0.0, -texelSize)).rgb, vec3(0.299, 0.587, 0.114));
    float edge = abs(lumR - lumL) + abs(lumU - lumD);
    edge = smoothstep(0.01, 0.06, edge);

    float landMask = smoothstep(0.07, 0.19, lum);

    vec3 lineColor = vec3(0.0, 0.55, 0.22);
    vec3 landFill = vec3(0.0, 0.14, 0.06);
    vec3 landBright = vec3(0.0, 0.20, 0.09);
    vec3 waterFill = vec3(0.003, 0.015, 0.01);

    vec3 baseColor = mix(waterFill, mix(landFill, landBright, smoothstep(0.19, 0.40, lum)), landMask);
    baseColor += lineColor * edge * 0.9;
    baseColor += lineColor * landMask * 0.06;

    vec3 viewDir = normalize(-vPosition);
    float fresnel = 1.0 - max(dot(viewDir, vNormal), 0.0);
    float rim = pow(fresnel, 3.0);

    vec3 rimColor = vec3(0.0, 0.50, 0.28);
    baseColor += rimColor * rim * 0.20;

    float scanLine = sin(vUv.y * 240.0 + uTime * 1.2) * 0.01;
    baseColor += vec3(0.0, scanLine, 0.0) * (1.0 - fresnel) * 0.5;

    float opacity = mix(0.07, 0.20, landMask * 0.6 + 0.4);
    opacity += edge * 0.35;
    opacity += rim * 0.14;
    opacity = min(opacity, 0.52);

    gl_FragColor = vec4(baseColor, opacity);
  }
`;

function StarDots() {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.003;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[starPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#c8d0d8"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.5}
      />
    </points>
  );
}

function GraticuleLines() {
  const geometry = useRef<THREE.BufferGeometry>(null);

  return (
    <lineSegments>
      <bufferGeometry ref={geometry}>
        <bufferAttribute
          attach="attributes-position"
          args={[graticulePositions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#00883a"
        transparent
        opacity={0.06}
      />
    </lineSegments>
  );
}

function ImmersiveEarth() {
  const dayMap = useTexture("/textures/earth-day.jpg", (tex) => {
    (tex as THREE.Texture).colorSpace = THREE.SRGBColorSpace;
  });
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[RADIUS, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={earthVertexShader}
        fragmentShader={earthFragmentShader}
        uniforms={{
          dayMap: { value: dayMap },
          uTime: { value: 0 },
        }}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

function InnerCore() {
  return (
    <mesh>
      <sphereGeometry args={[RADIUS * 0.97, 32, 32]} />
      <meshBasicMaterial
        color="#020604"
        transparent
        opacity={0.40}
      />
    </mesh>
  );
}

function Marker({
  stop,
  isActive,
  onSelect,
}: {
  stop: StopData;
  isActive: boolean;
  onSelect: (stop: StopData) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const pos = latLngToVec3(stop.lat, stop.lng, RADIUS + 0.025);
  const isSection = !stop.project;

  useFrame(() => {
    if (!groupRef.current) return;
    const wp = new THREE.Vector3();
    groupRef.current.getWorldPosition(wp);
    const front = wp.z > 0;
    const target = front ? (isActive ? 1.4 : 1) : 0.25;
    const s = THREE.MathUtils.lerp(groupRef.current.scale.x, target, 0.1);
    groupRef.current.scale.setScalar(s);
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(
        mat.opacity,
        front ? 1 : 0.1,
        0.1
      );
    }
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(
        mat.opacity,
        front ? (isActive ? 0.65 : 0.3) : 0.04,
        0.1
      );
    }
    if (beamRef.current) {
      const mat = beamRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(
        mat.opacity,
        isActive && front ? 0.55 : 0,
        0.08
      );
    }
  });

  return (
    <group ref={groupRef} position={pos}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(stop);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      >
        <sphereGeometry args={[isSection ? 0.032 : 0.028, 16, 16]} />
        <meshBasicMaterial
          color={isActive ? "#ffffff" : isSection ? GREEN_GLOW : ACCENT}
          transparent
          opacity={0.95}
        />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.048, 0.06, 24]} />
        <meshBasicMaterial
          color={isSection ? GREEN_GLOW : ACCENT}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      {isActive && (
        <mesh ref={beamRef} position={[0, 0.07, 0]}>
          <boxGeometry args={[0.003, 0.14, 0.003]} />
          <meshBasicMaterial color={isSection ? GREEN_GLOW : ACCENT} transparent opacity={0.55} />
        </mesh>
      )}
      {isActive && (
        <Html
          center
          position={[0, 0.13, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div className="flex items-center gap-1.5 whitespace-nowrap rounded border border-green-500/40 bg-background/90 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-green-400 shadow-lg backdrop-blur">
            <span className="inline-block size-1.5 rounded-full bg-green-400" />
            {stop.label}
          </div>
        </Html>
      )}
    </group>
  );
}

function GlobeMesh({
  stops,
  activeTitle,
  onSelect,
  progressRef,
}: Omit<GlobeProps, "activeStop" | "totalStops">) {
  const group = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragRotation = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (!group.current) return;
    const p = progressRef.current ?? 0;
    const idx = Math.round(p);
    const clampedIdx = Math.max(0, Math.min(stops.length - 1, idx));
    const targetStop = stops[clampedIdx];

    let targetY: number;
    let targetX: number;

    if (p < 0.5) {
      targetY = lngToYRotation(0);
      targetX = 0.14;
    } else {
      targetY = lngToYRotation(targetStop.lng);
      targetX = latToXTilt(targetStop.lat);
    }

    if (isDragging.current) {
      targetY = dragRotation.current.y;
      targetX = dragRotation.current.x;
    }

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetY,
      0.1
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetX,
      0.1
    );
  });

  const markers = stops.filter((s) => s.id !== "hero");

  return (
    <group
      ref={group}
      onPointerDown={(e) => {
        isDragging.current = true;
        dragStart.current = { x: e.clientX, y: e.clientY };
        dragRotation.current = {
          x: group.current?.rotation.x ?? 0,
          y: group.current?.rotation.y ?? 0,
        };
      }}
      onPointerUp={() => {
        isDragging.current = false;
      }}
      onPointerMove={(e) => {
        if (!isDragging.current || !group.current) return;
        const dx = (e.clientX - dragStart.current.x) * 0.005;
        const dy = (e.clientY - dragStart.current.y) * 0.005;
        dragRotation.current = {
          x: dragRotation.current.x - dy,
          y: dragRotation.current.y + dx,
        };
        dragStart.current = { x: e.clientX, y: e.clientY };
      }}
    >
      <Suspense
        fallback={
          <mesh>
            <sphereGeometry args={[RADIUS, 32, 32]} />
            <meshBasicMaterial color="#030a06" transparent opacity={0.2} />
          </mesh>
        }
      >
        <ImmersiveEarth />
      </Suspense>
      <InnerCore />
      <GraticuleLines />
      {markers.map((s) => (
        <Marker
          key={s.id}
          stop={s}
          isActive={s.label === activeTitle || s.id === activeTitle}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

export function Globe(props: GlobeProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 4.5], fov: 45 }}
      style={{ background: "transparent" }}
    >
      <color attach="background" args={["#030808"]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={0.5} />
      <StarDots />
      <GlobeMesh
        stops={props.stops}
        activeTitle={props.activeTitle}
        onSelect={props.onSelect}
        progressRef={props.progressRef}
      />
    </Canvas>
  );
}