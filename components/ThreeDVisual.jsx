'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeDVisual() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 5
    cameraRef.current = camera

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    })
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    )
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create floating geometric shapes
    const shapes = []
    const geometryTypes = [
      () => new THREE.IcosahedronGeometry(0.5, 0),
      () => new THREE.OctahedronGeometry(0.6, 0),
      () => new THREE.TetrahedronGeometry(0.7, 0),
      () => new THREE.DodecahedronGeometry(0.4, 0),
    ]

    // Create materials with gradient colors
    const materials = [
      new THREE.MeshBasicMaterial({ 
        color: 0x00d9ff,
        transparent: true,
        opacity: 0.6,
        wireframe: true
      }),
      new THREE.MeshBasicMaterial({ 
        color: 0xb026ff,
        transparent: true,
        opacity: 0.6,
        wireframe: true
      }),
      new THREE.MeshBasicMaterial({ 
        color: 0xff00ff,
        transparent: true,
        opacity: 0.6,
        wireframe: true
      }),
      new THREE.MeshBasicMaterial({ 
        color: 0x00ffaa,
        transparent: true,
        opacity: 0.6,
        wireframe: true
      }),
    ]

    // Create shapes
    for (let i = 0; i < 8; i++) {
      const geometry = geometryTypes[i % geometryTypes.length]()
      const material = materials[i % materials.length]
      const mesh = new THREE.Mesh(geometry, material)
      
      // Random position
      mesh.position.x = (Math.random() - 0.5) * 8
      mesh.position.y = (Math.random() - 0.5) * 8
      mesh.position.z = (Math.random() - 0.5) * 8
      
      // Random rotation speed
      mesh.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02,
        },
        floatSpeed: Math.random() * 0.01 + 0.005,
        floatDirection: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ),
        originalPosition: mesh.position.clone(),
      }
      
      scene.add(mesh)
      shapes.push(mesh)
    }

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // Add point lights
    const pointLight1 = new THREE.PointLight(0x00d9ff, 1, 10)
    pointLight1.position.set(3, 3, 3)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xb026ff, 1, 10)
    pointLight2.position.set(-3, -3, 3)
    scene.add(pointLight2)

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      // Animate shapes
      shapes.forEach((shape, index) => {
        // Rotation
        shape.rotation.x += shape.userData.rotationSpeed.x
        shape.rotation.y += shape.userData.rotationSpeed.y
        shape.rotation.z += shape.userData.rotationSpeed.z

        // Floating motion
        const time = Date.now() * shape.userData.floatSpeed
        shape.position.x = shape.userData.originalPosition.x + Math.sin(time + index) * 0.5
        shape.position.y = shape.userData.originalPosition.y + Math.cos(time + index) * 0.5
        shape.position.z = shape.userData.originalPosition.z + Math.sin(time * 0.5 + index) * 0.5

        // Pulsing opacity
        shape.material.opacity = 0.4 + Math.sin(time * 0.001) * 0.2
      })

      // Slow camera rotation
      camera.position.x = Math.sin(Date.now() * 0.0005) * 2
      camera.position.y = Math.cos(Date.now() * 0.0003) * 2
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return

      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      )
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
      
      // Dispose of Three.js resources
      shapes.forEach(shape => {
        shape.geometry.dispose()
        shape.material.dispose()
      })
      scene.clear()
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}