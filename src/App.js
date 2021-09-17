import './App.css'
import * as Three from 'three'
import { Canvas, useLoader } from 'react-three-fiber'
import Orb from './assets/customOrb.png'
import { Suspense, useCallback, useMemo } from 'react'

// ----------------------------------------------------------------------------------------------------

// Camera position
function AnimationCanvas() {
  return(
    <Canvas
    colorManagement={false}
    camera={{position:[100, 10, 0], fov: 90}}
    >
      <Suspense fallback={null}>
        <Points/>
      </Suspense>
    </Canvas>
  )
}

// ----------------------------------------------------------------------------------------------------

// Contains animation
function Points() {
  // Loads orb
  const orb = useLoader(Three.TextureLoader, Orb)
  // Number of points across an axis
  const count = 100
  // Distance between each point
  const distance = 4

  // SIN uses a wave pattern
  // y = sin ( frequency * ( x^2 + z^2 + theta ) ) * amplitude
  // Frequency changes how many times waves occur
  // Theta changes how far wave travels before repeating
  // Amplitude changes height of each wave
  // http://grapher.mathpix.com/
  let frequency = 0.002
  let theta = 0
  let amplitude = 3
  const graph = useCallback((x, z) => {
    return Math.sin(frequency * (x**2 + z**2 + theta)) * amplitude
  }, [theta, frequency, amplitude])

  // Creates positions in a 1D array rather than a 2D array with useMemo hook
  // Example: [x1, y1, z1, x2, y2, z2, x3 and so on...]
  let positions = useMemo(() => {
    let positions = []

    // Iterate over an index on x and z axis
    // From left to right on x
    // From back to front on z
    // Determine y on each corresponding point
    // Add all three into positions array
    for(let xi = 0; xi < count; xi++) {
      for(let zi = 0; zi < count; zi++) {
        let x = distance * (xi - count / 2)
        let z = distance * (zi - count / 2)
        let y = graph(x, z)
        positions.push(x, y, z)
      }
    }

    return new Float32Array(positions)
  }, [count, distance, graph])

  return(
    <points>
      <bufferGeometry attach="geometry">
        <bufferAttribute
        attachObject={['attributes', 'position']}
        array={positions}
        count={positions.length / 3}
        itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
      attach="material"
      map={orb}
      size={0.5}
      sizeAttenuation
      transparent={false}
      alphaTest={0.5}
      opacity={1.0}
      />
    </points>
  )
}

// ----------------------------------------------------------------------------------------------------

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <AnimationCanvas/>
      </Suspense>
    </div>
  )
}

export default App
