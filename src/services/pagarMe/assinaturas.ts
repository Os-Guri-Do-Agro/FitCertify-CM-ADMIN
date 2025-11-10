import { handleError } from '@/common/error.utils'
import apiClient from '../api-service'
// import type IArtigo from '@/Interfaces/artigo-interface'
// import { CategoryEntity, CreateCategoryDto, UpdateCategoryDto } from '@/common/types/category'

let tokenSession = sessionStorage.getItem('token')
class AssinaturaService {
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

  getPlansSubscriptions(): Promise<any> {
    return this.handleRequest(
      apiClient.get('/pagarme/plans/subscriptions', {
        headers: {
          'Authorization': `Bearer ${tokenSession}`
        },
      }),
      'Failed to fetch all users'
    )
  }

}


export default new AssinaturaService()
