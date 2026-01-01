import { handleError } from '@/common/error.utils'
import apiClient from '../api-service'

class grupoAcessoService {
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

  getAllGrupoAcesso(): Promise<any> {
    const token = sessionStorage.getItem('token')
    return this.handleRequest(
      apiClient.get('/grupo-acesso', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }),
      'Failed to fetch all users'
    )
  }

  editGrupoAcesso(id: string, data: any): Promise<any> {
    const token = sessionStorage.getItem('token')
    return this.handleRequest(
      apiClient.get(`/grupo-acesso/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }),
      'Failed to fetch all users'
    )
  }

  deleteGrupoAcesso(id: string): Promise<any> {
    const token = sessionStorage.getItem('token')
    return this.handleRequest(
      apiClient.delete(`/grupo-acesso/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }),
      'Failed to delete grupo acesso'
    )
  }

}

export default new grupoAcessoService()
