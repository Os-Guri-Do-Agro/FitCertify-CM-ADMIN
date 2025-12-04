import { handleError } from '@/common/error.utils'
import apiClient from '../api-service'
// import { CategoryEntity, CreateCategoryDto, UpdateCategoryDto } from '@/common/types/category'
let tokenSession = sessionStorage.getItem('token')
class TipoEventoService {
  private async handleRequest<T>(
    request: Promise<{ data: T }>,
    errorMessage: string
  ): Promise<T> {
    try {
      const { data } = await request
      return data
    } catch (error: any) {
      handleError(`${errorMessage}: ${error.message}`, error)
      throw error
    }
  }

  // #TODO - CRIAR INTARFACE PARA CATEGORIA ARTIGO

  getAllTipoEventos(): Promise<any> {
    return this.handleRequest(
      apiClient.get('/tipo-evento'),
      'Failed to fetch all Eventos'
    )
  }

  editTipoEvento(id: any, data: any): Promise<any> {
    return this.handleRequest(
      apiClient.patch(`/tipo-evento/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${tokenSession}`
        },
      }),
      'Failed to edit Evento'
    )
  }

  deleteTipoEvento(id: string): Promise<any> {
    return this.handleRequest(
      apiClient.delete(`/tipo-evento/${id}`, {
        headers: {
          'Authorization': `Bearer ${tokenSession}`
        },
      }),
      'Failed to delete Evento'
    )
  }

  createTipoEvento(data: any): Promise<any> {
    return this.handleRequest(
      apiClient.post('/tipo-evento', data, {
        headers: {
          'Authorization': `Bearer ${tokenSession}`
        },
      }),
      'Failed to create Evento'
    )
  }


}


export default new TipoEventoService()
