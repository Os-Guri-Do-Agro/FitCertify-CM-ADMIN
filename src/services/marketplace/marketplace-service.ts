import { handleError } from '@/common/error.utils'
import apiClient from '../api-service'


let tokenSession = sessionStorage.getItem('token')
class MarketplaceService {
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

  getAllProdutos(): Promise<any> {
    return this.handleRequest(
      apiClient.get('/produto'),
      'Failed to fetch all categories'
    )
  }

   getProdutosById(id:string): Promise<any> {
    return this.handleRequest(
      apiClient.get(`/produto/${id}`),
      'Failed to fetch all categories'
    )
  }

  deleteProduto(id: string): Promise<any> {
    return this.handleRequest(
      apiClient.delete(`/produto/${id}`,{
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${tokenSession}`
        },
    }),
      'Failed to delete produto'
    )
  }

  createProduto(formData: FormData): Promise<any> {
    return this.handleRequest(
      apiClient.post('/produto', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${tokenSession}`
        },
      }),
      'Failed to create produto'
    );
  }

  updateProduto(id: string, formData: FormData): Promise<any> {
    return this.handleRequest(
      apiClient.patch(`/produto/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${tokenSession}`
        },
      }),
      'Failed to update produto'
    );
  }

}


export default new MarketplaceService()
