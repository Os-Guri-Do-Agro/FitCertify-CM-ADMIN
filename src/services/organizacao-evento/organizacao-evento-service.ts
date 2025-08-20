import { handleError } from '@/common/error.utils'
import apiClient from '../api-service'
// import type IArtigo from '@/Interfaces/artigo-interface'
// import { CategoryEntity, CreateCategoryDto, UpdateCategoryDto } from '@/common/types/category'

let tokenSession = sessionStorage.getItem('token')
class OrganizacaoEventoService {
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

  getAllOrganizacoes(): Promise<any> {
    return this.handleRequest(
      apiClient.get('/organizacao'),
      'Failed to fetch all organizacao'
    )
  }

  getOrganizacaoById(id: string): Promise<any> {
    return this.handleRequest(
      apiClient.get(`/organizacao/${id}`),
      'Failed to fetch all organizacao'
    )
  }

  deleteOrganizacao(id: string): Promise<any> {
    return this.handleRequest(
      apiClient.delete(`/organizacao/${id}`, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${tokenSession}`,
        },
      }),
      'Failed to delete organizacao'
    )
  }

  createOrganizacao(formData: FormData): Promise<any> {
    return this.handleRequest(
      apiClient.post('/organizacao', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${tokenSession}`,
        },
      }),
      'Failed to create artigo'
    )
  }

  updateOrganizacao(id: string, formData: FormData): Promise<any> {
    return this.handleRequest(
      apiClient.patch(`/organizacao/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${tokenSession}`,
        },
      }),
      'Failed to update organizacao'
    )
  }
}

export default new OrganizacaoEventoService()
