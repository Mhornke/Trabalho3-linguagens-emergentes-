import { PrismaClient } from "@prisma/client"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()

router.get("/gerais", async (req, res) => {
  try {
    const clientes = await prisma.cliente.count()
    const carros = await prisma.ferramenta.count()
    const propostas = await prisma.ordem.count()
    res.status(200).json({ clientes, carros, propostas })
  } catch (error) {
    res.status(400).json(error)
  }
})

router.get("/ferramentaFabricante", async (req, res) => {
  try {
    const ferramenta = await prisma.ferramenta.groupBy({
      by: ['fabricanteId'],
      _count: {
        id: true, 
      }
    })

    // Para cada carro, inclui o nome da marca relacionada ao marcaId
    const ferramentaFabricante = await Promise.all(
      ferramenta.map(async (carro) => {
        const fabricante = await prisma.fabricante.findUnique({
          where: { id: ferramentaFabricante.fabricanteId }
        })
        return {
          fabricante: fabricante?.nome, 
          num: ferramenta._count.id
        }
      })
    )
    res.status(200).json(ferramentaFabricante)
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router
