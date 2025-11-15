import { handleError } from '@/common/error.utils'
import apiClient from '../api-service'
// import type IArtigo from '@/Interfaces/artigo-interface'
// import { CategoryEntity, CreateCategoryDto, UpdateCategoryDto } from '@/common/types/category'




let tokenSession = sessionStorage.getItem('token')
class AfiliadoService {
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

  getAllAfiliados(): Promise<any> {
    return this.handleRequest(
      apiClient.get('/afiliado'),
      'Failed to fetch all categories'
    )
  }

  apagarAfiliados(id: string): Promise<any> {
    return this.handleRequest(
      apiClient.delete(`/afiliado/${id}`, {
        headers: {
          Authorization: `Bearer ${tokenSession}`
        }
      }),
      'Failed to fetch all categories'
    )
  } 

  criarAfiliado(data: any): Promise<any> {
    return this.handleRequest(
      apiClient.post('/afiliado', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${tokenSession}`
        }
      }),
      'Failed to fetch all categories'
    )
  }

  getAfiliadoById(id: string): Promise<any> {
    return this.handleRequest(
      apiClient.get(`/afiliado/${id}`),
      'Failed to fetch all categories'
    )
  }

  editarAfiliado(id: string, data: any): Promise<any> {
    return this.handleRequest(
      apiClient.put(`/afiliado/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${tokenSession}`
        }
      }),
      'Failed to fetch all categories'
    )
  }

}


export default new AfiliadoService()
