import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const AnimatedGlobe = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId
    let particles = []

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const createParticles = () => {
      const particleCount = 100
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.3,
        })
      }
    }

    const drawGlobe = () => {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(centerX, centerY) * 0.6

      // Draw outer glow
      const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.5, centerX, centerY, radius * 1.5)
      gradient.addColorStop(0, 'rgba(79, 115, 242, 0.3)')
      gradient.addColorStop(1, 'rgba(79, 115, 242, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw globe
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(79, 115, 242, 0.1)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(79, 115, 242, 0.5)'
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw grid lines
      for (let i = 0; i <= 4; i++) {
        ctx.beginPath()
        ctx.ellipse(centerX, centerY, radius, radius * (0.2 + i * 0.2), 0, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Draw dashed latitude lines
      for (let i = -60; i <= 60; i += 30) {
        const y = centerY + (radius * Math.sin(i * Math.PI / 180))
        ctx.beginPath()
        ctx.ellipse(centerX, y, radius * Math.cos(i * Math.PI / 180), radius * 0.05, 0, 0, Math.PI * 2)
        ctx.setLineDash([5, 5])
        ctx.stroke()
      }
      ctx.setLineDash([])
    }

    const animate = () => {
      if (!canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawGlobe()
      
      particles.forEach(particle => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0
        
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(79, 115, 242, ${particle.opacity})`
        ctx.fill()
      })
      
      animationId = requestAnimationFrame(animate)
    }

    const init = () => {
      resizeCanvas()
      createParticles()
      animate()
    }

    init()
    window.addEventListener('resize', resizeCanvas)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      className="w-full h-[500px] relative"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </motion.div>
  )
}

export default AnimatedGlobe